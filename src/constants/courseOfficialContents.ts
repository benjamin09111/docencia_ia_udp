/** Contenidos indexados desde los programas oficiales por asignatura. */
const CONTENTS_BY_COURSE: Record<string, string[]> = {
  CIT3000: [
    "Atributos de calidad y requerimientos no funcionales",
    "Escenarios de calidad: estímulo, entorno y medida de respuesta",
    "Tácticas de disponibilidad y rendimiento",
    "Patrones arquitectónicos y trade-offs",
    "Modelado C4: contexto, contenedores y componentes",
    "Evaluación arquitectónica mediante ATAM",
  ],
  CIT3203: [
    "Fundamentos de gestión de proyectos TIC y ciclo de vida",
    "Planificación, alcance y estructura de desglose del trabajo",
    "Gestión ágil del proyecto, backlog e historias de usuario",
    "Gestión de riesgos, costos y cronograma",
    "Calidad, comunicaciones y trabajo colaborativo",
    "Cierre, lecciones aprendidas y presentación del proyecto",
  ],
  CIT2206: [
    "Fundamentos de gestión y comportamiento organizacional",
    "Estructura, cultura y diseño organizacional",
    "Liderazgo, motivación y trabajo en equipos",
    "Comunicación y gestión del cambio",
  ],
  CIT3100: [
    "Fundamentos de arquitecturas emergentes",
    "Microservicios, APIs y sistemas distribuidos",
    "Cloud computing, contenedores y orquestación",
    "Observabilidad, seguridad y resiliencia",
  ],
};

export function getOfficialCourseContents(courseCode: string): string[] {
  const prefix = courseCode.split("_")[0];
  return CONTENTS_BY_COURSE[prefix] || [];
}
