import { getSupabaseClient, isSupabaseConfigured } from "./supabaseClient";
import { ClassSession, CourseSection, AttendanceValue } from "@/types/attendance";
import { StudentRosterItem } from "./attendanceStore";

export interface AttendanceDbSyncResult {
  success: boolean;
  message?: string;
  error?: unknown;
}

/**
 * Registra o actualiza el curso y su sección en Supabase
 */
export async function syncCourseAndSectionToSupabase(
  courseCode: string,
  courseName: string,
  canvasCourseId: number,
  section: CourseSection
): Promise<{ success: boolean; courseId?: string; sectionId?: string; error?: unknown }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: "Supabase no configurado" };
  }

  try {
    // 1. Upsert del Curso
    const { data: course, error: cErr } = await supabase
      .from("courses")
      .upsert(
        {
          canvas_course_id: canvasCourseId,
          code: courseCode,
          name: courseName,
          term: "2026-02",
        },
        { onConflict: "canvas_course_id" }
      )
      .select("id")
      .single();

    if (cErr || !course) throw cErr || new Error("Fallo al registrar curso");

    // 2. Upsert de la Sección
    const { data: sec, error: sErr } = await supabase
      .from("sections")
      .upsert(
        {
          course_id: course.id,
          code: section.codigo || courseCode,
          name: section.nombre,
          teacher_name: section.profesor,
          assistant_name: section.ayudante,
          horario_catedra_dias: section.horarioCatedra.dias,
          horario_catedra_inicio: section.horarioCatedra.horaInicio,
          horario_catedra_fin: section.horarioCatedra.horaFin,
          horario_catedra_sala: section.horarioCatedra.sala,
          horario_ayudantia_dias: section.horarioAyudantia?.dias || [3],
          horario_ayudantia_inicio: section.horarioAyudantia?.horaInicio || "16:00",
          horario_ayudantia_fin: section.horarioAyudantia?.horaFin || "17:20",
          horario_ayudantia_sala: section.horarioAyudantia?.sala || "SALA X",
          pin_activo: section.pinActivo,
          requiere_pin: section.requierePin,
          requiere_geo: section.requiereGeolocalizacion,
        },
        { onConflict: "course_id,code" }
      )
      .select("id")
      .single();

    if (sErr || !sec) throw sErr || new Error("Fallo al registrar sección");

    return { success: true, courseId: course.id, sectionId: sec.id };
  } catch (error) {
    console.error("Error syncCourseAndSectionToSupabase:", error);
    return { success: false, error };
  }
}

/**
 * Sincroniza la lista de estudiantes matriculados y las sesiones programadas
 */
export async function syncStudentsAndSessionsToSupabase(
  sectionId: string,
  students: StudentRosterItem[],
  sessions: ClassSession[]
): Promise<AttendanceDbSyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false };

  try {
    // 1. Upsert estudiantes
    if (students.length > 0) {
      const studentsPayload = students.map((st) => ({
        canvas_id: st.canvas_id,
        rut: st.rut,
        nombres: st.nombres,
        apellidos: st.apellidos,
        email: st.email,
      }));

      const { data: insertedStudents, error: stErr } = await supabase
        .from("students")
        .upsert(studentsPayload, { onConflict: "canvas_id" })
        .select("id, canvas_id");

      if (stErr) console.warn("Aviso upsert estudiantes:", stErr.message);

      // Crear matrículas si los estudiantes existen
      if (insertedStudents && insertedStudents.length > 0) {
        const enrollmentsPayload = insertedStudents.map((st) => ({
          section_id: sectionId,
          student_id: st.id,
          status: "active" as const,
        }));

        await supabase
          .from("enrollments")
          .upsert(enrollmentsPayload, { onConflict: "section_id,student_id" });
      }
    }

    // 2. Upsert sesiones de clase
    if (sessions.length > 0) {
      const sessionsPayload = sessions.map((sess) => ({
        section_id: sectionId,
        session_code: sess.id,
        date: sess.fecha,
        dia_semana: sess.diaSemana,
        type: sess.tipo,
        modality: sess.modalidad,
        status: sess.estado,
        motivo_cancelacion: sess.motivoCancelacion || null,
        start_time: sess.horaInicio || null,
        end_time: sess.horaFin || null,
        room: sess.sala || null,
      }));

      const { error: sessErr } = await supabase
        .from("class_sessions")
        .upsert(sessionsPayload, { onConflict: "section_id,date,type" });

      if (sessErr) console.warn("Aviso upsert sesiones:", sessErr.message);
    }

    return { success: true };
  } catch (error) {
    console.error("Error syncStudentsAndSessionsToSupabase:", error);
    return { success: false, error };
  }
}

/**
 * Guarda una marcación individual (1 o 0) en Supabase por código semántico
 */
export async function saveAttendanceMarkToSupabase(
  sessionCode: string,
  studentCanvasId: number,
  value: AttendanceValue,
  markedBy: "profesor" | "ayudante" | "alumno_pin" | "sistema" = "profesor"
): Promise<AttendanceDbSyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false };

  try {
    const { error } = await supabase.rpc("upsert_attendance_by_code", {
      p_session_code: sessionCode,
      p_student_canvas_id: studentCanvasId,
      p_value: (value === 1 ? 1 : 0) as 0 | 1,
      p_marked_by: markedBy,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error guardando asistencia en Supabase:", error);
    return { success: false, error };
  }
}

/**
 * Guarda masivamente una lista de asistencias en Supabase
 */
export async function saveAttendanceBatchToSupabase(
  records: Array<{ session_code: string; student_canvas_id: number; value: number; marked_by?: string }>
): Promise<AttendanceDbSyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false };

  try {
    const { error } = await supabase.rpc("upsert_attendance_batch_by_codes", {
      records_json: records,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error en batch de asistencia a Supabase:", error);
    return { success: false, error };
  }
}

/**
 * Carga el mapa de asistencia almacenado en Supabase para una sección
 */
export async function fetchAttendanceMapFromSupabase(
  sectionCode: string
): Promise<Record<string, AttendanceValue>> {
  const supabase = getSupabaseClient();
  if (!supabase) return {};

  try {
    const { data, error } = await supabase.rpc("get_section_attendance_map", {
      p_section_code: sectionCode,
    });

    if (error || !data) {
      console.warn("No se pudo obtener mapa de asistencia Supabase:", error?.message);
      return {};
    }

    const map: Record<string, AttendanceValue> = {};
    data.forEach((r: { session_code: string; student_canvas_id: number; value: number }) => {
      map[`${r.session_code}_${r.student_canvas_id}`] = (r.value === 1 ? 1 : 0) as AttendanceValue;
    });

    return map;
  } catch (e) {
    console.error("Error cargando mapa desde Supabase:", e);
    return {};
  }
}

/**
 * Actualiza la configuración de horario y PIN de una sección en Supabase
 */
export async function updateSectionScheduleInSupabase(
  section: CourseSection
): Promise<AttendanceDbSyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, message: "Supabase no configurado" };

  try {
    const { error } = await supabase
      .from("sections")
      .update({
        name: section.nombre,
        teacher_name: section.profesor,
        assistant_name: section.ayudante,
        horario_catedra_dias: section.horarioCatedra.dias,
        horario_catedra_inicio: section.horarioCatedra.horaInicio,
        horario_catedra_fin: section.horarioCatedra.horaFin,
        horario_catedra_sala: section.horarioCatedra.sala,
        horario_ayudantia_dias: section.horarioAyudantia?.dias || [3],
        horario_ayudantia_inicio: section.horarioAyudantia?.horaInicio || "16:00",
        horario_ayudantia_fin: section.horarioAyudantia?.horaFin || "17:20",
        horario_ayudantia_sala: section.horarioAyudantia?.sala || "SALA X",
        pin_activo: section.pinActivo,
        requiere_pin: section.requierePin,
        requiere_geo: section.requiereGeolocalizacion,
        updated_at: new Date().toISOString(),
      })
      .eq("code", section.codigo);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error actualizando horario en Supabase:", error);
    return { success: false, error };
  }
}

/**
 * Obtiene todas las secciones configuradas en Supabase
 */
export async function fetchSectionsFromSupabase(): Promise<CourseSection[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from("sections").select("*");
    if (error || !data || data.length === 0) return null;

    const idMap: Record<string, string> = {
      "CIT3203_CA01": "sec_1",
      "CIT3203_CA02": "sec_2",
      "CIT3203_CA03": "sec_3",
      "CIT2206_CA01": "sec_gestion_org",
      "CIT3100_CA02": "sec_arq_emergentes",
    };

    const getCourseName = (code: string) => {
      if (code.includes("CIT3203") || code.includes("3203")) return "Proyecto en TICs II";
      if (code.includes("CIT2206") || code.includes("2206")) return "Gestión Organizacional";
      if (code.includes("CIT3100") || code.includes("3100")) return "Arquitecturas Emergentes de Software";
      return "Asignatura UDP";
    };

    return data.map((sec) => ({
      id: idMap[sec.code] || sec.code,
      codigo: sec.code,
      cursoNombre: getCourseName(sec.code),
      nombre: sec.name,
      profesor: sec.teacher_name || "Docente UDP",
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
      pinActivo: sec.pin_activo || "4821",
      requierePin: Boolean(sec.requiere_pin),
      requiereGeolocalizacion: Boolean(sec.requiere_geo),
    }));
  } catch (e) {
    console.error("Error fetchSectionsFromSupabase:", e);
    return null;
  }
}

/**
 * Guarda o actualiza las décimas y trabajos realizados de un estudiante en Supabase
 */
export async function saveStudentWorkRecordToSupabase(
  sectionCode: string,
  studentCanvasId: number,
  decimas: number,
  trabajosRealizados: number
): Promise<AttendanceDbSyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, message: "Supabase no configurado" };

  try {
    const { error } = await supabase.rpc("upsert_student_work_record", {
      p_section_code: sectionCode,
      p_student_canvas_id: studentCanvasId,
      p_decimas: decimas,
      p_trabajos: trabajosRealizados,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.warn("Aviso guardando décimas/trabajos en Supabase:", error);
    return { success: false, error };
  }
}

/**
 * Carga los registros de décimas y trabajos de ayudantía para una sección desde Supabase
 */
export async function fetchStudentWorkRecordsFromSupabase(
  sectionCode: string
): Promise<Record<number, { decimas: number; trabajosRealizados: number }>> {
  const supabase = getSupabaseClient();
  if (!supabase) return {};

  try {
    const { data, error } = await supabase.rpc("get_section_work_records", {
      p_section_code: sectionCode,
    });

    if (error || !data) {
      return {};
    }

    const map: Record<number, { decimas: number; trabajosRealizados: number }> = {};
    data.forEach((r: { student_canvas_id: number; decimas_acumuladas: number; trabajos_realizados: number }) => {
      map[r.student_canvas_id] = {
        decimas: Number(r.decimas_acumuladas) || 0,
        trabajosRealizados: Number(r.trabajos_realizados) || 0,
      };
    });

    return map;
  } catch (e) {
    console.warn("Aviso cargando décimas/trabajos desde Supabase:", e);
    return {};
  }
}

/**
 * Actualiza el estado de una sesión de clase en Supabase (ej. cancelada, programada, realizada)
 */
export async function updateSessionStatusInSupabase(
  sessionCode: string,
  status: "programada" | "realizada" | "cancelada",
  motivoCancelacion?: string
): Promise<AttendanceDbSyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false };

  try {
    const { error } = await supabase
      .from("class_sessions")
      .update({
        status,
        motivo_cancelacion: motivoCancelacion || null,
      })
      .eq("session_code", sessionCode);

    if (error) {
      console.warn("Aviso actualizando sesión en Supabase:", error.message);
      return { success: false, error };
    }
    return { success: true };
  } catch (error) {
    console.warn("Error updateSessionStatusInSupabase:", error);
    return { success: false, error };
  }
}

export { isSupabaseConfigured };
