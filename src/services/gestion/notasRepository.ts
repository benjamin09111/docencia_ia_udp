import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import type { CambioDecimas, CambioNota, Evaluacion, Nota, OrigenNota } from "@/types/gestion";
import { esNotaValida, tieneDecimales } from "@/utils/gestion/validacionNota";
import { ErrorGestion, errorDeBase } from "./errores";
import { aEvaluacion, aNota, ordenarEvaluaciones } from "./mapeos";

/**
 * Notas y décimas (solo servidor). Es la PUERTA DE ENTRADA del Módulo 2:
 * ver docs/modulo-1-contrato-datos.md. Revalida todo aunque el llamador ya lo haya hecho.
 */

const db = () => getSupabaseAdmin();

export interface OpcionesGuardado {
  /** 'manual' (tabla de notas), 'importacion' o 'actividad' (Módulo 2). */
  origen?: OrigenNota;
  /** Id de la actividad o entrega que generó la nota (Módulo 2). */
  referencia_externa?: string | null;
  /** userId de quien guarda, para auditoría simple. */
  updated_by?: string | null;
}

export async function listarEvaluaciones(cursoId: string): Promise<Evaluacion[]> {
  const { data, error } = await db().from("evaluaciones").select("*").eq("curso_id", cursoId);
  if (error) throw errorDeBase("listarEvaluaciones", error);
  return ordenarEvaluaciones((data ?? []).map(aEvaluacion));
}

/** Todas las notas del curso (las celdas vacías no vienen). */
export async function listarNotas(cursoId: string): Promise<Nota[]> {
  const evaluaciones = await listarEvaluaciones(cursoId);
  if (evaluaciones.length === 0) return [];
  const { data, error } = await db()
    .from("notas")
    .select("*")
    .in("evaluacion_id", evaluaciones.map((e) => e.id));
  if (error) throw errorDeBase("listarNotas", error);
  return (data ?? []).map(aNota);
}

/** Cantidad de notas por evaluación (para advertir antes de borrar una evaluación). */
export async function contarNotasPorEvaluacion(evaluacionIds: string[]): Promise<Record<string, number>> {
  const conteo: Record<string, number> = {};
  if (evaluacionIds.length === 0) return conteo;
  const { data, error } = await db().from("notas").select("evaluacion_id").in("evaluacion_id", evaluacionIds);
  if (error) throw errorDeBase("contarNotasPorEvaluacion", error);
  for (const fila of data ?? []) {
    const id = String(fila.evaluacion_id);
    conteo[id] = (conteo[id] ?? 0) + 1;
  }
  return conteo;
}

/** Verifica que todas las evaluaciones y alumnos pertenezcan al curso. */
async function verificarPertenencia(cursoId: string, evaluacionIds: string[], alumnoIds: string[]) {
  const evalDelCurso = new Set((await listarEvaluaciones(cursoId)).map((e) => e.id));
  const unicos = [...new Set(alumnoIds)];
  const { data, error } = unicos.length
    ? await db().from("alumnos").select("id").eq("curso_id", cursoId).in("id", unicos)
    : { data: [], error: null };
  if (error) throw errorDeBase("verificarPertenencia", error);
  const alumnosDelCurso = new Set((data ?? []).map((a) => String(a.id)));
  if (evaluacionIds.some((id) => !evalDelCurso.has(id)) || unicos.some((id) => !alumnosDelCurso.has(id))) {
    throw new ErrorGestion("invalido", "Hay notas que no pertenecen a este curso.");
  }
}

/**
 * Guarda (crea o reemplaza) notas del curso. `valor: null` borra la nota.
 * Nunca guarda la nota final: esa siempre se calcula.
 */
export async function guardarNotas(cursoId: string, cambios: CambioNota[], opciones: OpcionesGuardado = {}) {
  if (cambios.length === 0) return;
  if (cambios.some((c) => c.valor !== null && !esNotaValida(c.valor))) {
    throw new ErrorGestion("invalido", "La nota debe estar entre 1.0 y 7.0, con un decimal.");
  }
  await verificarPertenencia(
    cursoId,
    cambios.map((c) => c.evaluacion_id),
    cambios.map((c) => c.alumno_id)
  );

  const aGuardar = cambios
    .filter((c) => c.valor !== null)
    .map((c) => ({
      evaluacion_id: c.evaluacion_id,
      alumno_id: c.alumno_id,
      valor: c.valor,
      origen: opciones.origen ?? "manual",
      referencia_externa: opciones.referencia_externa ?? null,
      updated_by: opciones.updated_by ?? null,
    }));
  if (aGuardar.length > 0) {
    const { error } = await db().from("notas").upsert(aGuardar, { onConflict: "evaluacion_id,alumno_id" });
    if (error) throw errorDeBase("guardarNotas", error);
  }

  for (const c of cambios.filter((x) => x.valor === null)) {
    const { error } = await db()
      .from("notas")
      .delete()
      .eq("evaluacion_id", c.evaluacion_id)
      .eq("alumno_id", c.alumno_id);
    if (error) throw errorDeBase("guardarNotas.borrar", error);
  }
}

/** Fija las décimas ganadas por cada alumno (en puntos de nota: 0.3 = 3 décimas). */
export async function guardarDecimas(cursoId: string, cambios: CambioDecimas[]) {
  if (cambios.some((c) => !(c.decimas >= 0) || !tieneDecimales(c.decimas, 1))) {
    throw new ErrorGestion("invalido", "Las décimas deben ser un número positivo con un decimal.");
  }
  for (const c of cambios) {
    const { data, error } = await db()
      .from("alumnos")
      .update({ decimas: c.decimas })
      .eq("id", c.alumno_id)
      .eq("curso_id", cursoId)
      .select("id");
    if (error) throw errorDeBase("guardarDecimas", error);
    if (!data || data.length === 0) throw new ErrorGestion("invalido", "Hay décimas que no pertenecen a este curso.");
  }
}
