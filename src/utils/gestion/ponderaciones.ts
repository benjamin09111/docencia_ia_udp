/**
 * Ponderaciones del curso. Se suman en centésimas enteras (25.5% → 2550) para
 * evitar errores de coma flotante (ej. 33.33 + 33.33 + 33.34).
 */

const CIEN_POR_CIENTO = 100 * 100;

export function aCentesimas(porcentaje: number): number {
  return Math.round(porcentaje * 100);
}

/** Suma exacta de ponderaciones, en %, con hasta 2 decimales. */
export function sumaPonderaciones(evaluaciones: ReadonlyArray<{ ponderacion: number }>): number {
  const total = evaluaciones.reduce((acc, e) => acc + aCentesimas(e.ponderacion), 0);
  return total / 100;
}

export function ponderacionesSuman100(evaluaciones: ReadonlyArray<{ ponderacion: number }>): boolean {
  return evaluaciones.reduce((acc, e) => acc + aCentesimas(e.ponderacion), 0) === CIEN_POR_CIENTO;
}

/**
 * Reparte un porcentaje entre `cantidad` evaluaciones iguales con 2 decimales,
 * dejando el resto en las primeras para que la suma sea exacta.
 * Ej. repartirPonderacion(100, 3) → [33.34, 33.33, 33.33].
 */
export function repartirPonderacion(total: number, cantidad: number): number[] {
  if (!Number.isInteger(cantidad) || cantidad <= 0) return [];
  const totalCentesimas = aCentesimas(total);
  const base = Math.floor(totalCentesimas / cantidad);
  const resto = totalCentesimas - base * cantidad;
  return Array.from({ length: cantidad }, (_, i) => (base + (i < resto ? 1 : 0)) / 100);
}
