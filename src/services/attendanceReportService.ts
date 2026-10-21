import { CourseSection, ClassSession, AttendanceValue } from "@/types/attendance";
import { StudentRosterItem, generateSemesterSessions, getTodayDateStr, getAttendanceValue, getSavedAttendanceScheduleMap } from "./attendanceStore";
import { fetchAttendanceMapFromSupabase } from "./attendanceDbService";
import { computeAttendanceStats, isAttendanceAtRisk } from "@/utils/attendanceMetrics";
import { INITIAL_STUDENTS_ROSTER } from "@/constants/initialStudentRoster";

export interface StudentAttendanceExportRow {
  seccionCodigo: string;
  seccionNombre: string;
  profesor: string;
  ayudante: string;
  canvasId: number;
  rut: string;
  nombreCompleto: string;
  asistidasH1: number;
  asistidasH2: number;
  asistidas: number;
  validas: number;
  porcentaje: number;
  estado: "Regular" | "En Riesgo (RI)";
}

export interface SectionAttendanceSummaryReport {
  seccionCodigo: string;
  seccionNombre: string;
  profesor: string;
  ayudante: string;
  totalEstudiantes: number;
  asistenciaPromedio: number;
  alumnosEnRiesgo: number;
  alumnosRegulares: number;
  clasesRealizadas: number;
  totalAsistenciasH1: number;
  totalAsistenciasH2: number;
  estudiantes: StudentAttendanceExportRow[];
}

const CANVAS_ID_BY_CODE: Record<string, number> = {
  CIT3203_CA01: 44999, sec_1: 44999,
  CIT3203_CA02: 45002, sec_2: 45002,
  CIT3203_CA03: 47552, sec_3: 47552,
  CIT2206_CA01: 47047, sec_gestion_org: 47047,
  CIT3100_CA02: 44988, sec_arq_emergentes: 44988,
  CIT3000_CA02: 44988,
};

async function fetchRosterForSection(section: CourseSection): Promise<StudentRosterItem[]> {
  const canvasId = CANVAS_ID_BY_CODE[section.codigo] || CANVAS_ID_BY_CODE[section.id] || 44999;
  try {
    const res = await fetch(`/api/canvas/courses/${canvasId}/students`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((u: any) => ({
          canvas_id: u.canvas_id,
          rut: u.rut || "",
          nombres: u.nombres || "",
          apellidos: u.apellidos || "",
          email: u.email || "",
          seccionId: section.id,
        }));
      }
    }
  } catch {}
  return INITIAL_STUDENTS_ROSTER.filter(
    (s) => s.seccionId === section.id || s.seccionId === section.codigo
  );
}

export async function generateSectionsAttendanceSummary(
  sections: CourseSection[]
): Promise<SectionAttendanceSummaryReport[]> {
  const todayStr = getTodayDateStr();
  const reports: SectionAttendanceSummaryReport[] = [];

  const scheduleMap = getSavedAttendanceScheduleMap();

  for (const section of sections) {
    const [students, attendanceMap] = await Promise.all([
      fetchRosterForSection(section),
      fetchAttendanceMapFromSupabase(section.codigo),
    ]);

    const validSessions = generateSemesterSessions(section).filter(
      (s) => s.tipo === "ayudantia" && s.estado !== "cancelada" && s.fecha <= todayStr
    );

    const studentRows: StudentAttendanceExportRow[] = students.map((st) => {
      let asistidasH1 = 0;
      let asistidasH2 = 0;
      validSessions.forEach((sess) => {
        if (getAttendanceValue(attendanceMap, sess.id, st.canvas_id) === 1) {
          const sched =
            scheduleMap[`${sess.id}_${st.canvas_id}`] ||
            scheduleMap[`${section.codigo}_${st.canvas_id}_${sess.fecha}`] ||
            "H1";
          if (sched === "H2") asistidasH2++;
          else asistidasH1++;
        }
      });

      const stats = computeAttendanceStats(
        validSessions,
        (sId) => getAttendanceValue(attendanceMap, sId, st.canvas_id) === 1,
        todayStr
      );
      const atRisk = isAttendanceAtRisk(stats);
      const fullName = `${st.nombres || ""} ${st.apellidos || ""}`.trim() || `Estudiante ${st.canvas_id}`;
      return {
        seccionCodigo: section.codigo,
        seccionNombre: section.nombre || section.codigo,
        profesor: section.profesor || "Sin asignar",
        ayudante: section.ayudante || "Sin asignar",
        canvasId: st.canvas_id,
        rut: st.rut || "",
        nombreCompleto: fullName,
        asistidasH1,
        asistidasH2,
        asistidas: stats.asistidas,
        validas: stats.validas,
        porcentaje: stats.pct,
        estado: atRisk ? "En Riesgo (RI)" : "Regular",
      };
    });

    const totalStudents = studentRows.length;
    const avgPct = totalStudents > 0
      ? Math.round(studentRows.reduce((acc, r) => acc + r.porcentaje, 0) / totalStudents)
      : 0;
    const riskCount = studentRows.filter((r) => r.estado === "En Riesgo (RI)").length;
    const totalAsistenciasH1 = studentRows.reduce((acc, r) => acc + r.asistidasH1, 0);
    const totalAsistenciasH2 = studentRows.reduce((acc, r) => acc + r.asistidasH2, 0);

    reports.push({
      seccionCodigo: section.codigo,
      seccionNombre: `${section.cursoNombre || section.codigo} — ${section.nombre || section.codigo}`,
      profesor: section.profesor || "Sin asignar",
      ayudante: section.ayudante || "Sin asignar",
      totalEstudiantes: totalStudents,
      asistenciaPromedio: avgPct,
      alumnosEnRiesgo: riskCount,
      alumnosRegulares: totalStudents - riskCount,
      clasesRealizadas: validSessions.length,
      totalAsistenciasH1,
      totalAsistenciasH2,
      estudiantes: studentRows,
    });
  }

  return reports;
}
