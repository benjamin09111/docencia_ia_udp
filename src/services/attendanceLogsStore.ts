export interface AttendanceCheckinLog {
  id: string;
  sectionId: string;
  sectionCode: string;
  studentCanvasId: number;
  studentName: string;
  studentRut?: string;
  studentEmail?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  method: "PIN" | "PIN + GPS" | "Registro Online" | "Docente Manual" | "Quórum Grupal";
  distanciaMetros?: number;
  timestampISO: string;
}

const LOGS_STORAGE_KEY = "udp_attendance_logs_history_v2";

export function getSavedAttendanceLogs(sectionCodeOrId?: string): AttendanceCheckinLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    const list: AttendanceCheckinLog[] = raw ? JSON.parse(raw) : [];
    if (!sectionCodeOrId) return list;
    const searchUpper = sectionCodeOrId.toUpperCase();
    return list.filter(
      (l) =>
        l.sectionCode?.toUpperCase() === searchUpper ||
        l.sectionId?.toUpperCase() === searchUpper ||
        searchUpper.includes(l.sectionCode?.toUpperCase() || "") ||
        (l.sectionCode && searchUpper.includes(l.sectionCode.toUpperCase()))
    );
  } catch {
    return [];
  }
}

export function saveAttendanceLogs(logs: AttendanceCheckinLog[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
    window.dispatchEvent(new CustomEvent("udp_attendance_logs_updated", { detail: logs }));
  } catch (e) {
    console.error("Error saving attendance logs to localStorage:", e);
  }
}

export function addAttendanceLog(
  data: Omit<AttendanceCheckinLog, "id" | "timestampISO">
): AttendanceCheckinLog {
  const currentLogs = getSavedAttendanceLogs();
  const now = new Date();
  const newLog: AttendanceCheckinLog = {
    ...data,
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestampISO: now.toISOString(),
  };

  // Prevenir duplicados idénticos en menos de 10 segundos
  const isDuplicate = currentLogs.some(
    (l) =>
      l.studentCanvasId === newLog.studentCanvasId &&
      l.date === newLog.date &&
      l.method === newLog.method &&
      Math.abs(new Date(l.timestampISO).getTime() - now.getTime()) < 10000
  );

  if (!isDuplicate) {
    const updated = [newLog, ...currentLogs];
    saveAttendanceLogs(updated);
  }
  return newLog;
}

export function clearAttendanceLogs(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LOGS_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("udp_attendance_logs_updated", { detail: [] }));
  } catch (e) {
    console.error("Error clearing attendance logs:", e);
  }
}
