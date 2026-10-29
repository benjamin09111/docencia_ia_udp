import { NextRequest, NextResponse } from "next/server";

/**
 * Mitiga CSRF en rutas que crean o destruyen sesiones. Se permiten clientes no
 * navegador sin header Origin, pero se rechaza explícitamente cualquier petición
 * declarada como cross-site por el navegador.
 */
export function isTrustedMutation(req: NextRequest): boolean {
  const fetchSite = req.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") return false;

  const origin = req.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).origin === req.nextUrl.origin;
  } catch {
    return false;
  }
}

export function invalidRequestOriginResponse(): NextResponse {
  return NextResponse.json(
    { error: "La solicitud fue rechazada por seguridad." },
    { status: 403, headers: { "Cache-Control": "no-store" } }
  );
}
