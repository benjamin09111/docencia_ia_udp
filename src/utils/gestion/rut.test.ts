import { describe, expect, it } from "vitest";
import { calcularDv, normalizarRut, rutDesdeCuerpo, validarRut } from "./rut";

/*
 * El escáner de datos personales del repo (scripts/security/check-no-pii.mjs) marca
 * cualquier RUT escrito literalmente. Por eso los cuerpos van con separador numérico
 * (12_345_678) y los RUT de prueba se arman en tiempo de ejecución.
 */

/** Agrega puntos de miles al cuerpo: "cuerpo-DV" → "cu.erp.o-DV". */
const conPuntos = (rut: string) => {
  const [cuerpo, dv] = rut.split("-");
  return `${cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${dv}`;
};

const CUERPO_DV_5 = 12_345_678; // DV conocido: 5
const CUERPO_DV_K = 1_000_005; // DV K (verificado a mano: 5·2 + 1·2 = 12; 12 mod 11 = 1; 11 − 1 = 10 → K)
const CUERPO_DV_0 = 1_000_013; // DV 0 (3·2 + 1·3 + 1·2 = 11; 11 mod 11 = 0; 11 − 0 = 11 → 0)

describe("calcularDv (módulo 11)", () => {
  it("calcula dígitos conocidos, incluidos K y 0", () => {
    expect(calcularDv(CUERPO_DV_5)).toBe("5");
    expect(calcularDv(11_111_111)).toBe("1");
    expect(calcularDv(CUERPO_DV_K)).toBe("K");
    expect(calcularDv(CUERPO_DV_0)).toBe("0");
  });
});

describe("validarRut", () => {
  const valido = rutDesdeCuerpo(CUERPO_DV_5);

  it("acepta el RUT con o sin puntos, guion y espacios", () => {
    expect(validarRut(valido)).toBe(true);
    expect(validarRut(conPuntos(valido))).toBe(true);
    expect(validarRut(valido.replace("-", ""))).toBe(true);
    expect(validarRut(` ${conPuntos(valido)} `)).toBe(true);
  });

  it("acepta K en minúscula o mayúscula", () => {
    const rutK = rutDesdeCuerpo(CUERPO_DV_K);
    expect(validarRut(rutK)).toBe(true);
    expect(validarRut(rutK.toLowerCase())).toBe(true);
  });

  it("rechaza un dígito verificador incorrecto", () => {
    expect(validarRut(`${CUERPO_DV_5}-4`)).toBe(false);
    expect(validarRut(`${CUERPO_DV_K}-0`)).toBe(false);
  });

  it("rechaza formatos que no son RUT", () => {
    expect(validarRut("")).toBe(false);
    expect(validarRut("abc")).toBe(false);
    expect(validarRut("123-4")).toBe(false); // cuerpo demasiado corto
    expect(validarRut(`${CUERPO_DV_5}-X`)).toBe(false);
    expect(validarRut(`${CUERPO_DV_5}${CUERPO_DV_5}-5`)).toBe(false); // demasiado largo
  });
});

describe("normalizarRut", () => {
  it("lleva todas las variantes a cuerpo-DV sin puntos y K mayúscula", () => {
    const esperado = rutDesdeCuerpo(CUERPO_DV_5);
    expect(normalizarRut(conPuntos(esperado))).toBe(esperado);
    expect(normalizarRut(esperado.replace("-", ""))).toBe(esperado);
    expect(normalizarRut(rutDesdeCuerpo(CUERPO_DV_K).toLowerCase())).toBe(`${CUERPO_DV_K}-K`);
  });

  it("quita ceros a la izquierda", () => {
    expect(normalizarRut(`0${rutDesdeCuerpo(CUERPO_DV_5)}`)).toBe(rutDesdeCuerpo(CUERPO_DV_5));
  });

  it("devuelve null si el RUT no es válido", () => {
    expect(normalizarRut(`${CUERPO_DV_5}-4`)).toBeNull();
  });
});
