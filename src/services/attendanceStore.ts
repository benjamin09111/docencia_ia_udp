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
    profesor: "Leandro Llanza",
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
    profesor: "Cristian Osorio",
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
    profesor: "Jorge Elliott",
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
  if (upper.includes("CIT3000") || upper.includes("3000") || upper.includes("ARQ_SOFT")) return "Arquitectura de Software";
  return "Asignatura UDP";
}

const SECTIONS_STORAGE_KEY = "udp_course_sections_v2026_5secciones_ca01_leandro_llanza_v5";

export function getSavedSections(): CourseSection[] {
  if (typeof window === "undefined") return INITIAL_SECTIONS;
  try {
    const raw = localStorage.getItem(SECTIONS_STORAGE_KEY) || localStorage.getItem("udp_course_sections_v2026_5secciones_ca03_leandro_lanza_v4") || localStorage.getItem("udp_course_sections_v2026_5secciones_ca03_fixed_v3");
    if (!raw) return INITIAL_SECTIONS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_SECTIONS;

    // Garantizar que cualquier sección agregada a INITIAL_SECTIONS (como CIT3203_CA03) siempre esté presente
    const existingCodes = new Set(parsed.map((p: CourseSection) => p.codigo));
    const missing = INITIAL_SECTIONS.filter((init) => !existingCodes.has(init.codigo));
    const allParsed = [...parsed, ...missing];

    // Deduplicar estrictamente por código de sección
    const uniqueMap = new Map<string, CourseSection>();
    allParsed.forEach((sec) => {
      if (sec && sec.codigo && !uniqueMap.has(sec.codigo)) {
        uniqueMap.set(sec.codigo, sec);
      }
    });
    const deduplicated = Array.from(uniqueMap.values());

    return deduplicated.map((sec: CourseSection) => {
      const matchInit = INITIAL_SECTIONS.find((init) => init.id === sec.id || init.codigo === sec.codigo);
      const catRaw = (sec.horarioCatedra?.dias || []).filter((d) => d >= 0 && d <= 6);
      const catDias = catRaw.length > 0 ? catRaw : (matchInit?.horarioCatedra?.dias || [3]);

      const ayudRaw = (sec.horarioAyudantia?.dias || []).filter((d) => d >= 0 && d <= 6);
      // REGLA ESTRICTA INSTITUCIONAL: Las ayudantías tienen obligatoriamente 1 día oficial por semana
      const ayudDias = ayudRaw.length > 0 ? [ayudRaw[0]] : (matchInit?.horarioAyudantia?.dias || [3]);

      let prof = sec.profesor || matchInit?.profesor;
      if (sec.codigo === "CIT3203_CA01") {
        prof = "Leandro Llanza";
      } else if (sec.codigo === "CIT3203_CA03") {
        prof = "Jorge Esteban Cruz León";
      } else if (sec.codigo === "CIT3100_CA02") {
        prof = "Jorge Elliott";
      } else if (!prof || prof === "Docente UDP") {
        prof = "No identificado";
      }

      return {
        ...sec,
        id: sec.id || matchInit?.id || sec.codigo,
        codigo: sec.codigo,
        cursoNombre: sec.cursoNombre || matchInit?.cursoNombre || getCourseNameByCode(sec.codigo),
        nombre: sec.nombre || matchInit?.nombre || "Sección 1",
        profesor: prof,
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
        horarioAyudantia2: sec.horarioAyudantia2 && (sec.horarioAyudantia2.dias?.length ?? 0) > 0 ? {
          ...sec.horarioAyudantia2,
          dias: (sec.horarioAyudantia2.dias || []).filter((d) => d >= 0 && d <= 6),
          horaInicio: sec.horarioAyudantia2.horaInicio || "14:30",
          horaFin: sec.horarioAyudantia2.horaFin || "16:00",
          sala: sec.horarioAyudantia2.sala || "SALA X",
        } : undefined,
        horarioCatedra2: sec.horarioCatedra2 && (sec.horarioCatedra2.dias?.length ?? 0) > 0 ? {
          ...sec.horarioCatedra2,
          dias: (sec.horarioCatedra2.dias || []).filter((d) => d >= 0 && d <= 6),
          horaInicio: sec.horarioCatedra2.horaInicio || "14:30",
          horaFin: sec.horarioCatedra2.horaFin || "16:00",
          sala: sec.horarioCatedra2.sala || "SALA X",
        } : undefined,
      };
    });
  } catch {
    return INITIAL_SECTIONS;
  }
}

export function saveSections(sections: CourseSection[]): void {
  if (typeof window === "undefined") return;
  try {
    const uniqueMap = new Map<string, CourseSection>();
    sections.forEach((sec) => {
      if (sec && sec.codigo && !uniqueMap.has(sec.codigo)) {
        uniqueMap.set(sec.codigo, sec);
      }
    });
    const deduplicated = Array.from(uniqueMap.values());
    localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(deduplicated));
    window.dispatchEvent(new CustomEvent("udp_sections_updated", { detail: deduplicated }));
  } catch (e) {
    console.error("Error saving sections to localStorage", e);
  }
}

/**
 * Genera un PIN único determinístico de 4 dígitos para cada día de clase
 */
export function generateDailyPin(sectionCode: string, dateStr: string): string {
  let hash = 0;
  const combined = `${sectionCode}_${dateStr}_udp_secure_salt_2026`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const abs = Math.abs(hash);
  const pinNum = 1000 + (abs % 9000);
  return String(pinNum);
}

/**
 * Obtiene el PIN permanente semestral único de una sección para desbloquear la planilla pública de alumnos
 */
export function getSectionVisualPin(section: CourseSection): string {
  return section.pinActivo || "4821";
}

/**
 * Obtiene el PIN activo para una sección en una fecha dada (por defecto, hoy).
 * Si el docente regeneró el PIN manualmente para ese día, devuelve la sobreescritura.
 * De lo contrario, calcula el PIN diario automático único para ese día de ayudantía.
 */
export function getSectionDailyPin(section: CourseSection, dateStr?: string): string {
  const targetDate = dateStr || getTodayDateStr();
  if (typeof window !== "undefined") {
    const override =
      localStorage.getItem(`udp_pin_override_${section.id}_${targetDate}`) ||
      localStorage.getItem(`udp_pin_override_${section.codigo}_${targetDate}`);
    if (override) return override;
  }
  return generateDailyPin(section.codigo, targetDate);
}

/**
 * Guarda una regeneración de PIN para una fecha específica
 */
export function setSectionDailyPin(sectionIdOrCode: string, newPin: string, dateStr?: string): void {
  const targetDate = dateStr || getTodayDateStr();
  if (typeof window !== "undefined") {
    localStorage.setItem(`udp_pin_override_${sectionIdOrCode}_${targetDate}`, newPin);
    window.dispatchEvent(
      new CustomEvent("udp_pin_updated", { detail: { sectionIdOrCode, targetDate, newPin } })
    );
  }
}

/**
 * Regenera y guarda un nuevo PIN aleatorio de 4 dígitos para una sección en una fecha específica
 */
export function regenerateSectionPin(sectionIdOrCode: string, dateStr?: string): string {
  const targetDate = dateStr || getTodayDateStr();
  const newPin = Math.floor(1000 + Math.random() * 9000).toString();
  setSectionDailyPin(sectionIdOrCode, newPin, targetDate);

  const currentSections = getSavedSections();
  const updated = currentSections.map((sec) => {
    if (sec.id === sectionIdOrCode || sec.codigo === sectionIdOrCode) {
      return { ...sec, pinActivo: newPin };
    }
    return sec;
  });

  saveSections(updated);
  return newPin;
}

import { INITIAL_STUDENTS_ROSTER, StudentRosterItem } from "@/constants/initialStudentRoster";
export type { StudentRosterItem };
export { INITIAL_STUDENTS_ROSTER };

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

  // Rastreo estricto de semanas calendario para ayudantías (Lunes de cada semana)
  // REGLA INSTITUCIONAL: Las ayudantías tienen obligatoriamente UNA SOLA clase por semana en la planilla
  const seenAyudantiaWeeks = new Set<string>();
  const getWeekKey = (dt: Date) => {
    const monday = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() - ((dt.getDay() + 6) % 7));
    return `${monday.getFullYear()}-${monday.getMonth() + 1}-${monday.getDate()}`;
  };

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

    const isCatedra = seccion.horarioCatedra?.dias?.includes(dayOfWeek);
    const isCatedra2 = seccion.horarioCatedra2?.dias?.includes(dayOfWeek);
    
    // REGLA ESTRICTA: Ayudantías OBLIGATORIAMENTE 1 clase por semana en la planilla oficial.
    // El Bloque 2 (horarioAyudantia2) es secundario/alternativo y NUNCA genera una segunda clase semanal.
    const currentWeekKey = getWeekKey(current);
    const isAyudantia = Boolean(seccion.horarioAyudantia?.dias?.includes(dayOfWeek) && !seenAyudantiaWeeks.has(currentWeekKey));

    if (isCatedra || isCatedra2 || isAyudantia) {
      const feriado = isDateUDPHoliday(dateStr);

      // Si es feriado o receso institucional, NO se crea sesión (solo clases reales efectivas)
      if (!feriado) {
        const secIdentifier = seccion.codigo || seccion.id;
        if (isCatedra) {
          sessions.push({
            id: `sess_${secIdentifier}_cat_${dateStr}`,
            seccionId: seccion.id,
            fecha: dateStr,
            diaSemana: DIA_SEMANA_NOMBRES[dayOfWeek],
            tipo: "catedra",
            modalidad: "presencial",
            estado: "programada",
            horaInicio: seccion.horarioCatedra.horaInicio,
            horaFin: seccion.horarioCatedra.horaFin,
            sala: seccion.horarioCatedra.sala || "No definida",
            pin: getSectionDailyPin(seccion, dateStr),
          });
        }

        if (isCatedra2 && seccion.horarioCatedra2 && !isCatedra) {
          sessions.push({
            id: `sess_${secIdentifier}_cat2_${dateStr}`,
            seccionId: seccion.id,
            fecha: dateStr,
            diaSemana: DIA_SEMANA_NOMBRES[dayOfWeek],
            tipo: "catedra",
            modalidad: "presencial",
            estado: "programada",
            horaInicio: seccion.horarioCatedra2.horaInicio,
            horaFin: seccion.horarioCatedra2.horaFin,
            sala: seccion.horarioCatedra2.sala || "No definida",
            pin: getSectionDailyPin(seccion, dateStr),
          });
        }

        if (isAyudantia) {
          seenAyudantiaWeeks.add(currentWeekKey);
          sessions.push({
            id: `sess_${secIdentifier}_ayu_${dateStr}`,
            seccionId: seccion.id,
            fecha: dateStr,
            diaSemana: DIA_SEMANA_NOMBRES[dayOfWeek],
            tipo: "ayudantia",
            modalidad: "presencial",
            estado: "programada",
            horaInicio: seccion.horarioAyudantia?.horaInicio || "16:00",
            horaFin: seccion.horarioAyudantia?.horaFin || "17:20",
            sala: seccion.horarioAyudantia?.sala || "No definida",
            pin: getSectionDailyPin(seccion, dateStr),
          });
        }
      }
    }

    current.setDate(current.getDate() + 1);
  }

  // Aplicar sobreescrituras guardadas (ej. sesiones canceladas por el docente/ayudante o modalidad P/O)
  const overrides = getSavedSessionOverrides();
  return sessions.map((s) => {
    const ov = overrides[s.id];
    if (ov) {
      return {
        ...s,
        estado: ov.estado || s.estado,
        motivoCancelacion: ov.motivoCancelacion,
        modalidad: ov.modalidad || s.modalidad,
      };
    }
    return s;
  });
}

import {
  DEFAULT_ATTENDANCE_MAP,
  DEFAULT_STUDENT_WORK_RECORDS,
  DEFAULT_SESSION_OVERRIDES,
} from "@/constants/initialAttendanceData";

export { DEFAULT_ATTENDANCE_MAP, DEFAULT_STUDENT_WORK_RECORDS, DEFAULT_SESSION_OVERRIDES };

const SESSION_OVERRIDES_KEY = "udp_session_overrides_v2";

export interface SessionOverride {
  estado: "programada" | "realizada" | "cancelada";
  motivoCancelacion?: string;
  modalidad?: "presencial" | "online";
}

export function getSavedSessionOverrides(): Record<string, SessionOverride> {
  if (typeof window === "undefined") return DEFAULT_SESSION_OVERRIDES;
  try {
    const raw = localStorage.getItem(SESSION_OVERRIDES_KEY) || localStorage.getItem("udp_session_overrides_v1");
    const parsed = raw ? JSON.parse(raw) : {};
    // Garantizar que las fechas 2026-10-07 y 2026-09-23 NUNCA queden arrastradas como canceladas por caché antiguo,
    // y purgar cualquier residuo de ayu2 o sesiones no oficiales de ayudantía del 2026-10-08
    Object.keys(parsed).forEach((k) => {
      if (k.includes("_ayu2_") || (k.includes("ayu") && k.includes("2026-10-08") && !k.includes("CIT2206"))) {
        delete parsed[k];
      }
      if ((k.includes("2026-10-07") || k.includes("2026-09-23")) && parsed[k]?.estado === "cancelada") {
        delete parsed[k];
      }
    });
    return { ...DEFAULT_SESSION_OVERRIDES, ...parsed };
  } catch {
    return DEFAULT_SESSION_OVERRIDES;
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
    const existing = current[sessionId];
    current[sessionId] = { ...existing, estado, motivoCancelacion };
    localStorage.setItem(SESSION_OVERRIDES_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent("udp_sessions_overrides_updated", { detail: current }));
  } catch (e) {
    console.error("Error saving session override to localStorage", e);
  }
}

export function saveSessionModalityOverride(
  sessionId: string,
  modalidad: "presencial" | "online"
): void {
  if (typeof window === "undefined") return;
  try {
    const current = getSavedSessionOverrides();
    const existing = current[sessionId] || { estado: "programada" };
    current[sessionId] = { ...existing, modalidad };
    localStorage.setItem(SESSION_OVERRIDES_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent("udp_sessions_overrides_updated", { detail: current }));
  } catch (e) {
    console.error("Error saving session modality to localStorage", e);
  }
}

/**
 * Obtiene el valor canónico de asistencia (1 o 0) para una sesión y estudiante.
 * Normaliza y busca por clave directa y por variantes semánticas (código vs friendly).
 */
export function getAttendanceValue(
  attendanceMap: Record<string, AttendanceValue>,
  sessionId: string,
  studentId: number
): AttendanceValue {
  const primaryKey = `${sessionId}_${studentId}`;
  if (attendanceMap[primaryKey] !== undefined) {
    return attendanceMap[primaryKey];
  }

  const friendlyMap: Record<string, string> = {
    CIT3203_CA01: "sec_1",
    CIT3203_CA02: "sec_2",
    CIT3203_CA03: "sec_3",
    CIT3100_CA02: "sec_arq_emergentes",
  };
  const reverseMap: Record<string, string> = {
    sec_1: "CIT3203_CA01",
    sec_2: "CIT3203_CA02",
    sec_3: "CIT3203_CA03",
    sec_arq_emergentes: "CIT3100_CA02",
  };

  for (const [code, fr] of Object.entries(friendlyMap)) {
    if (sessionId.includes(code)) {
      const alt = `${sessionId.replace(code, fr)}_${studentId}`;
      if (attendanceMap[alt] !== undefined) return attendanceMap[alt];
    }
  }
  for (const [fr, code] of Object.entries(reverseMap)) {
    if (sessionId.includes(fr)) {
      const alt = `${sessionId.replace(fr, code)}_${studentId}`;
      if (attendanceMap[alt] !== undefined) return attendanceMap[alt];
    }
  }

  return 0;
}

const ATTENDANCE_MAP_STORAGE_KEY = "udp_attendance_records_map_v4";
const FULL_RESET_FLAG_KEY = "udp_attendance_full_reset_asistencias_txt_v4_oct07";

export function getSavedAttendanceMap(): Record<string, AttendanceValue> {
  if (typeof window === "undefined") return DEFAULT_ATTENDANCE_MAP;
  try {
    const alreadyReset = localStorage.getItem(FULL_RESET_FLAG_KEY) === "true";
    if (!alreadyReset) {
      // Limpiar versiones obsoletas y establecer el mapa oficial consolidado con 07/10 en 0
      localStorage.removeItem("udp_attendance_records_map_v2");
      localStorage.removeItem("udp_attendance_records_map_v3");
      localStorage.removeItem("udp_attendance_records_map_v4");
      localStorage.setItem(ATTENDANCE_MAP_STORAGE_KEY, JSON.stringify(DEFAULT_ATTENDANCE_MAP));
      localStorage.setItem(FULL_RESET_FLAG_KEY, "true");
      return DEFAULT_ATTENDANCE_MAP;
    }

    const raw = localStorage.getItem(ATTENDANCE_MAP_STORAGE_KEY);
    if (!raw) return DEFAULT_ATTENDANCE_MAP;
    const parsed = JSON.parse(raw);
    const cleaned: Record<string, AttendanceValue> = {};

    Object.keys(parsed).forEach((k) => {
      // Descartar de raíz sesiones espurias
      if (k.includes("_ayu2_") || (k.includes("2026-10-08") && !k.includes("CIT2206"))) {
        return;
      }
      cleaned[k] = parsed[k];
    });

    return { ...DEFAULT_ATTENDANCE_MAP, ...cleaned };
  } catch {
    return DEFAULT_ATTENDANCE_MAP;
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
 * Obtiene la cantidad global de trabajos realizados a la fecha para la sección (4 para TICs II, 2 para Emergentes)
 */
export function getSavedTotalTrabajos(sectionId?: string): number {
  const isEmergentes = sectionId?.includes("CIT3100") || sectionId?.includes("emergentes");
  const fallback = isEmergentes ? 2 : 4;
  if (typeof window === "undefined") return fallback;
  try {
    const key = sectionId ? `${TOTAL_TRABAJOS_KEY}_${sectionId}` : TOTAL_TRABAJOS_KEY;
    const raw = localStorage.getItem(key);
    return raw ? parseInt(raw, 10) : fallback;
  } catch {
    return fallback;
  }
}

const DECIMAS_POR_TRABAJO_KEY = "udp_ayudantia_decimas_por_trabajo_v1";

/**
 * Obtiene las décimas que se otorgan por cada trabajo extra (por defecto 0.2)
 */
export function getSavedDecimasPorTrabajo(sectionId?: string): number {
  if (typeof window === "undefined") return 0.2;
  try {
    const key = sectionId ? `${DECIMAS_POR_TRABAJO_KEY}_${sectionId}` : DECIMAS_POR_TRABAJO_KEY;
    const raw = localStorage.getItem(key) || localStorage.getItem(DECIMAS_POR_TRABAJO_KEY);
    return raw ? parseFloat(raw) : 0.2;
  } catch {
    return 0.2;
  }
}

/**
 * Guarda las décimas que se otorgan por trabajo para la sección
 */
export function saveDecimasPorTrabajo(val: number, sectionId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const key = sectionId ? `${DECIMAS_POR_TRABAJO_KEY}_${sectionId}` : DECIMAS_POR_TRABAJO_KEY;
    localStorage.setItem(key, String(val));
    localStorage.setItem(DECIMAS_POR_TRABAJO_KEY, String(val));
    window.dispatchEvent(new CustomEvent("udp_decimas_por_trabajo_updated", { detail: val }));
  } catch (e) {
    console.error("Error saving decimas por trabajo to localStorage", e);
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
  const fallbackSec1 = sections.find((s) => s.codigo === "CIT3203_CA01" || s.id === "sec_1") || sections[0] || INITIAL_SECTIONS[0];
  if (!courseCode || sections.length === 0) return fallbackSec1;

  const codeUpper = courseCode.toUpperCase().trim();

  // 1. Coincidencia EXACTA por código oficial o ID interno
  const exact = sections.find(
    (s) => s.codigo.toUpperCase() === codeUpper || s.id.toUpperCase() === codeUpper
  );
  if (exact) return exact;

  // 2. Coincidencia por asignatura específica (sin cruzar códigos de otras materias)
  if (codeUpper.includes("CIT3203") || codeUpper.includes("3203") || codeUpper.includes("TICS")) {
    if (codeUpper.includes("CA03") || codeUpper.includes("_03") || codeUpper.includes("SEC_3") || codeUpper.includes("SECCIÓN 3") || codeUpper.includes("SECCION 3")) {
      return sections.find((s) => s.codigo.includes("CA03") || s.id === "sec_3") || fallbackSec1;
    }
    if (codeUpper.includes("CA02") || codeUpper.includes("_02") || codeUpper.includes("SEC_2") || codeUpper.includes("SECCIÓN 2") || codeUpper.includes("SECCION 2")) {
      return sections.find((s) => s.codigo.includes("CA02") || s.id === "sec_2") || fallbackSec1;
    }
    return fallbackSec1;
  }

  if (codeUpper.includes("CIT2206") || codeUpper.includes("2206") || codeUpper.includes("GESTI")) {
    return sections.find((s) => s.codigo.includes("CIT2206") || s.id === "sec_gestion_org") || fallbackSec1;
  }

  if (codeUpper.includes("CIT3100") || codeUpper.includes("3100") || codeUpper.includes("ARQ")) {
    return sections.find((s) => s.codigo.includes("CIT3100") || s.id === "sec_arq_emergentes") || fallbackSec1;
  }

  if (codeUpper.includes("CIT3000") || codeUpper.includes("3000") || codeUpper.includes("SOFT")) {
    return sections.find((s) => s.codigo.includes("CIT3000") || s.id === "sec_arq_soft") || fallbackSec1;
  }

  // 3. Coincidencia por ID de sección de Proyecto en TICs II por defecto
  if (codeUpper === "SEC_1" || codeUpper === "CA01") {
    return fallbackSec1;
  }
  if (codeUpper === "SEC_2" || codeUpper === "CA02") {
    return sections.find((s) => s.codigo.includes("CA02") || s.id === "sec_2") || fallbackSec1;
  }
  if (codeUpper === "SEC_3" || codeUpper === "CA03") {
    return sections.find((s) => s.codigo.includes("CA03") || s.id === "sec_3") || fallbackSec1;
  }

  return fallbackSec1;
}

export function formatSectionSchedule(section: CourseSection) {
  const diasNombres = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const catedraDias = section.horarioCatedra.dias.map((d) => diasNombres[d]).join(" y ");
  const tieneAyudantia = Boolean(section.horarioAyudantia?.dias && section.horarioAyudantia.dias.length > 0);
  const ayudantiaDias = tieneAyudantia ? section.horarioAyudantia.dias.map((d) => diasNombres[d]).join(" y ") : null;

  const tieneAyudantia2 = Boolean(section.horarioAyudantia2?.dias && section.horarioAyudantia2.dias.length > 0);
  const ayudantiaDias2 = tieneAyudantia2 ? section.horarioAyudantia2!.dias.map((d) => diasNombres[d]).join(" y ") : null;
  const extraAyudantia = tieneAyudantia2 ? ` | Bloque 2: ${ayudantiaDias2} ${section.horarioAyudantia2!.horaInicio} - ${section.horarioAyudantia2!.horaFin}` : "";

  return {
    claseSemanal: `${catedraDias} ${section.horarioCatedra.horaInicio} - ${section.horarioCatedra.horaFin}`,
    catedra: `${catedraDias} ${section.horarioCatedra.horaInicio} - ${section.horarioCatedra.horaFin}`,
    catedraSala: section.horarioCatedra.sala,
    ayudantia: tieneAyudantia ? `${ayudantiaDias} ${section.horarioAyudantia.horaInicio} - ${section.horarioAyudantia.horaFin}${extraAyudantia}` : "Integrada en bloque semanal",
    ayudantiaSala: tieneAyudantia ? section.horarioAyudantia.sala : section.horarioCatedra.sala,
    profesor: section.profesor,
    ayudante: section.ayudante,
  };
}



