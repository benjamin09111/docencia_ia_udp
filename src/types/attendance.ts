export interface SectionSchedule {
  dias: number[]; // 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado
  horaInicio: string; // "14:30"
  horaFin: string; // "16:00"
  sala?: string;
}

export interface CourseSection {
  id: string; // "sec_1", "sec_2", "sec_3"
  codigo: string; // "CIT3203_CA01"
  cursoNombre?: string; // "Proyecto en TICs II"
  nombre: string; // "Sección 1"
  profesor: string;
  ayudante: string;
  horarioCatedra: SectionSchedule;
  horarioCatedra2?: SectionSchedule;
  horarioAyudantia: SectionSchedule;
  horarioAyudantia2?: SectionSchedule; // Segundo bloque/horario opcional para la misma sección
  pinActivo?: string; // Ej. "4821"
  requierePin: boolean;
  requiereGeolocalizacion: boolean;
  // Ubicación y GPS del campus UDP
  ubicacionNombre?: string; // Ej: "Facultad de Ingeniería y Ciencias UDP (Av. Ejército Libertador 441)"
  ubicacionLat?: number;    // Ej: -33.4501
  ubicacionLng?: number;    // Ej: -70.6622
  radioMetros?: number;     // Margen de error en metros (ej. 500m cuadrante Toesca - Los Héroes)
}

export type ClassSessionType = "catedra" | "ayudantia";
export type ClassSessionState = "programada" | "realizada" | "cancelada";
export type SessionModality = "presencial" | "online";

export interface ClassSession {
  id: string;
  seccionId: string;
  fecha: string; // "2026-09-30"
  diaSemana: string; // "Miércoles"
  tipo: ClassSessionType;
  modalidad?: SessionModality; // "presencial" | "online"
  estado: ClassSessionState;
  motivoCancelacion?: string;
  tema?: string;
  horaInicio: string;
  horaFin: string;
  sala?: string;
  pin?: string;
}

export type AttendanceValue = 1 | 0; // 1=Presente, 0=Ausente

export interface AttendanceRecord {
  sessionId: string;
  estudianteCanvasId: number;
  valor: AttendanceValue;
  marcadoPor: "profesor" | "alumno_link";
  timestamp?: string;
  deviceFingerprint?: string;
  lat?: number;
  lng?: number;
  distanciaMetros?: number;
}

export interface UDPHoliday {
  id: string;
  fecha: string; // YYYY-MM-DD
  descripcion: string;
  tipo: "feriado_nacional" | "receso_udp" | "suspension_academica";
  afectaClases: boolean;
}

export interface StudentAttendanceSummary {
  canvas_id: number;
  rut: string;
  nombres: string;
  apellidos: string;
  seccionId: string;
  email: string;
  // Métricas Ayudantías
  ayudantiasAsistidas: number;
  ayudantiasValidas: number;
  ayudantiasPct: number;
  // Métricas Cátedras
  catedrasAsistidas: number;
  catedrasValidas: number;
  catedrasPct: number;
  // Métricas Globales
  totalAsistidas: number;
  totalValidas: number;
  totalPct: number;
  enRiesgoRI: boolean;
}

export interface TodaySessionInfo {
  todayDateStr: string;
  diaActualNombre: string;
  isScheduledDay: boolean;
  todaySession: ClassSession | null;
  nextSession: ClassSession | null;
  horarioAyudantia: SectionSchedule;
  diasConfigurados: string;
}

export interface StudentWorkRecord {
  decimas: number; // e.g. 8
  trabajosRealizados: number; // e.g. 3
}

export type AppealStatus = "pendiente" | "resuelta" | "rechazada";
export type AppealMotivo = "asistencia";

export interface AttendanceAppeal {
  id: string;
  sectionId: string;
  sectionCode: string;
  studentCanvasId: number;
  studentName: string;
  studentRut?: string;
  date: string; // "YYYY-MM-DD"
  motivo: AppealMotivo;
  comentario: string;
  status: AppealStatus;
  createdAt: string; // ISO string
  resolvedAt?: string;
  resolvedBy?: string;
}
