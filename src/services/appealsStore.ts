import { AttendanceAppeal } from "@/types/attendance";
import { fetchAppeals, insertAppeal, updateAppealsStatus } from "./attendanceCloudService";

// Las apelaciones viven en Supabase (tabla attendance_appeals) para que el docente reciba
// las que envían los alumnos desde su propio celular.
const RATE_LIMIT_COOLDOWN_MS = 30000; // 30 segundos de cooldown entre envíos por dispositivo
const LAST_SUBMIT_KEY = "udp_last_appeal_submit_timestamp";

export function getSavedAppeals(sectionCode: string): Promise<AttendanceAppeal[]> {
  return fetchAppeals(sectionCode);
}

export async function createAppeal(data: {
  sectionCode: string;
  studentCanvasId: number;
  studentName: string;
  studentRut?: string;
  date: string;
  comentario?: string;
}): Promise<{ success: boolean; message: string }> {
  if (typeof window === "undefined") {
    return { success: false, message: "Entorno no compatible" };
  }

  // Protección contra envíos en ráfaga: cooldown de 30s por dispositivo
  try {
    const lastSubmitStr = localStorage.getItem(LAST_SUBMIT_KEY);
    if (lastSubmitStr) {
      const elapsed = Date.now() - Number(lastSubmitStr);
      if (elapsed < RATE_LIMIT_COOLDOWN_MS) {
        const remainingSec = Math.ceil((RATE_LIMIT_COOLDOWN_MS - elapsed) / 1000);
        return {
          success: false,
          message: `Por favor espera ${remainingSec}s antes de enviar otra apelación.`,
        };
      }
    }
  } catch {}

  const result = await insertAppeal({
    sectionCode: data.sectionCode,
    studentCanvasId: data.studentCanvasId,
    studentName: data.studentName,
    studentRut: data.studentRut,
    date: data.date,
    comentario: data.comentario?.trim() || "Sí asistí hoy",
  });

  if (result.duplicate) {
    return {
      success: false,
      message: `Ya tienes una apelación pendiente para la clase del ${data.date}. El equipo docente la revisará pronto.`,
    };
  }
  if (!result.ok) {
    return {
      success: false,
      message: "No se pudo enviar la apelación. Revisa tu conexión e inténtalo nuevamente.",
    };
  }

  try {
    localStorage.setItem(LAST_SUBMIT_KEY, String(Date.now()));
  } catch {}

  return {
    success: true,
    message: `✓ Apelación enviada correctamente para el ${data.date}. El docente la resolverá a la brevedad.`,
  };
}

export async function resolveAppeals(
  appeals: AttendanceAppeal[],
  resolvedBy = "Docente"
): Promise<boolean> {
  return updateAppealsStatus(appeals.map((a) => a.id), "resuelta", resolvedBy);
}

export async function rejectAppeal(appeal: AttendanceAppeal): Promise<boolean> {
  return updateAppealsStatus([appeal.id], "rechazada", "Docente");
}
