export type AnnouncementType = "suspension" | "sala" | "entrega" | "notas";

export interface AnnouncementTemplate {
  title: string;
  body: string;
}

export const getAnnouncementTemplate = (
  type: AnnouncementType,
  fecha: string,
  detalle: string
): AnnouncementTemplate => {
  switch (type) {
    case "suspension":
      return {
        title: "🛑 URGENTE: Suspensión de Sesión Docente",
        body: `Estimados y estimadas estudiantes:\n\nPor medio del presente comunicado oficial se informa que la clase programada para ${fecha} queda excepcionalmente SUSPENDIDA debido a ${detalle}.\n\nLas actividades y material de trabajo asincrónico quedarán disponibles en Canvas. Agradecemos su comprensión.\n\nAtentamente,\nEquipo Docente UDP`,
      };
    case "sala":
      return {
        title: "📍 AVISO: Cambio de Sala / Laboratorio",
        body: `Estimadas y estimados estudiantes:\n\nSe les notifica que la clase programada para ${fecha} se realizará excepcionalmente en: ${detalle}.\n\nRogamos acudir puntualmente a dicha ubicación.\n\nSaludos cordiales,\nEquipo Docente UDP`,
      };
    case "entrega":
      return {
        title: "⏰ RECORDATORIO: Próximo Hito de Entrega Oficial",
        body: `Estimadas y estimados estudiantes:\n\nLes recordamos que el plazo oficial para ${detalle} vence impostergablemente ${fecha}.\n\nPor favor verificar que los entregables y enlaces cumplan con los lineamientos de la pauta Canvas.\n\nÉxito en el desarrollo,\nEquipo Docente UDP`,
      };
    case "notas":
      return {
        title: "📊 PUBLICACIÓN: Planilla de Calificaciones Oficiales",
        body: `Estimadas y estimados estudiantes:\n\nYa se encuentran publicadas en Canvas las notas oficiales correspondientes a ${detalle}.\n\nPueden revisar su detalle y observaciones. El período de consultas finaliza ${fecha}.\n\nSaludos cordiales,\nEquipo Docente UDP`,
      };
  }
};
