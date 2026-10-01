import { CourseSection, ClassSessionType } from "@/types/attendance";

export interface UDPRoomScheduleEntry {
  id: string;
  cursoCodigo: string;
  cursoNombre: string;
  seccionCodigo: string;
  seccionNombre: string;
  tipo: ClassSessionType;
  diaSemana: number; // 1=Lun ... 6=Sab
  diaNombre: string;
  horaInicio: string;
  horaFin: string;
  profesor: string;
  ayudante?: string;
  sala: string;
  edificio: string;
  campus: string;
  capacidadSala: number;
  estadoSala: "asignada" | "reprogramada" | "suspendida";
}

// Mock Oficial de la API de Asignación de Salas e Infraestructura UDP
export const UDP_ROOMS_REGISTRY: UDPRoomScheduleEntry[] = [
  // Sección 1
  {
    id: "room_cit3203_s1_cat",
    cursoCodigo: "CIT3203",
    cursoNombre: "PROYECTO EN TICS II",
    seccionCodigo: "CIT3203_CA01",
    seccionNombre: "Sección 1",
    tipo: "catedra",
    diaSemana: 2, // Martes
    diaNombre: "Martes",
    horaInicio: "10:00",
    horaFin: "11:20",
    profesor: "Jorge Esteban Cruz León",
    ayudante: "Benjamín Morales Pizarro",
    sala: "Sala 302",
    edificio: "Edificio B (Aulas)",
    campus: "Campus República - Vergara 432",
    capacidadSala: 45,
    estadoSala: "asignada",
  },
  {
    id: "room_cit3203_s1_cat2",
    cursoCodigo: "CIT3203",
    cursoNombre: "PROYECTO EN TICS II",
    seccionCodigo: "CIT3203_CA01",
    seccionNombre: "Sección 1",
    tipo: "catedra",
    diaSemana: 4, // Jueves
    diaNombre: "Jueves",
    horaInicio: "10:00",
    horaFin: "11:20",
    profesor: "Jorge Esteban Cruz León",
    ayudante: "Benjamín Morales Pizarro",
    sala: "Sala 302",
    edificio: "Edificio B (Aulas)",
    campus: "Campus República - Vergara 432",
    capacidadSala: 45,
    estadoSala: "asignada",
  },
  {
    id: "room_cit3203_s1_ayu",
    cursoCodigo: "CIT3203",
    cursoNombre: "PROYECTO EN TICS II",
    seccionCodigo: "CIT3203_CA01",
    seccionNombre: "Sección 1",
    tipo: "ayudantia",
    diaSemana: 3, // Miércoles
    diaNombre: "Miércoles",
    horaInicio: "14:30",
    horaFin: "16:00",
    profesor: "Jorge Esteban Cruz León",
    ayudante: "Benjamín Morales Pizarro",
    sala: "Laboratorio TIC 2",
    edificio: "Edificio Informática",
    campus: "Campus República - Ejército 441",
    capacidadSala: 35,
    estadoSala: "asignada",
  },
  // Sección 2
  {
    id: "room_cit3203_s2_ayu",
    cursoCodigo: "CIT3203",
    cursoNombre: "PROYECTO EN TICS II",
    seccionCodigo: "CIT3203_CA02",
    seccionNombre: "Sección 2",
    tipo: "ayudantia",
    diaSemana: 5, // Viernes
    diaNombre: "Viernes",
    horaInicio: "10:00",
    horaFin: "11:30",
    profesor: "Claudio Meneses Silva",
    ayudante: "Benjamín Morales Pizarro",
    sala: "Laboratorio de Redes",
    edificio: "Edificio Informática",
    campus: "Campus República - Ejército 441",
    capacidadSala: 30,
    estadoSala: "asignada",
  },
  // Sección 3
  {
    id: "room_cit3203_s3_ayu",
    cursoCodigo: "CIT3203",
    cursoNombre: "PROYECTO EN TICS II",
    seccionCodigo: "CIT3203_CA03",
    seccionNombre: "Sección 3",
    tipo: "ayudantia",
    diaSemana: 3, // Miércoles
    diaNombre: "Miércoles",
    horaInicio: "16:00",
    horaFin: "17:20",
    profesor: "Leandro Lanza",
    ayudante: "Benjamín Morales Pizarro",
    sala: "Laboratorio TIC 2",
    edificio: "Edificio Informática",
    campus: "Campus República - Ejército 441",
    capacidadSala: 30,
    estadoSala: "asignada",
  },
];

export interface SessionActiveStatus {
  isActive: boolean;
  tipo?: ClassSessionType;
  horaInicio?: string;
  horaFin?: string;
  sala?: string;
  edificio?: string;
  motivo?: string;
  proximaSesion?: {
    diaNombre: string;
    tipo: ClassSessionType;
    horaInicio: string;
    horaFin: string;
    sala: string;
  };
}

export function checkCurrentSessionActive(
  section: CourseSection,
  forceDemoActive = false
): SessionActiveStatus {
  const now = new Date();
  const currentDay = now.getDay(); // 0=Dom ... 6=Sab
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const toMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  // Si se fuerza modo demo para pruebas
  if (forceDemoActive) {
    return {
      isActive: true,
      tipo: "ayudantia",
      horaInicio: section.horarioAyudantia.horaInicio,
      horaFin: section.horarioAyudantia.horaFin,
      sala: section.horarioAyudantia.sala || "Laboratorio TIC 2",
      edificio: "Edificio Informática UDP (Ejército 441)",
    };
  }

  // 1. Revisar si coincide con horario de Ayudantía (abre 15 min antes y cierra 15 min después)
  if (section.horarioAyudantia.dias.includes(currentDay)) {
    const start = toMinutes(section.horarioAyudantia.horaInicio) - 15;
    const end = toMinutes(section.horarioAyudantia.horaFin) + 15;
    if (currentMinutes >= start && currentMinutes <= end) {
      return {
        isActive: true,
        tipo: "ayudantia",
        horaInicio: section.horarioAyudantia.horaInicio,
        horaFin: section.horarioAyudantia.horaFin,
        sala: section.horarioAyudantia.sala || "Laboratorio TIC 2",
        edificio: "Edificio Informática UDP",
      };
    }
  }

  // 2. Revisar si coincide con horario de Cátedra
  if (section.horarioCatedra.dias.includes(currentDay)) {
    const start = toMinutes(section.horarioCatedra.horaInicio) - 15;
    const end = toMinutes(section.horarioCatedra.horaFin) + 15;
    if (currentMinutes >= start && currentMinutes <= end) {
      return {
        isActive: true,
        tipo: "catedra",
        horaInicio: section.horarioCatedra.horaInicio,
        horaFin: section.horarioCatedra.horaFin,
        sala: section.horarioCatedra.sala || "Sala 302",
        edificio: "Edificio B (Aulas)",
      };
    }
  }

  // Si no está activa en este minuto, calcular datos precisos de la próxima sesión según la sección
  const diasNombres = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const ayudDiaNum = section.horarioAyudantia.dias[0] ?? 3;
  const diaNombre = diasNombres[ayudDiaNum] || "Miércoles";

  return {
    isActive: false,
    proximaSesion: {
      diaNombre,
      tipo: "ayudantia",
      horaInicio: section.horarioAyudantia.horaInicio || "16:00",
      horaFin: section.horarioAyudantia.horaFin || "17:20",
      sala: section.horarioAyudantia.sala ? `${section.horarioAyudantia.sala} (${section.ubicacionNombre || "Ejército 441"})` : `Laboratorio TIC (${section.ubicacionNombre || "Ejército 441"})`,
    },
  };
}
