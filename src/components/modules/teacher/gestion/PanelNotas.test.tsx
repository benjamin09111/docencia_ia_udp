// @vitest-environment happy-dom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { CursoConEvaluaciones } from "@/types/gestion";
import { PanelNotas } from "./PanelNotas";

const S1 = "e1000000-0000-4000-8000-000000000001";
const S2 = "e1000000-0000-4000-8000-000000000002";
const ANA = "a1000000-0000-4000-8000-000000000001";
const LUIS = "a1000000-0000-4000-8000-000000000002";

const curso = {
  id: "c1000000-0000-4000-8000-000000000001",
  nota_minima: 1,
  nota_maxima: 7,
  nota_aprobacion: 4,
  exigencia_pct: 60,
  nota_eximicion: null,
  nota_minima_examen: null,
  decimas_totales: 0.5,
  asistencia_minima_pct: null,
  notas_faltantes: "pendiente",
  restricciones: [],
  evaluaciones: [
    { id: S1, curso_id: "c", nombre: "Solemne 1", tipo: "solemne", ponderacion: 50, orden: 0 },
    { id: S2, curso_id: "c", nombre: "Solemne 2", tipo: "solemne", ponderacion: 50, orden: 1 },
  ],
} as unknown as CursoConEvaluaciones;

const alumno = (id: string, nombres: string, apellidos: string) => ({
  id, curso_id: curso.id, nombres, apellidos, rut: "-", correo: `${nombres}@mail.udp.test`, decimas: 0,
});

let puts: unknown[] = [];
let fallarPut = false;

beforeEach(() => {
  puts = [];
  fallarPut = false;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: string, init?: RequestInit) => {
      if (init?.method === "PUT") {
        puts.push(JSON.parse(String(init.body)));
        return fallarPut ? Response.json({ error: "Falla simulada." }, { status: 500 }) : Response.json({ ok: true });
      }
      return Response.json({
        alumnos: [alumno(ANA, "Ana", "Pérez"), alumno(LUIS, "Luis", "Soto")],
        notas: [
          { evaluacion_id: S1, alumno_id: ANA, valor: 5, origen: "manual" },
          { evaluacion_id: S1, alumno_id: LUIS, valor: 3.9, origen: "manual" },
          { evaluacion_id: S2, alumno_id: LUIS, valor: 4, origen: "manual" },
        ],
      });
    })
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const fila = (texto: string) => screen.getByText(texto).closest("tr")!;
const notaFinal = (texto: string) => within(fila(texto)).getAllByRole("cell").at(-2)!.textContent;

async function montar() {
  render(<PanelNotas curso={curso} onIrAAlumnos={() => {}} />);
  await screen.findByText("Pérez, Ana");
}

describe("PanelNotas", () => {
  it("muestra notas guardadas, la nota final calculada y los pendientes", async () => {
    await montar();
    expect(notaFinal("Soto, Luis")).toBe("4.0"); // 3.95 redondea a 4.0
    expect(within(fila("Soto, Luis")).getByText("Aprobado")).toBeTruthy();
    expect(notaFinal("Pérez, Ana")).toBe("Pendiente");
  });

  it("recalcula la nota final mientras se escribe y guarda al salir de la celda", async () => {
    await montar();
    const celda = screen.getByLabelText("Solemne 2 de Ana Pérez");
    fireEvent.focus(celda);
    fireEvent.change(celda, { target: { value: "6" } });
    expect(notaFinal("Pérez, Ana")).toBe("5.5"); // en vivo, aún sin guardar
    expect(puts).toHaveLength(0);
    fireEvent.blur(celda);
    await waitFor(() => expect(puts).toHaveLength(1));
    expect(puts[0]).toEqual({ notas: [{ evaluacion_id: S2, alumno_id: ANA, valor: 6 }], decimas: [] });
    expect((celda as HTMLInputElement).value).toBe("6.0");
  });

  it("rechaza notas fuera de rango sin guardarlas y avisa", async () => {
    await montar();
    const celda = screen.getByLabelText("Solemne 1 de Ana Pérez");
    fireEvent.focus(celda);
    fireEvent.change(celda, { target: { value: "8" } });
    expect(celda.getAttribute("aria-invalid")).toBe("true");
    fireEvent.blur(celda);
    expect(await screen.findByText(/no es válido en Solemne 1 de Ana Pérez/)).toBeTruthy();
    expect((celda as HTMLInputElement).value).toBe("5.0");
    expect(puts).toHaveLength(0);
  });

  it("Escape deshace lo escrito sin guardar", async () => {
    await montar();
    const celda = screen.getByLabelText("Solemne 1 de Ana Pérez");
    fireEvent.focus(celda);
    fireEvent.change(celda, { target: { value: "2" } });
    fireEvent.keyDown(celda, { key: "Escape" });
    fireEvent.blur(celda);
    expect((celda as HTMLInputElement).value).toBe("5.0");
    expect(puts).toHaveLength(0);
  });

  it("en modo simulación recalcula sin guardar y al salir vuelve a lo guardado", async () => {
    await montar();
    fireEvent.click(screen.getByRole("button", { name: "Simular escenarios" }));
    const celda = screen.getByLabelText("Solemne 1 de Luis Soto");
    fireEvent.focus(celda);
    fireEvent.change(celda, { target: { value: "1" } });
    fireEvent.blur(celda);
    expect(notaFinal("Soto, Luis")).toBe("2.5");
    expect(within(fila("Soto, Luis")).getByText("Reprobado")).toBeTruthy();
    expect(puts).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Salir de simulación" }));
    expect(notaFinal("Soto, Luis")).toBe("4.0");
  });

  it("si el guardado falla, revierte la nota y muestra el error", async () => {
    await montar();
    fallarPut = true;
    const celda = screen.getByLabelText("Solemne 2 de Ana Pérez");
    fireEvent.focus(celda);
    fireEvent.change(celda, { target: { value: "6" } });
    fireEvent.blur(celda);
    expect(await screen.findByText(/No se guardó el último cambio: Falla simulada/)).toBeTruthy();
    await waitFor(() => expect((celda as HTMLInputElement).value).toBe(""));
    expect(notaFinal("Pérez, Ana")).toBe("Pendiente");
  });
});
