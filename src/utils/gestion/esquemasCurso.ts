import { z } from "zod";
import { CRITERIOS_RESTRICCION, MODOS_NOTAS_FALTANTES, TIPOS_EVALUACION } from "@/types/gestion";
import { esNotaValida, tieneDecimales } from "./validacionNota";
import { ponderacionesSuman100, sumaPonderaciones } from "./ponderaciones";

z.config(z.locales.es());

/**
 * Schemas del curso del Módulo 1. Los usa el formulario (cliente) y las rutas
 * /api/gestion (servidor), así ambos validan exactamente lo mismo.
 */

const nota = z
  .number({ error: "Ingresa una nota." })
  .refine((v) => esNotaValida(v), "La nota debe estar entre 1.0 y 7.0, con un decimal.");

const textoOpcional = (max: number) => z.string().trim().max(max);

export const evaluacionInputSchema = z.object({
  /** Presente cuando la evaluación ya existe (se conservan sus notas al editar). */
  id: z.uuid().optional(),
  nombre: z.string().trim().min(1, "Escribe el nombre de la evaluación.").max(80),
  tipo: z.enum(TIPOS_EVALUACION),
  ponderacion: z
    .number({ error: "Ingresa la ponderación." })
    .gt(0, "La ponderación debe ser mayor que 0.")
    .max(100, "La ponderación no puede superar 100%.")
    .refine((v) => tieneDecimales(v, 2), "Usa como máximo 2 decimales."),
});

export const restriccionSchema = z.object({
  tipo_evaluacion: z.enum(TIPOS_EVALUACION),
  nota_minima: nota,
  criterio: z.enum(CRITERIOS_RESTRICCION),
  descripcion: textoOpcional(300).default(""),
});

export const cursoInputSchema = z
  .object({
    nombre: z.string().trim().min(1, "Escribe el nombre del curso.").max(150),
    codigo: z.string().trim().min(1, "Escribe el código del curso.").max(30),
    seccion: textoOpcional(20).default(""),
    semestre: z.string().trim().min(1, "Escribe el semestre (ej. 2026-2).").max(20),
    docente_nombre: textoOpcional(150).nullable().default(null),
    origen: z.enum(["pdf", "manual"]).default("manual"),
    programa_archivo: textoOpcional(255).nullable().default(null),
    nota_minima: nota,
    nota_maxima: nota,
    nota_aprobacion: nota,
    exigencia_pct: z.number().gt(0).max(100),
    nota_eximicion: nota.nullable(),
    nota_minima_examen: nota.nullable(),
    decimas_totales: z
      .number()
      .min(0)
      .max(3, "Las décimas totales no pueden superar 3.0 puntos.")
      .refine((v) => tieneDecimales(v, 1), "Usa un decimal (0.5 = 5 décimas).")
      .nullable(),
    asistencia_minima_pct: z.number().min(0).max(100).nullable(),
    notas_faltantes: z.enum(MODOS_NOTAS_FALTANTES),
    restricciones: z.array(restriccionSchema).max(10),
    supuestos: z.array(z.string().trim().min(1).max(300)).max(20),
    evaluaciones: z.array(evaluacionInputSchema).min(1, "Agrega al menos una evaluación.").max(30),
  })
  .superRefine((curso, ctx) => {
    // Zod ejecuta esta validación aunque otros campos fallen: revisar tipos antes de usar.
    const { nota_minima: min, nota_aprobacion: aprob, nota_maxima: max } = curso;
    if ([min, aprob, max].every((n) => typeof n === "number") && !(min < aprob && aprob <= max)) {
      ctx.addIssue({
        code: "custom",
        path: ["nota_aprobacion"],
        message: "La escala debe cumplir: nota mínima < nota de aprobación ≤ nota máxima.",
      });
    }

    const evaluaciones = Array.isArray(curso.evaluaciones) ? curso.evaluaciones : [];
    if (evaluaciones.every((e) => typeof e?.ponderacion === "number") && !ponderacionesSuman100(evaluaciones)) {
      ctx.addIssue({
        code: "custom",
        path: ["evaluaciones"],
        message: `Las ponderaciones suman ${sumaPonderaciones(evaluaciones)}%; deben sumar 100%.`,
      });
    }
    if (evaluaciones.filter((e) => e?.tipo === "examen").length > 1) {
      ctx.addIssue({ code: "custom", path: ["evaluaciones"], message: "Solo puede haber un examen." });
    }
    const ids = evaluaciones.map((e) => e?.id).filter(Boolean);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({ code: "custom", path: ["evaluaciones"], message: "Hay evaluaciones repetidas." });
    }
  });

export type EvaluacionInput = z.infer<typeof evaluacionInputSchema>;
export type CursoInput = z.infer<typeof cursoInputSchema>;
export type RestriccionInput = z.infer<typeof restriccionSchema>;

/** Primer mensaje de error por campo (ej. { "evaluaciones": "Las ponderaciones suman 90%…" }). */
export function erroresPorCampo(error: z.ZodError): Record<string, string> {
  const errores: Record<string, string> = {};
  for (const issue of error.issues) {
    const campo = issue.path.join(".") || "_";
    if (!errores[campo]) errores[campo] = issue.message;
  }
  return errores;
}
