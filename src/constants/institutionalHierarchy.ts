export interface InstitutionalFaculty {
  id: string;
  nombre: string;
  sigla: string;
  campus: string;
  carrerasCount: number;
  cursosActivos: number;
  agentesActivos: number;
  estado: "activo" | "proximamente";
  descripcion: string;
}

export interface InstitutionalCareer {
  id: string;
  facultadId: string;
  nombre: string;
  codigo: string;
  grado: string;
  semestres: number;
  cursosActivos: number;
  seccionesActivas: number;
  agentesActivos: number;
  estado: "activo" | "proximamente";
  director: string;
}

export const INSTITUTIONAL_FACULTIES: InstitutionalFaculty[] = [
  {
    id: "fac_ingenieria",
    nombre: "Facultad de Ingeniería y Ciencias",
    sigla: "FIC",
    campus: "Campus Santiago Centro (Av. Ejército 441)",
    carrerasCount: 1,
    cursosActivos: 5,
    agentesActivos: 8,
    estado: "activo",
    descripcion: "Facultad pionera en la adopción del ecosistema de Agentes de Inteligencia Artificial para docencia, SpeedGrader y rúbricas automatizadas.",
  },
  {
    id: "fac_comunicacion",
    nombre: "Facultad de Comunicación y Letras",
    sigla: "FCL",
    campus: "Campus Santiago Centro (Vergara 240)",
    carrerasCount: 0,
    cursosActivos: 0,
    agentesActivos: 0,
    estado: "proximamente",
    descripcion: "Fase 2 de expansión institucional para cursos de redacción y análisis de medios con IA.",
  },
  {
    id: "fac_derecho",
    nombre: "Facultad de Derecho",
    sigla: "FD",
    campus: "Campus Santiago Centro (República 105)",
    carrerasCount: 0,
    cursosActivos: 0,
    agentesActivos: 0,
    estado: "proximamente",
    descripcion: "Fase 3 de incorporación para argumentación jurídica y simulación de juicios.",
  },
];

export const INSTITUTIONAL_CAREERS: InstitutionalCareer[] = [
  {
    id: "car_citi",
    facultadId: "fac_ingenieria",
    nombre: "Ingeniería Civil en Informática y Telecomunicaciones",
    codigo: "CIT",
    grado: "Licenciatura en Ciencias de la Ingeniería",
    semestres: 10,
    cursosActivos: 5,
    seccionesActivas: 28,
    agentesActivos: 8,
    estado: "activo",
    director: "Escuela de Informática y Telecomunicaciones UDP",
  },
  {
    id: "car_industrial",
    facultadId: "fac_ingenieria",
    nombre: "Ingeniería Civil Industrial",
    codigo: "CII",
    grado: "Licenciatura en Ciencias de la Ingeniería",
    semestres: 10,
    cursosActivos: 0,
    seccionesActivas: 0,
    agentesActivos: 0,
    estado: "proximamente",
    director: "Escuela de Industria UDP",
  },
  {
    id: "car_obras",
    facultadId: "fac_ingenieria",
    nombre: "Ingeniería Civil en Obras Civiles",
    codigo: "COC",
    grado: "Licenciatura en Ciencias de la Ingeniería",
    semestres: 10,
    cursosActivos: 0,
    seccionesActivas: 0,
    agentesActivos: 0,
    estado: "proximamente",
    director: "Escuela de Obras Civiles UDP",
  },
];
