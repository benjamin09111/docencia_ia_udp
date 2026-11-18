import type { Alumno, Nota } from "@/types/gestion";
import {
  calcularNotaFinal,
  type ConfiguracionCalculo,
  type EvaluacionCalculo,
  type ResultadoCalculo,
} from "./calcularNotaFinal";
import { aDecimas, deDecimas, dividirRedondeando } from "./redondeo";

/**
 * Calcula la nota final de todos los alumnos del curso (función pura).
 * La usan la tabla de notas (recálculo en vivo) y el acta Excel.
 */

export type NotasPorAlumno = Record<string, Record<string, number | null>>;

/** Agrupa las notas por alumno: { alumno_id: { evaluacion_id: valor } }. */
export function agruparNotas(notas: ReadonlyArray<Pick<Nota, "alumno_id" | "evaluacion_id" | "valor">>): NotasPorAlumno {
  const porAlumno: NotasPorAlumno = {};
  for (const n of notas) {
    (porAlumno[n.alumno_id] ??= {})[n.evaluacion_id] = n.valor;
  }
  return porAlumno;
}

export function calcularTabla(
  config: ConfiguracionCalculo,
  evaluaciones: ReadonlyArray<EvaluacionCalculo>,
  alumnos: ReadonlyArray<Pick<Alumno, "id" | "decimas">>,
  notasPorAlumno: NotasPorAlumno
): Record<string, ResultadoCalculo> {
  const resultados: Record<string, ResultadoCalculo> = {};
  for (const alumno of alumnos) {
    resultados[alumno.id] = calcularNotaFinal({
      config,
      evaluaciones,
      notas: notasPorAlumno[alumno.id] ?? {},
      decimas: alumno.decimas,
    });
  }
  return resultados;
}

export interface ResumenCurso {
  total: number;
  aprobados: number;
  reprobados: number;
  pendientes: number;
  /** Promedio de las notas finales ya calculadas (sin pendientes), o null. */
  promedio: number | null;
}

export function resumirTabla(resultados: Readonly<Record<string, ResultadoCalculo>>): ResumenCurso {
  const lista = Object.values(resultados);
  const finales = lista.map((r) => r.nota_final).filter((n): n is number => n !== null);
  const sumaDecimas = finales.reduce((acc, n) => acc + aDecimas(n), 0);
  return {
    total: lista.length,
    aprobados: lista.filter((r) => r.estado === "Aprobado").length,
    reprobados: lista.filter((r) => r.estado === "Reprobado").length,
    pendientes: lista.filter((r) => r.estado === "Pendiente").length,
    promedio: finales.length ? deDecimas(dividirRedondeando(sumaDecimas, finales.length)) : null,
  };
}
