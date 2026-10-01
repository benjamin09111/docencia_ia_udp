export type AnnouncementCategory =
  | "cancelacion"
  | "sala"
  | "notas"
  | "entrega"
  | "ayudantia"
  | "general";

export interface CanvasAnnouncement {
  id: string;
  courseCode: string;
  titulo: string;
  mensaje: string;
  categoria: AnnouncementCategory;
  fechaPublicacion: string;
  autor: string;
  estado: "publicado" | "borrador";
}

export interface AnnouncementTemplate {
  id: string;
  categoria: AnnouncementCategory;
  tituloSugerido: string;
  descripcionCorta: string;
  icono: string;
  color: string;
  generarMensaje: (data: {
    cursoNombre: string;
    cursoCodigo: string;
    profesor: string;
    fecha?: string;
    sala?: string;
    motivo?: string;
    linkPlanilla?: string;
  }) => { titulo: string; mensaje: string };
}

export const ANNOUNCEMENT_TEMPLATES: AnnouncementTemplate[] = [
  {
    id: "tpl_cancelacion",
    categoria: "cancelacion",
    tituloSugerido: "Suspensión de Cátedra por Fuerza Mayor",
    descripcionCorta: "Informa cancelación imprevista, motivos y actividades autónomas.",
    icono: "AlertOctagon",
    color: "#C8102E",
    generarMensaje: ({ cursoNombre, cursoCodigo, profesor, fecha = "este viernes", motivo = "motivos de fuerza mayor e imprevistos de salud" }) => ({
      titulo: `[AVISO URGENTE] Suspensión de clase - ${cursoCodigo}`,
      mensaje: `Estimadas y estimados estudiantes del curso ${cursoNombre}:

Lamento informarles que por ${motivo}, la sesión programada para ${fecha} queda suspendida.

El material correspondiente a la sesión y las diapositivas de lectura guiada ya se encuentran disponibles en la sección "Módulos" de Canvas para su revisión autónoma. La próxima semana retomaremos con normalidad y dedicaremos los primeros 20 minutos a resolver dudas de este contenido.

Agradezco su comprensión.

Atentamente,
${profesor}
Escuela de Informática y Telecomunicaciones UDP`,
    }),
  },
  {
    id: "tpl_cambio_sala",
    categoria: "sala",
    tituloSugerido: "Cambio de Sala / Traslado a Laboratorio",
    descripcionCorta: "Avisa reubicación de sala o clase práctica en laboratorio.",
    icono: "MapPin",
    color: "#008EE2",
    generarMensaje: ({ cursoNombre, cursoCodigo, profesor, fecha = "hoy", sala = "Laboratorio L-204 (Pabellón Informática)" }) => ({
      titulo: `[CAMBIO DE SALA] Sesión ${fecha} en ${sala} - ${cursoCodigo}`,
      mensaje: `Estimados y estimadas estudiantes:

Les informo que la clase de ${cursoNombre} de ${fecha} se llevará a cabo excepcionalmente en:

📍 Nueva Sala: ${sala}

Por favor dirigirse directamente a esta ubicación para contar con los equipos y el software necesario para el taller práctico.

Nos vemos en clase.

Saludos cordiales,
${profesor}`,
    }),
  },
  {
    id: "tpl_notas",
    categoria: "notas",
    tituloSugerido: "Publicación de Calificaciones Oficiales",
    descripcionCorta: "Notifica planilla final de notas por RUT y plazo de apelación.",
    icono: "FileSpreadsheet",
    color: "#2E7D32",
    generarMensaje: ({ cursoNombre, cursoCodigo, profesor, linkPlanilla }) => ({
      titulo: `[CALIFICACIONES] Planilla oficial publicada por RUT - ${cursoCodigo}`,
      mensaje: `Estimadas y estimados estudiantes:

Ya se encuentra publicada la planilla oficial y consolidada de calificaciones para el curso ${cursoNombre}.

Conforme a la normativa institucional y a la Ley N° 19.628 de Protección de Datos Personales, las calificaciones se encuentran publicadas exclusivamente por RUT:

🔗 Enlace de consulta: ${linkPlanilla || `https://canvas.udp.cl/calificaciones/${cursoCodigo}`}

El plazo para solicitar revisión o aclaración de pautas es de 5 días hábiles a partir de esta publicación.

Saludos cordiales,
Equipo Docente UDP`,
    }),
  },
  {
    id: "tpl_entrega",
    categoria: "entrega",
    tituloSugerido: "Recordatorio de Entrega Próxima",
    descripcionCorta: "Recuerda fecha límite, formato PDF y pauta de evaluación.",
    icono: "Clock",
    color: "#F57F17",
    generarMensaje: ({ cursoNombre, cursoCodigo, profesor, fecha = "este domingo a las 23:59 hrs" }) => ({
      titulo: `[RECORDATORIO] Próxima entrega de evaluación - ${cursoCodigo}`,
      mensaje: `Estimados estudiantes de ${cursoNombre}:

Les recordamos que el plazo límite para cargar la entrega en la plataforma vence impostergablemente ${fecha}.

Puntos importantes a verificar antes de enviar:
• Formato único de entrega: Documento PDF formal.
• Comprueben que el archivo cargado no esté corrupto y corresponda a la versión final de su equipo.
• La plataforma cierra automáticamente y no se aceptarán envíos por correo electrónico fuera de plazo.

¡Mucho éxito en el desarrollo!

Saludos cordiales,
${profesor}`,
    }),
  },
  {
    id: "tpl_ayudantia",
    categoria: "ayudantia",
    tituloSugerido: "Ayudantía Extraordinaria / Consultas",
    descripcionCorta: "Convoca sesión de resolución de dudas previa a solemnes.",
    icono: "HelpCircle",
    color: "#7B1FA2",
    generarMensaje: ({ cursoNombre, cursoCodigo, profesor, fecha = "miércoles a las 18:00 hrs", sala = "Enlace Zoom en Canvas / Sala B-102" }) => ({
      titulo: `[AYUDANTÍA EXTRA] Sesión de resolución de dudas - ${cursoCodigo}`,
      mensaje: `Estimadas y estimados:

Previo a la próxima evaluación de ${cursoNombre}, realizaremos una sesión extraordinaria de ayudantía y resolución de dudas:

📅 Fecha y Hora: ${fecha}
📍 Lugar/Conexión: ${sala}

Revisaremos ejercicios tipo prueba y responderemos consultas sobre los criterios de la pauta oficial. La asistencia es libre y voluntaria.

¡Los esperamos!

Benjamín Morales (Ayudante) & ${profesor}`,
    }),
  },
  {
    id: "tpl_material",
    categoria: "general",
    tituloSugerido: "Material de Cátedra & Código Fuente",
    descripcionCorta: "Avisa nuevas diapositivas y lecturas complementarias.",
    icono: "BookOpen",
    color: "#2D3B45",
    generarMensaje: ({ cursoNombre, cursoCodigo, profesor }) => ({
      titulo: `[MATERIAL DISPONIBLE] Diapositivas y código de la semana - ${cursoCodigo}`,
      mensaje: `Estimados y estimadas estudiantes:

Ya se encuentran cargadas en Canvas las diapositivas y ejemplos de código fuente abordados en las clases de esta semana en ${cursoNombre}.

Pueden encontrarlos en la carpeta "Módulos > Unidad 2: Tácticas de Calidad". Se sugiere complementar con las lecturas indicadas en la bibliografía oficial.

Saludos cordiales,
${profesor}`,
    }),
  },
];

export const INITIAL_ANNOUNCEMENTS: CanvasAnnouncement[] = [
  {
    id: "ann_1",
    courseCode: "CIT3000_CA02",
    titulo: "[CALIFICACIONES] Planilla oficial publicada por RUT - CIT3000_CA02",
    mensaje: "Ya se encuentra disponible la planilla final consolidada por RUT conforme a la normativa de privacidad UDP.",
    categoria: "notas",
    fechaPublicacion: "30 Sep 2026, 17:45",
    autor: "Jorge Esteban Cruz León",
    estado: "publicado",
  },
  {
    id: "ann_2",
    courseCode: "CIT3000_CA02",
    titulo: "[SOLEMNE 1] Contenidos y Sala de Evaluación - CIT3000_CA02",
    mensaje: "La solemne 1 se realizará este jueves en el Auditorio 102. Entra desde PPT 1 a PPT 6.",
    categoria: "entrega",
    fechaPublicacion: "18 Sep 2026, 11:30",
    autor: "Jorge Esteban Cruz León",
    estado: "publicado",
  },
];

const ANNOUNCEMENTS_STORAGE_KEY = "udp_course_announcements_history_v1";

export function getStoredAnnouncements(courseCode: string): CanvasAnnouncement[] {
  if (typeof window === "undefined") return INITIAL_ANNOUNCEMENTS;
  try {
    const raw = localStorage.getItem(`${ANNOUNCEMENTS_STORAGE_KEY}_${courseCode}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Error loading announcements", e);
  }
  return INITIAL_ANNOUNCEMENTS;
}

export function saveStoredAnnouncements(courseCode: string, list: CanvasAnnouncement[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${ANNOUNCEMENTS_STORAGE_KEY}_${courseCode}`, JSON.stringify(list));
  } catch (e) {
    console.error("Error saving announcements", e);
  }
}
