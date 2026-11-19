import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import type { CursoConEvaluaciones, CursoResumen } from "@/types/gestion";
import type { CursoInput, EvaluacionInput } from "@/utils/gestion/esquemasCurso";
import { ErrorGestion, errorDeBase } from "./errores";
import { aCurso, aEvaluacion, ordenarEvaluaciones } from "./mapeos";

/**
 * Acceso a `cursos` y `evaluaciones` (solo servidor; usa la clave service_role).
 * Quien llama ya validó el input con `cursoInputSchema` y el permiso del usuario.
 */

const MSJ_CURSO_DUPLICADO = "Ya tienes un curso con ese código, sección y semestre.";

const db = () => getSupabaseAdmin();

/** Conteo embebido de PostgREST: `evaluaciones(count)` → [{ count: 6 }]. */
const conteo = (v: unknown): number => (Array.isArray(v) && v[0] ? Number(v[0].count) || 0 : 0);

/** Cursos del docente; `ownerUserId = null` lista todos (uso de admin). */
export async function listarCursos(ownerUserId: string | null): Promise<CursoResumen[]> {
  let consulta = db()
    .from("cursos")
    .select("*, evaluaciones(count), alumnos(count)")
    .order("created_at", { ascending: false });
  if (ownerUserId) consulta = consulta.eq("owner_user_id", ownerUserId);
  const { data, error } = await consulta;
  if (error) throw errorDeBase("listarCursos", error);
  return (data ?? []).map((fila) => ({
    ...aCurso(fila),
    total_evaluaciones: conteo(fila.evaluaciones),
    total_alumnos: conteo(fila.alumnos),
  }));
}

export async function obtenerCurso(cursoId: string): Promise<CursoConEvaluaciones | null> {
  const { data, error } = await db().from("cursos").select("*, evaluaciones(*)").eq("id", cursoId).maybeSingle();
  if (error) throw errorDeBase("obtenerCurso", error);
  if (!data) return null;
  const evaluaciones = Array.isArray(data.evaluaciones) ? data.evaluaciones.map(aEvaluacion) : [];
  return { ...aCurso(data), evaluaciones: ordenarEvaluaciones(evaluaciones) };
}

function filaEvaluacion(cursoId: string, e: EvaluacionInput, orden: number) {
  return { curso_id: cursoId, nombre: e.nombre, tipo: e.tipo, ponderacion: e.ponderacion, orden };
}

/** Crea el curso y sus evaluaciones. Si fallan las evaluaciones, borra el curso (sin transacción en supabase-js). */
export async function crearCurso(ownerUserId: string, input: CursoInput): Promise<CursoConEvaluaciones> {
  const { evaluaciones, ...datos } = input;
  const { data, error } = await db()
    .from("cursos")
    .insert({ ...datos, owner_user_id: ownerUserId })
    .select("id")
    .single();
  if (error || !data) throw errorDeBase("crearCurso", error, MSJ_CURSO_DUPLICADO);

  const cursoId = String(data.id);
  const filas = evaluaciones.map((e, i) => filaEvaluacion(cursoId, e, i));
  const { error: errorEval } = await db().from("evaluaciones").insert(filas);
  if (errorEval) {
    await db().from("cursos").delete().eq("id", cursoId);
    throw errorDeBase("crearCurso.evaluaciones", errorEval);
  }
  return requerirCurso(cursoId);
}

/**
 * Actualiza datos, configuración y evaluaciones del curso.
 * Las evaluaciones con `id` conocido se actualizan (conservan sus notas), las nuevas se
 * insertan y las que ya no vienen se eliminan al final (sus notas se borran en cascada).
 */
export async function actualizarCurso(cursoId: string, input: CursoInput): Promise<CursoConEvaluaciones> {
  const { evaluaciones, ...datos } = input;
  const { error } = await db().from("cursos").update(datos).eq("id", cursoId);
  if (error) throw errorDeBase("actualizarCurso", error, MSJ_CURSO_DUPLICADO);

  const actual = await requerirCurso(cursoId);
  const idsExistentes = new Set(actual.evaluaciones.map((e) => e.id));

  const nuevas = [];
  for (const [orden, e] of evaluaciones.entries()) {
    if (e.id && idsExistentes.has(e.id)) {
      const { error: errUpd } = await db()
        .from("evaluaciones")
        .update(filaEvaluacion(cursoId, e, orden))
        .eq("id", e.id)
        .eq("curso_id", cursoId);
      if (errUpd) throw errorDeBase("actualizarCurso.evaluacion", errUpd);
    } else {
      nuevas.push(filaEvaluacion(cursoId, e, orden));
    }
  }
  if (nuevas.length > 0) {
    const { error: errIns } = await db().from("evaluaciones").insert(nuevas);
    if (errIns) throw errorDeBase("actualizarCurso.nuevas", errIns);
  }

  const idsQueQuedan = new Set(evaluaciones.map((e) => e.id).filter(Boolean));
  const eliminar = [...idsExistentes].filter((id) => !idsQueQuedan.has(id));
  if (eliminar.length > 0) {
    const { error: errDel } = await db().from("evaluaciones").delete().eq("curso_id", cursoId).in("id", eliminar);
    if (errDel) throw errorDeBase("actualizarCurso.eliminar", errDel);
  }
  return requerirCurso(cursoId);
}

async function requerirCurso(cursoId: string): Promise<CursoConEvaluaciones> {
  const curso = await obtenerCurso(cursoId);
  if (!curso) throw new ErrorGestion("no_encontrado", "Curso no encontrado.");
  return curso;
}
