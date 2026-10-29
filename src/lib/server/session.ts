/**
 * Sesiones firmadas (HMAC-SHA256) — compatibles con Edge (middleware) y Node.
 * Token: base64url(payload JSON) + "." + base64url(firma)
 *
 * - `exp`: vencimiento absoluto (12 h).
 * - `idleExp`: vencimiento por inactividad (30 min). El middleware lo renueva en cada
 *   petición válida ("sliding"); si pasa sin actividad, la sesión muere.
 * - `jti`: identificador nuevo en CADA login (previene fijación de sesión).
 */

export type SessionRole = "docente" | "admin";

export interface SessionClaims {
  role: SessionRole;
  userId?: string;
  isOwner?: boolean;
  authVersion?: number;
  jti: string;
  iat: number; // epoch segundos
  exp: number;
  idleExp: number;
}

export const SESSION_COOKIE = "udp_auth_session";
export const SESSION_ABSOLUTE_TTL_S = 60 * 60 * 12; // 12 h
export const SESSION_IDLE_TTL_S = 60 * 30; // 30 min (Regla 10)

const encoder = new TextEncoder();

export class SessionConfigError extends Error {}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new SessionConfigError("SESSION_SECRET no configurada (mínimo 32 caracteres).");
  }
  return secret;
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array<ArrayBuffer> {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(str.length / 4) * 4, "=");
  const bin = atob(b64);
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(usage: "sign" | "verify"): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encoder.encode(getSecret()), { name: "HMAC", hash: "SHA-256" }, false, [usage]);
}

const nowS = () => Math.floor(Date.now() / 1000);

export type UserSessionPayload = {
  userId: string;
  role: SessionRole;
  isOwner: boolean;
  authVersion: number;
};

/** Crea un token NUEVO (identificador nuevo). Usar en el login. */
export async function createSessionToken(
  userOrRole: SessionRole | UserSessionPayload,
  now = nowS()
): Promise<string> {
  const isObj = typeof userOrRole === "object";
  const claims: SessionClaims = {
    role: isObj ? userOrRole.role : userOrRole,
    userId: isObj ? userOrRole.userId : undefined,
    isOwner: isObj ? userOrRole.isOwner : undefined,
    authVersion: isObj ? userOrRole.authVersion : undefined,
    jti: crypto.randomUUID(),
    iat: now,
    exp: now + SESSION_ABSOLUTE_TTL_S,
    idleExp: now + SESSION_IDLE_TTL_S,
  };
  return signClaims(claims);
}

/** Firma cualquier objeto JSON (HMAC-SHA256). Base común de los tokens de sesión y del tablero. */
export async function signPayload(obj: object): Promise<string> {
  const payload = toBase64Url(encoder.encode(JSON.stringify(obj)));
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", await hmacKey("sign"), encoder.encode(payload)));
  return `${payload}.${toBase64Url(sig)}`;
}

/** Verifica SOLO la firma y devuelve el objeto, o null. Quien la usa valida además los vencimientos. */
export async function verifyPayload(token: string | undefined): Promise<Record<string, unknown> | null> {
  if (!token || token.length > 2048) return null;
  const [payload, sig, extra] = token.split(".");
  if (!payload || !sig || extra !== undefined) return null;
  try {
    // crypto.subtle.verify compara en tiempo constante
    const ok = await crypto.subtle.verify("HMAC", await hmacKey("verify"), fromBase64Url(sig), encoder.encode(payload));
    if (!ok) return null;
    return JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
  } catch (e) {
    if (e instanceof SessionConfigError) throw e;
    return null;
  }
}

const signClaims = (claims: SessionClaims) => signPayload(claims);

/** Verifica firma y vencimientos. Devuelve las claims o null (token inválido/vencido/manipulado). */
export async function verifySessionToken(token: string | undefined, now = nowS()): Promise<SessionClaims | null> {
  const claims = (await verifyPayload(token)) as SessionClaims | null;
  if (!claims) return null;
  if (claims.role !== "docente" && claims.role !== "admin") return null;
  // Las versiones antiguas incluían PII en una cookie firmada pero no cifrada.
  // Se invalidan para forzar una sesión nueva con claims mínimos.
  if ("email" in claims || "name" in claims) return null;
  if (
    !claims.jti ||
    !claims.userId ||
    typeof claims.authVersion !== "number" ||
    !Number.isSafeInteger(claims.authVersion) ||
    claims.authVersion < 1 ||
    typeof claims.exp !== "number" ||
    typeof claims.idleExp !== "number" ||
    typeof claims.iat !== "number" ||
    claims.exp - claims.iat > SESSION_ABSOLUTE_TTL_S ||
    claims.idleExp - claims.iat > SESSION_IDLE_TTL_S
  ) return null;
  if (now >= claims.exp || now >= claims.idleExp) return null;
  return claims;
}

/**
 * Renueva la ventana de inactividad (misma sesión, mismo jti). Devuelve un token nuevo solo si
 * pasó más de 1 minuto desde la última renovación, para no reescribir la cookie en cada petición.
 */
export async function refreshIdle(claims: SessionClaims, now = nowS()): Promise<string | null> {
  const remainingIdle = claims.idleExp - now;
  if (remainingIdle > SESSION_IDLE_TTL_S - 60) return null;
  return signClaims({ ...claims, idleExp: Math.min(now + SESSION_IDLE_TTL_S, claims.exp) });
}

/** Opciones de cookie (Regla 10): HttpOnly, Secure en producción, SameSite=Lax. */
export function sessionCookieOptions(maxAgeS = SESSION_ABSOLUTE_TTL_S) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeS,
    priority: "high" as const,
  };
}

/** Comparación de cadenas en tiempo constante (para la clave de acceso). */
export async function safeEqual(a: string, b: string): Promise<boolean> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(getSecret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const [ha, hb] = await Promise.all([
    crypto.subtle.sign("HMAC", key, encoder.encode(a)),
    crypto.subtle.sign("HMAC", key, encoder.encode(b)),
  ]);
  const x = new Uint8Array(ha);
  const y = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}
