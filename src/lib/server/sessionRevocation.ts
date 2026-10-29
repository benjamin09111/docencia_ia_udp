import { getSupabaseAdmin } from "./supabaseAdmin";

/**
 * Revocación de sesiones (cierre de sesión REAL en el servidor, Regla 10).
 * El token firmado es sin estado, así que al cerrar sesión su identificador (jti) se registra en
 * `revoked_sessions` y las rutas de datos lo rechazan aunque alguien conserve una copia de la cookie.
 */
const NOT_REVOKED_TTL_MS = 30_000; // un "no revocada" se recuerda 30 s para no consultar la base en cada petición
const checkedOk = new Map<string, number>();
const revokedLocal = new Set<string>();
const MAX_CACHE = 2000;

export async function isRevoked(jti: string, now = Date.now()): Promise<boolean> {
  if (revokedLocal.has(jti)) return true;
  const last = checkedOk.get(jti);
  if (last && now - last < NOT_REVOKED_TTL_MS) return false;
  try {
    const { data, error } = await getSupabaseAdmin().from("revoked_sessions").select("jti").eq("jti", jti).maybeSingle();
    if (error) throw error;
    if (data) {
      revokedLocal.add(jti);
      return true;
    }
    if (checkedOk.size > MAX_CACHE) checkedOk.clear();
    checkedOk.set(jti, now);
    return false;
  } catch (e) {
    // Sin poder consultar revocaciones no es posible garantizar que una sesión cerrada
    // siga invalidada. Las rutas privadas fallan cerradas hasta recuperar el servicio.
    console.error("[revocation] no se pudo consultar revoked_sessions:", e instanceof Error ? e.message : e);
    return true;
  }
}

/** Registra la sesión como revocada (logout). `expSeconds` = vencimiento absoluto de la sesión. */
export async function revokeSession(jti: string, expSeconds: number): Promise<void> {
  revokedLocal.add(jti);
  checkedOk.delete(jti);
  try {
    const admin = getSupabaseAdmin();
    await admin.from("revoked_sessions").upsert({ jti, expires_at: new Date(expSeconds * 1000).toISOString() }, { onConflict: "jti" });
    // Limpieza oportunista de revocaciones ya vencidas
    await admin.from("revoked_sessions").delete().lt("expires_at", new Date().toISOString());
  } catch (e) {
    console.error("[revocation] no se pudo registrar la revocación:", e instanceof Error ? e.message : e);
  }
}
