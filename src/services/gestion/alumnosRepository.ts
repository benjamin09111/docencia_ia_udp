import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import type { Alumno, AlumnoNuevo } from "@/types/gestion";
import { ErrorGestion, errorDeBase } from "./errores";
import { aAlumno } from "./mapeos";

/**
 * Acceso a `alumnos` (solo servidor). Toda operación filtra por `curso_id`, así un
 * alumno de otro curso nunca se lee ni se modifica por error.
 * Quien llama ya normalizó y validó RUT y correo.
 */

const MSJ_ALUMNO_DUPLICADO = "Ya existe un alumno con ese RUT o correo en el curso.";

const db = () => getSupabaseAdmin();

export async function listarAlumnos(cursoId: string): Promise<Alumno[]> {
  const { data, error } = await db()
    .from("alumnos")
    .select("*")
    .eq("curso_id", cursoId)
    .order("apellidos", { ascending: true })
    .order("nombres", { ascending: true });
  if (error) throw errorDeBase("listarAlumnos", error);
  return (data ?? []).map(aAlumno);
}

/** Inserta varios alumnos de una vez (carga desde Excel o alta manual). */
export async function insertarAlumnos(cursoId: string, alumnos: AlumnoNuevo[]): Promise<Alumno[]> {
  if (alumnos.length === 0) return [];
  const filas = alumnos.map((a) => ({ ...a, curso_id: cursoId }));
  const { data, error } = await db().from("alumnos").insert(filas).select("*");
  if (error) throw errorDeBase("insertarAlumnos", error, MSJ_ALUMNO_DUPLICADO);
  return (data ?? []).map(aAlumno);
}

export async function actualizarAlumno(cursoId: string, alumnoId: string, datos: AlumnoNuevo): Promise<Alumno> {
  const { data, error } = await db()
    .from("alumnos")
    .update(datos)
    .eq("id", alumnoId)
    .eq("curso_id", cursoId)
    .select("*")
    .maybeSingle();
  if (error) throw errorDeBase("actualizarAlumno", error, MSJ_ALUMNO_DUPLICADO);
  if (!data) throw new ErrorGestion("no_encontrado", "Alumno no encontrado.");
  return aAlumno(data);
}

/** Elimina al alumno y, en cascada, todas sus notas. */
export async function eliminarAlumno(cursoId: string, alumnoId: string): Promise<void> {
  const { data, error } = await db()
    .from("alumnos")
    .delete()
    .eq("id", alumnoId)
    .eq("curso_id", cursoId)
    .select("id");
  if (error) throw errorDeBase("eliminarAlumno", error);
  if (!data || data.length === 0) throw new ErrorGestion("no_encontrado", "Alumno no encontrado.");
}
