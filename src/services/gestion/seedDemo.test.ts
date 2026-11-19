import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ALUMNOS, CURSO_SEED, EVALUACIONES } from "../../../seed/modulo1/datos-demo.mjs";
import { calcularNotaFinal, type ConfiguracionCalculo } from "@/utils/gestion/calcularNotaFinal";
import { leerExcelAlumnos } from "@/utils/gestion/excelAlumnos";
import { validarFilasAlumnos } from "@/utils/gestion/validarAlumnos";
import { cursoInputSchema } from "@/utils/gestion/esquemasCurso";
import type { TipoEvaluacion } from "@/types/gestion";
import { extraerTextoPdf } from "./extraerPrograma";

/** Verifica que los archivos y datos de la demo (seed/modulo1) sigan coherentes con el código. */

const archivo = (nombre: string) => readFileSync(path.join(process.cwd(), "seed", "modulo1", nombre));
const comoArrayBuffer = (b: Buffer) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;

describe("archivos de la demo", () => {
  it("el PDF del programa tiene texto legible con el sistema de evaluación", async () => {
    const texto = await extraerTextoPdf(new Uint8Array(archivo("programa-demo.pdf")));
    expect(texto).toContain("Arquitectura de Software (CIT3000) - Sección 2");
    expect(texto).toContain("NF = 80% Nota de Presentación (NP) + 20% Examen");
    expect(texto).toContain("Eximición");
  });

  it("alumnos-demo.xlsx trae 10 alumnos válidos", async () => {
    const filas = await leerExcelAlumnos(comoArrayBuffer(archivo("alumnos-demo.xlsx")));
    const validadas = validarFilasAlumnos(filas);
    expect(validadas).toHaveLength(10);
    expect(validadas.every((f) => f.valida)).toBe(true);
  });

  it("alumnos-con-errores.xlsx marca los errores esperados y deja 1 fila válida", async () => {
    const filas = validarFilasAlumnos(await leerExcelAlumnos(comoArrayBuffer(archivo("alumnos-con-errores.xlsx"))));
    expect(filas.map((f) => f.errores[0] ?? "ok")).toEqual([
      "RUT inválido (dígito verificador incorrecto).",
      "Correo inválido.",
      "RUT duplicado en el archivo (filas 4, 5).",
      "RUT duplicado en el archivo (filas 4, 5).",
      "Faltan los nombres.",
      "ok",
    ]);
  });
});

describe("curso demo del seed", () => {
  // datos-demo.mjs es JavaScript: sus literales se infieren como string y no como los tipos del dominio.
  const config = CURSO_SEED as unknown as ConfiguracionCalculo;
  const evaluaciones = EVALUACIONES.map((e, i) => ({ ...e, id: `e${i}`, tipo: e.tipo as TipoEvaluacion }));
  const calcular = (i: number) =>
    calcularNotaFinal({
      config,
      evaluaciones,
      notas: Object.fromEntries(ALUMNOS[i].notas.map((n, j) => [`e${j}`, n])),
      decimas: ALUMNOS[i].decimas,
    });

  it("la configuración del curso es válida para guardar", () => {
    expect(cursoInputSchema.safeParse({ ...CURSO_SEED, evaluaciones: EVALUACIONES }).success).toBe(true);
  });

  it("cada alumno muestra el caso que describe", () => {
    const casos = ALUMNOS.map((_, i) => {
      const r = calcular(i);
      return [r.nota_presentacion, r.nota_final, r.estado];
    });
    expect(casos).toEqual([
      [6.4, 6.4, "Aprobado"], // eximida
      [5, 5, "Aprobado"], // aprueba con examen
      [4.8, 5, "Reprobado"], // nota 5.0 pero promedio de solemnes 3.5
      [null, null, "Pendiente"], // falta Tarea 3 y Examen
      [4, 4, "Aprobado"], // NP exacta 3.95 → 4.0
      [3, 3, "Reprobado"],
      [4.2, 4.4, "Aprobado"], // 4.1 + 0.3 décimas
      [5.7, 5.7, "Aprobado"], // eximido
      [4.9, 5.1, "Aprobado"], // 4.9 + 0.2 décimas
      [4.5, null, "Pendiente"], // debe rendir examen
    ]);
    expect(calcular(2).motivos).toContain("Promedio de solemnes 3.5 < 4.0.");
  });
});
