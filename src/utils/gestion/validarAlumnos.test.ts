import { describe, expect, it } from "vitest";
import { validarFilasAlumnos, type FilaAlumnoCruda } from "./validarAlumnos";
import { rutDesdeCuerpo } from "./rut";

// RUT armados en tiempo de ejecución (el escáner de datos personales marca los literales).
const RUT_A = rutDesdeCuerpo(20_111_222);
const RUT_B = rutDesdeCuerpo(19_333_444);
const conPuntos = (rut: string) => rut.replace(/^(\d{1,2})(\d{3})(\d{3})/, "$1.$2.$3");
const rutMalo = (rut: string) => `${rut.slice(0, -1)}${rut.endsWith("1") ? "2" : "1"}`;

const fila = (n: number, cambios: Partial<FilaAlumnoCruda> = {}): FilaAlumnoCruda => ({
  fila: n,
  nombres: "Ana",
  apellidos: "Pérez",
  rut: RUT_A,
  correo: "ana.perez@mail.udp.test",
  ...cambios,
});

describe("validarFilasAlumnos", () => {
  it("normaliza RUT, correo y espacios de una fila válida", () => {
    const [r] = validarFilasAlumnos([fila(2, { rut: ` ${conPuntos(RUT_A)} `, correo: " Ana.Perez@MAIL.udp.test ", nombres: "  Ana   María " })]);
    expect(r.valida).toBe(true);
    expect(r.datos).toEqual({ nombres: "Ana María", apellidos: "Pérez", rut: RUT_A, correo: "ana.perez@mail.udp.test" });
  });

  it("marca RUT con dígito verificador incorrecto", () => {
    const [r] = validarFilasAlumnos([fila(2, { rut: rutMalo(RUT_A) })]);
    expect(r.valida).toBe(false);
    expect(r.errores).toContain("RUT inválido (dígito verificador incorrecto).");
  });

  it("marca correos inválidos y campos vacíos", () => {
    const [r] = validarFilasAlumnos([fila(2, { correo: "ana@", nombres: "", apellidos: " " })]);
    expect(r.errores).toEqual(["Faltan los nombres.", "Faltan los apellidos.", "Correo inválido."]);
  });

  it("marca todas las filas con RUT o correo duplicado dentro del archivo", () => {
    const r = validarFilasAlumnos([
      fila(2),
      fila(3, { rut: conPuntos(RUT_A), correo: "otro@mail.udp.test" }),
      fila(4, { rut: RUT_B, correo: "ANA.PEREZ@mail.udp.test" }),
    ]);
    expect(r[0].errores).toEqual([
      "RUT duplicado en el archivo (filas 2, 3).",
      "Correo duplicado en el archivo (filas 2, 4).",
    ]);
    expect(r[1].errores).toEqual(["RUT duplicado en el archivo (filas 2, 3)."]);
    expect(r[2].errores).toEqual(["Correo duplicado en el archivo (filas 2, 4)."]);
  });

  it("marca alumnos que ya están en el curso", () => {
    const existentes = [{ rut: RUT_A, correo: "x@mail.udp.test" }, { rut: RUT_B, correo: "ana.perez@mail.udp.test" }];
    const [r] = validarFilasAlumnos([fila(2)], existentes);
    expect(r.errores).toEqual(["El RUT ya está en el curso.", "El correo ya está en el curso."]);
  });
});
