export interface GradeScaleConfig {
  puntoBase: number;       // default 1.0 (Punto Base obligatorio UDP)
  notaMaxima: number;      // default 7.0
  notaAprobacion: number;  // default 4.0
  exigenciaPct: number;    // default 60 (60% de exigencia estándar)
}

export const DEFAULT_GRADE_SCALE_CONFIG: GradeScaleConfig = {
  puntoBase: 1.0,
  notaMaxima: 7.0,
  notaAprobacion: 4.0,
  exigenciaPct: 60,
};

/**
 * Calcula la nota final con punto base y exigencia oficial chilena / UDP
 * @param score Puntaje obtenido por el estudiante
 * @param maxScore Puntaje máximo total de la evaluación
 * @param config Configuración de escala (Punto base 1.0, Exigencia 60%, Aprobación 4.0, Max 7.0)
 */
export function calculateGradeFromScore(
  score: number,
  maxScore: number,
  config: GradeScaleConfig = DEFAULT_GRADE_SCALE_CONFIG
): number {
  if (maxScore <= 0) return config.puntoBase;
  const clampedScore = Math.max(0, Math.min(score, maxScore));
  const corte = maxScore * (config.exigenciaPct / 100);

  let grade = config.puntoBase;
  if (corte <= 0) {
    grade = config.notaMaxima;
  } else if (clampedScore <= corte) {
    // Tramo inferior: Desde punto base hasta nota de aprobación
    grade = config.puntoBase + ((config.notaAprobacion - config.puntoBase) * clampedScore) / corte;
  } else {
    // Tramo superior: Desde nota de aprobación hasta nota máxima
    grade =
      config.notaAprobacion +
      ((config.notaMaxima - config.notaAprobacion) * (clampedScore - corte)) /
        (maxScore - corte);
  }

  // Redondear a 1 decimal
  return Math.round(grade * 10) / 10;
}
