import { aCentesimas } from "./ponderaciones";

/**
 * Redondeo de notas estilo UDP: half-up a 1 decimal (3.95 → 4.0).
 *
 * Los promedios se calculan con ENTEROS (notas en décimas, pesos en centésimas de %)
 * porque en coma flotante 0.3·1.4 + 0.3·4.3 + 0.4·5.6 da 3.9499999… y un redondeo
 * ingenuo dejaría 3.9 (reprobado) cuando la nota correcta es 4.0 (aprobado).
 */

/** Nota → décimas enteras (5.5 → 55). */
export function aDecimas(nota: number): number {
  return Math.round(nota * 10);
}

/** Décimas enteras → nota (55 → 5.5). */
export function deDecimas(decimas: number): number {
  return decimas / 10;
}

/** División entera redondeando la mitad hacia arriba. Solo para valores positivos. */
export function dividirRedondeando(numerador: number, denominador: number): number {
  return Math.floor((2 * numerador + denominador) / (2 * denominador));
}

/**
 * Promedio ponderado exacto, redondeado a 1 decimal. Los pesos se re-normalizan
 * (no necesitan sumar 100). Devuelve null si no hay pesos.
 */
export function promedioPonderado(items: ReadonlyArray<{ nota: number; ponderacion: number }>): number | null {
  let numerador = 0;
  let sumaPesos = 0;
  for (const { nota, ponderacion } of items) {
    const peso = aCentesimas(ponderacion);
    numerador += aDecimas(nota) * peso;
    sumaPesos += peso;
  }
  if (sumaPesos === 0) return null;
  return deDecimas(dividirRedondeando(numerador, sumaPesos));
}

/** Redondeo half-up a 1 decimal para un número cualquiera (corrige 3.9499999… → 4.0). */
export function redondearUnDecimal(valor: number): number {
  return Math.round(Number((valor * 10).toFixed(6))) / 10;
}

/** "5.0" para mostrar; "—" si no hay nota. */
export function formatearNota(nota: number | null | undefined): string {
  return typeof nota === "number" && Number.isFinite(nota) ? nota.toFixed(1) : "—";
}
