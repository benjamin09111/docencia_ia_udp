import { SubjectCourseGroup, EnrichedCourseSection } from "./courseGrouping";
import { getPublicCheckinUrl, getPublicVisualUrl } from "./urlHelper";
import { getSectionVisualPin } from "@/services/attendanceStore";
import { publishAnnouncement } from "@/services/announcementsService";

/**
 * Genera el texto estándar con links de asistencia, pin y plantilla de una sección.
 */
export function formatSectionAttendanceInfo(sec: EnrichedCourseSection, subjectName: string): string {
  const code = sec.code;
  const secName = sec.sectionName;
  const checkinUrl = getPublicCheckinUrl(code);
  const visualUrl = getPublicVisualUrl(code);
  const details = sec.sectionDetails;
  const pin = details?.pinActivo || "Disponible en clase";
  const visualPin = details ? getSectionVisualPin(details) : "4821";

  return `${subjectName} - ${secName}
ASISTENCIA: ${checkinUrl}
Pin: ${pin}
PLANTILLA (${visualPin}): ${visualUrl}`;
}

/**
 * Copia al portapapeles la información consolidada de asistencia de todas las secciones del grupo.
 */
export async function copyGroupAttendanceInfo(group: SubjectCourseGroup): Promise<boolean> {
  const allText = group.sections
    .map((s) => formatSectionAttendanceInfo(s, group.subjectName))
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
 * Publica automáticamente un comunicado oficial de asistencia de hoy en cada sección del grupo.
 */
export function publishGroupAttendanceAnnouncement(group: SubjectCourseGroup): number {
  let count = 0;
  group.sections.forEach((sec) => {
    const text = formatSectionAttendanceInfo(sec, group.subjectName);
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
