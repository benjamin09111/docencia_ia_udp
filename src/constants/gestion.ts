import type { CriterioRestriccion, ModoNotasFaltantes, TipoEvaluacion } from "@/types/gestion";

/** Catálogos del Módulo 1 (Regla 6: nada de textos de catálogo en los componentes). */

export const ETIQUETAS_TIPO_EVALUACION: Record<TipoEvaluacion, { singular: string; plural: string }> = {
  solemne: { singular: "Solemne", plural: "solemnes" },
  control: { singular: "Control", plural: "controles" },
  tarea: { singular: "Tarea", plural: "tareas" },
  proyecto: { singular: "Proyecto", plural: "proyectos" },
  informe: { singular: "Informe", plural: "informes" },
  presentacion: { singular: "Presentación", plural: "presentaciones" },
  examen: { singular: "Examen", plural: "exámenes" },
  otro: { singular: "Otra", plural: "otras evaluaciones" },
};

export const ETIQUETAS_NOTAS_FALTANTES: Record<ModoNotasFaltantes, string> = {
  pendiente: "La nota final queda pendiente hasta tener todas las notas",
  nota_minima: "Una nota faltante cuenta como la nota mínima",
};

export const ETIQUETAS_CRITERIO_RESTRICCION: Record<CriterioRestriccion, string> = {
  promedio: "El promedio de",
  cada_una: "Cada una de las",
};

/** Escala por defecto UDP (punto base 1.0, aprobación 4.0, exigencia 60%). */
export const ESCALA_POR_DEFECTO = {
  nota_minima: 1.0,
  nota_maxima: 7.0,
  nota_aprobacion: 4.0,
  exigencia_pct: 60,
} as const;
