import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SessionConfigError, createSessionToken, safeEqual, sessionCookieOptions } from "@/lib/server/session";
import { clientIp } from "@/lib/server/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/server/rateLimit";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  const limiterKey = `login:${clientIp(req)}`;
  try {
    const limit = checkRateLimit(limiterKey, MAX_ATTEMPTS, WINDOW_MS);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera unos minutos antes de volver a intentar." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterS) } }
      );
    }

    const body = await req.json().catch(() => null);
    const password = body?.password;
    if (!password || typeof password !== "string" || password.length > 200) {
      return NextResponse.json({ error: "Debe ingresar una clave de acceso." }, { status: 400 });
    }

    // Solo variable de servidor: una clave NEXT_PUBLIC_* viajaría en el código del navegador
    const expectedKey = process.env.APP_ACCESS_KEY?.trim();
    if (!expectedKey) {
      console.error("APP_ACCESS_KEY no está configurada en las variables de entorno.");
      return NextResponse.json({ error: "El servicio no está disponible en este momento." }, { status: 500 });
    }

    if (!(await safeEqual(password.trim(), expectedKey))) {
      return NextResponse.json({ error: "Clave de acceso incorrecta. Intente nuevamente." }, { status: 401 });
    }

    resetRateLimit(limiterKey);

    // Identificador de sesión NUEVO en cada login (previene fijación de sesión)
    const token = await createSessionToken("docente");
    const response = NextResponse.json({ success: true, message: "Acceso autorizado." });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return response;
  } catch (error) {
    if (error instanceof SessionConfigError) console.error("[login]", error.message);
    else console.error("Error en autenticación institucional:", error);
    return NextResponse.json({ error: "No fue posible procesar el inicio de sesión en este momento." }, { status: 500 });
  }
}
