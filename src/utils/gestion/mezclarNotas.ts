import type { NotasPorAlumno } from "./calcularTabla";

/**
 * Capas de la tabla de notas (funciones puras e inmutables):
 * guardadas → simulación → valor que se está escribiendo.
 * Solo se clona el alumno que cambia, así React no re-renderiza las demás filas.
 */

/** Devuelve una copia con la nota de un alumno cambiada (null = celda vacía). */
export function aplicarCambio(
  notas: NotasPorAlumno,
  alumnoId: string,
  evaluacionId: string,
  valor: number | null
): NotasPorAlumno {
  if ((notas[alumnoId]?.[evaluacionId] ?? null) === valor && evaluacionId in (notas[alumnoId] ?? {})) return notas;
  return { ...notas, [alumnoId]: { ...(notas[alumnoId] ?? {}), [evaluacionId]: valor } };
}

/** Superpone una capa sobre la base; en la capa, null significa "sin nota". */
export function superponer(base: NotasPorAlumno, capa: NotasPorAlumno): NotasPorAlumno {
  const ids = Object.keys(capa);
  if (ids.length === 0) return base;
  const resultado = { ...base };
  for (const id of ids) resultado[id] = { ...(base[id] ?? {}), ...capa[id] };
  return resultado;
}

/** Cuenta celdas y décimas cambiadas en una simulación. */
export function contarCambios(capaNotas: NotasPorAlumno, capaDecimas: Record<string, number>): number {
  const celdas = Object.values(capaNotas).reduce((acc, notas) => acc + Object.keys(notas).length, 0);
  return celdas + Object.keys(capaDecimas).length;
}
