import { UDP_CAMPUS_LOCATION, calcularDistanciaMetros } from "@/services/udpCalendarService";

/** Reglas de validación del check-in, puras y sin dependencias de base de datos (fáciles de probar). */

export const CHILE_TZ = "America/Santiago";
const WINDOW_MARGIN_MIN = 15; // la ventana abre 15 min antes y cierra 15 min después del horario

export interface ChileNow {
  dateStr: string; // YYYY-MM-DD
  dow: number; // 0=Domingo … 6=Sábado
  minutes: number; // minutos desde medianoche
}

/** Fecha y hora actuales en Chile, sin depender del reloj ni de la zona del dispositivo del alumno. */
export function chileNow(now: Date = new Date()): ChileNow {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: CHILE_TZ,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value])
  );
  const dows: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    dateStr: `${parts.year}-${parts.month}-${parts.day}`,
    dow: dows[parts.weekday as string] ?? 0,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

export interface SectionScheduleRow {
  horario_ayudantia_dias: number[] | null;
  horario_ayudantia_inicio: string | null; // "16:00:00"
  horario_ayudantia_fin: string | null;
  horario_ayudantia2?: {
    dias?: number[];
    horaInicio?: string;
    horaFin?: string;
    sala?: string;
  } | null;
}

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

export interface WindowCheck {
  open: boolean;
  horaInicio?: string;
  horaFin?: string;
  isSecondary?: boolean;
}

/** ¿Está abierta la ventana de marcaje de la ayudantía en este momento (hora de Chile)? */
export function checkWindow(section: SectionScheduleRow, now: ChileNow): WindowCheck {
  const { horario_ayudantia_dias: dias, horario_ayudantia_inicio: ini, horario_ayudantia_fin: fin } = section;
  if (dias && ini && fin) {
    const horaInicio = ini.slice(0, 5);
    const horaFin = fin.slice(0, 5);
    if (dias.includes(now.dow)) {
      const open = now.minutes >= toMinutes(horaInicio) - WINDOW_MARGIN_MIN && now.minutes <= toMinutes(horaFin) + WINDOW_MARGIN_MIN;
      if (open) return { open: true, horaInicio, horaFin, isSecondary: false };
    }
  }

  // Horario secundario opcional: permite marcar la misma ayudantía en un segundo bloque semanal
  const ayu2 = section.horario_ayudantia2;
  if (ayu2?.dias && ayu2?.horaInicio && ayu2?.horaFin) {
    const horaInicio2 = ayu2.horaInicio.slice(0, 5);
    const horaFin2 = ayu2.horaFin.slice(0, 5);
    if (ayu2.dias.includes(now.dow)) {
      const open = now.minutes >= toMinutes(horaInicio2) - WINDOW_MARGIN_MIN && now.minutes <= toMinutes(horaFin2) + WINDOW_MARGIN_MIN;
      if (open) return { open: true, horaInicio: horaInicio2, horaFin: horaFin2, isSecondary: true };
    }
  }

  const fallbackIni = ini?.slice(0, 5);
  const fallbackFin = fin?.slice(0, 5);
  return { open: false, horaInicio: fallbackIni, horaFin: fallbackFin };
}

export interface GeoCheck {
  ok: boolean;
  distancia?: number;
  reason?: "missing" | "invalid" | "out_of_range";
}

/** Verifica que las coordenadas existan, sean válidas y estén dentro del radio del campus. */
export function checkGeo(lat: unknown, lng: unknown): GeoCheck {
  if (lat === undefined || lat === null || lng === undefined || lng === null) return { ok: false, reason: "missing" };
  if (typeof lat !== "number" || typeof lng !== "number" || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { ok: false, reason: "invalid" };
  }
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return { ok: false, reason: "invalid" };
  const distancia = Math.round(calcularDistanciaMetros(lat, lng, UDP_CAMPUS_LOCATION.lat, UDP_CAMPUS_LOCATION.lng));
  return distancia <= UDP_CAMPUS_LOCATION.radioPermitidoMetros
    ? { ok: true, distancia }
    : { ok: false, distancia, reason: "out_of_range" };
}

/** Código de la sesión de ayudantía de una sección en una fecha (mismo formato que el resto de la app). */
export const sessionCodeFor = (sectionCode: string, dateStr: string) => `sess_${sectionCode}_ayu_${dateStr}`;

/**
 * Dada una fecha y día actual, calcula la fecha (YYYY-MM-DD) del día oficial principal de la misma semana (lunes-domingo).
 */
export function canonicalWeeklyDateStr(dateStr: string, currentDow: number, targetDow: number): string {
  if (currentDow === targetDow) return dateStr;
  const [y, m, d] = dateStr.split("-").map(Number);
  const curUtc = Date.UTC(y, m - 1, d);
  const curOffset = currentDow === 0 ? 6 : currentDow - 1;
  const targetOffset = targetDow === 0 ? 6 : targetDow - 1;
  const diffDays = targetOffset - curOffset;
  const targetDate = new Date(curUtc + diffDays * 86_400_000);
  return targetDate.toISOString().slice(0, 10);
}

/**
 * Código de sesión canónico: si el marcaje ocurre durante el horario alternativo/secundario,
 * se vincula a la sesión oficial semanal de la sección para evitar duplicar columnas en la planilla.
 */
export function canonicalSessionCode(
  sectionCode: string,
  section: SectionScheduleRow,
  now: ChileNow,
  isSecondary: boolean
): string {
  if (!isSecondary) {
    return sessionCodeFor(sectionCode, now.dateStr);
  }
  const primaryDow = section.horario_ayudantia_dias?.[0] ?? now.dow;
  const canonicalDate = canonicalWeeklyDateStr(now.dateStr, now.dow, primaryDow);
  return sessionCodeFor(sectionCode, canonicalDate);
}
