import { AttendanceAppeal } from "@/types/attendance";

export interface AppealStudentGroup {
  studentCanvasId: number;
  studentName: string;
  /** Todas las fechas apeladas por el alumno (más antigua primero) */
  appeals: AttendanceAppeal[];
  /** Última actividad del grupo, para ordenar (más reciente primero) */
  latestAt: string;
}

/** Agrupa las apelaciones por alumno: una fila con todas sus fechas. */
export function groupAppealsByStudent(appeals: AttendanceAppeal[]): AppealStudentGroup[] {
  const map = new Map<number, AppealStudentGroup>();
  for (const a of appeals) {
    const group = map.get(a.studentCanvasId) ?? {
      studentCanvasId: a.studentCanvasId,
      studentName: a.studentName,
      appeals: [],
      latestAt: a.createdAt,
    };
    group.appeals.push(a);
    if (a.createdAt > group.latestAt) group.latestAt = a.createdAt;
    map.set(a.studentCanvasId, group);
  }
  return Array.from(map.values())
    .map((g) => ({ ...g, appeals: [...g.appeals].sort((x, y) => x.date.localeCompare(y.date)) }))
    .sort((a, b) => b.latestAt.localeCompare(a.latestAt));
}
