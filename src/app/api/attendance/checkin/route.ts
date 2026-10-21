import { NextRequest, NextResponse } from "next/server";
import { clientIp } from "@/lib/server/auth";
import { AdminConfigError, getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import { computeDailyPin, pinMatches } from "@/lib/server/dailyPin";
import { checkRateLimit } from "@/lib/server/rateLimit";
import { checkGeo, checkWindow, chileNow, canonicalSessionCode } from "@/lib/server/checkinRules";
import { verifyAndConsumeCheckinTicket } from "@/lib/server/checkinTicket";

const SECTION_RE = /^[A-Za-z0-9_-]{3,40}$/;
const WINDOW_MS = 10 * 60 * 1000;

type Code =
  | "invalid" | "rate_limited" | "section_not_found" | "window_closed" | "pin_invalid"
  | "geo_required" | "geo_out_of_range" | "cancelled" | "session_not_found"
  | "not_enrolled" | "student_not_found" | "device_conflict" | "ticket_invalid" | "server_error";

const FAIL: Record<Code, { status: number; message: string }> = {
  invalid: { status: 400, message: "Datos inválidos." },
  rate_limited: { status: 429, message: "Demasiados intentos. Espera unos minutos e inténtalo nuevamente." },
  section_not_found: { status: 404, message: "No se encontró la sección." },
  window_closed: { status: 403, message: "La asistencia solo se puede marcar durante el horario de la ayudantía." },
  pin_invalid: { status: 403, message: "PIN incorrecto." },
  geo_required: { status: 403, message: "Debes activar tu ubicación para marcar asistencia presencial." },
  geo_out_of_range: { status: 403, message: "Estás fuera del campus. Debes estar en la universidad para marcar asistencia." },
  cancelled: { status: 409, message: "La clase de hoy fue suspendida por el equipo docente. No es necesario marcar asistencia." },
  session_not_found: { status: 404, message: "Hoy no hay clase registrada para esta sección." },
  not_enrolled: { status: 403, message: "No figuras matriculado en esta sección. Avisa al equipo docente." },
  student_not_found: { status: 404, message: "No se encontró al estudiante." },
  device_conflict: { status: 409, message: "Este dispositivo ya registró la asistencia de otro estudiante en esta clase. Si es un error, usa Apelar." },
  ticket_invalid: { status: 403, message: "Ticket de dispositivo inválido o expirado. Actualiza la página e inténtalo de nuevo." },
  server_error: { status: 500, message: "No se pudo procesar la solicitud en este momento." },
};

const fail = (code: Code, extra?: Record<string, unknown>) =>
  NextResponse.json({ ok: false, code, message: FAIL[code].message, ...extra }, { status: FAIL[code].status });

/** Marcaje de asistencia del alumno con validación atómica y ticket firmado de hardware */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const section = typeof body?.section === "string" ? body.section : "";
    const studentCanvasId = Number(body?.studentCanvasId);
    const ticket = typeof body?.ticket === "string" ? body.ticket : "";
    const pin = typeof body?.pin === "string" ? body.pin : "";

    if (!SECTION_RE.test(section) || !Number.isSafeInteger(studentCanvasId) || studentCanvasId <= 0 || !ticket) {
      return fail("invalid");
    }

    const ip = clientIp(req);
    const ua = req.headers.get("user-agent") || "unknown";

    // Rate limits: por IP general, por alumno individual y anti-ráfaga por cliente (IP+UA)
    if (
      !checkRateLimit(`ci:ip:${ip}`, 300, WINDOW_MS).allowed ||
      !checkRateLimit(`ci:stu:${section}:${studentCanvasId}`, 10, WINDOW_MS).allowed ||
      !checkRateLimit(`ci:cli:${ip}:${ua.slice(0, 40)}`, 2, 5_000).allowed
    ) {
      return fail("rate_limited");
    }

    const admin = getSupabaseAdmin();
    const { data: sec, error: secErr } = await admin
      .from("sections")
      .select("code, requiere_pin, requiere_geo, horario_ayudantia_dias, horario_ayudantia_inicio, horario_ayudantia_fin, horario_ayudantia2")
      .eq("code", section)
      .maybeSingle();
    if (secErr) throw secErr;
    if (!sec) return fail("section_not_found");

    const now = chileNow();
    const window = checkWindow(sec, now);
    if (!window.open) return fail("window_closed", { horaInicio: window.horaInicio, horaFin: window.horaFin });

    if (sec.requiere_pin && !pinMatches(computeDailyPin(section, now.dateStr), pin)) return fail("pin_invalid");

    const sessionCode = canonicalSessionCode(section, sec, now, Boolean(window.isSecondary));

    // Verificación y consumo criptográfico de ticket de un solo uso
    const ticketCheck = verifyAndConsumeCheckinTicket(ticket, section, sessionCode);
    if (!ticketCheck.valid) {
      return fail("ticket_invalid");
    }

    let distancia: number | undefined;
    if (sec.requiere_geo) {
      const geo = checkGeo(body?.lat, body?.lng);
      if (!geo.ok) return fail(geo.reason === "out_of_range" ? "geo_out_of_range" : "geo_required");
      distancia = geo.distancia;
    }

    // El deviceHash proviene exclusivamente del ticket firmado por el servidor (no falsificable)
    const { data, error } = await admin.rpc("checkin_attendance", {
      p_section_code: section,
      p_session_code: sessionCode,
      p_student_canvas_id: studentCanvasId,
      p_device_hash: ticketCheck.deviceHash,
      p_method: sec.requiere_geo ? "PIN + GPS" : "PIN",
      p_schedule_label: window.horaInicio
        ? `${window.horaInicio} - ${window.horaFin} (${window.isSecondary ? "Horario 2" : "Horario 1"})`
        : window.isSecondary ? "Horario 2" : "Horario 1",
      p_distancia: distancia ?? null,
    });
    if (error) throw error;

    const row = Array.isArray(data) ? data[0] : data;
    const result = row?.result as string | undefined;
    if (result === "ok" || result === "already_marked") {
      return NextResponse.json({
        ok: true,
        alreadyMarked: result === "already_marked",
        studentName: row.student_name,
        timestamp: new Date().toLocaleTimeString("es-CL", { timeZone: "America/Santiago", hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        distanciaMetros: distancia,
      });
    }
    if (result && result in FAIL) return fail(result as Code);
    throw new Error(`Resultado inesperado de checkin_attendance: ${result}`);
  } catch (error) {
    if (error instanceof AdminConfigError) console.error("[checkin]", error.message);
    else console.error("[checkin]", error);
    return fail("server_error");
  }
}
