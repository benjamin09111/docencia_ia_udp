import { describe, expect, it } from "vitest";
import { aplicarCambio, contarCambios, superponer } from "./mezclarNotas";

describe("capas de la tabla de notas", () => {
  const base = { a1: { e1: 5, e2: 6 }, a2: { e1: 4 } };

  it("aplicarCambio clona solo el alumno modificado", () => {
    const r = aplicarCambio(base, "a1", "e1", 6.5);
    expect(r.a1).toEqual({ e1: 6.5, e2: 6 });
    expect(r.a2).toBe(base.a2); // misma referencia: la fila no se re-renderiza
    expect(base.a1.e1).toBe(5); // la base no se muta
  });

  it("aplicarCambio con el mismo valor devuelve el mismo objeto", () => {
    expect(aplicarCambio(base, "a1", "e1", 5)).toBe(base);
  });

  it("superponer aplica la simulación, incluidas notas borradas (null)", () => {
    const r = superponer(base, { a1: { e2: null }, a3: { e1: 7 } });
    expect(r).toEqual({ a1: { e1: 5, e2: null }, a2: { e1: 4 }, a3: { e1: 7 } });
    expect(superponer(base, {})).toBe(base);
  });

  it("contarCambios suma celdas y décimas simuladas", () => {
    expect(contarCambios({ a1: { e1: 3, e2: null }, a2: { e1: 4 } }, { a1: 0.2 })).toBe(4);
  });
});
