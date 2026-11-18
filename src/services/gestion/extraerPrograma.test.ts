import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { ErrorIa, type MensajeChat } from "@/lib/server/aiClient";
import { rellenarPrompt } from "@/lib/server/prompts";
import { TIPOS_EVALUACION } from "@/types/gestion";
import { RESPUESTA_DEMO } from "@/utils/gestion/__fixtures__/respuestaIaDemo";
import { extraerProgramaConIa } from "./extraerPrograma";

const leerPrompt = (nombre: string) => readFileSync(path.join(process.cwd(), "prompts", nombre), "utf8");
const PROMPTS = { sistema: leerPrompt("extraer-programa.system.md"), corregir: leerPrompt("extraer-programa.corregir.md") };
const TEXTO = "Programa Arquitectura de Software. Contacto: docente@ejemplo.test. Solemne 1 25% ...";

describe("extraerProgramaConIa", () => {
  it("con una respuesta válida pre-rellena el borrador en un solo intento", async () => {
    const cliente = vi.fn(async () => JSON.stringify(RESPUESTA_DEMO));
    const r = await extraerProgramaConIa(TEXTO, "programa.pdf", cliente, PROMPTS);
    expect(r.fuente).toBe("ia");
    expect(cliente).toHaveBeenCalledTimes(1);
    expect(r.fuente === "ia" && r.avisos).toEqual([]);
  });

  it("envía el texto como dato delimitado y con el correo tachado", async () => {
    const cliente = vi.fn(async (_m: MensajeChat[]) => JSON.stringify(RESPUESTA_DEMO));
    await extraerProgramaConIa(TEXTO, null, cliente, PROMPTS);
    const usuario = cliente.mock.calls[0][0][1].content;
    expect(usuario.startsWith("<programa>")).toBe(true);
    expect(usuario).toContain("[correo]");
    expect(usuario).not.toContain("docente@ejemplo.test");
  });

  it("si la primera respuesta no es válida, reintenta una vez con los errores", async () => {
    const cliente = vi
      .fn<(m: MensajeChat[]) => Promise<string>>()
      .mockResolvedValueOnce("Claro, aquí va el resumen del programa…")
      .mockResolvedValueOnce(JSON.stringify(RESPUESTA_DEMO));
    const r = await extraerProgramaConIa(TEXTO, null, cliente, PROMPTS);
    expect(r.fuente).toBe("ia");
    expect(cliente).toHaveBeenCalledTimes(2);
    const segundo = cliente.mock.calls[1][0];
    expect(segundo.at(-1)?.content).toContain("La respuesta no contiene un objeto JSON.");
  });

  it("si falla dos veces, devuelve el formulario vacío con el motivo", async () => {
    const cliente = vi.fn(async () => "{}");
    const r = await extraerProgramaConIa(TEXTO, null, cliente, PROMPTS);
    expect(cliente).toHaveBeenCalledTimes(2);
    expect(r.fuente).toBe("vacio");
    expect(r.fuente === "vacio" && r.motivo).toMatch(/Completa el formulario a mano/);
    expect(r.borrador.nombre).toBe("");
  });

  it("si el proveedor no responde, no reintenta y explica el motivo", async () => {
    const cliente = vi.fn(async () => {
      throw new ErrorIa("timeout", "sin respuesta");
    });
    const r = await extraerProgramaConIa(TEXTO, null, cliente, PROMPTS);
    expect(cliente).toHaveBeenCalledTimes(1);
    expect(r.fuente === "vacio" && r.motivo).toMatch(/tardó demasiado/);
  });

  it("avisa cuando las ponderaciones extraídas no suman 100", async () => {
    const respuesta = { ...RESPUESTA_DEMO, evaluaciones: RESPUESTA_DEMO.evaluaciones.slice(0, 2) };
    const r = await extraerProgramaConIa(TEXTO, null, async () => JSON.stringify(respuesta), PROMPTS);
    expect(r.fuente === "ia" && r.avisos[0]).toMatch(/suman 80%/);
  });
});

describe("prompts", () => {
  it("el prompt de sistema lista todos los tipos de evaluación del código", () => {
    for (const tipo of TIPOS_EVALUACION) expect(PROMPTS.sistema).toContain(`"${tipo}"`);
  });

  it("la plantilla de corrección inserta los errores", () => {
    expect(rellenarPrompt(PROMPTS.corregir, { errores: "curso: falta" })).toContain("curso: falta");
    expect(rellenarPrompt(PROMPTS.corregir, { errores: "x" })).not.toContain("{{errores}}");
  });
});
