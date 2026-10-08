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
  method: "PIN + GPS" | "PIN" | "Link Directo" | "Docente Manual" | "Quórum Grupal" | "QR";
  distanciaMetros?: number;
  timestampISO: string;
}

const LOGS_STORAGE_KEY = "udp_attendance_logs_history_v1";

const DEFAULT_MOCK_LOGS: AttendanceCheckinLog[] = [
  {
    id: "log_init_1",
    sectionId: "sec_1",
    sectionCode: "CIT3203_CA01",
    studentCanvasId: 29248,
    studentName: "Benjamín Morales Pizarro",
    studentRut: "20.481.932-8",
    studentEmail: "benjamin.morales3@mail.udp.cl",
    date: "2026-10-07",
    time: "14:32:15",
    method: "PIN + GPS",
    distanciaMetros: 18,
    timestampISO: "2026-10-07T14:32:15.000Z",
  },
  {
    id: "log_init_2",
    sectionId: "sec_1",
    sectionCode: "CIT3203_CA01",
    studentCanvasId: 31021,
    studentName: "Víctor Vicente Barrera Jorquera",
    studentRut: "21.109.845-K",
    studentEmail: "victor.barrera@mail.udp.cl",
    date: "2026-10-07",
    time: "14:34:02",
    method: "PIN + GPS",
    distanciaMetros: 25,
    timestampISO: "2026-10-07T14:34:02.000Z",
  },
  {
    id: "log_init_3",
    sectionId: "sec_1",
    sectionCode: "CIT3203_CA01",
    studentCanvasId: 32415,
    studentName: "Laura Francisca Salinas Herrera",
    studentRut: "20.912.433-4",
    studentEmail: "laura.salinas1@mail.udp.cl",
    date: "2026-10-07",
    time: "14:35:48",
    method: "PIN + GPS",
    distanciaMetros: 12,
    timestampISO: "2026-10-07T14:35:48.000Z",
  },
];

export function getSavedAttendanceLogs(sectionCodeOrId?: string): AttendanceCheckinLog[] {
  if (typeof window === "undefined") return DEFAULT_MOCK_LOGS;
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    const list: AttendanceCheckinLog[] = raw ? JSON.parse(raw) : DEFAULT_MOCK_LOGS;
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
    return DEFAULT_MOCK_LOGS;
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
