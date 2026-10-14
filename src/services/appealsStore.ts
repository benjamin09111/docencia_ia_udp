import { AttendanceAppeal } from "@/types/attendance";
import {
  fetchAppeals,
  fetchMyAppeals,
  insertAppeals,
  insertDecimasAppeal,
  resolveAttendanceAppealsAtomic,
  updateAppealsStatus,
} from "./attendanceCloudService";

// Las apelaciones viven en Supabase (tabla attendance_appeals) y TODA operación pasa por el servidor, que valida
// matrícula, fechas y duplicados; el nombre y el RUT del alumno salen de la base, no del navegador.
const RATE_LIMIT_COOLDOWN_MS = 30000; // 30 segundos entre envíos desde un mismo dispositivo (UX; el límite real es del servidor)
const LAST_SUBMIT_KEY = "udp_last_appeal_submit_timestamp";

export const DECIMAS_DESCRIPTION_MIN = 5;
export const DECIMAS_DESCRIPTION_MAX = 200;

/** Docente: todas las apelaciones de la sección. */
export function getSavedAppeals(sectionCode: string): Promise<AttendanceAppeal[]> {
  return fetchAppeals(sectionCode);
}

/** Alumno: solo sus propias apelaciones. */
export function getMyAppeals(sectionCode: string, studentCanvasId: number): Promise<AttendanceAppeal[]> {
  return fetchMyAppeals(sectionCode, studentCanvasId);
}

/** Segundos que faltan para poder enviar otra apelación desde este dispositivo (0 = ya se puede). */
function cooldownRemainingS(): number {
  try {
    const last = Number(localStorage.getItem(LAST_SUBMIT_KEY) || 0);
    const elapsed = Date.now() - last;
    return last && elapsed < RATE_LIMIT_COOLDOWN_MS ? Math.ceil((RATE_LIMIT_COOLDOWN_MS - elapsed) / 1000) : 0;
  } catch {
    return 0;
  }
}

const markSubmitted = () => {
  try {
    localStorage.setItem(LAST_SUBMIT_KEY, String(Date.now()));
  } catch {}
};

/** Crea una apelación de asistencia con una o varias fechas (sin justificación). */
export async function createAppeals(data: {
  sectionCode: string;
  studentCanvasId: number;
  dates: string[];
}): Promise<{ success: boolean; message: string }> {
  if (typeof window === "undefined") return { success: false, message: "Entorno no compatible" };
  if (data.dates.length === 0) return { success: false, message: "Agrega al menos una fecha para apelar." };

  const wait = cooldownRemainingS();
  if (wait > 0) return { success: false, message: `Por favor espera ${wait}s antes de enviar otra apelación.` };

  const result = await insertAppeals(data);
  if (!result.ok) {
    return { success: false, message: result.message || "No se pudo enviar la apelación. Revisa tu conexión e inténtalo nuevamente." };
  }

  const notes: string[] = [];
  if (result.duplicates.length) notes.push(`ya estaban pendientes: ${result.duplicates.join(", ")}`);
  if (result.alreadyPresent.length) notes.push(`ya figuras presente: ${result.alreadyPresent.join(", ")}`);
  if (result.invalid.length) notes.push(`sin clase válida: ${result.invalid.join(", ")}`);
  const suffix = notes.length ? ` (${notes.join("; ")})` : "";

  if (result.inserted.length === 0) {
    return { success: false, message: `No se envió ninguna apelación${suffix || "."}` };
  }
  markSubmitted();
  return {
    success: true,
    message: `✓ Apelación enviada para ${result.inserted.length === 1 ? "el" : "las fechas"} ${result.inserted.join(", ")}${suffix}. El docente la resolverá a la brevedad.`,
  };
}

/** Crea una apelación de décimas (trabajos): solo una descripción breve. */
export async function createDecimasAppeal(data: {
  sectionCode: string;
  studentCanvasId: number;
  descripcion: string;
}): Promise<{ success: boolean; message: string }> {
  const descripcion = data.descripcion.trim();
  if (descripcion.length < DECIMAS_DESCRIPTION_MIN) {
    return { success: false, message: "Escribe una breve descripción de tu apelación." };
  }
  const wait = cooldownRemainingS();
  if (wait > 0) return { success: false, message: `Por favor espera ${wait}s antes de enviar otra apelación.` };

  const result = await insertDecimasAppeal({ ...data, descripcion: descripcion.slice(0, DECIMAS_DESCRIPTION_MAX) });
  if (result.duplicate) {
    return { success: false, message: "Ya tienes una apelación de décimas pendiente. El equipo docente la revisará pronto." };
  }
  if (!result.ok) {
    return { success: false, message: result.message || "No se pudo enviar la apelación. Revisa tu conexión e inténtalo nuevamente." };
  }
  markSubmitted();
  return { success: true, message: "✓ Apelación de décimas enviada. El docente la revisará a la brevedad." };
}

/** Marca como atendidas apelaciones de décimas (solo cambia el estado; las décimas se ajustan a mano). */
export async function resolveDecimasAppeals(appeals: AttendanceAppeal[]): Promise<boolean> {
  return updateAppealsStatus(appeals.map((a) => a.id), "resuelta");
}

/**
 * Resuelve TODAS las fechas indicadas en una sola operación atómica de la base.
 * Devuelve null si la operación falló (no se modificó nada).
 */
export async function resolveAppeals(
  appeals: AttendanceAppeal[]
): Promise<{ resolved: AttendanceAppeal[]; failed: AttendanceAppeal[] } | null> {
  const result = await resolveAttendanceAppealsAtomic(appeals.map((a) => a.id));
  if (!result) return null;
  const resolvedSet = new Set(result.resolvedIds);
  return {
    resolved: appeals.filter((a) => resolvedSet.has(a.id)),
    failed: appeals.filter((a) => !resolvedSet.has(a.id)),
  };
}

export async function rejectAppeals(appeals: AttendanceAppeal[]): Promise<boolean> {
  return updateAppealsStatus(appeals.map((a) => a.id), "rechazada");
}
