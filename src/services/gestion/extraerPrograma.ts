import { extractText, getDocumentProxy } from "unpdf";
import { ErrorIa, type ClienteIa, type MensajeChat } from "@/lib/server/aiClient";
import { rellenarPrompt } from "@/lib/server/prompts";
import { borradorVacio, type CursoBorrador } from "@/utils/gestion/borradorCurso";
import { borradorDesdeProgramaExtraido, parsearRespuestaIa } from "@/utils/gestion/programaExtraido";
import { ponderacionesSuman100, sumaPonderaciones } from "@/utils/gestion/ponderaciones";
import { prepararTextoProgramaParaIa } from "@/utils/gestion/redactarTexto";

/**
 * Programa del curso (PDF) → borrador del formulario, usando IA.
 * Nunca guarda nada: el docente revisa y confirma en el formulario.
 * Privacidad: solo procesa el texto del programa (con correos, RUT y teléfonos tachados).
 */

export interface PromptsExtraccion {
  sistema: string;
  corregir: string;
}

export type ResultadoExtraccion =
  | { fuente: "ia"; borrador: CursoBorrador; avisos: string[] }
  | { fuente: "vacio"; borrador: CursoBorrador; motivo: string };

export const MAX_INTENTOS_IA = 2; // un intento + un reintento

export async function extraerTextoPdf(bytes: Uint8Array): Promise<string> {
  const pdf = await getDocumentProxy(bytes);
  const { text } = await extractText(pdf, { mergePages: true });
  return Array.isArray(text) ? text.join("\n") : text;
}

/** Formulario vacío con el motivo por el que no se pudo pre-rellenar. */
export function resultadoVacio(motivo: string): ResultadoExtraccion {
  return { fuente: "vacio", borrador: borradorVacio(), motivo };
}

const MOTIVO_ERROR_IA: Record<ErrorIa["motivo"], string> = {
  timeout: "La IA tardó demasiado en responder.",
  http: "El proveedor de IA rechazó la solicitud.",
  respuesta: "La IA devolvió una respuesta vacía.",
  red: "No se pudo conectar con el proveedor de IA.",
};

export async function extraerProgramaConIa(
  textoPdf: string,
  nombreArchivo: string | null,
  cliente: ClienteIa,
  prompts: PromptsExtraccion
): Promise<ResultadoExtraccion> {
  const { texto, recortado } = prepararTextoProgramaParaIa(textoPdf);
  const mensajes: MensajeChat[] = [
    { role: "system", content: prompts.sistema },
    { role: "user", content: `<programa>\n${texto}\n</programa>` },
  ];

  let ultimoError = "";
  for (let intento = 1; intento <= MAX_INTENTOS_IA; intento++) {
    let respuesta: string;
    try {
      respuesta = await cliente(mensajes);
    } catch (err) {
      const motivo = err instanceof ErrorIa ? MOTIVO_ERROR_IA[err.motivo] : "No se pudo consultar la IA.";
      console.error("[gestion] extracción del programa:", err instanceof Error ? err.message : err);
      return resultadoVacio(`${motivo} Completa el formulario a mano.`);
    }

    const parseo = parsearRespuestaIa(respuesta);
    if (parseo.ok) {
      const borrador = borradorDesdeProgramaExtraido(parseo.datos, nombreArchivo);
      return { fuente: "ia", borrador, avisos: avisosDe(borrador, recortado) };
    }
    ultimoError = parseo.error;
    mensajes.push(
      { role: "assistant", content: respuesta.slice(0, 8000) },
      { role: "user", content: rellenarPrompt(prompts.corregir, { errores: parseo.error }) }
    );
  }

  console.error("[gestion] la IA no entregó un JSON válido tras", MAX_INTENTOS_IA, "intentos:", ultimoError);
  return resultadoVacio("La IA no entregó datos válidos del programa. Completa el formulario a mano.");
}

function avisosDe(borrador: CursoBorrador, recortado: boolean): string[] {
  const avisos: string[] = [];
  const evaluaciones = borrador.evaluaciones.filter((e) => e.nombre);
  if (evaluaciones.length === 0) {
    avisos.push("La IA no encontró evaluaciones en el programa: agrégalas a mano.");
  } else if (!ponderacionesSuman100(evaluaciones.map((e) => ({ ponderacion: e.ponderacion ?? 0 })))) {
    const suma = sumaPonderaciones(evaluaciones.map((e) => ({ ponderacion: e.ponderacion ?? 0 })));
    avisos.push(`Las ponderaciones extraídas suman ${suma}%: ajústalas para que sumen 100% antes de guardar.`);
  }
  if (recortado) avisos.push("El programa es muy largo: la IA leyó solo la primera parte. Revisa que no falten evaluaciones.");
  return avisos;
}
