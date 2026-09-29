import {
  AttendanceRecord,
  AttendanceValue,
  ClassSession,
  CourseSection,
  StudentAttendanceSummary,
  StudentWorkRecord,
} from "@/types/attendance";
import { isDateUDPHoliday, DIA_SEMANA_NOMBRES } from "./udpCalendarService";

export const INITIAL_SECTIONS: CourseSection[] = [
  {
    id: "sec_1",
    codigo: "CIT3203_CA01",
    cursoNombre: "Proyecto en TICs II",
    nombre: "Sección 1",
    profesor: "Jorge Esteban Cruz León",
    ayudante: "Benjamín Morales Pizarro",
    horarioCatedra: { dias: [3], horaInicio: "14:30", horaFin: "17:30", sala: "SALA X" },
    horarioAyudantia: { dias: [3], horaInicio: "16:00", horaFin: "17:20", sala: "SALA X" },
    pinActivo: "4821",
    requierePin: true,
    requiereGeolocalizacion: true,
    ubicacionNombre: "Facultad de Ingeniería y Ciencias UDP (Av. Ejército Libertador 441)",
    ubicacionLat: -33.4501,
    ubicacionLng: -70.6622,
    radioMetros: 500,
  },
  {
    id: "sec_2",
    codigo: "CIT3203_CA02",
    cursoNombre: "Proyecto en TICs II",
    nombre: "Sección 2",
    profesor: "Claudio Meneses Silva",
    ayudante: "Benjamín Morales Pizarro",
    horarioCatedra: { dias: [3], horaInicio: "10:00", horaFin: "13:00", sala: "SALA X" },
    horarioAyudantia: { dias: [3], horaInicio: "16:00", horaFin: "17:20", sala: "SALA X" },
    pinActivo: "5914",
    requierePin: true,
    requiereGeolocalizacion: true,
    ubicacionNombre: "Facultad de Ingeniería y Ciencias UDP (Av. Ejército Libertador 441)",
    ubicacionLat: -33.4501,
    ubicacionLng: -70.6622,
    radioMetros: 500,
  },
  {
    id: "sec_3",
    codigo: "CIT3203_CA03",
    cursoNombre: "Proyecto en TICs II",
    nombre: "Sección 3",
    profesor: "Jorge Esteban Cruz León",
    ayudante: "Benjamín Morales Pizarro",
    horarioCatedra: { dias: [3], horaInicio: "17:00", horaFin: "20:00", sala: "SALA X" },
    horarioAyudantia: { dias: [3], horaInicio: "16:00", horaFin: "17:20", sala: "SALA X" },
    pinActivo: "7239",
    requierePin: true,
    requiereGeolocalizacion: true,
    ubicacionNombre: "Facultad de Ingeniería y Ciencias UDP (Av. Ejército Libertador 441)",
    ubicacionLat: -33.4501,
    ubicacionLng: -70.6622,
    radioMetros: 500,
  },
  {
    id: "sec_gestion_org",
    codigo: "CIT2206_CA01",
    cursoNombre: "Gestión Organizacional",
    nombre: "Sección 1",
    profesor: "María José Quintana",
    ayudante: "Benjamín Morales Pizarro",
    horarioCatedra: { dias: [3], horaInicio: "08:30", horaFin: "11:30", sala: "SALA X" },
    horarioAyudantia: { dias: [4], horaInicio: "14:30", horaFin: "16:00", sala: "SALA X" },
    pinActivo: "3312",
    requierePin: true,
    requiereGeolocalizacion: true,
    ubicacionNombre: "Facultad de Ingeniería y Ciencias UDP (Av. Ejército Libertador 441)",
    ubicacionLat: -33.4501,
    ubicacionLng: -70.6622,
    radioMetros: 500,
  },
  {
    id: "sec_arq_emergentes",
    codigo: "CIT3100_CA02",
    cursoNombre: "Arquitecturas Emergentes de Software",
    nombre: "Sección 2",
    profesor: "Jorge Esteban Cruz León",
    ayudante: "Benjamín Morales Pizarro",
    horarioCatedra: { dias: [3], horaInicio: "14:30", horaFin: "17:30", sala: "SALA X" },
    horarioAyudantia: { dias: [4], horaInicio: "16:00", horaFin: "17:20", sala: "SALA X" },
    pinActivo: "8891",
    requierePin: true,
    requiereGeolocalizacion: true,
    ubicacionNombre: "Facultad de Ingeniería y Ciencias UDP (Av. Ejército Libertador 441)",
    ubicacionLat: -33.4501,
    ubicacionLng: -70.6622,
    radioMetros: 500,
  },
];

export function getCourseNameByCode(codigo?: string): string {
  if (!codigo) return "Asignatura UDP";
  const upper = codigo.toUpperCase();
  if (upper.includes("CIT3203") || upper.includes("3203")) return "Proyecto en TICs II";
  if (upper.includes("CIT2206") || upper.includes("2206")) return "Gestión Organizacional";
  if (upper.includes("CIT3100") || upper.includes("3100")) return "Arquitecturas Emergentes de Software";
  return "Asignatura UDP";
}

const SECTIONS_STORAGE_KEY = "udp_course_sections_v2026_5secciones_ca03_fixed_v3";

export function getSavedSections(): CourseSection[] {
  if (typeof window === "undefined") return INITIAL_SECTIONS;
  try {
    const raw = localStorage.getItem(SECTIONS_STORAGE_KEY);
    if (!raw) return INITIAL_SECTIONS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_SECTIONS;

    // Garantizar que cualquier sección agregada a INITIAL_SECTIONS (como CIT3203_CA03) siempre esté presente
    const existingCodes = new Set(parsed.map((p: CourseSection) => p.codigo));
    const missing = INITIAL_SECTIONS.filter((init) => !existingCodes.has(init.codigo));
    const allParsed = [...parsed, ...missing];

    return allParsed.map((sec: CourseSection) => {
      const matchInit = INITIAL_SECTIONS.find((init) => init.id === sec.id || init.codigo === sec.codigo);
      const catRaw = (sec.horarioCatedra?.dias || []).filter((d) => d >= 1 && d <= 5);
      const catDias = catRaw.length === 1 ? catRaw : (matchInit?.horarioCatedra?.dias || [3]);

      const ayudRaw = (sec.horarioAyudantia?.dias || []).filter((d) => d >= 1 && d <= 5);
      const ayudDias = ayudRaw.length === 1 ? ayudRaw : (matchInit?.horarioAyudantia?.dias || [3]);

      return {
        ...sec,
        id: sec.id || matchInit?.id || sec.codigo,
        codigo: sec.codigo,
        cursoNombre: sec.cursoNombre || matchInit?.cursoNombre || getCourseNameByCode(sec.codigo),
        nombre: sec.nombre || matchInit?.nombre || "Sección 1",
        profesor: sec.profesor || matchInit?.profesor || "Docente UDP",
        ayudante: sec.ayudante || matchInit?.ayudante || "Benjamín Morales Pizarro",
        pinActivo: sec.pinActivo || matchInit?.pinActivo || "4821",
        requierePin: sec.requierePin !== undefined ? sec.requierePin : true,
        requiereGeolocalizacion: sec.requiereGeolocalizacion !== undefined ? sec.requiereGeolocalizacion : true,
        ubicacionNombre: sec.ubicacionNombre || matchInit?.ubicacionNombre || "Facultad de Ingeniería y Ciencias UDP (Av. Ejército Libertador 441)",
        ubicacionLat: sec.ubicacionLat !== undefined ? sec.ubicacionLat : (matchInit?.ubicacionLat ?? -33.4501),
        ubicacionLng: sec.ubicacionLng !== undefined ? sec.ubicacionLng : (matchInit?.ubicacionLng ?? -70.6622),
        radioMetros: sec.radioMetros !== undefined ? sec.radioMetros : (matchInit?.radioMetros ?? 500),
        horarioCatedra: {
          ...sec.horarioCatedra,
          dias: catDias,
          horaInicio: sec.horarioCatedra?.horaInicio || matchInit?.horarioCatedra.horaInicio || "14:30",
          horaFin: sec.horarioCatedra?.horaFin || matchInit?.horarioCatedra.horaFin || "17:30",
          sala: sec.horarioCatedra?.sala || matchInit?.horarioCatedra.sala || "SALA X",
        },
        horarioAyudantia: {
          ...sec.horarioAyudantia,
          dias: ayudDias,
          horaInicio: sec.horarioAyudantia?.horaInicio || matchInit?.horarioAyudantia?.horaInicio || "16:00",
          horaFin: sec.horarioAyudantia?.horaFin || matchInit?.horarioAyudantia?.horaFin || "17:20",
          sala: sec.horarioAyudantia?.sala || matchInit?.horarioAyudantia?.sala || "SALA X",
        },
      };
    });
  } catch {
    return INITIAL_SECTIONS;
  }
}

export function saveSections(sections: CourseSection[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(sections));
    window.dispatchEvent(new CustomEvent("udp_sections_updated", { detail: sections }));
  } catch (e) {
    console.error("Error saving sections to localStorage", e);
  }
}

/**
 * Regenera y guarda un nuevo PIN aleatorio de 4 dígitos para una sección
 */
export function regenerateSectionPin(sectionIdOrCode: string): string {
  const currentSections = getSavedSections();
  const newPin = Math.floor(1000 + Math.random() * 9000).toString();

  const updated = currentSections.map((sec) => {
    if (sec.id === sectionIdOrCode || sec.codigo === sectionIdOrCode) {
      return { ...sec, pinActivo: newPin };
    }
    return sec;
  });

  saveSections(updated);
  return newPin;
}

export interface StudentRosterItem {
  canvas_id: number;
  rut: string;
  nombres: string;
  apellidos: string;
  email: string;
  seccionId: string;
}

export const INITIAL_STUDENTS_ROSTER: StudentRosterItem[] = [
  // Alumnos Sección 1 - TICs II
  { canvas_id: 29248, rut: "20.481.932-8", nombres: "Benjamín", apellidos: "Morales Pizarro", email: "benjamin.morales3@mail.udp.cl", seccionId: "sec_1" },
  { canvas_id: 31021, rut: "21.109.845-K", nombres: "Víctor Vicente", apellidos: "Barrera Jorquera", email: "victor.barrera@mail.udp.cl", seccionId: "sec_1" },
  { canvas_id: 32415, rut: "20.912.433-4", nombres: "Laura Francisca", apellidos: "Salinas Herrera", email: "laura.salinas1@mail.udp.cl", seccionId: "sec_1" },
  { canvas_id: 33890, rut: "20.765.231-1", nombres: "Francisco", apellidos: "Alvarado Vivanco", email: "francisco.alvarado1@mail.udp.cl", seccionId: "sec_1" },
  { canvas_id: 34112, rut: "21.345.678-9", nombres: "Camila Ignacia", apellidos: "Tapia González", email: "camila.tapia@mail.udp.cl", seccionId: "sec_1" },
  { canvas_id: 35190, rut: "20.887.112-5", nombres: "Matías Ignacio", apellidos: "Fuenzalida Castro", email: "matias.fuenzalida@mail.udp.cl", seccionId: "sec_1" },
  { canvas_id: 36201, rut: "21.002.443-1", nombres: "Valentina Paz", apellidos: "Rojas Vergara", email: "valentina.rojas4@mail.udp.cl", seccionId: "sec_1" },
  { canvas_id: 37402, rut: "20.654.890-3", nombres: "Joaquín Andrés", apellidos: "Navarro Soto", email: "joaquin.navarro@mail.udp.cl", seccionId: "sec_1" },
  // Alumnos Sección 2 - TICs II
  { canvas_id: 38101, rut: "20.991.222-6", nombres: "Diego Esteban", apellidos: "Cáceres Muñoz", email: "diego.caceres@mail.udp.cl", seccionId: "sec_2" },
  { canvas_id: 38102, rut: "21.223.456-7", nombres: "Constanza Belén", apellidos: "Pino Leiva", email: "constanza.pino@mail.udp.cl", seccionId: "sec_2" },
  { canvas_id: 38103, rut: "20.554.881-2", nombres: "Sebastián Ariel", apellidos: "Bravo Orellana", email: "sebastian.bravo@mail.udp.cl", seccionId: "sec_2" },
  // Alumnos Sección 3 - TICs II
  { canvas_id: 39101, rut: "20.123.987-4", nombres: "Martina Andrea", apellidos: "Guzmán Silva", email: "martina.guzman@mail.udp.cl", seccionId: "sec_3" },
  { canvas_id: 39102, rut: "21.432.109-8", nombres: "Felipe Ignacio", apellidos: "Mella Carvajal", email: "felipe.mella@mail.udp.cl", seccionId: "sec_3" },
  // Alumnos Gestión Organizacional
  { canvas_id: 41001, rut: "21.111.222-3", nombres: "Daniela Paz", apellidos: "Valenzuela Castro", email: "daniela.valenzuela@mail.udp.cl", seccionId: "sec_gestion_org" },
  { canvas_id: 41002, rut: "20.888.777-6", nombres: "Tomás Ignacio", apellidos: "Herrera Morales", email: "tomas.herrera@mail.udp.cl", seccionId: "sec_gestion_org" },
  { canvas_id: 41003, rut: "21.333.444-5", nombres: "Javiera Ignacia", apellidos: "Silva Paredes", email: "javiera.silva@mail.udp.cl", seccionId: "sec_gestion_org" },
  // Alumnos Arquitecturas Emergentes
  { canvas_id: 42001, rut: "20.777.666-1", nombres: "Gabriel Alejandro", apellidos: "Reyes Fuentes", email: "gabriel.reyes@mail.udp.cl", seccionId: "sec_arq_emergentes" },
  { canvas_id: 42002, rut: "21.444.555-8", nombres: "Francisca Andrea", apellidos: "Muñoz Vera", email: "francisca.munoz@mail.udp.cl", seccionId: "sec_arq_emergentes" },
  { canvas_id: 42003, rut: "20.999.888-2", nombres: "Álvaro Nicolás", apellidos: "Donoso Soto", email: "alvaro.donoso@mail.udp.cl", seccionId: "sec_arq_emergentes" },
];

/**
 * Obtiene la fecha actual en formato local YYYY-MM-DD
 */
export function getTodayDateStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Generar sesiones semestrales oficiales UDP (Cátedra: 2 días por semana, Ayudantía: 1 día por semana, Lun a Vie)
export function generateSemesterSessions(
  seccion: CourseSection,
  fechaInicio = "2026-08-06",
  fechaFin = "2026-11-27"
): ClassSession[] {
  const sessions: ClassSession[] = [];
  const [sy, sm, sd] = fechaInicio.split("-").map(Number);
  const [ey, em, ed] = fechaFin.split("-").map(Number);

  // Inicializar al mediodía (12:00) para blindar el cálculo contra saltos de horario de verano (DST)
  const current = new Date(sy, sm - 1, sd, 12, 0, 0);
  const end = new Date(ey, em - 1, ed, 12, 0, 0);
  let idCounter = 1;

  while (current <= end) {
    const dayOfWeek = current.getDay(); // 0=Dom, 1=Lun, 2=Mar, 3=Mie, 4=Jue, 5=Vie, 6=Sab
    // EXCLUSIÓN ESTRICTA: Ni sábados ni domingos jamás
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      current.setDate(current.getDate() + 1);
      continue;
    }

    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, "0");
    const d = String(current.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;

    const isCatedra = seccion.horarioCatedra.dias.includes(dayOfWeek);
    const isAyudantia = seccion.horarioAyudantia?.dias?.includes(dayOfWeek);

    if (isCatedra || isAyudantia) {
      const feriado = isDateUDPHoliday(dateStr);

      // Si es feriado o receso institucional, NO se crea sesión (solo clases reales efectivas)
      if (!feriado) {
        if (isCatedra) {
          sessions.push({
            id: `sess_${seccion.id}_cat_${idCounter++}`,
            seccionId: seccion.id,
            fecha: dateStr,
            diaSemana: DIA_SEMANA_NOMBRES[dayOfWeek],
            tipo: "catedra",
            modalidad: "presencial",
            estado: "programada",
            horaInicio: seccion.horarioCatedra.horaInicio,
            horaFin: seccion.horarioCatedra.horaFin,
            sala: seccion.horarioCatedra.sala,
          });
        }

        if (isAyudantia) {
          sessions.push({
            id: `sess_${seccion.id}_ayu_${idCounter++}`,
            seccionId: seccion.id,
            fecha: dateStr,
            diaSemana: DIA_SEMANA_NOMBRES[dayOfWeek],
            tipo: "ayudantia",
            modalidad: "presencial",
            estado: "programada",
            horaInicio: seccion.horarioAyudantia?.horaInicio || "14:30",
            horaFin: seccion.horarioAyudantia?.horaFin || "16:00",
            sala: seccion.horarioAyudantia?.sala || seccion.horarioCatedra.sala,
          });
        }
      }
    }

    current.setDate(current.getDate() + 1);
  }

  // Aplicar sobreescrituras guardadas (ej. sesiones canceladas por el docente/ayudante)
  const overrides = getSavedSessionOverrides();
  return sessions.map((s) => {
    const ov = overrides[s.id];
    if (ov) {
      return {
        ...s,
        estado: ov.estado,
        motivoCancelacion: ov.motivoCancelacion,
      };
    }
    return s;
  });
}

const SESSION_OVERRIDES_KEY = "udp_session_overrides_v1";

export interface SessionOverride {
  estado: "programada" | "realizada" | "cancelada";
  motivoCancelacion?: string;
}

export function getSavedSessionOverrides(): Record<string, SessionOverride> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SESSION_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveSessionOverride(
  sessionId: string,
  estado: "programada" | "realizada" | "cancelada",
  motivoCancelacion?: string
): void {
  if (typeof window === "undefined") return;
  try {
    const current = getSavedSessionOverrides();
    if (estado === "programada" && !motivoCancelacion) {
      delete current[sessionId];
    } else {
      current[sessionId] = { estado, motivoCancelacion };
    }
    localStorage.setItem(SESSION_OVERRIDES_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent("udp_sessions_overrides_updated", { detail: current }));
  } catch (e) {
    console.error("Error saving session override to localStorage", e);
  }
}

const ATTENDANCE_MAP_STORAGE_KEY = "udp_attendance_records_map_v2";

export function getSavedAttendanceMap(): Record<string, AttendanceValue> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ATTENDANCE_MAP_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveAttendanceMap(map: Record<string, AttendanceValue>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ATTENDANCE_MAP_STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent("udp_attendance_updated", { detail: map }));
  } catch (e) {
    console.error("Error saving attendance to localStorage", e);
  }
}

export function clearSavedAttendanceMap(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ATTENDANCE_MAP_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("udp_attendance_updated", { detail: {} }));
  } catch (e) {
    console.error("Error clearing attendance from localStorage", e);
  }
}

const STUDENT_WORK_RECORDS_KEY = "udp_ayudantia_student_work_records_v1";

// Valores por defecto ilustrativos de ayudantía (ej. 8 décimas / 3 trabajos realizados)
export const DEFAULT_STUDENT_WORK_RECORDS: Record<number, StudentWorkRecord> = {
  29248: { decimas: 8, trabajosRealizados: 3 },
  31021: { decimas: 6, trabajosRealizados: 2 },
  32415: { decimas: 9, trabajosRealizados: 3 },
  33890: { decimas: 5, trabajosRealizados: 2 },
  34112: { decimas: 10, trabajosRealizados: 4 },
  35190: { decimas: 4, trabajosRealizados: 1 },
  36201: { decimas: 8, trabajosRealizados: 3 },
  37402: { decimas: 7, trabajosRealizados: 2 },
};

export function getSavedStudentWorkRecords(): Record<number, StudentWorkRecord> {
  if (typeof window === "undefined") return DEFAULT_STUDENT_WORK_RECORDS;
  try {
    const raw = localStorage.getItem(STUDENT_WORK_RECORDS_KEY);
    if (!raw) return DEFAULT_STUDENT_WORK_RECORDS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STUDENT_WORK_RECORDS, ...parsed };
  } catch {
    return DEFAULT_STUDENT_WORK_RECORDS;
  }
}

export function saveStudentWorkRecords(records: Record<number, StudentWorkRecord>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STUDENT_WORK_RECORDS_KEY, JSON.stringify(records));
    window.dispatchEvent(new CustomEvent("udp_student_work_updated", { detail: records }));
  } catch (e) {
    console.error("Error saving student work records to localStorage", e);
  }
}

const TOTAL_TRABAJOS_KEY = "udp_ayudantia_total_trabajos_v1";

/**
 * Obtiene la cantidad global de trabajos realizados a la fecha para la sección (por defecto 3)
 */
export function getSavedTotalTrabajos(sectionId?: string): number {
  if (typeof window === "undefined") return 3;
  try {
    const key = sectionId ? `${TOTAL_TRABAJOS_KEY}_${sectionId}` : TOTAL_TRABAJOS_KEY;
    const raw = localStorage.getItem(key) || localStorage.getItem(TOTAL_TRABAJOS_KEY);
    return raw ? parseInt(raw, 10) : 3;
  } catch {
    return 3;
  }
}

/**
 * Guarda la cantidad global de trabajos realizados a la fecha configurada para todos
 */
export function saveTotalTrabajos(total: number, sectionId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const key = sectionId ? `${TOTAL_TRABAJOS_KEY}_${sectionId}` : TOTAL_TRABAJOS_KEY;
    localStorage.setItem(key, String(total));
    localStorage.setItem(TOTAL_TRABAJOS_KEY, String(total));
    window.dispatchEvent(new CustomEvent("udp_total_trabajos_updated", { detail: total }));
  } catch (e) {
    console.error("Error saving total trabajos to localStorage", e);
  }
}

// Generar registros de asistencia iniciales (todos parten en 0 por defecto)
export function generateInitialRecords(
  sessions: ClassSession[],
  students: StudentRosterItem[]
): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];

  sessions.forEach((sess) => {
    if (sess.estado === "cancelada") return;

    students
      .filter((s) => s.seccionId === sess.seccionId)
      .forEach((student) => {
        records.push({
          sessionId: sess.id,
          estudianteCanvasId: student.canvas_id,
          valor: 0,
          marcadoPor: "profesor",
        });
      });
  });

  return records;
}

export function getSectionByCourseCode(courseCode?: string, customSections?: CourseSection[]): CourseSection {
  const sections = customSections && customSections.length > 0 ? customSections : getSavedSections();
  if (!courseCode || sections.length === 0) return sections[0] || INITIAL_SECTIONS[0];

  const codeUpper = courseCode.toUpperCase();

  // 1. Coincidencia directa por código o ID
  const direct = sections.find((s) => 
    s.codigo.toUpperCase() === codeUpper ||
    codeUpper.includes(s.codigo.toUpperCase()) ||
    s.codigo.toUpperCase().includes(codeUpper) ||
    s.id.toUpperCase() === codeUpper
  );
  if (direct) return direct;

  // 2. Coincidencia por asignatura institucional
  if (codeUpper.includes("CIT2206") || codeUpper.includes("2206") || codeUpper.includes("GESTI")) {
    const sGest = sections.find((s) => s.id === "sec_gestion_org" || s.codigo.includes("CIT2206"));
    if (sGest) return sGest;
  }

  if (codeUpper.includes("CIT3100") || codeUpper.includes("3100") || codeUpper.includes("ARQ")) {
    const sArq = sections.find((s) => s.id === "sec_arq_emergentes" || s.codigo.includes("CIT3100"));
    if (sArq) return sArq;
  }

  if (codeUpper.includes("CA03") || codeUpper.includes("SECCIÓN 3") || codeUpper.includes("SECCION 3") || codeUpper.includes("SEC 3")) {
    const s3 = sections.find((s) => s.id === "sec_3" || s.codigo.includes("CA03"));
    if (s3) return s3;
  }

  if (codeUpper.includes("CA02") || codeUpper.includes("SECCIÓN 2") || codeUpper.includes("SECCION 2") || codeUpper.includes("SEC 2")) {
    const s2 = sections.find((s) => s.id === "sec_2" || s.codigo.includes("CA02"));
    if (s2) return s2;
  }

  if (codeUpper.includes("CA01") || codeUpper.includes("SECCIÓN 1") || codeUpper.includes("SECCION 1") || codeUpper.includes("SEC 1") || codeUpper.includes("CIT3203") || codeUpper.includes("3203")) {
    const s1 = sections.find((s) => s.id === "sec_1" || s.codigo.includes("CA01"));
    if (s1) return s1;
  }

  return sections[0];
}

export function formatSectionSchedule(section: CourseSection) {
  const diasNombres = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const catedraDias = section.horarioCatedra.dias.map((d) => diasNombres[d]).join(" y ");
  const tieneAyudantia = Boolean(section.horarioAyudantia?.dias && section.horarioAyudantia.dias.length > 0);
  const ayudantiaDias = tieneAyudantia ? section.horarioAyudantia.dias.map((d) => diasNombres[d]).join(" y ") : null;

  return {
    claseSemanal: `${catedraDias} ${section.horarioCatedra.horaInicio} - ${section.horarioCatedra.horaFin}`,
    catedra: `${catedraDias} ${section.horarioCatedra.horaInicio} - ${section.horarioCatedra.horaFin}`,
    catedraSala: section.horarioCatedra.sala,
    ayudantia: tieneAyudantia ? `${ayudantiaDias} ${section.horarioAyudantia.horaInicio} - ${section.horarioAyudantia.horaFin}` : "Integrada en bloque semanal",
    ayudantiaSala: tieneAyudantia ? section.horarioAyudantia.sala : section.horarioCatedra.sala,
    profesor: section.profesor,
    ayudante: section.ayudante,
  };
}


