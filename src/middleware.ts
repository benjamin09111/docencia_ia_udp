import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SessionConfigError, refreshIdle, sessionCookieOptions, verifySessionToken } from "@/lib/server/session";

/**
 * Rutas de API que pueden llamarse SIN sesión de docente. Todo lo demás bajo /api/ exige sesión.
 * Cada una valida por sí misma lo que recibe (PIN, fecha, etc.) y devuelve solo datos mínimos.
 */
const PUBLIC_API = [
  "/api/auth/login",
  "/api/auth/logout",
  "/api/attendance/checkin",
  "/api/data", // cada operación declara su acceso (público / tablero / docente) y la ruta lo verifica
  "/api/canvas/courses/", // solo .../students (nómina mínima sin sesión; el resto se valida en la ruta)
];

const isPublicApi = (pathname: string) =>
  PUBLIC_API.some((p) => (p.endsWith("/") ? pathname.startsWith(p) && pathname.endsWith("/students") : pathname === p));

// Páginas públicas del alumno (asistencia y portales visuales)
const isPublicPage = (pathname: string) =>
  pathname.startsWith("/asistencia") || pathname.includes("/visual");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Estáticos de Next.js y archivos con extensión (favicon, svg, etc.)
  if (pathname.startsWith("/_next/") || pathname.includes(".")) return NextResponse.next();

  const isApi = pathname.startsWith("/api/");
  if ((isApi && isPublicApi(pathname)) || (!isApi && isPublicPage(pathname))) return NextResponse.next();

  let claims = null;
  try {
    claims = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  } catch (e) {
    // Falla CERRADA: sin SESSION_SECRET nada protegido se abre
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
    if (request.cookies.get(SESSION_COOKIE)) response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(0), maxAge: 0 });
    return response;
  }

  // Sesión válida: renueva la ventana de inactividad (30 min) sin cambiar el identificador
  const response = NextResponse.next();
  const refreshed = await refreshIdle(claims);
  if (refreshed) response.cookies.set(SESSION_COOKIE, refreshed, sessionCookieOptions(claims.exp - Math.floor(Date.now() / 1000)));
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
