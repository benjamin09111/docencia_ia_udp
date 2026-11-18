import { z } from "zod";
import { esNotaValida, tieneDecimales } from "./validacionNota";

/**
 * Schema del guardado de la tabla de notas (PUT /api/gestion/cursos/[id]/notas).
 * También lo puede usar el Módulo 2 para validar lo que escribe.
 */

export const cambioNotaSchema = z.object({
  evaluacion_id: z.uuid(),
  alumno_id: z.uuid(),
  /** null borra la nota (la celda queda vacía). */
  valor: z
    .number()
    .refine((v) => esNotaValida(v), "La nota debe estar entre 1.0 y 7.0, con un decimal.")
    .nullable(),
});

export const cambioDecimasSchema = z.object({
  alumno_id: z.uuid(),
  decimas: z
    .number()
    .min(0, "Las décimas no pueden ser negativas.")
    .max(9.9)
    .refine((v) => tieneDecimales(v, 1), "Usa un decimal (0.3 = 3 décimas)."),
});

export const guardarNotasSchema = z.object({
  notas: z.array(cambioNotaSchema).max(2000).default([]),
  decimas: z.array(cambioDecimasSchema).max(500).default([]),
});

export type GuardarNotasInput = z.infer<typeof guardarNotasSchema>;
