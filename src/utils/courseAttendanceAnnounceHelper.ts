import { SubjectCourseGroup, EnrichedCourseSection } from "./courseGrouping";
import { getPublicCheckinUrl, getPublicVisualUrl } from "./urlHelper";
import { getSectionVisualPin, getTodayDateStr } from "@/services/attendanceStore";
import { publishAnnouncement } from "@/services/announcementsService";

/**
 * Consulta el PIN diario dinámico de asistencia para una sección específica desde la API protegida del servidor.
 */
export async function fetchDailyPinForSection(sectionCode: string, dateStr?: string): Promise<string> {
  try {
    const date = dateStr || getTodayDateStr();
    const res = await fetch(
      `/api/teacher/pin?section=${encodeURIComponent(sectionCode)}&date=${encodeURIComponent(date)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return "Disponible en clase";
    const data = await res.json();
    return typeof data?.pin === "string" ? data.pin : "Disponible en clase";
  } catch {
    return "Disponible en clase";
  }
}

/**
 * Genera el texto estándar con links de asistencia, pin dinámico y planilla de una sección.
 */
export function formatSectionAttendanceInfo(
  sec: EnrichedCourseSection,
  subjectName: string,
  dailyPin?: string
): string {
  const code = sec.code;
  const secName = sec.sectionName;
  const checkinUrl = getPublicCheckinUrl(code);
  const visualUrl = getPublicVisualUrl(code);
  const details = sec.sectionDetails;
  const visualPin = details ? getSectionVisualPin(details) : (details?.pinActivo || "4821");
  const pinAsistencia = dailyPin || "Disponible en clase";

  return `${subjectName} - ${secName}
ASISTENCIA (Check-in hoy): ${checkinUrl}
Pin de Asistencia: ${pinAsistencia}

PLANILLA DE NOTAS (Tablero): ${visualUrl}
Pin de Planilla: ${visualPin}`;
}

/**
 * Copia al portapapeles la información consolidada de asistencia de todas las secciones del grupo,
 * obteniendo el PIN diario dinámico real de cada sección.
 */
export async function copyGroupAttendanceInfo(group: SubjectCourseGroup): Promise<boolean> {
  const today = getTodayDateStr();
  const pins = await Promise.all(
    group.sections.map((s) => fetchDailyPinForSection(s.code, today))
  );

  const allText = group.sections
    .map((s, idx) => formatSectionAttendanceInfo(s, group.subjectName, pins[idx]))
    .join("\n\n--------------------\n\n");

  try {
    if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(allText);
      return true;
    }
    const ta = document.createElement("textarea");
    ta.value = allText;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch (e) {
    console.error("Error al copiar asistencia del grupo:", e);
    return false;
  }
}

/**
 * Publica automáticamente un comunicado oficial de asistencia de hoy en cada sección del grupo,
 * con el PIN dinámico de cada una.
 */
export async function publishGroupAttendanceAnnouncement(group: SubjectCourseGroup): Promise<number> {
  const today = getTodayDateStr();
  const pins = await Promise.all(
    group.sections.map((s) => fetchDailyPinForSection(s.code, today))
  );

  let count = 0;
  group.sections.forEach((sec, idx) => {
    const text = formatSectionAttendanceInfo(sec, group.subjectName, pins[idx]);
    publishAnnouncement(sec.code, {
      titulo: "Asistencia de la clase de hoy",
      mensaje: `Estimadas y estimados estudiantes:\n\nComparto los accesos para la sesión de hoy:\n\n${text}\n\nPor favor registrar su asistencia dentro del horario estipulado.`,
      categoria: "general",
      autor: sec.profesor || sec.ayudante || "Docente UDP",
    });
    count++;
  });
  return count;
}
