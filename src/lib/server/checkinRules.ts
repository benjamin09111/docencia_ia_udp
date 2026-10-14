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
}

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

export interface WindowCheck {
  open: boolean;
  horaInicio?: string;
  horaFin?: string;
}

/** ¿Está abierta la ventana de marcaje de la ayudantía en este momento (hora de Chile)? */
export function checkWindow(section: SectionScheduleRow, now: ChileNow): WindowCheck {
  const { horario_ayudantia_dias: dias, horario_ayudantia_inicio: ini, horario_ayudantia_fin: fin } = section;
  if (!dias || !ini || !fin) return { open: false };
  const horaInicio = ini.slice(0, 5);
  const horaFin = fin.slice(0, 5);
  if (!dias.includes(now.dow)) return { open: false, horaInicio, horaFin };
  const open = now.minutes >= toMinutes(horaInicio) - WINDOW_MARGIN_MIN && now.minutes <= toMinutes(horaFin) + WINDOW_MARGIN_MIN;
  return { open, horaInicio, horaFin };
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
