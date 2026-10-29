import crypto from "node:crypto";

/** Huella HMAC estable para controles de seguridad sin guardar el valor original. */
export function securityFingerprint(value: string): string | null {
  const secret = process.env.AUDIT_HASH_SECRET || process.env.SESSION_SECRET || "";
  if (!secret) return null;
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}
