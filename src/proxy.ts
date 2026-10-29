import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SessionConfigError, refreshIdle, sessionCookieOptions, verifySessionToken } from "@/lib/server/session";

/**
 * Rutas de API que pueden llamarse SIN sesión de docente. Todo lo demás bajo /api/ exige sesión.
 * Cada una valida por sí misma lo que recibe (PIN, fecha, etc.) y devuelve solo datos mínimos.
 */
const PUBLIC_API = [
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/me",
  "/api/attendance/checkin",
  "/api/attendance/ticket",
  "/api/data", // cada operación declara su acceso (público / tablero / docente) y la ruta lo verifica
  "/api/canvas/courses/", // solo .../students (nómina mínima sin sesión; el resto se valida en la ruta)
];

const isPublicApi = (pathname: string) =>
  PUBLIC_API.some((p) => (p.endsWith("/") ? pathname.startsWith(p) && pathname.endsWith("/students") : pathname === p));

// Páginas públicas del alumno (asistencia y portales visuales)
const isPublicPage = (pathname: string) =>
  pathname.startsWith("/asistencia") || pathname.includes("/visual");

// Nunca habilitar impersonación de vistas en producción, incluso ante un error
// de configuración que deje DEV=TRUE en el entorno desplegado.
const developmentCrossRoleViewsEnabled = () =>
  process.env.NODE_ENV !== "production" && process.env.DEV === "TRUE";

export async function proxy(request: NextRequest) {
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

  // El rol se decide únicamente en la sesión firmada del servidor. Una URL como
  // /admin o ?role=admin nunca puede elevar privilegios de un docente/alumno.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (claims.role !== "admin") {
      if (isApi) return NextResponse.json({ error: "No tienes permiso para esta acción." }, { status: 403 });
      return NextResponse.redirect(new URL("/docente", request.url));
    }
  }

  // Un admin puede recorrer vistas de otros roles sólo durante desarrollo local.
  // Esto cambia navegación visual, no concede permisos adicionales a rutas API.
  if (
    claims.role === "admin" &&
    (pathname === "/docente" || pathname.startsWith("/docente/") || pathname === "/estudiante" || pathname.startsWith("/estudiante/")) &&
    !developmentCrossRoleViewsEnabled()
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
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
