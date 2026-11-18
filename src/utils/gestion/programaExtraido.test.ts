import { describe, expect, it } from "vitest";
import { borradorDesdeProgramaExtraido, parsearRespuestaIa } from "./programaExtraido";
import { validarBorrador } from "./borradorCurso";
import { RESPUESTA_DEMO } from "./__fixtures__/respuestaIaDemo";

describe("parsearRespuestaIa", () => {
  it("acepta JSON puro o envuelto en ```json", () => {
    expect(parsearRespuestaIa(JSON.stringify(RESPUESTA_DEMO)).ok).toBe(true);
    expect(parsearRespuestaIa("```json\n" + JSON.stringify(RESPUESTA_DEMO) + "\n```").ok).toBe(true);
  });

  it("normaliza tipos con mayúsculas o tildes y lleva lo desconocido a 'otro'", () => {
    const r = parsearRespuestaIa(
      JSON.stringify({
        ...RESPUESTA_DEMO,
        evaluaciones: [
          { nombre: "Presentación final", tipo: "Presentación", ponderacion_total: 60, cantidad: 1 },
          { nombre: "Bitácora", tipo: "bitacora", ponderacion_total: 40, cantidad: 1 },
        ],
      })
    );
    expect(r.ok && r.datos.evaluaciones.map((e) => e.tipo)).toEqual(["presentacion", "otro"]);
  });

  it("tolera números como texto y secciones opcionales ausentes (típico de modelos abiertos)", () => {
    const r = parsearRespuestaIa(
      JSON.stringify({
        curso: { nombre: "Curso", codigo: "CIT3000" },
        evaluaciones: [
          { nombre: "Solemne", tipo: "solemne", ponderacion_total: "62,5%", cantidad: "2" },
          { nombre: "Examen", tipo: "examen", ponderacion_total: "37.5" },
        ],
        escala: { nota_minima: "1,0", nota_maxima: 7, nota_aprobacion: "4", exigencia_pct: "60%" },
      })
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.datos.evaluaciones.map((e) => [e.ponderacion_total, e.cantidad])).toEqual([[62.5, 2], [37.5, 1]]);
    expect(r.datos.escala).toEqual({ nota_minima: 1, nota_maxima: 7, nota_aprobacion: 4, exigencia_pct: 60 });
    expect(r.datos.curso.seccion).toBeNull();
    expect([r.datos.examen, r.datos.decimas_totales, r.datos.restricciones, r.datos.supuestos]).toEqual([null, null, [], []]);
  });

  it("rechaza texto sin JSON, JSON roto o tipos incorrectos con un mensaje útil", () => {
    expect(parsearRespuestaIa("No pude leer el programa.")).toEqual({ ok: false, error: "La respuesta no contiene un objeto JSON." });
    expect(parsearRespuestaIa("{ curso: 1 ")).toMatchObject({ ok: false });
    const r = parsearRespuestaIa(JSON.stringify({ ...RESPUESTA_DEMO, decimas_totales: "5 décimas" }));
    expect(r.ok).toBe(false);
    expect(!r.ok && r.error).toContain("decimas_totales");
  });
});

describe("borradorDesdeProgramaExtraido", () => {
  const r = parsearRespuestaIa(JSON.stringify(RESPUESTA_DEMO));
  if (!r.ok) throw new Error(r.error);
  const borrador = borradorDesdeProgramaExtraido(r.datos, "programa-demo.pdf");

  it("expande evaluaciones por cantidad repartiendo la ponderación", () => {
    expect(borrador.evaluaciones.map((e) => [e.nombre, e.tipo, e.ponderacion])).toEqual([
      ["Solemne 1", "solemne", 25],
      ["Solemne 2", "solemne", 25],
      ["Tarea 1", "tarea", 10],
      ["Tarea 2", "tarea", 10],
      ["Tarea 3", "tarea", 10],
      ["Examen", "examen", 20],
    ]);
  });

  it("copia escala, examen, décimas, restricciones y supuestos, y marca el origen PDF", () => {
    expect(borrador).toMatchObject({
      nombre: "Arquitectura de Software",
      codigo: "CIT3000",
      origen: "pdf",
      programa_archivo: "programa-demo.pdf",
      nota_eximicion: 5.5,
      decimas_totales: 0.5,
      asistencia_minima_pct: 75,
    });
    expect(borrador.restricciones[0]).toMatchObject({ tipo_evaluacion: "solemne", nota_minima: 4, criterio: "promedio" });
  });

  it("el borrador resultante es válido para guardar", () => {
    expect(validarBorrador(borrador).ok).toBe(true);
  });

  it("usa la escala UDP por defecto si el programa no la indica", () => {
    const sinEscala = borradorDesdeProgramaExtraido(
      { ...r.datos, escala: { nota_minima: null, nota_maxima: null, nota_aprobacion: null, exigencia_pct: null } },
      null
    );
    expect([sinEscala.nota_minima, sinEscala.nota_maxima, sinEscala.nota_aprobacion, sinEscala.exigencia_pct]).toEqual([1, 7, 4, 60]);
  });
});
