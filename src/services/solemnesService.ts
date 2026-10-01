export interface CourseSolemne {
  id: string;
  codigoCurso: string;
  numero: number;
  titulo: string;
  ponderacion: string;
  fecha: string; // "2026-09-25"
  hora: string; // "14:30 - 16:00"
  sala: string; // "Auditorio 102 - Torre Central"
  contenidosOficialesSeleccionados: string[];
  contenidosManuales: string;
  miniDescripcionAnuncio?: string;
  incluirContenidosEnAnuncio: boolean;
  incluirFechaHorarioEnAnuncio: boolean;
  anuncioPublicado?: boolean;
  fechaUltimoAnuncio?: string;
}

export const CONTENIDOS_OFICIALES_PROGRAMA = [
  "Atributos de Calidad y Requerimientos No Funcionales (NFR) — Bass et al.",
  "Escenarios de Calidad: Estímulo, Entorno y Medida de Respuesta Cuantitativa",
  "Tácticas de Disponibilidad: Failover, Réplicas Activas-Calientes y Heartbeat",
  "Tácticas de Rendimiento: Concurrencia, Balanceo de Carga y Caché",
  "Patrones Arquitectónicos: Microservicios vs Monolito Modular vs EDA",
  "Diseño y Versionamiento de APIs RESTful y Contratos OpenAPI / Swagger",
  "Modelado de Sistemas C4: Contexto, Contenedores y Componentes",
  "Evaluación Arquitectónica y Matriz de Trade-offs Técnicos (Método ATAM)",
];

export const INITIAL_SOLEMNES: CourseSolemne[] = [
  {
    id: "sol_1",
    codigoCurso: "CIT3000_CA02",
    numero: 1,
    titulo: "Solemne 1",
    ponderacion: "20%",
    fecha: "2026-09-25",
    hora: "14:30 - 16:00",
    sala: "Auditorio 102 - Torre Central",
    contenidosOficialesSeleccionados: [
      "Atributos de Calidad y Requerimientos No Funcionales (NFR) — Bass et al.",
      "Escenarios de Calidad: Estímulo, Entorno y Medida de Respuesta Cuantitativa",
      "Tácticas de Disponibilidad: Failover, Réplicas Activas-Calientes y Heartbeat",
      "Tácticas de Rendimiento: Concurrencia, Balanceo de Carga y Caché",
    ],
    contenidosManuales: "Entra desde la PPT1 a la PPT6. Lectura obligatoria: Capítulos 1 y 2 de Software Architecture in Practice.",
    miniDescripcionAnuncio: "Evaluación presencial individual. Se permite 1 hoja de apuntes manuscrita (formulario de tácticas).",
    incluirContenidosEnAnuncio: true,
    incluirFechaHorarioEnAnuncio: true,
    anuncioPublicado: true,
    fechaUltimoAnuncio: "18 Sep 2026, 11:30",
  },
  {
    id: "sol_2",
    codigoCurso: "CIT3000_CA02",
    numero: 2,
    titulo: "Solemne 2",
    ponderacion: "20%",
    fecha: "2026-11-27",
    hora: "14:30 - 16:00",
    sala: "Auditorio 201 - Edificio Ejército 441",
    contenidosOficialesSeleccionados: [
      "Patrones Arquitectónicos: Microservicios vs Monolito Modular vs EDA",
      "Diseño y Versionamiento de APIs RESTful y Contratos OpenAPI / Swagger",
      "Modelado de Sistemas C4: Contexto, Contenedores y Componentes",
      "Evaluación Arquitectónica y Matriz de Trade-offs Técnicos (Método ATAM)",
    ],
    contenidosManuales: "PPT 7 a PPT 12. Modelado C4 en Structurizr/PlantUML y trade-offs ATAM.",
    miniDescripcionAnuncio: "Prueba práctica de diseño arquitectónico con caso de estudio bancario.",
    incluirContenidosEnAnuncio: true,
    incluirFechaHorarioEnAnuncio: true,
    anuncioPublicado: false,
  },
  {
    id: "sol_examen",
    codigoCurso: "CIT3000_CA02",
    numero: 3,
    titulo: "Examen Final / Recuperativa",
    ponderacion: "20%",
    fecha: "2026-12-14",
    hora: "10:00 - 12:30",
    sala: "Sala B-301 - Pabellón Docente",
    contenidosOficialesSeleccionados: [
      "Atributos de Calidad y Requerimientos No Funcionales (NFR) — Bass et al.",
      "Escenarios de Calidad: Estímulo, Entorno y Medida de Respuesta Cuantitativa",
      "Tácticas de Disponibilidad: Failover, Réplicas Activas-Calientes y Heartbeat",
      "Tácticas de Rendimiento: Concurrencia, Balanceo de Carga y Caché",
      "Patrones Arquitectónicos: Microservicios vs Monolito Modular vs EDA",
      "Diseño y Versionamiento de APIs RESTful y Contratos OpenAPI / Swagger",
      "Modelado de Sistemas C4: Contexto, Contenedores y Componentes",
      "Evaluación Arquitectónica y Matriz de Trade-offs Técnicos (Método ATAM)",
    ],
    contenidosManuales: "Examen integrador de todo el semestre para alumnos bajo nota de eximición (4.5) o recuperativa justificada.",
    miniDescripcionAnuncio: "Alumnos eximidos no rinden esta instancia.",
    incluirContenidosEnAnuncio: true,
    incluirFechaHorarioEnAnuncio: true,
    anuncioPublicado: false,
  },
];

const SOLEMNES_STORAGE_KEY = "udp_course_solemnes_data_v1";

export function getStoredSolemnes(courseCode: string): CourseSolemne[] {
  if (typeof window === "undefined") return INITIAL_SOLEMNES;
  try {
    const raw = localStorage.getItem(`${SOLEMNES_STORAGE_KEY}_${courseCode}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Error loading solemnes data", e);
  }
  return INITIAL_SOLEMNES;
}

export function saveStoredSolemnes(courseCode: string, solemnes: CourseSolemne[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${SOLEMNES_STORAGE_KEY}_${courseCode}`, JSON.stringify(solemnes));
  } catch (e) {
    console.error("Error saving solemnes data", e);
  }
}
