import type {
  CriterioRestriccion,
  CursoConEvaluaciones,
  ModoNotasFaltantes,
  OrigenCurso,
  TipoEvaluacion,
} from "@/types/gestion";
import { ESCALA_POR_DEFECTO } from "@/constants/gestion";
import { cursoInputSchema, erroresPorCampo, type CursoInput } from "./esquemasCurso";

/**
 * Borrador editable del curso (estado del formulario). Los números pueden estar
 * vacíos (null) mientras el docente escribe; `validarBorrador` lo convierte en un
 * CursoInput válido o devuelve los errores por campo. Lo producen el formulario
 * manual, la edición de un curso existente y la extracción del PDF con IA.
 */

export interface EvaluacionBorrador {
  /** Clave estable para React (no se guarda). */
  clave: string;
  /** Presente si la evaluación ya existe en la base. */
  id?: string;
  nombre: string;
  tipo: TipoEvaluacion;
  ponderacion: number | null;
}

export interface RestriccionBorrador {
  clave: string;
  tipo_evaluacion: TipoEvaluacion;
  nota_minima: number | null;
  criterio: CriterioRestriccion;
  descripcion: string;
}

export interface CursoBorrador {
  nombre: string;
  codigo: string;
  seccion: string;
  semestre: string;
  docente_nombre: string;
  origen: OrigenCurso;
  programa_archivo: string | null;
  nota_minima: number | null;
  nota_maxima: number | null;
  nota_aprobacion: number | null;
  exigencia_pct: number | null;
  nota_eximicion: number | null;
  nota_minima_examen: number | null;
  decimas_totales: number | null;
  asistencia_minima_pct: number | null;
  notas_faltantes: ModoNotasFaltantes;
  restricciones: RestriccionBorrador[];
  supuestos: string[];
  evaluaciones: EvaluacionBorrador[];
}

let contador = 0;
/** Clave única local (no usa crypto.randomUUID: no existe fuera de contextos seguros). */
export function nuevaClave(): string {
  contador += 1;
  return `k${Date.now().toString(36)}${contador.toString(36)}`;
}

export function evaluacionVacia(tipo: TipoEvaluacion = "solemne"): EvaluacionBorrador {
  return { clave: nuevaClave(), nombre: "", tipo, ponderacion: null };
}

export function restriccionVacia(): RestriccionBorrador {
  return { clave: nuevaClave(), tipo_evaluacion: "solemne", nota_minima: 4, criterio: "promedio", descripcion: "" };
}

/** Semestre académico chileno: marzo–julio = 1, agosto–diciembre (y enero–febrero del año siguiente) = 2. */
export function semestreActual(fecha = new Date()): string {
  const mes = fecha.getMonth() + 1;
  if (mes <= 2) return `${fecha.getFullYear() - 1}-2`;
  return `${fecha.getFullYear()}-${mes <= 7 ? 1 : 2}`;
}

export function borradorVacio(): CursoBorrador {
  return {
    nombre: "",
    codigo: "",
    seccion: "",
    semestre: semestreActual(),
    docente_nombre: "",
    origen: "manual",
    programa_archivo: null,
    ...ESCALA_POR_DEFECTO,
    nota_eximicion: null,
    nota_minima_examen: null,
    decimas_totales: null,
    asistencia_minima_pct: null,
    notas_faltantes: "pendiente",
    restricciones: [],
    supuestos: [],
    evaluaciones: [evaluacionVacia()],
  };
}

export function borradorDesdeCurso(curso: CursoConEvaluaciones): CursoBorrador {
  return {
    nombre: curso.nombre,
    codigo: curso.codigo,
    seccion: curso.seccion,
    semestre: curso.semestre,
    docente_nombre: curso.docente_nombre ?? "",
    origen: curso.origen,
    programa_archivo: curso.programa_archivo,
    nota_minima: curso.nota_minima,
    nota_maxima: curso.nota_maxima,
    nota_aprobacion: curso.nota_aprobacion,
    exigencia_pct: curso.exigencia_pct,
    nota_eximicion: curso.nota_eximicion,
    nota_minima_examen: curso.nota_minima_examen,
    decimas_totales: curso.decimas_totales,
    asistencia_minima_pct: curso.asistencia_minima_pct,
    notas_faltantes: curso.notas_faltantes,
    restricciones: curso.restricciones.map((r) => ({ ...r, clave: nuevaClave() })),
    supuestos: [...curso.supuestos],
    evaluaciones: curso.evaluaciones.map((e) => ({
      clave: nuevaClave(),
      id: e.id,
      nombre: e.nombre,
      tipo: e.tipo,
      ponderacion: e.ponderacion,
    })),
  };
}

export type ResultadoValidacion =
  | { ok: true; input: CursoInput; errores: Record<string, never> }
  | { ok: false; errores: Record<string, string> };

/** Valida el borrador con el mismo schema que usa el servidor. */
export function validarBorrador(borrador: CursoBorrador): ResultadoValidacion {
  const candidato = {
    ...borrador,
    docente_nombre: borrador.docente_nombre.trim() || null,
    supuestos: borrador.supuestos.map((s) => s.trim()).filter(Boolean),
    restricciones: borrador.restricciones.map(({ clave: _clave, ...r }) => r),
    evaluaciones: borrador.evaluaciones.map(({ clave: _clave, ...e }) => e),
  };
  const r = cursoInputSchema.safeParse(candidato);
  return r.success ? { ok: true, input: r.data, errores: {} } : { ok: false, errores: erroresPorCampo(r.error) };
}
