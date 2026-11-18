import type { ConfiguracionCurso, Evaluacion } from "@/types/gestion";
import { ETIQUETAS_TIPO_EVALUACION } from "@/constants/gestion";
import { aCentesimas } from "./ponderaciones";
import { aDecimas, deDecimas, dividirRedondeando, formatearNota as f, promedioPonderado } from "./redondeo";

/**
 * Motor de cálculo de la nota final (función pura, sin I/O).
 *
 * 1. NP (nota de presentación) = promedio ponderado de las evaluaciones que no son examen.
 * 2. Sin examen: NF = NP. Con examen: eximido si NP ≥ nota_eximicion (NF = NP); sin derecho a
 *    examen si NP < nota_minima_examen (Reprobado, NF = NP); si no, NF = NP·(1 − w) + Examen·w.
 * 3. Décimas del alumno (tope decimas_totales) se suman a la NF, con tope nota_maxima.
 * 4. Restricciones incumplidas dejan el estado en Reprobado; NO cambian el número de la NF.
 * Todo se redondea half-up a 1 decimal con aritmética entera (ver redondeo.ts).
 */

export type EstadoAlumno = "Aprobado" | "Reprobado" | "Pendiente";

export type EvaluacionCalculo = Pick<Evaluacion, "id" | "nombre" | "tipo" | "ponderacion">;

export type ConfiguracionCalculo = Pick<
  ConfiguracionCurso,
  | "nota_minima"
  | "nota_maxima"
  | "nota_aprobacion"
  | "nota_eximicion"
  | "nota_minima_examen"
  | "decimas_totales"
  | "notas_faltantes"
  | "restricciones"
>;

export interface EntradaCalculo {
  config: ConfiguracionCalculo;
  evaluaciones: ReadonlyArray<EvaluacionCalculo>;
  /** Notas del alumno por evaluacion_id. Ausente o null = sin nota. */
  notas: Readonly<Record<string, number | null | undefined>>;
  /** Décimas ganadas por el alumno (en puntos de nota). */
  decimas?: number;
}

export interface ResultadoCalculo {
  /** Nota de presentación; solo se informa si el curso tiene examen. */
  nota_presentacion: number | null;
  nota_final: number | null;
  estado: EstadoAlumno;
  eximido: boolean;
  decimas_aplicadas: number;
  /** Nombres de las evaluaciones que faltan para cerrar la nota. */
  faltantes: string[];
  /** Explicaciones legibles para el docente (restricciones, eximición, etc.). */
  motivos: string[];
}

type NotaDe = (e: EvaluacionCalculo) => number | null;

export function calcularNotaFinal({ config, evaluaciones, notas, decimas = 0 }: EntradaCalculo): ResultadoCalculo {
  const tieneNota = (e: EvaluacionCalculo) => typeof notas[e.id] === "number";
  const usarMinima = config.notas_faltantes === "nota_minima";
  const notaDe: NotaDe = (e) => (tieneNota(e) ? (notas[e.id] as number) : usarMinima ? config.nota_minima : null);

  const examen = evaluaciones.find((e) => e.tipo === "examen");
  const regulares = evaluaciones.filter((e) => e.tipo !== "examen");
  const motivos: string[] = [];

  // 1. Nota de presentación
  const notasRegulares = regulares.map((e) => ({ nota: notaDe(e), ponderacion: e.ponderacion }));
  const np = notasRegulares.every((x) => x.nota !== null)
    ? promedioPonderado(notasRegulares as Array<{ nota: number; ponderacion: number }>)
    : null;

  // 2. Nota final base (antes de décimas)
  let base: number | null = null;
  let eximido = false;
  let sinDerecho = false;
  if (!examen) {
    base = np;
  } else if (np !== null) {
    if (config.nota_eximicion !== null && aDecimas(np) >= aDecimas(config.nota_eximicion)) {
      eximido = true;
      base = np;
      motivos.push(`Eximido del examen (NP ${f(np)} ≥ ${f(config.nota_eximicion)}).`);
    } else if (config.nota_minima_examen !== null && aDecimas(np) < aDecimas(config.nota_minima_examen)) {
      sinDerecho = true;
      base = np;
      motivos.push(`Sin derecho a examen (NP ${f(np)} < ${f(config.nota_minima_examen)}).`);
    } else {
      const notaExamen = notaDe(examen);
      base = notaExamen === null ? null : notaConExamen(np, notaExamen, examen.ponderacion);
    }
  } else if (regulares.length === 0) {
    base = notaDe(examen); // curso con solo examen
  }

  // 3. Evaluaciones que faltan (el examen no hace falta si está eximido o sin derecho)
  const necesarias = examen && (eximido || sinDerecho) ? regulares : evaluaciones;
  const sinNota = necesarias.filter((e) => !tieneNota(e)).map((e) => e.nombre);
  const faltantes = usarMinima ? [] : sinNota;
  if (usarMinima && sinNota.length > 0) {
    motivos.push(`Sin nota, cuentan como ${f(config.nota_minima)}: ${sinNota.join(", ")}.`);
  }

  // 4. Restricciones y décimas
  const incumplidas = evaluarRestricciones(config, evaluaciones, notaDe);
  motivos.push(...incumplidas);
  const tope = config.decimas_totales ?? 0;
  const decimasAplicadas = base === null ? 0 : deDecimas(Math.min(aDecimas(Math.max(decimas, 0)), aDecimas(tope)));
  const notaFinal =
    base === null ? null : deDecimas(Math.min(aDecimas(base) + aDecimas(decimasAplicadas), aDecimas(config.nota_maxima)));

  // 5. Estado
  let estado: EstadoAlumno;
  if (notaFinal === null) {
    estado = "Pendiente";
    if (faltantes.length > 0) motivos.unshift(`Faltan notas: ${faltantes.join(", ")}.`);
  } else if (sinDerecho || incumplidas.length > 0 || aDecimas(notaFinal) < aDecimas(config.nota_aprobacion)) {
    estado = "Reprobado";
  } else {
    estado = "Aprobado";
  }

  return {
    nota_presentacion: examen ? np : null,
    nota_final: notaFinal,
    estado,
    eximido,
    decimas_aplicadas: decimasAplicadas,
    faltantes,
    motivos,
  };
}

/** NF = NP·(1 − w) + Examen·w, con w = ponderación del examen; exacto y redondeado. */
function notaConExamen(np: number, notaExamen: number, ponderacionExamen: number): number {
  const peso = aCentesimas(ponderacionExamen); // 20% → 2000 (de 10000)
  return deDecimas(dividirRedondeando(aDecimas(np) * (10000 - peso) + aDecimas(notaExamen) * peso, 10000));
}

/** Devuelve un texto por cada restricción que el alumno no cumple. */
function evaluarRestricciones(
  config: ConfiguracionCalculo,
  evaluaciones: ReadonlyArray<EvaluacionCalculo>,
  notaDe: NotaDe
): string[] {
  const incumplidas: string[] = [];
  for (const r of config.restricciones) {
    const delTipo = evaluaciones.filter((e) => e.tipo === r.tipo_evaluacion);
    if (delTipo.length === 0) continue;
    const etiqueta = ETIQUETAS_TIPO_EVALUACION[r.tipo_evaluacion].plural;
    const minimo = aDecimas(r.nota_minima);

    if (r.criterio === "cada_una") {
      for (const e of delTipo) {
        const nota = notaDe(e);
        if (nota !== null && aDecimas(nota) < minimo) {
          incumplidas.push(`${e.nombre}: ${f(nota)} < ${f(r.nota_minima)} (mínimo en cada una de las ${etiqueta}).`);
        }
      }
      continue;
    }

    const conNota = delTipo.map((e) => ({ nota: notaDe(e), ponderacion: e.ponderacion }));
    if (conNota.some((x) => x.nota === null)) continue; // aún no se puede evaluar
    const promedio = promedioPonderado(conNota as Array<{ nota: number; ponderacion: number }>);
    if (promedio !== null && aDecimas(promedio) < minimo) {
      incumplidas.push(`Promedio de ${etiqueta} ${f(promedio)} < ${f(r.nota_minima)}.`);
    }
  }
  return incumplidas;
}
