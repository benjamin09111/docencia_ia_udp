import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SessionConfigError, createSessionToken, sessionCookieOptions } from "@/lib/server/session";
import { clientIp } from "@/lib/server/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/server/rateLimit";
import { findUserByCredentials, verifyPassword, hashPassword, generateSalt } from "@/lib/server/userStore";
import { recordAuthEvent } from "@/lib/server/authAudit";
import { invalidRequestOriginResponse, isTrustedMutation } from "@/lib/server/requestSecurity";
import { consumePersistentRateLimit, resetPersistentRateLimit } from "@/lib/server/persistentRateLimit";

const MAX_IP_ATTEMPTS = 10;
const MAX_ACCOUNT_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const IDENTIFIER_RE = /^(?:[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|[a-z0-9._-]{3,64})$/i;

const rateLimitUnavailable = () =>
  NextResponse.json(
    { error: "El servicio de autenticación no está disponible en este momento." },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  );

// Salt y hash simulados para cálculo en tiempo constante si el usuario no existe (anti-timing attacks)
const DUMMY_SALT = generateSalt();
const DUMMY_HASH = hashPassword("dummy_pass_timing_mitigation", DUMMY_SALT);

export async function POST(req: NextRequest) {
  if (!isTrustedMutation(req)) return invalidRequestOriginResponse();

  const ip = clientIp(req);
  const ipKey = `login:ip:${ip}`;

  try {
    // 1. Rate limiting por IP (previene ataques de fuerza bruta masivos desde un mismo origen)
    const ipLimit = checkRateLimit(ipKey, MAX_IP_ATTEMPTS, WINDOW_MS);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos desde esta dirección. Por seguridad, espera unos minutos." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterS), "Cache-Control": "no-store" } }
      );
    }
    const persistentIpLimit = await consumePersistentRateLimit("login_ip", ip, MAX_IP_ATTEMPTS, WINDOW_MS / 1000);
    if (!persistentIpLimit && (process.env.AUTH_RATE_LIMIT_REQUIRED === "true" || process.env.NODE_ENV === "production")) return rateLimitUnavailable();
    if (persistentIpLimit && !persistentIpLimit.allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos desde esta dirección. Por seguridad, espera unos minutos." },
        { status: 429, headers: { "Retry-After": String(persistentIpLimit.retryAfterS), "Cache-Control": "no-store" } }
      );
    }

    const body = await req.json().catch(() => null);
    const identifier = typeof body?.identifier === "string" ? body.identifier.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!identifier || identifier.length > 120 || !IDENTIFIER_RE.test(identifier) || !password || password.length > 200) {
      return NextResponse.json(
        { error: "Debe ingresar su correo/usuario institucional y clave de acceso." },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    // 2. Rate limiting por cuenta (previene ataques de credential stuffing distribuidos contra una cuenta)
    const accountKey = `login:account:${identifier.toLowerCase()}`;
    const accountLimit = checkRateLimit(accountKey, MAX_ACCOUNT_ATTEMPTS, WINDOW_MS);
    if (!accountLimit.allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos fallidos para esta cuenta. Acceso temporalmente bloqueado." },
        { status: 429, headers: { "Retry-After": String(accountLimit.retryAfterS), "Cache-Control": "no-store" } }
      );
    }
    const persistentAccountLimit = await consumePersistentRateLimit("login_account", identifier.toLowerCase(), MAX_ACCOUNT_ATTEMPTS, WINDOW_MS / 1000);
    if (!persistentAccountLimit && (process.env.AUTH_RATE_LIMIT_REQUIRED === "true" || process.env.NODE_ENV === "production")) return rateLimitUnavailable();
    if (persistentAccountLimit && !persistentAccountLimit.allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos fallidos para esta cuenta. Acceso temporalmente bloqueado." },
        { status: 429, headers: { "Retry-After": String(persistentAccountLimit.retryAfterS), "Cache-Control": "no-store" } }
      );
    }

    const user = await findUserByCredentials(identifier);

    // Comparación en tiempo constante siempre (anti-timing attacks / enumeración de cuentas)
    const saltToUse = user ? user.salt : DUMMY_SALT;
    const hashToUse = user ? user.passwordHash : DUMMY_HASH;
    const isPasswordValid = verifyPassword(password, saltToUse, hashToUse);

    if (!user || !isPasswordValid) {
      await recordAuthEvent({ type: "login_failed", identifier, ip });
      return NextResponse.json(
        { error: "Credenciales institucionales incorrectas. Verifique su correo o clave." },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    // Credenciales correctas: limpiar contadores de intentos
    resetRateLimit(ipKey);
    resetRateLimit(accountKey);
    await Promise.all([resetPersistentRateLimit("login_ip", ip), resetPersistentRateLimit("login_account", identifier.toLowerCase())]);
    await recordAuthEvent({ type: "login_success", identifier, ip, userId: user.id });

    // Generar sesión segura firmada con HMAC-SHA256 y nuevo JTI (anti-fijación de sesión)
    const token = await createSessionToken({
      userId: user.id,
      role: user.role,
      isOwner: user.isOwner,
      authVersion: user.authVersion,
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
    }, { headers: { "Cache-Control": "no-store" } });

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
