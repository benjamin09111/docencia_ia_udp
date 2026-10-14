import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SessionConfigError, sessionCookieOptions, verifySessionToken } from "@/lib/server/session";
import { revokeSession } from "@/lib/server/sessionRevocation";

export async function POST(req: NextRequest) {
  try {
    // Destrucción de la sesión en el servidor: el identificador queda revocado y deja de servir
    const claims = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
    if (claims) await revokeSession(claims.jti, claims.exp);
  } catch (e) {
    if (!(e instanceof SessionConfigError)) console.error("[logout]", e);
  }
  const response = NextResponse.json({ success: true, message: "Sesión cerrada correctamente." });
  // Y se destruye la cookie en el navegador
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(0), maxAge: 0 });
  return response;
}
