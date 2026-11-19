/** Validaciones numéricas puras del Módulo 1 (sin dependencias). */

const EPSILON = 1e-6;

/** true si el número tiene a lo más `decimales` decimales (tolerando errores de coma flotante). */
export function tieneDecimales(valor: number, decimales: number): boolean {
  if (!Number.isFinite(valor)) return false;
  const factor = 10 ** decimales;
  return Math.abs(valor * factor - Math.round(valor * factor)) < EPSILON;
}

/** Nota válida: entre `min` y `max` (por defecto 1.0–7.0) y con un decimal como máximo. */
export function esNotaValida(valor: number, min = 1, max = 7): boolean {
  return Number.isFinite(valor) && valor >= min && valor <= max && tieneDecimales(valor, 1);
}

/**
 * Interpreta lo que el docente escribe en una celda: acepta coma o punto decimal
 * ("5,5" o "5.5"). Devuelve null si la celda queda vacía y NaN si no es un número.
 */
export function leerNotaEscrita(texto: string): number | null {
  const limpio = texto.trim().replace(",", ".");
  if (limpio === "") return null;
  if (!/^\d+(\.\d+)?$/.test(limpio)) return Number.NaN;
  return Number(limpio);
}
