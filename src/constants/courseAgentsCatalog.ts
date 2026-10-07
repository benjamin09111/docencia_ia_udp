export interface CourseAgentMetadata {
  courseCode: string;
  courseName: string;
  level: string;
  teorico: {
    name: string;
    corpus: string;
    scope: string;
  };
  sectionCodes: { code: string; name: string; eximicion: string }[];
}

export const COURSE_AGENTS_METADATA: CourseAgentMetadata[] = [
  {
    courseCode: "CIT3203",
    courseName: "PROYECTO EN TICS II",
    level: "10° Semestre • Escuela de Informática y Telecomunicaciones UDP",
    teorico: {
      name: "Agente Teórico CIT3203",
      corpus: "Guía PMBOK 7ma Edición (PMI), Marcos Ágiles (Scrum, Kanban), 6 RAPs Institucionales y 7 Unidades Temáticas",
      scope: "1 Agente Teórico Centralizado (Compartido idénticamente por las Secciones 1, 2 y 3)",
    },
    sectionCodes: [
      { code: "CIT3203_CA01", name: "Sección 1", eximicion: "Promedio ≥ 5.5 + 75% Asistencia" },
      { code: "CIT3203_CA02", name: "Sección 2", eximicion: "Promedio ≥ 5.0 + 75% Asistencia" },
      { code: "CIT3203_CA03", name: "Sección 3", eximicion: "Régimen taller 100% ponderado (Sin examen)" },
    ],
  },
  {
    courseCode: "CIT2206",
    courseName: "GESTIÓN ORGANIZACIONAL",
    level: "6° Semestre • Escuela de Informática y Telecomunicaciones UDP",
    teorico: {
      name: "Agente Teórico CIT2206",
      corpus: "Teoría de la Organización, Estructuras, Dinámicas de Personas, Liderazgo Estratégico y Casos Harvard",
      scope: "1 Agente Teórico Centralizado",
    },
    sectionCodes: [
      { code: "CIT2206_CA01", name: "Sección 1", eximicion: "Promedio ≥ 5.0 + 75% Asistencia" },
    ],
  },
  {
    courseCode: "CIT3100",
    courseName: "ARQUITECTURAS EMERGENTES DE SOFTWARE",
    level: "8° Semestre • Escuela de Informática y Telecomunicaciones UDP",
    teorico: {
      name: "Agente Teórico CIT3100",
      corpus: "Patrones Cloud Native, Microservicios, Sistemas Distribuidos, Serverless & Kubernetes",
      scope: "1 Agente Teórico Centralizado",
    },
    sectionCodes: [
      { code: "CIT3100_CA02", name: "Sección 2", eximicion: "Promedio ≥ 5.2 + Proyecto desplegado en nube" },
    ],
  },
];
