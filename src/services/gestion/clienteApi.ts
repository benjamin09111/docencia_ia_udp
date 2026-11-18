import type { CursoConEvaluaciones, CursoResumen } from "@/types/gestion";
import type { CursoInput } from "@/utils/gestion/esquemasCurso";
import type { CursoBorrador } from "@/utils/gestion/borradorCurso";

/**
 * Cliente del NAVEGADOR para /api/gestion (Módulo 1).
 * No importa nada del servidor: solo hace fetch y traduce errores a mensajes legibles.
 */

export class ErrorApi extends Error {
  constructor(
    mensaje: string,
    public readonly status: number,
    public readonly campos: Record<string, string> = {}
  ) {
    super(mensaje);
    this.name = "ErrorApi";
  }
}

const MENSAJE_RED = "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.";

export async function pedirJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    const esFormulario = init.body instanceof FormData;
    res = await fetch(url, {
      ...init,
      headers: esFormulario ? init.headers : { "Content-Type": "application/json", ...init.headers },
      cache: "no-store",
    });
  } catch {
    throw new ErrorApi(MENSAJE_RED, 0);
  }
  const cuerpo = await res.json().catch(() => ({}));
  if (!res.ok) {
    const mensaje = typeof cuerpo?.error === "string" ? cuerpo.error : "No se pudo completar la acción.";
    throw new ErrorApi(mensaje, res.status, cuerpo?.campos ?? {});
  }
  return cuerpo as T;
}

export function mensajeDeError(error: unknown): string {
  return error instanceof Error ? error.message : "No se pudo completar la acción.";
}

export async function listarCursosApi(): Promise<CursoResumen[]> {
  return (await pedirJson<{ cursos: CursoResumen[] }>("/api/gestion/cursos")).cursos;
}

export interface CursoDetalle {
  curso: CursoConEvaluaciones;
  notas_por_evaluacion: Record<string, number>;
}

export async function obtenerCursoApi(cursoId: string): Promise<CursoDetalle> {
  return pedirJson<CursoDetalle>(`/api/gestion/cursos/${encodeURIComponent(cursoId)}`);
}

export async function crearCursoApi(input: CursoInput): Promise<CursoConEvaluaciones> {
  const r = await pedirJson<{ curso: CursoConEvaluaciones }>("/api/gestion/cursos", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return r.curso;
}

export type ResultadoExtraccionApi =
  | { fuente: "ia"; borrador: CursoBorrador; avisos: string[] }
  | { fuente: "vacio"; borrador: CursoBorrador; motivo: string };

/** Sube el PDF del programa y recibe un borrador para revisar (no guarda nada). */
export async function extraerProgramaApi(archivo: File): Promise<ResultadoExtraccionApi> {
  const datos = new FormData();
  datos.append("programa", archivo);
  return pedirJson<ResultadoExtraccionApi>("/api/gestion/programa/extraer", { method: "POST", body: datos });
}

export async function actualizarCursoApi(cursoId: string, input: CursoInput): Promise<CursoConEvaluaciones> {
  const r = await pedirJson<{ curso: CursoConEvaluaciones }>(`/api/gestion/cursos/${encodeURIComponent(cursoId)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return r.curso;
}
