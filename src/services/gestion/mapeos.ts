import type { Alumno, Curso, Evaluacion, Nota, Restriccion } from "@/types/gestion";

/**
 * Filas de Supabase → tipos del dominio. Postgres devuelve NUMERIC como número
 * o texto según el caso; aquí se normaliza todo a number.
 */

type Fila = Record<string, unknown>;

const num = (v: unknown): number => Number(v);
const numONull = (v: unknown): number | null => (v === null || v === undefined ? null : Number(v));
const textoONull = (v: unknown): string | null => (typeof v === "string" ? v : null);

export function aCurso(f: Fila): Curso {
  return {
    id: String(f.id),
    owner_user_id: String(f.owner_user_id),
    nombre: String(f.nombre),
    codigo: String(f.codigo),
    seccion: String(f.seccion ?? ""),
    semestre: String(f.semestre),
    docente_nombre: textoONull(f.docente_nombre),
    origen: f.origen === "pdf" ? "pdf" : "manual",
    programa_archivo: textoONull(f.programa_archivo),
    nota_minima: num(f.nota_minima),
    nota_maxima: num(f.nota_maxima),
    nota_aprobacion: num(f.nota_aprobacion),
    exigencia_pct: num(f.exigencia_pct),
    nota_eximicion: numONull(f.nota_eximicion),
    nota_minima_examen: numONull(f.nota_minima_examen),
    decimas_totales: numONull(f.decimas_totales),
    asistencia_minima_pct: numONull(f.asistencia_minima_pct),
    notas_faltantes: f.notas_faltantes === "nota_minima" ? "nota_minima" : "pendiente",
    restricciones: Array.isArray(f.restricciones) ? (f.restricciones as Restriccion[]) : [],
    supuestos: Array.isArray(f.supuestos) ? (f.supuestos as unknown[]).map(String) : [],
    created_at: String(f.created_at),
    updated_at: String(f.updated_at),
  };
}

export function aEvaluacion(f: Fila): Evaluacion {
  return {
    id: String(f.id),
    curso_id: String(f.curso_id),
    nombre: String(f.nombre),
    tipo: f.tipo as Evaluacion["tipo"],
    ponderacion: num(f.ponderacion),
    orden: num(f.orden),
  };
}

export function aAlumno(f: Fila): Alumno {
  return {
    id: String(f.id),
    curso_id: String(f.curso_id),
    nombres: String(f.nombres),
    apellidos: String(f.apellidos),
    rut: String(f.rut),
    correo: String(f.correo),
    decimas: num(f.decimas),
  };
}

export function aNota(f: Fila): Nota {
  return {
    id: String(f.id),
    evaluacion_id: String(f.evaluacion_id),
    alumno_id: String(f.alumno_id),
    valor: num(f.valor),
    origen: f.origen as Nota["origen"],
    referencia_externa: textoONull(f.referencia_externa),
    updated_by: textoONull(f.updated_by),
    updated_at: String(f.updated_at),
  };
}

/** Orden estable de evaluaciones: por `orden` y luego por nombre. */
export function ordenarEvaluaciones(evaluaciones: Evaluacion[]): Evaluacion[] {
  return [...evaluaciones].sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, "es"));
}
