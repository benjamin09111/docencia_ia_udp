import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * PIN del día calculado SOLO en el servidor con un secreto (HMAC-SHA256).
 * Antes se calculaba en el navegador con una función pública: cualquiera podía obtener el PIN de cualquier día.
 *
 * Solo para rutas de servidor (usa node:crypto). El docente lo obtiene por una ruta protegida
 * y el alumno nunca lo ve: solo lo envía para validarlo.
 */
export function computeDailyPin(sectionCode: string, dateStr: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET no configurada");
  const digest = createHmac("sha256", secret).update(`daily-pin|${sectionCode}|${dateStr}`).digest();
  const n = digest.readUInt32BE(0) % 9000;
  return String(1000 + n);
}

/** Compara PINs en tiempo constante. */
export function pinMatches(expected: string, provided: string): boolean {
  const given = (provided || "").trim();
  if (given.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(given));
}
