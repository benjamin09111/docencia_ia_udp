import { NextRequest, NextResponse } from "next/server";
import { clientIp } from "@/lib/server/auth";
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import { checkRateLimit } from "@/lib/server/rateLimit";
import { checkWindow, chileNow, sessionCodeFor } from "@/lib/server/checkinRules";
import {
  validateDeviceSignals,
  computeServerDeviceHash,
  createCheckinTicket,
} from "@/lib/server/checkinTicket";
import { DeviceSignals } from "@/utils/deviceFingerprint";

const SECTION_RE = /^[A-Za-z0-9_-]{3,40}$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const section = typeof body?.section === "string" ? body.section : "";
    const signals = body?.signals as DeviceSignals | undefined;

    if (!SECTION_RE.test(section) || !validateDeviceSignals(signals)) {
      return NextResponse.json(
        { ok: false, code: "invalid_signals", message: "Dispositivo o parámetros inválidos." },
        { status: 400 }
      );
    }

    const ip = clientIp(req);
    const ua = req.headers.get("user-agent") || "unknown";
    // Límite de emisión de tickets por navegador para frenar scripts en bucle (máximo 3 por 10s por cliente)
    const rateCheck = checkRateLimit(`tkt:cli:${ip}:${ua.slice(0, 40)}`, 3, 10_000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { ok: false, code: "rate_limited", message: "Demasiadas solicitudes. Espera un momento." },
        { status: 429 }
      );
    }

    const admin = getSupabaseAdmin();
    const { data: sec, error: secErr } = await admin
      .from("sections")
      .select("code, requiere_pin, requiere_geo, horario_ayudantia_dias, horario_ayudantia_inicio, horario_ayudantia_fin")
      .eq("code", section)
      .maybeSingle();

    if (secErr || !sec) {
      return NextResponse.json({ ok: false, code: "section_not_found", message: "Sección no encontrada." }, { status: 404 });
    }

    const now = chileNow();
    const window = checkWindow(sec, now);
    if (!window.open) {
      return NextResponse.json(
        { ok: false, code: "window_closed", message: "La clase no está en horario activo para marcar asistencia." },
        { status: 403 }
      );
    }

    const sessionCode = sessionCodeFor(section, now.dateStr);
    const deviceHash = computeServerDeviceHash(signals!);

    // Regla anti-incógnito: si el hardware ya registró a otro alumno en esta clase, rechazar de inmediato
    const { data: existingDevice } = await admin
      .from("checkin_devices")
      .select("student_canvas_id")
      .eq("session_code", sessionCode)
      .eq("device_hash", deviceHash)
      .maybeSingle();

    if (existingDevice) {
      return NextResponse.json(
        {
          ok: false,
          code: "device_conflict",
          message: "Este dispositivo ya registró la asistencia de otro estudiante en esta clase. Si es un error, usa Apelar.",
        },
        { status: 409 }
      );
    }

    const ticket = createCheckinTicket(section, sessionCode, deviceHash);
    return NextResponse.json({ ok: true, ticket });
  } catch (error) {
    console.error("[ticket_error]", error);
    return NextResponse.json({ ok: false, code: "server_error", message: "Error interno al verificar dispositivo." }, { status: 500 });
  }
}
