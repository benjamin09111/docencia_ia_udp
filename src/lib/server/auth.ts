import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SessionClaims, SessionConfigError, verifySessionToken } from "./session";
import { isRevoked } from "./sessionRevocation";
import { isSessionVersionCurrent } from "./userStore";

/** Sesión válida de la petición, o null (sin cookie, inválida, vencida o servidor mal configurado). */
export async function getSession(req: NextRequest): Promise<SessionClaims | null> {
  try {
    const claims = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
    // Una sesión cerrada (logout) queda revocada aunque alguien conserve la cookie
    if (!claims) return null;
    if (await isRevoked(claims.jti)) return null;
    if (!(await isSessionVersionCurrent(claims.userId!, claims.authVersion!))) return null;
    return claims;
  } catch (e) {
    if (e instanceof SessionConfigError) console.error("[auth]", e.message);
    return null;
  }
}

/**
 * Guardia para rutas protegidas (defensa en profundidad: el middleware ya filtra, pero cada ruta
 * que muta o expone datos verifica por sí misma). Devuelve la sesión o una respuesta 401/403 lista.
 */
export async function requireRole(
  req: NextRequest,
  roles: Array<SessionClaims["role"]> = ["docente", "admin"]
): Promise<{ session: SessionClaims } | { response: NextResponse }> {
  const session = await getSession(req);
  if (!session) {
    return { response: NextResponse.json({ error: "Sesión requerida." }, { status: 401 }) };
  }
  if (!roles.includes(session.role)) {
    return { response: NextResponse.json({ error: "No tienes permiso para esta acción." }, { status: 403 }) };
  }
  return { session };
}

/** IP del cliente (Vercel/proxy) para limitar intentos. */
export function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
