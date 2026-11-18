import { describe, expect, it } from "vitest";
import { ponderacionesSuman100, repartirPonderacion, sumaPonderaciones } from "./ponderaciones";
import { esNotaValida, leerNotaEscrita, tieneDecimales } from "./validacionNota";

const conPesos = (...pesos: number[]) => pesos.map((ponderacion) => ({ ponderacion }));

describe("ponderaciones", () => {
  it("suma exacto aunque los decimales no sean representables en coma flotante", () => {
    expect(0.1 + 0.2).not.toBe(0.3); // recordatorio del problema
    expect(sumaPonderaciones(conPesos(33.33, 33.33, 33.34))).toBe(100);
    expect(ponderacionesSuman100(conPesos(33.33, 33.33, 33.34))).toBe(true);
    expect(ponderacionesSuman100(conPesos(10.1, 20.2, 69.7))).toBe(true);
  });

  it("detecta cuando no suman 100", () => {
    expect(ponderacionesSuman100(conPesos(25, 25, 40))).toBe(false);
    expect(sumaPonderaciones(conPesos(25, 25, 40))).toBe(90);
  });

  it("reparte un porcentaje en partes iguales con suma exacta", () => {
    expect(repartirPonderacion(30, 3)).toEqual([10, 10, 10]);
    expect(repartirPonderacion(100, 3)).toEqual([33.34, 33.33, 33.33]);
    expect(sumaPonderaciones(conPesos(...repartirPonderacion(40, 7)))).toBe(40);
    expect(repartirPonderacion(20, 0)).toEqual([]);
  });
});

describe("validación de notas", () => {
  it("acepta notas entre 1.0 y 7.0 con un decimal", () => {
    expect(esNotaValida(1)).toBe(true);
    expect(esNotaValida(4.5)).toBe(true);
    expect(esNotaValida(7)).toBe(true);
  });

  it("rechaza notas fuera de rango o con más de un decimal", () => {
    expect(esNotaValida(0.9)).toBe(false);
    expect(esNotaValida(7.1)).toBe(false);
    expect(esNotaValida(8)).toBe(false);
    expect(esNotaValida(4.55)).toBe(false);
    expect(esNotaValida(Number.NaN)).toBe(false);
  });

  it("tolera errores de coma flotante al contar decimales", () => {
    expect(tieneDecimales(0.1 + 0.2, 1)).toBe(true);
    expect(tieneDecimales(5.3, 1)).toBe(true);
  });

  it("lee lo que escribe el docente con coma o punto", () => {
    expect(leerNotaEscrita("5,5")).toBe(5.5);
    expect(leerNotaEscrita(" 6.0 ")).toBe(6);
    expect(leerNotaEscrita("")).toBeNull();
    expect(leerNotaEscrita("abc")).toBeNaN();
    expect(leerNotaEscrita("-3")).toBeNaN();
  });
});
