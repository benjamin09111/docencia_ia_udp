import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SessionConfigError,
  refreshIdle,
  sessionCookieOptions,
  verifySessionToken,
} from "@/lib/server/session";

const PUBLIC_API = [
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/me",
  "/api/attendance/checkin",
  "/api/attendance/ticket",
  "/api/data",
  "/api/canvas/courses/",
];

const isPublicApi = (pathname: string) =>
  PUBLIC_API.some((p) =>
    p.endsWith("/") ? pathname.startsWith(p) && pathname.endsWith("/students") : pathname === p
  );

const isPublicPage = (pathname: string) =>
  pathname.startsWith("/asistencia") || pathname.includes("/visual");

const isDev = () => process.env.NODE_ENV !== "production";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next/") || pathname.includes(".")) return NextResponse.next();

  const isApi = pathname.startsWith("/api/");
  if ((isApi && isPublicApi(pathname)) || (!isApi && isPublicPage(pathname))) return NextResponse.next();

  let claims = null;
  try {
    claims = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  } catch (e) {
    if (e instanceof SessionConfigError) {
      console.error("[middleware]", e.message);
      return isApi
        ? NextResponse.json({ error: "El servicio no está disponible en este momento." }, { status: 503 })
        : new NextResponse("Servicio no disponible: configuración de seguridad incompleta.", { status: 503 });
    }
  }

  if (pathname === "/login") {
    return claims ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
  }

  if (!claims) {
    if (isApi) return NextResponse.json({ error: "Sesión requerida." }, { status: 401 });
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") loginUrl.searchParams.set("next", pathname);
    const response = NextResponse.redirect(loginUrl);
    if (request.cookies.get(SESSION_COOKIE)) {
      response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(0), maxAge: 0 });
    }
    return response;
  }

  // Control de acceso por rol
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (claims.role !== "admin") {
      if (isApi) return NextResponse.json({ error: "No tienes permiso para esta acción." }, { status: 403 });
      const target = claims.role === "estudiante" ? "/estudiante" : "/docente";
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  if (claims.role === "estudiante" && (pathname === "/docente" || pathname.startsWith("/docente/"))) {
    if (isApi) return NextResponse.json({ error: "Acceso exclusivo para docentes." }, { status: 403 });
    return NextResponse.redirect(new URL("/estudiante", request.url));
  }

  // En producción, admin permanece en /admin salvo si está en desarrollo
  if (
    claims.role === "admin" &&
    !claims.isOwner &&
    (pathname === "/docente" || pathname.startsWith("/docente/") || pathname === "/estudiante" || pathname.startsWith("/estudiante/")) &&
    !isDev()
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const response = NextResponse.next();
  const refreshed = await refreshIdle(claims);
  if (refreshed) {
    response.cookies.set(
      SESSION_COOKIE,
      refreshed,
      sessionCookieOptions(claims.exp - Math.floor(Date.now() / 1000))
    );
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
