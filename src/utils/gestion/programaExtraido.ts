import { z } from "zod";
import { TIPOS_EVALUACION, type TipoEvaluacion } from "@/types/gestion";
import { ESCALA_POR_DEFECTO } from "@/constants/gestion";
import {
  borradorVacio,
  evaluacionVacia,
  nuevaClave,
  type CursoBorrador,
  type EvaluacionBorrador,
} from "./borradorCurso";
import { repartirPonderacion } from "./ponderaciones";
import { redondearUnDecimal } from "./redondeo";

/**
 * JSON que la IA debe devolver al leer el programa (ver prompts/extraer-programa.system.md)
 * y su conversión al borrador del formulario. Nada de esto se guarda sin confirmación del docente.
 */

const sinTildes = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Acepta "Solemne", "presentación", etc.; lo desconocido pasa a "otro". */
const tipoEvaluacion = z.preprocess(
  (v) => (typeof v === "string" ? sinTildes(v) : v),
  z.enum(TIPOS_EVALUACION).catch("otro")
);

const textoONull = z.string().trim().max(300).nullable();
const notaONull = z.number().min(1).max(7).nullable();

export const programaExtraidoSchema = z.object({
  curso: z.object({
    nombre: textoONull,
    codigo: textoONull,
    seccion: textoONull,
    semestre: textoONull,
    docente: textoONull,
  }),
  evaluaciones: z
    .array(
      z.object({
        nombre: z.string().trim().min(1).max(80),
        tipo: tipoEvaluacion,
        ponderacion_total: z.number().gt(0).max(100),
        cantidad: z.number().int().min(1).max(20),
      })
    )
    .max(30),
  escala: z.object({
    nota_minima: notaONull,
    nota_maxima: notaONull,
    nota_aprobacion: notaONull,
    exigencia_pct: z.number().gt(0).max(100).nullable(),
  }),
  examen: z.object({ nota_eximicion: notaONull, nota_minima_para_rendir: notaONull }).nullable(),
  decimas_totales: z.number().min(0).max(3).nullable(),
  asistencia_minima_pct: z.number().min(0).max(100).nullable(),
  restricciones: z
    .array(
      z.object({
        tipo_evaluacion: tipoEvaluacion,
        nota_minima: z.number().min(1).max(7),
        criterio: z.enum(["promedio", "cada_una"]).catch("promedio"),
        descripcion: z.string().trim().max(300).catch(""),
      })
    )
    .max(10),
  supuestos: z.array(z.string().trim().min(1).max(300)).max(15),
});

export type ProgramaExtraido = z.infer<typeof programaExtraidoSchema>;

export type ResultadoParseo = { ok: true; datos: ProgramaExtraido } | { ok: false; error: string };

/** Extrae el objeto JSON de la respuesta (tolera ```json … ``` o texto alrededor) y lo valida. */
export function parsearRespuestaIa(respuesta: string): ResultadoParseo {
  const inicio = respuesta.indexOf("{");
  const fin = respuesta.lastIndexOf("}");
  if (inicio < 0 || fin <= inicio) return { ok: false, error: "La respuesta no contiene un objeto JSON." };
  let json: unknown;
  try {
    json = JSON.parse(respuesta.slice(inicio, fin + 1));
  } catch {
    return { ok: false, error: "El JSON no es válido (revisa comillas, comas y llaves)." };
  }
  const r = programaExtraidoSchema.safeParse(json);
  if (r.success) return { ok: true, datos: r.data };
  const detalle = r.error.issues
    .slice(0, 8)
    .map((i) => `${i.path.join(".") || "(raíz)"}: ${i.message}`)
    .join("; ");
  return { ok: false, error: detalle };
}

/** "Tarea" × 3 al 30% → Tarea 1, Tarea 2, Tarea 3 al 10% cada una. */
function expandirEvaluaciones(datos: ProgramaExtraido): EvaluacionBorrador[] {
  const lista = datos.evaluaciones.flatMap((e) => {
    const pesos = repartirPonderacion(e.ponderacion_total, e.cantidad);
    return pesos.map((ponderacion, i) => ({
      clave: nuevaClave(),
      nombre: e.cantidad > 1 ? `${e.nombre} ${i + 1}` : e.nombre,
      tipo: e.tipo as TipoEvaluacion,
      ponderacion,
    }));
  });
  return lista.length > 0 ? lista : [evaluacionVacia()];
}

const unDecimal = (n: number | null) => (n === null ? null : redondearUnDecimal(n));

export function borradorDesdeProgramaExtraido(datos: ProgramaExtraido, nombreArchivo: string | null): CursoBorrador {
  const base = borradorVacio();
  const { curso, escala, examen } = datos;
  return {
    ...base,
    nombre: curso.nombre ?? "",
    codigo: curso.codigo ?? "",
    seccion: curso.seccion ?? "",
    semestre: curso.semestre ?? base.semestre,
    docente_nombre: curso.docente ?? "",
    origen: "pdf",
    programa_archivo: nombreArchivo,
    nota_minima: unDecimal(escala.nota_minima) ?? ESCALA_POR_DEFECTO.nota_minima,
    nota_maxima: unDecimal(escala.nota_maxima) ?? ESCALA_POR_DEFECTO.nota_maxima,
    nota_aprobacion: unDecimal(escala.nota_aprobacion) ?? ESCALA_POR_DEFECTO.nota_aprobacion,
    exigencia_pct: escala.exigencia_pct ?? ESCALA_POR_DEFECTO.exigencia_pct,
    nota_eximicion: unDecimal(examen?.nota_eximicion ?? null),
    nota_minima_examen: unDecimal(examen?.nota_minima_para_rendir ?? null),
    decimas_totales: unDecimal(datos.decimas_totales),
    asistencia_minima_pct: datos.asistencia_minima_pct,
    restricciones: datos.restricciones.map((r) => ({
      clave: nuevaClave(),
      tipo_evaluacion: r.tipo_evaluacion as TipoEvaluacion,
      nota_minima: unDecimal(r.nota_minima),
      criterio: r.criterio,
      descripcion: r.descripcion,
    })),
    supuestos: datos.supuestos,
    evaluaciones: expandirEvaluaciones(datos),
  };
}
