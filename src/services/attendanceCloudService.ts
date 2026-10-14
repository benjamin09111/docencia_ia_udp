import { AttendanceAppeal, AttendanceValue } from "@/types/attendance";
import { callOp, GatewayError } from "./dataGateway";

/** Mensaje seguro de mostrar al usuario a partir de un error del servidor. */
const messageOf = (e: unknown) => (e instanceof GatewayError ? e.message : "No se pudo completar la operación.");

// ------------------------------------------------------------------------------
// Historial de marcajes REALES de alumnos (docente)
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

/**
 * Historial de marcajes REALES de alumnos (1 por alumno y clase), paginado en el servidor.
 * Los cambios manuales del docente y los registros en 0 NO aparecen aquí (van a Auditoría).
 */
export async function fetchCheckinHistoryPage(params: {
  sectionCode: string;
  date?: string | null;
  search?: string;
  page: number;
  pageSize: number;
}): Promise<{ rows: CloudCheckinLog[]; total: number }> {
  const rows = await callOp<any[]>("history.page", {
    sectionCode: params.sectionCode,
    date: params.date || null,
    search: params.search?.trim() || null,
    page: params.page,
    pageSize: params.pageSize,
  });
  return {
    total: rows.length > 0 ? Number(rows[0].total_count) : 0,
    rows: rows.map((r) => ({
      id: r.id,
      sectionCode: params.sectionCode,
      sessionCode: r.session_code,
      date: r.session_date,
      studentCanvasId: Number(r.student_canvas_id),
      studentName: r.student_name,
      studentEmail: r.student_email || undefined,
      value: 1 as AttendanceValue,
      method: r.method,
      scheduleLabel: r.schedule_label || undefined,
      distanciaMetros: r.distancia_metros ?? undefined,
      createdAt: r.created_at,
    })),
  };
}

/** Días de clase con marcajes de alumnos (más reciente primero) y cuántos marcaron. */
export async function fetchCheckinHistoryDates(sectionCode: string): Promise<Array<{ date: string; total: number }>> {
  try {
    const rows = await callOp<any[]>("history.dates", { sectionCode });
    return rows.map((r) => ({ date: r.session_date, total: Number(r.total) }));
  } catch {
    return [];
  }
}

// ------------------------------------------------------------------------------
// Estado de las clases (cancelada / modalidad / opcional) — también lo ve el alumno
// ------------------------------------------------------------------------------

type SessionState = {
  estado: "programada" | "realizada" | "cancelada";
  motivoCancelacion?: string;
  modalidad?: "presencial" | "online";
  esOpcional?: boolean;
};

export async function fetchSectionSessionStates(sectionCode: string): Promise<Record<string, SessionState>> {
  try {
    const rows = await callOp<any[]>("sessions.states", { sectionCode });
    const map: Record<string, SessionState> = {};
    rows.forEach((r) => {
      if (!r.session_code) return;
      map[r.session_code] = {
        estado: r.status === "cancelada" || r.status === "realizada" ? r.status : "programada",
        motivoCancelacion: r.motivo_cancelacion || undefined,
        modalidad: r.modality === "online" ? "online" : "presencial",
        esOpcional: r.is_optional === undefined ? undefined : r.is_optional === true,
      };
    });
    return map;
  } catch {
    return {};
  }
}

// ------------------------------------------------------------------------------
// Parámetros de décimas por sección (docente)
// ------------------------------------------------------------------------------

export async function fetchSectionWorkSettings(
  sectionCode: string
): Promise<{ totalTrabajos?: number; decimasPorTrabajo?: number } | null> {
  try {
    const row = await callOp<{ total_trabajos: number | null; decimas_por_trabajo: number | null } | null>("sections.workSettings.get", { sectionCode });
    if (!row) return null;
    return {
      totalTrabajos: row.total_trabajos ?? undefined,
      decimasPorTrabajo: row.decimas_por_trabajo !== null && row.decimas_por_trabajo !== undefined ? Number(row.decimas_por_trabajo) : undefined,
    };
  } catch {
    return null;
  }
}

export async function saveSectionWorkSettings(
  sectionCode: string,
  settings: { totalTrabajos?: number; decimasPorTrabajo?: number }
): Promise<void> {
  try {
    await callOp("sections.workSettings.save", { sectionCode, ...settings });
  } catch (e) {
    console.warn("Aviso guardando parámetros de décimas:", messageOf(e));
  }
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
  motivo: r.kind === "decimas" ? "decimas" : "asistencia",
  comentario: r.comentario || "",
  requestId: r.request_id || undefined,
  status: r.status,
  createdAt: r.created_at,
  resolvedAt: r.resolved_at || undefined,
  resolvedBy: r.resolved_by || undefined,
});

/** Docente: todas las apelaciones de la sección. */
export async function fetchAppeals(sectionCode: string): Promise<AttendanceAppeal[]> {
  try {
    return (await callOp<any[]>("appeals.listAll", { sectionCode })).map(mapAppeal);
  } catch {
    return [];
  }
}

/** Alumno: solo las apelaciones del alumno indicado (sin RUT). */
export async function fetchMyAppeals(sectionCode: string, studentCanvasId: number): Promise<AttendanceAppeal[]> {
  try {
    return (await callOp<any[]>("appeals.listMine", { sectionCode, studentCanvasId })).map(mapAppeal);
  } catch {
    return [];
  }
}

export interface InsertAppealsResult {
  ok: boolean;
  inserted: string[];
  duplicates: string[];
  invalid: string[];
  alreadyPresent: string[];
  message?: string;
}

/** Apelación de asistencia con varias fechas. El servidor valida las fechas, la matrícula y los duplicados. */
export async function insertAppeals(data: {
  sectionCode: string;
  studentCanvasId: number;
  dates: string[];
}): Promise<InsertAppealsResult> {
  try {
    const res = await callOp<Omit<InsertAppealsResult, "ok">>("appeals.create", data);
    return { ok: true, ...res };
  } catch (e) {
    return { ok: false, inserted: [], duplicates: [], invalid: [], alreadyPresent: [], message: messageOf(e) };
  }
}

/** Apelación de décimas: una descripción breve; una sola pendiente por alumno y sección. */
export async function insertDecimasAppeal(data: {
  sectionCode: string;
  studentCanvasId: number;
  descripcion: string;
}): Promise<{ ok: boolean; duplicate?: boolean; message?: string }> {
  try {
    const res = await callOp<{ duplicate: boolean }>("appeals.createDecimas", data);
    return { ok: !res.duplicate, duplicate: res.duplicate };
  } catch (e) {
    return { ok: false, message: messageOf(e) };
  }
}

/**
 * Resuelve apelaciones de asistencia de forma ATÓMICA en la base: marca presente, deja constancia
 * en el historial y resuelve. Las fechas sin clase válida quedan pendientes (devueltas en `failed`).
 * Devuelve null si la llamada falla (nada se modificó).
 */
export async function resolveAttendanceAppealsAtomic(
  appealIds: string[]
): Promise<{ resolvedIds: string[]; failed: Array<{ id: string; outcome: string }> } | null> {
  if (appealIds.length === 0) return null;
  try {
    const rows = await callOp<Array<{ appeal_id: string; outcome: string }>>("appeals.resolve", { ids: appealIds });
    return {
      resolvedIds: rows.filter((r) => r.outcome === "resuelta").map((r) => r.appeal_id),
      failed: rows.filter((r) => r.outcome !== "resuelta").map((r) => ({ id: r.appeal_id, outcome: r.outcome })),
    };
  } catch (e) {
    console.warn("Aviso resolviendo apelaciones:", messageOf(e));
    return null;
  }
}

export async function updateAppealsStatus(appealIds: string[], status: "resuelta" | "rechazada"): Promise<boolean> {
  if (appealIds.length === 0) return false;
  try {
    await callOp("appeals.setStatus", { ids: appealIds, status });
    return true;
  } catch (e) {
    console.warn("Aviso actualizando apelaciones:", messageOf(e));
    return false;
  }
}
