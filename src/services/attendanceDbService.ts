import { ClassSession, CourseSection, AttendanceValue } from "@/types/attendance";
import { StudentRosterItem, generateSemesterSessions, getSavedSections } from "./attendanceStore";
import { callOp, GatewayError } from "./dataGateway";

/**
 * Servicio de datos de asistencia. Antes hablaba directo con Supabase usando la clave pública del navegador;
 * ahora TODA operación pasa por el servidor (/api/data), que valida y autoriza. Las firmas se mantienen.
 */

export interface AttendanceDbSyncResult {
  success: boolean;
  message?: string;
  error?: unknown;
}

/**
 * Antes indicaba si había credenciales de Supabase en el navegador. Ya no las hay: la disponibilidad real
 * la decide el servidor y las funciones de este archivo fallan con gracia si no responde.
 */
export const isSupabaseConfigured = () => true;

const failure = (error: unknown): AttendanceDbSyncResult => {
  const message = error instanceof GatewayError ? error.message : "No se pudo completar la operación.";
  console.warn("Aviso de sincronización:", message);
  return { success: false, message, error: message };
};

type AttendanceMarker = "profesor" | "ayudante" | "alumno_pin" | "sistema" | "alumno_link" | "alumno_qr";

/** Solo estos orígenes los puede enviar el docente; los de alumno los escribe únicamente el check-in del servidor. */
const teacherMarker = (markedBy?: string) => (markedBy === "ayudante" || markedBy === "sistema" ? markedBy : "profesor");

const sectionPayload = (section: CourseSection) => ({
  codigo: section.codigo,
  nombre: section.nombre,
  profesor: section.profesor,
  ayudante: section.ayudante,
  horarioCatedra: section.horarioCatedra,
  horarioAyudantia: section.horarioAyudantia,
  horarioAyudantia2: section.horarioAyudantia2 ?? null,
  pinActivo: section.pinActivo,
  requierePin: section.requierePin,
  requiereGeolocalizacion: section.requiereGeolocalizacion,
});

const sessionsPayload = (sessions: ClassSession[]) =>
  sessions.map((s) => ({ id: s.id, fecha: s.fecha, diaSemana: s.diaSemana, tipo: s.tipo, horaInicio: s.horaInicio, horaFin: s.horaFin, sala: s.sala }));

/** Registra o actualiza el curso y su sección */
export async function syncCourseAndSectionToSupabase(
  courseCode: string,
  courseName: string,
  canvasCourseId: number,
  section: CourseSection
): Promise<{ success: boolean; courseId?: string; sectionId?: string; error?: unknown }> {
  try {
    const res = await callOp<{ courseId: string; sectionId: string }>("sections.syncCourse", {
      courseCode,
      courseName,
      canvasCourseId,
      section: sectionPayload(section),
    });
    return { success: true, ...res };
  } catch (error) {
    return failure(error);
  }
}

/** Sincroniza la lista de estudiantes matriculados y las sesiones programadas */
export async function syncStudentsAndSessionsToSupabase(
  sectionId: string,
  students: StudentRosterItem[],
  sessions: ClassSession[]
): Promise<AttendanceDbSyncResult> {
  try {
    await callOp("sections.syncRoster", {
      sectionId,
      students: students.map((st) => ({ canvas_id: st.canvas_id, rut: st.rut, nombres: st.nombres, apellidos: st.apellidos, email: st.email })),
      sessions: sessionsPayload(sessions),
    });
    return { success: true };
  } catch (error) {
    return failure(error);
  }
}

const REVERSE_FRIENDLY_IDS: Record<string, string> = {
  sec_1: "CIT3203_CA01",
  sec_2: "CIT3203_CA02",
  sec_3: "CIT3203_CA03",
  sec_arq_emergentes: "CIT3100_CA02",
};

export function toCanonicalSessionCode(sessionCode: string): string {
  let canonical = sessionCode;
  for (const [fr, code] of Object.entries(REVERSE_FRIENDLY_IDS)) {
    if (canonical.includes(fr)) canonical = canonical.replace(fr, code);
  }
  return canonical;
}

/** Guarda una marcación individual (1 o 0) por código semántico */
export async function saveAttendanceMarkToSupabase(
  sessionCode: string,
  studentCanvasId: number,
  value: AttendanceValue,
  markedBy: AttendanceMarker = "profesor"
): Promise<AttendanceDbSyncResult> {
  if (!sessionCode || !studentCanvasId || isNaN(Number(studentCanvasId))) {
    return { success: false, message: "Parámetros incompletos para registrar asistencia" };
  }
  try {
    const canonical = toCanonicalSessionCode(sessionCode);
    await callOp("attendance.mark", { sessionCode: canonical, studentCanvasId: Number(studentCanvasId), value: value === 1 ? 1 : 0, markedBy: teacherMarker(markedBy) });
    return { success: true };
  } catch (error) {
    return failure(error);
  }
}

/** Guarda masivamente una lista de asistencias */
export async function saveAttendanceBatchToSupabase(
  records: Array<{ session_code: string; student_canvas_id: number; value: number; marked_by?: string }>
): Promise<AttendanceDbSyncResult> {
  const safe = (records || [])
    .filter((r) => r.session_code && r.student_canvas_id && !isNaN(Number(r.student_canvas_id)))
    .map((r) => ({
      session_code: toCanonicalSessionCode(r.session_code),
      student_canvas_id: Number(r.student_canvas_id),
      value: r.value === 1 ? 1 : 0,
      marked_by: teacherMarker(r.marked_by),
    }));
  if (safe.length === 0) return { success: true };
  try {
    // Lotes de 2000 para no superar el tamaño máximo de la solicitud
    for (let i = 0; i < safe.length; i += 2000) await callOp("attendance.batch", { records: safe.slice(i, i + 2000) });
    return { success: true };
  } catch (error) {
    return failure(error);
  }
}

const FRIENDLY_SECTION_IDS: Record<string, string> = {
  CIT3203_CA01: "sec_1",
  CIT3203_CA02: "sec_2",
  CIT3203_CA03: "sec_3",
  CIT3100_CA02: "sec_arq_emergentes",
};

/** Carga el mapa de asistencia de una sección (docente, o alumno con el PIN del tablero desbloqueado) */
export async function fetchAttendanceMapFromSupabase(sectionCode: string): Promise<Record<string, AttendanceValue>> {
  try {
    const rows = await callOp<Array<{ session_code: string; student_canvas_id: number; value: number }>>(
      "attendance.map",
      { sectionCode },
      { boardSection: sectionCode }
    );
    const map: Record<string, AttendanceValue> = {};
    rows.forEach((r) => {
      const code = r.session_code;
      // Descartar de raíz sesiones secundarias o espurias como 2026-10-08 en ramos de los miércoles
      if (!code || code.includes("_ayu2_") || (code.includes("CIT3203") && code.includes("2026-10-08"))) return;
      const val = (r.value === 1 ? 1 : 0) as AttendanceValue;
      map[`${code}_${r.student_canvas_id}`] = val;
      // Variantes friendly (sec_1, sec_2, ...)
      for (const [realCode, friendly] of Object.entries(FRIENDLY_SECTION_IDS)) {
        if (code.includes(realCode)) map[`${code.replace(realCode, friendly)}_${r.student_canvas_id}`] = val;
      }
    });
    return map;
  } catch (e) {
    console.warn("No se pudo obtener el mapa de asistencia:", e instanceof GatewayError ? e.message : e);
    return {};
  }
}

/** Actualiza horario, PIN y sesiones de una sección */
export async function updateSectionScheduleInSupabase(section: CourseSection): Promise<AttendanceDbSyncResult> {
  try {
    await callOp("sections.updateSchedule", { section: sectionPayload(section), sessions: sessionsPayload(generateSemesterSessions(section)) });
    return { success: true };
  } catch (error) {
    return failure(error);
  }
}

/** Actualiza la modalidad online/presencial (requiere_geo) de una sección */
export async function updateSectionOnlineStatusInSupabase(sectionCode: string, requiereGeo: boolean): Promise<AttendanceDbSyncResult> {
  try {
    await callOp("sections.updateOnline", { sectionCode, requiereGeo });
    return { success: true };
  } catch (error) {
    return failure(error);
  }
}

const COURSE_NAMES: Array<[string, string]> = [
  ["3203", "Proyecto en TICs II"],
  ["2206", "Gestión Organizacional"],
  ["3100", "Arquitecturas Emergentes de Software"],
];

/** Obtiene las secciones configuradas. El PIN semestral solo llega al docente con sesión. */
export async function fetchSectionsFromSupabase(): Promise<CourseSection[] | null> {
  try {
    const data = await callOp<any[]>("sections.list");
    if (!data || data.length === 0) return null;

    const idMap: Record<string, string> = { ...FRIENDLY_SECTION_IDS, CIT2206_CA01: "sec_gestion_org" };
    const courseName = (code: string) => COURSE_NAMES.find(([n]) => code.includes(n))?.[1] || "Asignatura UDP";
    const currentSaved = getSavedSections();

    return data.map((sec) => {
      const matchLocal = currentSaved.find((ls) => ls.codigo === sec.code || ls.id === sec.code);
      const teacher = sec.teacher_name?.trim();
      return {
        id: idMap[sec.code] || sec.code,
        codigo: sec.code,
        cursoNombre: courseName(sec.code),
        nombre: sec.name,
        profesor: (() => {
          if (sec.code === "CIT3203_CA01") return "Leandro Llanza";
          if (sec.code === "CIT3203_CA02") return teacher || "Cristian Osorio";
          if (sec.code === "CIT3203_CA03") return teacher || "Jorge Esteban Cruz León";
          if (sec.code === "CIT3100_CA02") return teacher || "Jorge Elliott";
          return teacher && teacher !== "Docente UDP" ? teacher : "No identificado";
        })(),
        ayudante: sec.assistant_name || "Benjamín Morales Pizarro",
        horarioCatedra: {
          dias: sec.horario_catedra_dias || [3],
          horaInicio: sec.horario_catedra_inicio?.slice(0, 5) || "14:30",
          horaFin: sec.horario_catedra_fin?.slice(0, 5) || "17:30",
          sala: sec.horario_catedra_sala || "SALA X",
        },
        horarioAyudantia: {
          dias: sec.horario_ayudantia_dias || [3],
          horaInicio: sec.horario_ayudantia_inicio?.slice(0, 5) || "16:00",
          horaFin: sec.horario_ayudantia_fin?.slice(0, 5) || "17:20",
          sala: sec.horario_ayudantia_sala || "SALA X",
        },
        horarioAyudantia2: sec.horario_ayudantia2
          ? {
              dias: sec.horario_ayudantia2.dias || [3],
              horaInicio: sec.horario_ayudantia2.horaInicio?.slice(0, 5) || "16:00",
              horaFin: sec.horario_ayudantia2.horaFin?.slice(0, 5) || "17:20",
              sala: sec.horario_ayudantia2.sala || "SALA X",
            }
          : matchLocal?.horarioAyudantia2,
        horarioCatedra2: matchLocal?.horarioCatedra2,
        pinActivo: sec.pin_activo || undefined, // undefined para el público: nunca se inventa un PIN por defecto
        requierePin: Boolean(sec.requiere_pin),
        requiereGeolocalizacion: Boolean(sec.requiere_geo),
      };
    });
  } catch (e) {
    console.warn("Aviso cargando secciones:", e instanceof GatewayError ? e.message : e);
    return null;
  }
}

/** Guarda o actualiza las décimas y trabajos realizados de un estudiante */
export async function saveStudentWorkRecordToSupabase(
  sectionCode: string,
  studentCanvasId: number,
  decimas: number,
  trabajosRealizados: number
): Promise<AttendanceDbSyncResult> {
  try {
    await callOp("work.save", { sectionCode, studentCanvasId, decimas, trabajos: trabajosRealizados });
    return { success: true };
  } catch (error) {
    return failure(error);
  }
}

/** Carga décimas y trabajos de una sección (docente, o alumno con el PIN del tablero desbloqueado) */
export async function fetchStudentWorkRecordsFromSupabase(
  sectionCode: string
): Promise<Record<number, { decimas: number; trabajosRealizados: number }>> {
  try {
    const rows = await callOp<Array<{ student_canvas_id: number; decimas_acumuladas: number; trabajos_realizados: number }>>(
      "work.records",
      { sectionCode },
      { boardSection: sectionCode }
    );
    const map: Record<number, { decimas: number; trabajosRealizados: number }> = {};
    rows.forEach((r) => {
      map[r.student_canvas_id] = { decimas: Number(r.decimas_acumuladas) || 0, trabajosRealizados: Number(r.trabajos_realizados) || 0 };
    });
    return map;
  } catch (e) {
    console.warn("Aviso cargando décimas/trabajos:", e instanceof GatewayError ? e.message : e);
    return {};
  }
}

/** Actualiza el estado de una sesión (cancelada, programada, realizada) */
export async function updateSessionStatusInSupabase(
  sessionCode: string,
  status: "programada" | "realizada" | "cancelada",
  motivoCancelacion?: string
): Promise<AttendanceDbSyncResult> {
  try {
    await callOp("sessions.setStatus", { sessionCode, status, motivo: motivoCancelacion });
    return { success: true };
  } catch (error) {
    return failure(error);
  }
}

/** Actualiza la modalidad de una sesión (online / presencial) */
export async function updateSessionModalityInSupabase(
  sessionCode: string,
  modality: "presencial" | "online"
): Promise<AttendanceDbSyncResult> {
  try {
    await callOp("sessions.setModality", { sessionCode, modality });
    return { success: true };
  } catch (error) {
    return failure(error);
  }
}

/** Marca o desmarca una sesión como opcional (suma a quien asiste, no resta a quien falta) */
export async function updateSessionOptionalInSupabase(sessionCode: string, esOpcional: boolean): Promise<AttendanceDbSyncResult> {
  try {
    await callOp("sessions.setOptional", { sessionCode, esOpcional });
    return { success: true };
  } catch (error) {
    return failure(error);
  }
}

/** Sesiones de una sección que ya tienen asistencia registrada */
export async function fetchHistoricalRecordedSessionsFromSupabase(sectionCode: string): Promise<ClassSession[]> {
  try {
    const rows = await callOp<any[]>("sessions.recorded", { sectionCode });
    return rows
      // Excluir sesiones espurias como 2026-10-08 o bloques secundarios que no son clase semanal
      .filter((s) => s.date !== "2026-10-08" && !s.session_code?.includes("2026-10-08") && !s.session_code?.includes("_ayu2_"))
      .map((s) => ({
        id: s.session_code,
        seccionId: sectionCode,
        fecha: s.date,
        diaSemana: s.dia_semana,
        tipo: s.type,
        modalidad: s.modality || "presencial",
        estado: s.status || "programada",
        motivoCancelacion: s.motivo_cancelacion || undefined,
        horaInicio: s.start_time?.slice(0, 5) || "14:30",
        horaFin: s.end_time?.slice(0, 5) || "16:00",
        sala: s.room || "No definida",
      }));
  } catch (e) {
    console.warn("Aviso cargando sesiones históricas:", e instanceof GatewayError ? e.message : e);
    return [];
  }
}
