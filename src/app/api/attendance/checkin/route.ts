import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { clientIp } from "@/lib/server/auth";
import { AdminConfigError, getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import { computeDailyPin, pinMatches } from "@/lib/server/dailyPin";
import { checkRateLimit } from "@/lib/server/rateLimit";
import { checkGeo, checkWindow, chileNow, sessionCodeFor } from "@/lib/server/checkinRules";

const SECTION_RE = /^[A-Za-z0-9_-]{3,40}$/;
const DEVICE_RE = /^[a-f0-9]{32,128}$/;
const WINDOW_MS = 10 * 60 * 1000;

type Code =
  | "invalid" | "rate_limited" | "section_not_found" | "window_closed" | "pin_invalid"
  | "geo_required" | "geo_out_of_range" | "cancelled" | "session_not_found"
  | "not_enrolled" | "student_not_found" | "device_conflict" | "server_error";

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
  server_error: { status: 500, message: "No se pudo procesar la solicitud en este momento." },
};

const fail = (code: Code, extra?: Record<string, unknown>) =>
  NextResponse.json({ ok: false, code, message: FAIL[code].message, ...extra }, { status: FAIL[code].status });

/** Marcaje de asistencia del alumno. Toda la validación ocurre aquí, nunca en el navegador. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const section = typeof body?.section === "string" ? body.section : "";
    const studentCanvasId = Number(body?.studentCanvasId);
    const deviceId = typeof body?.deviceId === "string" ? body.deviceId : "";
    const pin = typeof body?.pin === "string" ? body.pin : "";
    if (!SECTION_RE.test(section) || !Number.isSafeInteger(studentCanvasId) || studentCanvasId <= 0 || !DEVICE_RE.test(deviceId)) {
      return fail("invalid");
    }

    // Límites: por IP (alta: muchos alumnos comparten el WiFi del campus) y por alumno (frena adivinar el PIN)
    if (
      !checkRateLimit(`ci:ip:${clientIp(req)}`, 300, WINDOW_MS).allowed ||
      !checkRateLimit(`ci:stu:${section}:${studentCanvasId}`, 10, WINDOW_MS).allowed ||
      !checkRateLimit(`ci:dev:${deviceId}`, 20, WINDOW_MS).allowed
    ) {
      return fail("rate_limited");
    }

    const admin = getSupabaseAdmin();
    const { data: sec, error: secErr } = await admin
      .from("sections")
      .select("code, requiere_pin, requiere_geo, horario_ayudantia_dias, horario_ayudantia_inicio, horario_ayudantia_fin")
      .eq("code", section)
      .maybeSingle();
    if (secErr) throw secErr;
    if (!sec) return fail("section_not_found");

    // Hora de Chile del servidor: cambiar el reloj del celular no sirve
    const now = chileNow();
    const window = checkWindow(sec, now);
    if (!window.open) return fail("window_closed", { horaInicio: window.horaInicio, horaFin: window.horaFin });

    if (sec.requiere_pin && !pinMatches(computeDailyPin(section, now.dateStr), pin)) return fail("pin_invalid");

    let distancia: number | undefined;
    if (sec.requiere_geo) {
      const geo = checkGeo(body?.lat, body?.lng);
      if (!geo.ok) return fail(geo.reason === "out_of_range" ? "geo_out_of_range" : "geo_required");
      distancia = geo.distancia;
    }

    // La huella del cliente se vuelve a firmar con un secreto: lo guardado no es reversible
    const deviceHash = createHmac("sha256", process.env.SESSION_SECRET || "").update(`device|${deviceId}`).digest("hex");

    const { data, error } = await admin.rpc("checkin_attendance", {
      p_section_code: section,
      p_session_code: sessionCodeFor(section, now.dateStr),
      p_student_canvas_id: studentCanvasId,
      p_device_hash: deviceHash,
      p_method: sec.requiere_geo ? "PIN + GPS" : "PIN",
      p_schedule_label: window.horaInicio ? `${window.horaInicio} - ${window.horaFin}` : null,
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
