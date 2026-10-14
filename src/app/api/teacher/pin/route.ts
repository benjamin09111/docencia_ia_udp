import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/server/auth";
import { computeDailyPin } from "@/lib/server/dailyPin";

const SECTION_RE = /^[A-Za-z0-9_-]{3,40}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** PIN del día de una sección. Solo el docente puede consultarlo. */
export async function GET(req: NextRequest) {
  const auth = await requireRole(req);
  if ("response" in auth) return auth.response;

  const section = req.nextUrl.searchParams.get("section") || "";
  const date = req.nextUrl.searchParams.get("date") || "";
  if (!SECTION_RE.test(section) || !DATE_RE.test(date)) {
    return NextResponse.json({ error: "Parámetros inválidos." }, { status: 400 });
  }
  try {
    return NextResponse.json({ pin: computeDailyPin(section, date) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[teacher/pin]", error);
    return NextResponse.json({ error: "No se pudo procesar la solicitud en este momento." }, { status: 500 });
  }
}
