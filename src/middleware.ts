import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Rutas que son 100% públicas y NUNCA requieren autenticación
  // Toda la asistencia y portales visuales de cualquier curso (/asistencia, /[cursoId]/visual, etc.)
  if (
    pathname.startsWith("/asistencia") ||
    pathname.endsWith("/visual") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".") // favicon.ico, svgs, etc.
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("udp_auth_session")?.value;
  const isAuthenticated = Boolean(sessionCookie && sessionCookie.trim() !== "");

  // 2. Si ya está autenticado e intenta entrar a /login, redirigir al Dashboard principal
  if (pathname === "/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 3. Proteger todas las demás rutas privadas si no está autenticado
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("next", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto archivos estáticos internos de Next.js
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
