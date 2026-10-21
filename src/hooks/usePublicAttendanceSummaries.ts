import { useMemo } from "react";
import { StudentRosterItem, getAttendanceValue } from "@/services/attendanceStore";
import { ClassSession, StudentWorkRecord, AttendanceValue } from "@/types/attendance";
import { computeAttendanceStats, isAttendanceAtRisk } from "@/utils/attendanceMetrics";
import { StudentVisualRow } from "@/components/modules/public-attendance/PublicAttendanceRosterMatrix";

interface Props {
  students: StudentRosterItem[];
  sessions: ClassSession[];
  attendanceMap: Record<string, AttendanceValue>;
  studentWorkRecords: Record<number, StudentWorkRecord>;
  searchTerm: string;
  conditionFilter: "all" | "ok" | "risk";
}

export function usePublicAttendanceSummaries({
  students,
  sessions,
  attendanceMap,
  studentWorkRecords,
  searchTerm,
  conditionFilter,
}: Props) {
  const studentSummaries: StudentVisualRow[] = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return students
      .map((st) => {
        const stats = computeAttendanceStats(sessions, (id) => getAttendanceValue(attendanceMap, id, st.canvas_id) === 1);
        const { asistidas, validas, pct } = stats;
        const work = studentWorkRecords[st.canvas_id];
        const trabCount = work ? (work.trabajosRealizados ?? 0) : 0;
        const fullName = `${st.nombres || ""} ${st.apellidos || ""}`.trim() || (st as any).name || st.rut || `Estudiante ${st.canvas_id}`;
        return {
          canvas_id: st.canvas_id,
          nombreCompleto: fullName,
          nombres: st.nombres,
          apellidos: st.apellidos,
          rut: st.rut || "",
          asistidas,
          validas,
          pct,
          ok: !isAttendanceAtRisk(stats),
          decimas: Math.round(trabCount * 0.2 * 10) / 10,
          trabajosRealizados: trabCount,
        };
      })
      .filter((st) => {
        if (query && !st.nombreCompleto.toLowerCase().includes(query)) return false;
        if (conditionFilter === "ok" && !st.ok) return false;
        if (conditionFilter === "risk" && st.ok) return false;
        return true;
      });
  }, [students, sessions, attendanceMap, studentWorkRecords, searchTerm, conditionFilter]);

  const highlightedStudent = useMemo(() => {
    if (searchTerm.trim().length >= 3 && studentSummaries.length === 1) return studentSummaries[0];
    return null;
  }, [searchTerm, studentSummaries]);

  return { studentSummaries, highlightedStudent };
}
