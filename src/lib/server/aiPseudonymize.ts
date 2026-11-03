/**
 * Seudonimización ligera de nombres propios antes de enviar texto a LLM.
 * No sustituye el gate checkAiPrivacy (RUT/email/etc.); es una capa adicional.
 *
 * Convención: "Estudiante A", "Estudiante B", … estable dentro del mismo texto.
 */

const TITLE_CASE_NAME = /\b([A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,}){1,3})\b/g;

/** Palabras que parecen Title Case pero no son nombres de persona. */
const NON_NAME_PHRASES = new Set(
  [
    "Clean Architecture",
    "Software Architecture",
    "Recovery Time",
    "Recovery Point",
    "Server Side",
    "Open Router",
    "Human Loop",
    "Universidad Diego",
    "Diego Portales",
    "Escuela Informática",
    "Proyecto Tics",
  ].map((s) => s.toLowerCase())
);

export function pseudonymizePersonNames(text: string): {
  text: string;
  aliasCount: number;
  aliases: Record<string, string>;
} {
  const aliases: Record<string, string> = {};
  let aliasCount = 0;

  const replaced = text.replace(TITLE_CASE_NAME, (match) => {
    if (NON_NAME_PHRASES.has(match.toLowerCase())) return match;
    // Evitar frases técnicas cortas tipo "Trade Offs" con 2 tokens muy genéricos
    const parts = match.split(/\s+/);
    if (parts.every((p) => p.length <= 3)) return match;

    const key = match.toLowerCase();
    if (!aliases[key]) {
      aliasCount += 1;
      aliases[key] = `Estudiante ${String.fromCharCode(64 + Math.min(aliasCount, 26))}`;
    }
    return aliases[key];
  });

  return { text: replaced, aliasCount, aliases };
}
