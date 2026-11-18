import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Prompts de IA versionados como archivos en /prompts (fuera del código).
 * next.config.mjs los incluye en el despliegue (outputFileTracingIncludes).
 */

const cache = new Map<string, string>();
const NOMBRE_VALIDO = /^[a-z0-9-]+(\.[a-z0-9-]+)*\.md$/;

export async function cargarPrompt(nombre: string): Promise<string> {
  if (!NOMBRE_VALIDO.test(nombre)) throw new Error(`Nombre de prompt inválido: ${nombre}`);
  const enCache = cache.get(nombre);
  if (enCache) return enCache;
  const contenido = await readFile(path.join(process.cwd(), "prompts", nombre), "utf8");
  // En desarrollo se relee siempre, para poder ajustar el prompt sin reiniciar.
  if (process.env.NODE_ENV === "production") cache.set(nombre, contenido);
  return contenido;
}

/** Reemplaza {{clave}} por su valor. */
export function rellenarPrompt(plantilla: string, valores: Record<string, string>): string {
  return plantilla.replace(/\{\{(\w+)\}\}/g, (_, clave: string) => valores[clave] ?? "");
}
