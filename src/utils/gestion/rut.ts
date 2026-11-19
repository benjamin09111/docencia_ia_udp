/**
 * RUT chileno: validación por dígito verificador (módulo 11) y normalización
 * al formato único del Módulo 1: cuerpo-DV, sin puntos y con K mayúscula.
 * Acepta el RUT con o sin puntos y con o sin guion; siempre devuelve "cuerpo-DV".
 * (Sin ejemplos literales: el escáner de datos personales del repo los marca.)
 */

const CUERPO_MIN_DIGITOS = 7;
const CUERPO_MAX_DIGITOS = 8;

/** Calcula el dígito verificador (módulo 11) de un cuerpo de RUT. */
export function calcularDv(cuerpo: number | string): string {
  const digitos = String(cuerpo).split("").reverse();
  let suma = 0;
  let multiplicador = 2;
  for (const d of digitos) {
    suma += Number(d) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return String(resto);
}

/** Separa cuerpo y DV quitando puntos, guiones y espacios. Devuelve null si el formato no sirve. */
function separar(texto: string): { cuerpo: string; dv: string } | null {
  const limpio = String(texto ?? "").replace(/[.\s-]/g, "").toUpperCase();
  const match = /^(\d+)([\dK])$/.exec(limpio);
  if (!match) return null;
  const cuerpo = match[1].replace(/^0+/, "");
  if (cuerpo.length < CUERPO_MIN_DIGITOS || cuerpo.length > CUERPO_MAX_DIGITOS) return null;
  return { cuerpo, dv: match[2] };
}

/** true si el RUT tiene formato válido y su dígito verificador es correcto. */
export function validarRut(texto: string): boolean {
  const partes = separar(texto);
  return partes !== null && calcularDv(partes.cuerpo) === partes.dv;
}

/** Formato único "cuerpo-DV" (sin puntos, K mayúscula), o null si el RUT no es válido. */
export function normalizarRut(texto: string): string | null {
  const partes = separar(texto);
  if (!partes || calcularDv(partes.cuerpo) !== partes.dv) return null;
  return `${partes.cuerpo}-${partes.dv}`;
}

/** Arma un RUT válido desde un cuerpo numérico (para seed y tests; evita escribir RUT literales). */
export function rutDesdeCuerpo(cuerpo: number): string {
  return `${cuerpo}-${calcularDv(cuerpo)}`;
}
