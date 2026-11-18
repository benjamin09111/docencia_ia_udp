import { NextRequest } from "next/server";
import { jsonSinCache, requireDocente, respuestaDeError } from "@/lib/server/gestionAcceso";
import { checkRateLimit } from "@/lib/server/rateLimit";
import { configIaDesdeEntorno, crearClienteIa } from "@/lib/server/aiClient";
import { cargarPrompt } from "@/lib/server/prompts";
import { extraerProgramaConIa, extraerTextoPdf, resultadoVacio } from "@/services/gestion/extraerPrograma";

/**
 * POST multipart (campo "programa" = PDF). Devuelve un BORRADOR del curso para que el
 * docente lo revise; no guarda nada. Si la IA no está disponible o falla dos veces,
 * devuelve el formulario vacío con el motivo.
 *
 * Nota: no se aplica validateAiInput sobre el PDF porque sus patrones de "extracción de
 * código" (exec(, eval(…) dan falsos positivos en programas de cursos de programación. El
 * texto va delimitado como dato en el prompt y la salida se valida con un schema estricto.
 */

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_BYTES = 4 * 1024 * 1024; // bajo el límite de 4.5 MB de las funciones de Vercel
const MIN_CARACTERES = 50;
const EXTRACCIONES_POR_VENTANA = 10;
const VENTANA_MS = 10 * 60 * 1000;

const esPdf = (bytes: Uint8Array) =>
  bytes.length > 4 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46; // "%PDF"

export async function POST(req: NextRequest) {
  const auth = await requireDocente(req);
  if ("response" in auth) return auth.response;

  try {
    // Rechaza envíos demasiado grandes antes de leerlos en memoria (margen para el multipart).
    if (Number(req.headers.get("content-length") || 0) > MAX_BYTES + 64 * 1024) {
      return jsonSinCache({ error: "El PDF debe pesar menos de 4 MB." }, 413);
    }
    const form = await req.formData().catch(() => null);
    const archivo = form?.get("programa");
    if (!(archivo instanceof File)) return jsonSinCache({ error: "Adjunta el PDF del programa del curso." }, 400);
    if (archivo.size === 0 || archivo.size > MAX_BYTES) {
      return jsonSinCache({ error: "El PDF debe pesar menos de 4 MB." }, 400);
    }
    const bytes = new Uint8Array(await archivo.arrayBuffer());
    if (!esPdf(bytes)) return jsonSinCache({ error: "El archivo no es un PDF válido." }, 400);
    const nombreArchivo = archivo.name.split(/[\\/]/).pop()?.slice(0, 255) || null;

    let texto: string;
    try {
      texto = await extraerTextoPdf(bytes);
    } catch (err) {
      console.error("[gestion] no se pudo leer el PDF:", err instanceof Error ? err.message : err);
      return jsonSinCache({ error: "No se pudo leer el PDF. Revisa que no esté dañado ni protegido con clave." }, 400);
    }
    if (texto.replace(/\s/g, "").length < MIN_CARACTERES) {
      return jsonSinCache(
        resultadoVacio("El PDF no tiene texto seleccionable (puede ser un escaneo). Completa el formulario a mano.")
      );
    }

    const config = configIaDesdeEntorno();
    if (!config) {
      return jsonSinCache(
        resultadoVacio("La extracción con IA no está habilitada en este servidor. Completa el formulario a mano.")
      );
    }

    const limite = checkRateLimit(`ai:programa:${auth.session.userId}`, EXTRACCIONES_POR_VENTANA, VENTANA_MS);
    if (!limite.allowed) {
      return jsonSinCache({ error: "Ya leíste varios programas seguidos. Espera unos minutos e inténtalo de nuevo." }, 429);
    }

    const [sistema, corregir] = await Promise.all([
      cargarPrompt("extraer-programa.system.md"),
      cargarPrompt("extraer-programa.corregir.md"),
    ]);
    const resultado = await extraerProgramaConIa(texto, nombreArchivo, crearClienteIa(config), { sistema, corregir });
    return jsonSinCache(resultado);
  } catch (error) {
    return respuestaDeError(error, "POST /api/gestion/programa/extraer");
  }
}
