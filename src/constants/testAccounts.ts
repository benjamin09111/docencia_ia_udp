export interface TestAccount {
  id: string;
  email: string;
  username: string;
  name: string;
  role: "admin" | "docente" | "ayudante" | "estudiante";
  isOwner: boolean;
  description: string;
  coursesSummary: string;
}

export const DEV_PASSWORD = "udp2026";
export const DEV_SALT = "udp_dev_salt_2026";
export const DEV_HASH = "352864c7a2c55c06ae74510fd91df707b6787a3747fb6c33f9f83a4be98423acd77487273c922e86fd1c867530f2292c3e4634e6ebece4478c45d12dba5add6e";

export const TEST_ACCOUNTS: TestAccount[] = [
  // --- 1. ADMINISTRADORES ---
  {
    id: "usr_admin_1",
    email: "admin1@udp.test",
    username: "admin1",
    name: "Dra. Carolina Lagos (Decana FIC)",
    role: "admin",
    isOwner: false,
    description: "Visión global: Facultades, métricas y supervisión de agentes.",
    coursesSummary: "Panel Escuela & Supervisión Global",
  },
  {
    id: "usr_admin_2",
    email: "admin2@udp.test",
    username: "admin2",
    name: "Mg. Roberto González (Coordinador Académico)",
    role: "admin",
    isOwner: false,
    description: "Gestión curricular, oferta académica y calendario anual.",
    coursesSummary: "Gestión Curricular y Salas",
  },
  {
    id: "usr_admin_3",
    email: "admin3@udp.test",
    username: "admin3",
    name: "Lic. Patricia Morales (Administradora UDP)",
    role: "admin",
    isOwner: false,
    description: "Gestión de roles, usuarios, costos y auditoría de IA.",
    coursesSummary: "Usuarios, Roles y Costos IA",
  },

  // --- 2. DOCENTES ---
  {
    id: "usr_docente_1",
    email: "bmorales@udp.test",
    username: "bmorales",
    name: "Prof. Benjamín Morales Pizarro (Titular)",
    role: "docente",
    isOwner: true,
    description: "Cátedra de Arquitectura de Software y proyectos de titulación.",
    coursesSummary: "CIT3000 Arquitectura de Software (Sandbox / Canvas)",
  },
  {
    id: "usr_docente_2",
    email: "docente.prog@udp.test",
    username: "docente_prog",
    name: "Prof. Alejandro Silva (Cátedra Programación)",
    role: "docente",
    isOwner: false,
    description: "Taller de Programación y Algoritmos, rúbricas de código.",
    coursesSummary: "CIT1000 Taller de Programación (Piloto)",
  },
  {
    id: "usr_docente_3",
    email: "docente.gest@udp.test",
    username: "docente_gest",
    name: "Prof. Marcela Soto (Cátedra Gestión)",
    role: "docente",
    isOwner: false,
    description: "Gestión Organizacional, proyectos grupales y KPIs.",
    coursesSummary: "CIT2206 Gestión Organizacional (Piloto)",
  },

  // --- 3. AYUDANTES ---
  {
    id: "usr_ayudante_1",
    email: "ayudante1@udp.test",
    username: "ayudante1",
    name: "Lucas Meneses (Ayudante Arquitectura)",
    role: "ayudante",
    isOwner: false,
    description: "Talleres prácticos de arquitectura, revisión y décimas.",
    coursesSummary: "CIT3000 Laboratorio & Ayudantía",
  },
  {
    id: "usr_ayudante_2",
    email: "ayudante2@udp.test",
    username: "ayudante2",
    name: "Sofía Valenzuela (Ayudante Programación)",
    role: "ayudante",
    isOwner: false,
    description: "Ejercicios de código en vivo y quórum de asistencia.",
    coursesSummary: "CIT1000 Ayudantía de Programación",
  },
  {
    id: "usr_ayudante_3",
    email: "ayudante3@udp.test",
    username: "ayudante3",
    name: "Matías Riquelme (Ayudante Gestión)",
    role: "ayudante",
    isOwner: false,
    description: "Seguimiento de entregas grupales y apelaciones.",
    coursesSummary: "CIT2206 Ayudantía de Gestión",
  },

  // --- 4. ESTUDIANTES ---
  {
    id: "usr_estudiante_1",
    email: "estudiante1@udp.test",
    username: "estudiante1",
    name: "Camila Andrea Rojas (Estudiante 3er Año)",
    role: "estudiante",
    isOwner: false,
    description: "Matriculada en Arquitectura de Software. Tutor Mini-Yo activo.",
    coursesSummary: "CIT3000 Arquitectura de Software",
  },
  {
    id: "usr_estudiante_2",
    email: "estudiante2@udp.test",
    username: "estudiante2",
    name: "Nicolás Ignacio Pérez (Estudiante 2do Año)",
    role: "estudiante",
    isOwner: false,
    description: "Matriculado en Programación. Realiza entregas de código.",
    coursesSummary: "CIT1000 Taller de Programación",
  },
  {
    id: "usr_estudiante_3",
    email: "estudiante3@udp.test",
    username: "estudiante3",
    name: "Valentina Paz Castro (Estudiante)",
    role: "estudiante",
    isOwner: false,
    description: "Matriculada en Gestión Organizacional. Proyecto grupal.",
    coursesSummary: "CIT2206 Gestión Organizacional",
  },
];
