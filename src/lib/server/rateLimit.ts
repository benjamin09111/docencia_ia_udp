/**
 * Limitador de intentos en memoria (ventana fija).
 *
 * LIMITACIÓN CONOCIDA: en serverless cada instancia tiene su propia memoria, así que es una
 * defensa de mejor esfuerzo. La versión definitiva usa la base (tabla de intentos) con service_role.
 */
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5000;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterS: number;
}

export function checkRateLimit(key: string, limit: number, windowMs: number, now = Date.now()): RateLimitResult {
  if (buckets.size > MAX_BUCKETS) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterS: 0 };
  }
  bucket.count++;
  const retryAfterS = Math.ceil((bucket.resetAt - now) / 1000);
  return { allowed: bucket.count <= limit, remaining: Math.max(0, limit - bucket.count), retryAfterS };
}

/** Borra el contador (p. ej. tras un login exitoso). */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}
