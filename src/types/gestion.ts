/**
 * Módulo 1 — Gestión y Calificaciones.
 * Los nombres de campo coinciden con las columnas de la migración
 * supabase/migrations/20261118_modulo1_gestion_calificaciones.sql.
 */

export const TIPOS_EVALUACION = [
  "solemne",
  "control",
  "tarea",
  "proyecto",
  "informe",
  "presentacion",
  "examen",
  "otro",
] as const;
export type TipoEvaluacion = (typeof TIPOS_EVALUACION)[number];

export const MODOS_NOTAS_FALTANTES = ["pendiente", "nota_minima"] as const;
export type ModoNotasFaltantes = (typeof MODOS_NOTAS_FALTANTES)[number];

export const ORIGENES_NOTA = ["manual", "importacion", "actividad"] as const;
export type OrigenNota = (typeof ORIGENES_NOTA)[number];

export const CRITERIOS_RESTRICCION = ["promedio", "cada_una"] as const;
export type CriterioRestriccion = (typeof CRITERIOS_RESTRICCION)[number];

export type OrigenCurso = "pdf" | "manual";

/** Restricción para aprobar, ej. "promedio de solemnes >= 4.0". */
export interface Restriccion {
  tipo_evaluacion: TipoEvaluacion;
  nota_minima: number;
  criterio: CriterioRestriccion;
  descripcion: string;
}

/** Datos de identificación del curso. */
export interface DatosCurso {
  nombre: string;
  codigo: string;
  seccion: string;
  semestre: string;
  docente_nombre: string | null;
}

/** Configuración que usa el motor de cálculo de notas. */
export interface ConfiguracionCurso {
  nota_minima: number;
  nota_maxima: number;
  nota_aprobacion: number;
  exigencia_pct: number;
  nota_eximicion: number | null;
  nota_minima_examen: number | null;
  decimas_totales: number | null;
  asistencia_minima_pct: number | null;
  notas_faltantes: ModoNotasFaltantes;
  restricciones: Restriccion[];
}

export interface Curso extends DatosCurso, ConfiguracionCurso {
  id: string;
  owner_user_id: string;
  origen: OrigenCurso;
  programa_archivo: string | null;
  supuestos: string[];
  created_at: string;
  updated_at: string;
}

export interface Evaluacion {
  id: string;
  curso_id: string;
  nombre: string;
  tipo: TipoEvaluacion;
  /** % sobre la nota final. Todas las evaluaciones del curso suman 100. */
  ponderacion: number;
  orden: number;
}

export interface CursoConEvaluaciones extends Curso {
  evaluaciones: Evaluacion[];
}

/** Fila de la lista de cursos del docente. */
export interface CursoResumen extends Curso {
  total_evaluaciones: number;
  total_alumnos: number;
}

export interface Alumno {
  id: string;
  curso_id: string;
  nombres: string;
  apellidos: string;
  /** Normalizado: cuerpo-DV sin puntos, K mayúscula. */
  rut: string;
  correo: string;
  /** Décimas ganadas, en puntos de nota (0.3 = 3 décimas). */
  decimas: number;
}

export interface Nota {
  id: string;
  evaluacion_id: string;
  alumno_id: string;
  valor: number;
  origen: OrigenNota;
  referencia_externa: string | null;
  updated_by: string | null;
  updated_at: string;
}

/** Cambio de una celda de la tabla de notas. `valor: null` borra la nota. */
export interface CambioNota {
  evaluacion_id: string;
  alumno_id: string;
  valor: number | null;
}

export interface CambioDecimas {
  alumno_id: string;
  decimas: number;
}

/** Datos de un alumno antes de guardarlo (sin id ni curso). */
export interface AlumnoNuevo {
  nombres: string;
  apellidos: string;
  rut: string;
  correo: string;
}
