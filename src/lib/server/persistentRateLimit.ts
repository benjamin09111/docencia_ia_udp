import { getSupabaseAdmin } from "./supabaseAdmin";
import { securityFingerprint } from "./securityFingerprint";

export interface PersistentRateLimitResult {
  allowed: boolean;
  retryAfterS: number;
}

/**
 * Límite compartido entre instancias. Devuelve null sólo ante contingencia de
 * infraestructura; producción falla cerrada, desarrollo conserva el límite local.
 */
export async function consumePersistentRateLimit(
  scope: string,
  rawKey: string,
  limit: number,
  windowSeconds: number
): Promise<PersistentRateLimitResult | null> {
  const keyHash = securityFingerprint(rawKey);
  if (!keyHash) return null;

  try {
    const { data, error } = await getSupabaseAdmin().rpc("consume_auth_rate_limit", {
      p_scope: scope,
      p_key_hash: keyHash,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    if (error || !Array.isArray(data) || !data[0]) throw error || new Error("Respuesta inválida de rate limit.");
    return { allowed: Boolean(data[0].allowed), retryAfterS: Number(data[0].retry_after_seconds) || 0 };
  } catch {
    console.error("[rate-limit] No fue posible consultar el límite persistente.");
    return null;
  }
}

export async function resetPersistentRateLimit(scope: string, rawKey: string): Promise<void> {
  const keyHash = securityFingerprint(rawKey);
  if (!keyHash) return;
  try {
    await getSupabaseAdmin().from("auth_rate_limit_windows").delete().eq("scope", scope).eq("key_hash", keyHash);
  } catch {
    console.error("[rate-limit] No fue posible reiniciar el límite persistente.");
  }
}
