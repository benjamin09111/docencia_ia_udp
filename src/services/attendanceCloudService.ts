import { getSupabaseClient } from "./supabaseClient";
import { AttendanceAppeal, AttendanceValue } from "@/types/attendance";

// ------------------------------------------------------------------------------
// Historial inalterable de marcajes (tabla attendance_checkin_logs)
// ------------------------------------------------------------------------------

export interface CloudCheckinLog {
  id: string;
  sectionCode: string;
  sessionCode: string;
  date: string; // YYYY-MM-DD de la clase
  studentCanvasId: number;
  studentName: string;
  studentEmail?: string;
  value: AttendanceValue;
  method: string;
  scheduleLabel?: string;
  distanciaMetros?: number;
  createdAt: string; // ISO del momento real del marcaje
}

export async function insertCheckinLog(log: Omit<CloudCheckinLog, "id" | "createdAt">): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;
  const { error } = await supabase.from("attendance_checkin_logs").insert({
    section_code: log.sectionCode,
    session_code: log.sessionCode,
    session_date: log.date,
    student_canvas_id: log.studentCanvasId,
    student_name: log.studentName.slice(0, 255),
    student_email: log.studentEmail || null,
    value: log.value === 1 ? 1 : 0,
    method: log.method,
    schedule_label: log.scheduleLabel || null,
    distancia_metros: log.distanciaMetros !== undefined ? Math.round(log.distanciaMetros) : null,
  });
  if (error) console.warn("Aviso guardando historial de asistencia:", error.message);
  return !error;
}

export async function fetchCheckinLogs(sectionCode: string): Promise<CloudCheckinLog[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("attendance_checkin_logs")
    .select("*")
    .eq("section_code", sectionCode)
    .order("created_at", { ascending: false })
    .limit(2000);
  if (error || !data) {
    if (error) console.warn("Aviso cargando historial de asistencia:", error.message);
    return [];
  }
  return data.map((r) => ({
    id: r.id,
    sectionCode: r.section_code,
    sessionCode: r.session_code,
    date: r.session_date,
    studentCanvasId: Number(r.student_canvas_id),
    studentName: r.student_name,
    studentEmail: r.student_email || undefined,
    value: (r.value === 1 ? 1 : 0) as AttendanceValue,
    method: r.method,
    scheduleLabel: r.schedule_label || undefined,
    distanciaMetros: r.distancia_metros ?? undefined,
    createdAt: r.created_at,
  }));
}

// ------------------------------------------------------------------------------
// Estado de la sesión del día (cancelación) en class_sessions
// ------------------------------------------------------------------------------

export async function fetchSessionState(
  sessionCode: string
): Promise<{ status?: string; pin?: string } | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("class_sessions")
    .select("status, pin")
    .eq("session_code", sessionCode)
    .limit(1);
  if (error) {
    console.warn("Aviso consultando estado de la sesión:", error.message);
    return null;
  }
  const row = data?.[0];
  return row ? { status: row.status || undefined, pin: row.pin || undefined } : {};
}

/** Estados (cancelada / modalidad) guardados en la nube para todas las sesiones de una sección */
export async function fetchSectionSessionStates(
  sectionCode: string
): Promise<Record<string, { estado: "programada" | "realizada" | "cancelada"; motivoCancelacion?: string; modalidad?: "presencial" | "online" }>> {
  const supabase = getSupabaseClient();
  if (!supabase) return {};
  const { data, error } = await supabase
    .from("class_sessions")
    .select("session_code, status, motivo_cancelacion, modality, sections!inner(code)")
    .eq("sections.code", sectionCode);
  if (error || !data) return {};
  const map: Record<string, { estado: "programada" | "realizada" | "cancelada"; motivoCancelacion?: string; modalidad?: "presencial" | "online" }> = {};
  data.forEach((r: any) => {
    if (!r.session_code) return;
    const estado = r.status === "cancelada" || r.status === "realizada" ? r.status : "programada";
    map[r.session_code] = {
      estado,
      motivoCancelacion: r.motivo_cancelacion || undefined,
      modalidad: r.modality === "online" ? "online" : "presencial",
    };
  });
  return map;
}

// ------------------------------------------------------------------------------
// Parámetros de décimas por sección (sections.total_trabajos / decimas_por_trabajo)
// ------------------------------------------------------------------------------

export async function fetchSectionWorkSettings(
  sectionCode: string
): Promise<{ totalTrabajos?: number; decimasPorTrabajo?: number } | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("sections")
    .select("total_trabajos, decimas_por_trabajo")
    .eq("code", sectionCode)
    .limit(1);
  if (error || !data?.[0]) return null;
  const row = data[0];
  return {
    totalTrabajos: row.total_trabajos ?? undefined,
    decimasPorTrabajo: row.decimas_por_trabajo !== null && row.decimas_por_trabajo !== undefined ? Number(row.decimas_por_trabajo) : undefined,
  };
}

export async function saveSectionWorkSettings(
  sectionCode: string,
  settings: { totalTrabajos?: number; decimasPorTrabajo?: number }
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const payload: Record<string, number> = {};
  if (settings.totalTrabajos !== undefined) payload.total_trabajos = settings.totalTrabajos;
  if (settings.decimasPorTrabajo !== undefined) payload.decimas_por_trabajo = settings.decimasPorTrabajo;
  const { error } = await supabase.from("sections").update(payload).eq("code", sectionCode);
  if (error) console.warn("Aviso guardando parámetros de décimas:", error.message);
}

// ------------------------------------------------------------------------------
// Apelaciones (tabla attendance_appeals)
// ------------------------------------------------------------------------------

const mapAppeal = (r: any): AttendanceAppeal => ({
  id: r.id,
  sectionId: r.section_code,
  sectionCode: r.section_code,
  studentCanvasId: Number(r.student_canvas_id),
  studentName: r.student_name,
  studentRut: r.student_rut || undefined,
  date: r.appeal_date,
  motivo: "asistencia",
  comentario: r.comentario,
  status: r.status,
  createdAt: r.created_at,
  resolvedAt: r.resolved_at || undefined,
  resolvedBy: r.resolved_by || undefined,
});

export async function fetchAppeals(sectionCode: string): Promise<AttendanceAppeal[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("attendance_appeals")
    .select("*")
    .eq("section_code", sectionCode)
    .order("created_at", { ascending: false });
  if (error || !data) {
    if (error) console.warn("Aviso cargando apelaciones:", error.message);
    return [];
  }
  return data.map(mapAppeal);
}

export async function insertAppeal(data: {
  sectionCode: string;
  studentCanvasId: number;
  studentName: string;
  studentRut?: string;
  date: string;
  comentario: string;
}): Promise<{ ok: boolean; duplicate?: boolean }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { ok: false };
  const { error } = await supabase.from("attendance_appeals").insert({
    section_code: data.sectionCode,
    student_canvas_id: data.studentCanvasId,
    student_name: data.studentName.trim().slice(0, 255),
    student_rut: data.studentRut?.trim().slice(0, 20) || null,
    appeal_date: data.date,
    comentario: data.comentario.trim().slice(0, 300),
  });
  if (error) {
    console.warn("Aviso enviando apelación:", error.message);
    return { ok: false, duplicate: error.code === "23505" };
  }
  return { ok: true };
}

export async function updateAppealsStatus(
  appealIds: string[],
  status: "resuelta" | "rechazada",
  resolvedBy: string
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase || appealIds.length === 0) return false;
  const { error } = await supabase
    .from("attendance_appeals")
    .update({ status, resolved_by: resolvedBy, resolved_at: new Date().toISOString() })
    .in("id", appealIds)
    .eq("status", "pendiente");
  if (error) console.warn("Aviso resolviendo apelaciones:", error.message);
  return !error;
}
