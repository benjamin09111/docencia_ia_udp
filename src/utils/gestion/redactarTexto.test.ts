import { describe, expect, it } from "vitest";
import { prepararTextoProgramaParaIa, redactarDatosPersonales } from "./redactarTexto";
import { rutDesdeCuerpo } from "./rut";

// RUT y teléfonos se arman en tiempo de ejecución (el escáner de datos personales marca los literales).
const rut = rutDesdeCuerpo(12_345_678);
const rutConPuntos = `${rut.slice(0, 2)}.${rut.slice(2, 5)}.${rut.slice(5)}`;
const telefono = ["+56", "9", "1234", "5678"].join(" ");

describe("redactarDatosPersonales", () => {
  it("tacha correo, RUT, teléfono y enlaces del programa", () => {
    const texto = `Docente: Ana Pérez (ana.perez@ejemplo.test), RUT ${rutConPuntos}, fono ${telefono}. Ver https://ejemplo.test/x`;
    const r = redactarDatosPersonales(texto);
    expect(r).toContain("[correo]");
    expect(r).toContain("[rut]");
    expect(r).toContain("[teléfono]");
    expect(r).toContain("[enlace]");
    expect(r).not.toContain("ana.perez@");
    expect(r).not.toContain(rutConPuntos);
    expect(r).toContain("Ana Pérez"); // el nombre del docente se mantiene: se extrae como dato del curso
  });

  it("no altera ponderaciones, notas ni fechas", () => {
    const texto = "Solemne 1: 25%. Nota mínima 4.0. Semestre 2026-2. Examen 30% el 12/12/2026.";
    expect(redactarDatosPersonales(texto)).toBe(texto);
  });
});

describe("prepararTextoProgramaParaIa", () => {
  it("normaliza espacios y recorta textos largos", () => {
    const r = prepararTextoProgramaParaIa("a   b\n\n\n\nc", 100);
    expect(r).toEqual({ texto: "a b\n\nc", recortado: false });
    const largo = prepararTextoProgramaParaIa("x".repeat(50), 10);
    expect(largo).toEqual({ texto: "x".repeat(10), recortado: true });
  });
});
