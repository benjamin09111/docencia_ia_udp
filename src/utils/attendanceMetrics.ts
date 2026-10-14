/** Umbral oficial de asistencia mínima (%). Bajo este valor el alumno queda en riesgo (RI). */
export const ATTENDANCE_RISK_THRESHOLD = 75;

export interface MetricSession {
  id: string;
  estado: string;
  fecha: string;
  esOpcional?: boolean;
}

export interface AttendanceStats {
  /** Clases a las que asistió (obligatorias + opcionales). */
  asistidas: number;
  /** Clases obligatorias válidas (base del porcentaje). Las opcionales NO suman aquí. */
  validas: number;
  /** Cuántas de las asistidas fueron opcionales (bonificación). */
  opcionalesAsistidas: number;
  /** Porcentaje 0–100 (con tope de 100). Sin clases obligatorias válidas → 100. */
  pct: number;
}

/**
 * Fuente única del cálculo de asistencia (SSOT).
 * - Las clases canceladas y las futuras no cuentan.
 * - Clase opcional: si el alumno asistió SUMA al numerador; si faltó NO resta (no entra al denominador).
 * - El porcentaje se topa en 100%.
 */
export function computeAttendanceStats(
  sessions: MetricSession[],
  hasAttended: (sessionId: string) => boolean,
  todayStr?: string
): AttendanceStats {
  let asistidas = 0;
  let validas = 0;
  let opcionalesAsistidas = 0;

  for (const s of sessions) {
    if (s.estado === "cancelada") continue;
    if (todayStr && s.fecha > todayStr) continue;

    const attended = hasAttended(s.id);
    if (s.esOpcional) {
      if (attended) {
        asistidas++;
        opcionalesAsistidas++;
      }
      continue;
    }
    validas++;
    if (attended) asistidas++;
  }

  const pct = validas > 0 ? Math.min(100, Math.round((asistidas / validas) * 100)) : 100;
  return { asistidas, validas, opcionalesAsistidas, pct };
}

/** En riesgo solo si ya hubo clases obligatorias y el porcentaje queda bajo el umbral. */
export function isAttendanceAtRisk(stats: Pick<AttendanceStats, "validas" | "pct">): boolean {
  return stats.validas > 0 && stats.pct < ATTENDANCE_RISK_THRESHOLD;
}
