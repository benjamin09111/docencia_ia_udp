import { AttendanceAppeal } from "@/types/attendance";

const APPEALS_STORAGE_KEY = "udp_attendance_appeals_v1";
const RATE_LIMIT_COOLDOWN_MS = 30000; // 30 segundos de cooldown entre envíos por cliente
const LAST_SUBMIT_KEY = "udp_last_appeal_submit_timestamp";

export function getSavedAppeals(sectionCodeOrId?: string): AttendanceAppeal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(APPEALS_STORAGE_KEY);
    const list: AttendanceAppeal[] = raw ? JSON.parse(raw) : [];
    if (!sectionCodeOrId) return list;
    return list.filter(
      (a) => a.sectionCode === sectionCodeOrId || a.sectionId === sectionCodeOrId
    );
  } catch {
    return [];
  }
}

export function saveAppeals(appeals: AttendanceAppeal[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(APPEALS_STORAGE_KEY, JSON.stringify(appeals));
    window.dispatchEvent(new CustomEvent("udp_appeals_updated", { detail: appeals }));
    if ("BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel("udp_appeals_channel");
        channel.postMessage({ type: "APPEALS_SYNC", timestamp: Date.now() });
        channel.close();
      } catch {}
    }
  } catch (e) {
    console.error("Error saving appeals to localStorage:", e);
  }
}

export function createAppeal(data: {
  sectionId: string;
  sectionCode: string;
  studentCanvasId: number;
  studentName: string;
  studentRut?: string;
  date: string;
  motivo?: "asistencia";
  comentario?: string;
}): { success: boolean; message: string; appeal?: AttendanceAppeal } {
  if (typeof window === "undefined") {
    return { success: false, message: "Entorno no compatible" };
  }

  // 1. Protección contra ataques de ráfaga / DoS: Cooldown de 30s
  try {
    const lastSubmitStr = localStorage.getItem(LAST_SUBMIT_KEY);
    if (lastSubmitStr) {
      const elapsed = Date.now() - Number(lastSubmitStr);
      if (elapsed < RATE_LIMIT_COOLDOWN_MS) {
        const remainingSec = Math.ceil((RATE_LIMIT_COOLDOWN_MS - elapsed) / 1000);
        return {
          success: false,
          message: `Seguridad: Por favor espera ${remainingSec}s antes de enviar otra apelación para evitar saturación.`,
        };
      }
    }
  } catch {}

  const currentAppeals = getSavedAppeals();

  // 2. Prevenir apelaciones duplicadas pendientes para el mismo alumno y fecha
  const existingPending = currentAppeals.find(
    (a) =>
      a.studentCanvasId === data.studentCanvasId &&
      a.date === data.date &&
      a.status === "pendiente"
  );

  if (existingPending) {
    return {
      success: false,
      message: `Ya tienes una apelación pendiente registrada para la clase del ${data.date}. El equipo docente la revisará pronto.`,
    };
  }

  // 3. Crear apelación sanitizada
  const newAppeal: AttendanceAppeal = {
    id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    sectionId: data.sectionId,
    sectionCode: data.sectionCode,
    studentCanvasId: data.studentCanvasId,
    studentName: data.studentName.trim().slice(0, 100),
    studentRut: data.studentRut?.trim().slice(0, 20),
    date: data.date,
    motivo: "asistencia",
    comentario: data.comentario?.trim().slice(0, 300) || "Sí asistí hoy",
    status: "pendiente",
    createdAt: new Date().toISOString(),
  };

  const updated = [newAppeal, ...currentAppeals];
  saveAppeals(updated);

  try {
    localStorage.setItem(LAST_SUBMIT_KEY, String(Date.now()));
  } catch {}

  return {
    success: true,
    message: `✓ Apelación enviada correctamente para el ${data.date}. El docente la resolverá a la brevedad.`,
    appeal: newAppeal,
  };
}

export function resolveAllPendingAppeals(sectionCodeOrId?: string): {
  resolvedAppeals: AttendanceAppeal[];
  updatedList: AttendanceAppeal[];
} {
  const current = getSavedAppeals();
  const now = new Date().toISOString();
  const resolvedAppeals: AttendanceAppeal[] = [];

  const updatedList = current.map((a) => {
    const matchesSection = !sectionCodeOrId || a.sectionCode === sectionCodeOrId || a.sectionId === sectionCodeOrId;
    if (matchesSection && a.status === "pendiente") {
      const resolved: AttendanceAppeal = {
        ...a,
        status: "resuelta",
        resolvedAt: now,
        resolvedBy: "Docente (Resolución Masiva)",
      };
      resolvedAppeals.push(resolved);
      return resolved;
    }
    return a;
  });

  saveAppeals(updatedList);
  return { resolvedAppeals, updatedList };
}

export function resolveSingleAppeal(appealId: string): AttendanceAppeal | null {
  const current = getSavedAppeals();
  let resolved: AttendanceAppeal | null = null;
  const updated = current.map((a) => {
    if (a.id === appealId) {
      resolved = { ...a, status: "resuelta", resolvedAt: new Date().toISOString() };
      return resolved;
    }
    return a;
  });
  if (resolved) saveAppeals(updated);
  return resolved;
}

export function rejectSingleAppeal(appealId: string): AttendanceAppeal | null {
  const current = getSavedAppeals();
  let rejected: AttendanceAppeal | null = null;
  const updated = current.map((a) => {
    if (a.id === appealId) {
      rejected = { ...a, status: "rechazada", resolvedAt: new Date().toISOString() };
      return rejected;
    }
    return a;
  });
  if (rejected) saveAppeals(updated);
  return rejected;
}
