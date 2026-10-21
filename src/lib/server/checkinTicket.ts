import { createHmac, randomUUID } from "node:crypto";
import { DeviceSignals } from "@/utils/deviceFingerprint";

const TICKET_TTL_MS = 120 * 1000; // 2 minutos de validez
const consumedNonces = new Map<string, number>();

function getSecret(): string {
  return process.env.SESSION_SECRET || "udp_attendance_fallback_secret_prod_2026";
}

function cleanupNonces() {
  const now = Date.now();
  for (const [nonce, exp] of consumedNonces.entries()) {
    if (now > exp) consumedNonces.delete(nonce);
  }
}

/** Valida que las señales de hardware sean verosímiles y no un objeto vacío o sintético */
export function validateDeviceSignals(signals?: DeviceSignals | null): boolean {
  if (!signals || typeof signals !== "object") return false;
  if (!signals.canvas || typeof signals.canvas !== "string" || signals.canvas.length < 20) return false;
  if (!signals.webgl || typeof signals.webgl !== "string") return false;
  if (!signals.audio || typeof signals.audio !== "string") return false;
  const s = signals.screen;
  if (!s || typeof s.w !== "number" || typeof s.h !== "number" || s.w < 200 || s.h < 200) return false;
  const h = signals.hardware;
  if (!h || typeof h.cores !== "number" || h.cores < 1 || h.cores > 128) return false;
  return true;
}

/** Calcula la huella del dispositivo firmada en el servidor (inmune a ventanas de incógnito) */
export function computeServerDeviceHash(signals: DeviceSignals): string {
  const secret = getSecret();
  const raw = [
    signals.canvas,
    signals.webgl,
    signals.audio,
    `${signals.screen.w}x${signals.screen.h}`,
    signals.screen.colorDepth,
    signals.hardware.cores,
    signals.hardware.touchPoints,
    signals.hardware.platform,
    signals.locale?.timezone || "America/Santiago",
  ].join("##");

  return createHmac("sha256", secret).update(`dvc_sign|${raw}`).digest("hex");
}

export interface TicketPayload {
  sec: string;
  sess: string;
  dvc: string;
  nonce: string;
  exp: number;
}

/** Genera un ticket criptográfico firmado de un solo uso */
export function createCheckinTicket(sectionCode: string, sessionCode: string, deviceHash: string): string {
  const secret = getSecret();
  const payload: TicketPayload = {
    sec: sectionCode,
    sess: sessionCode,
    dvc: deviceHash,
    nonce: randomUUID().replace(/-/g, ""),
    exp: Date.now() + TICKET_TTL_MS,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(payloadB64).digest("base64url");
  return `${payloadB64}.${signature}`;
}

/** Verifica la firma y consume el ticket (garantiza que NINGÚN ticket se reutilice) */
export function verifyAndConsumeCheckinTicket(
  ticket: string,
  expectedSection: string,
  expectedSession: string
): { valid: true; deviceHash: string } | { valid: false; reason: string } {
  if (!ticket || typeof ticket !== "string" || !ticket.includes(".")) {
    return { valid: false, reason: "ticket_format" };
  }

  const [payloadB64, signature] = ticket.split(".");
  const secret = getSecret();
  const expectedSig = createHmac("sha256", secret).update(payloadB64).digest("base64url");
  if (signature !== expectedSig) {
    return { valid: false, reason: "ticket_signature_invalid" };
  }

  let payload: TicketPayload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
  } catch {
    return { valid: false, reason: "ticket_payload_corrupted" };
  }

  if (Date.now() > payload.exp) {
    return { valid: false, reason: "ticket_expired" };
  }

  if (payload.sec !== expectedSection || payload.sess !== expectedSession) {
    return { valid: false, reason: "ticket_scope_mismatch" };
  }

  // Protección anti-repetición estricta (Single-Use Nonce)
  cleanupNonces();
  if (consumedNonces.has(payload.nonce)) {
    return { valid: false, reason: "ticket_already_consumed" };
  }

  consumedNonces.set(payload.nonce, payload.exp);
  return { valid: true, deviceHash: payload.dvc };
}
