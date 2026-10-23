import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SessionConfigError, createSessionToken, sessionCookieOptions } from "@/lib/server/session";
import { clientIp } from "@/lib/server/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/server/rateLimit";
import { findUserByCredentials, verifyPassword, hashPassword, generateSalt } from "@/lib/server/userStore";

const MAX_IP_ATTEMPTS = 10;
const MAX_ACCOUNT_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos

// Salt y hash simulados para cálculo en tiempo constante si el usuario no existe (anti-timing attacks)
const DUMMY_SALT = generateSalt();
const DUMMY_HASH = hashPassword("dummy_pass_timing_mitigation", DUMMY_SALT);

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const ipKey = `login:ip:${ip}`;

  try {
    // 1. Rate limiting por IP (previene ataques de fuerza bruta masivos desde un mismo origen)
    const ipLimit = checkRateLimit(ipKey, MAX_IP_ATTEMPTS, WINDOW_MS);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos desde esta dirección. Por seguridad, espera unos minutos." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterS) } }
      );
    }

    const body = await req.json().catch(() => null);
    const identifier = typeof body?.identifier === "string" ? body.identifier.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!identifier || identifier.length > 120 || !password || password.length > 200) {
      return NextResponse.json(
        { error: "Debe ingresar su correo/usuario institucional y clave de acceso." },
        { status: 400 }
      );
    }

    // 2. Rate limiting por cuenta (previene ataques de credential stuffing distribuidos contra una cuenta)
    const accountKey = `login:account:${identifier.toLowerCase()}`;
    const accountLimit = checkRateLimit(accountKey, MAX_ACCOUNT_ATTEMPTS, WINDOW_MS);
    if (!accountLimit.allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos fallidos para esta cuenta. Acceso temporalmente bloqueado." },
        { status: 429, headers: { "Retry-After": String(accountLimit.retryAfterS) } }
      );
    }

    const user = await findUserByCredentials(identifier);

    // Comparación en tiempo constante siempre (anti-timing attacks / enumeración de cuentas)
    const saltToUse = user ? user.salt : DUMMY_SALT;
    const hashToUse = user ? user.passwordHash : DUMMY_HASH;
    const isPasswordValid = verifyPassword(password, saltToUse, hashToUse);

    if (!user || !isPasswordValid) {
      return NextResponse.json(
        { error: "Credenciales institucionales incorrectas. Verifique su correo o clave." },
        { status: 401 }
      );
    }

    // Credenciales correctas: limpiar contadores de intentos
    resetRateLimit(ipKey);
    resetRateLimit(accountKey);

    // Generar sesión segura firmada con HMAC-SHA256 y nuevo JTI (anti-fijación de sesión)
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isOwner: user.isOwner,
    });

    const response = NextResponse.json({
      success: true,
      message: "Acceso autorizado.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isOwner: user.isOwner,
      },
    });

    // Sesión en cookie HttpOnly + Secure (Regla 10, cero tokens en localStorage)
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return response;
  } catch (error) {
    if (error instanceof SessionConfigError) console.error("[login]", error.message);
    else console.error("Error en autenticación institucional:", error);
    // Regla 12: sanitización de errores internos
    return NextResponse.json(
      { error: "No fue posible procesar el inicio de sesión en este momento." },
      { status: 500 }
    );
  }
}
