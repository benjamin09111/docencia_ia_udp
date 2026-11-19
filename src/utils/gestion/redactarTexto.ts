/**
 * Prepara el texto del programa del curso antes de enviarlo a la IA:
 * tacha datos personales que suelen venir en los programas (correo y teléfono
 * del docente, algún RUT) y limita el largo. Los datos de los alumnos NUNCA
 * pasan por aquí: este flujo solo procesa el PDF del programa.
 */

const PATRONES: Array<{ patron: RegExp; reemplazo: string }> = [
  { patron: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, reemplazo: "[correo]" },
  { patron: /\b\d{1,2}(?:\.\d{3}){2}-?[\dKk]\b|\b\d{7,8}-[\dKk]\b/g, reemplazo: "[rut]" },
  { patron: /(?:\+?56\s?)?(?:9\s?\d{4}\s?\d{4}|2\s?\d{4}\s?\d{4})\b/g, reemplazo: "[teléfono]" },
  { patron: /https?:\/\/\S+/gi, reemplazo: "[enlace]" },
];

export const MAX_CARACTERES_PROGRAMA = 30_000;

export interface TextoPreparado {
  texto: string;
  recortado: boolean;
}

export function redactarDatosPersonales(texto: string): string {
  return PATRONES.reduce((acc, { patron, reemplazo }) => acc.replace(patron, reemplazo), texto);
}

/** Tacha datos personales, normaliza espacios y recorta al máximo permitido. */
export function prepararTextoProgramaParaIa(textoPdf: string, max = MAX_CARACTERES_PROGRAMA): TextoPreparado {
  const limpio = redactarDatosPersonales(textoPdf)
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return limpio.length > max ? { texto: limpio.slice(0, max), recortado: true } : { texto: limpio, recortado: false };
}
