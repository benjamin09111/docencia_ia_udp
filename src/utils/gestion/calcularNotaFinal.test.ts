import { describe, expect, it } from "vitest";
import { calcularNotaFinal, type ConfiguracionCalculo, type EvaluacionCalculo } from "./calcularNotaFinal";

const configBase: ConfiguracionCalculo = {
  nota_minima: 1,
  nota_maxima: 7,
  nota_aprobacion: 4,
  nota_eximicion: null,
  nota_minima_examen: null,
  decimas_totales: null,
  notas_faltantes: "pendiente",
  restricciones: [],
};

const ev = (id: string, tipo: EvaluacionCalculo["tipo"], ponderacion: number, nombre = id): EvaluacionCalculo => ({
  id,
  nombre,
  tipo,
  ponderacion,
});

/** Curso simple sin examen: 30% / 30% / 40%. */
const SIMPLE = [ev("s1", "solemne", 30, "Solemne 1"), ev("s2", "solemne", 30, "Solemne 2"), ev("t", "tarea", 40, "Tarea")];

/** Curso demo: 2 solemnes 25%, 3 tareas 10%, examen 20%. */
const DEMO = [
  ev("s1", "solemne", 25, "Solemne 1"),
  ev("s2", "solemne", 25, "Solemne 2"),
  ev("t1", "tarea", 10, "Tarea 1"),
  ev("t2", "tarea", 10, "Tarea 2"),
  ev("t3", "tarea", 10, "Tarea 3"),
  ev("ex", "examen", 20, "Examen"),
];
const configDemo: ConfiguracionCalculo = { ...configBase, nota_eximicion: 5.5, decimas_totales: 0.5 };
const regularesDemo = (s1: number, s2: number, t: number) => ({ s1, s2, t1: t, t2: t, t3: t });

describe("ponderaciones normales", () => {
  it("promedia según la ponderación y aprueba con 4.0 o más", () => {
    const r = calcularNotaFinal({ config: configBase, evaluaciones: SIMPLE, notas: { s1: 5, s2: 6, t: 4 } });
    expect(r.nota_final).toBe(4.9); // 1.5 + 1.8 + 1.6
    expect(r.estado).toBe("Aprobado");
    expect(r.nota_presentacion).toBeNull(); // sin examen no se informa NP aparte
  });
});

describe("notas faltantes", () => {
  it("modo pendiente: la nota final queda vacía y se listan las faltantes", () => {
    const r = calcularNotaFinal({ config: configBase, evaluaciones: SIMPLE, notas: { s1: 5, s2: 6, t: null } });
    expect(r.nota_final).toBeNull();
    expect(r.estado).toBe("Pendiente");
    expect(r.faltantes).toEqual(["Tarea"]);
    expect(r.motivos[0]).toBe("Faltan notas: Tarea.");
  });

  it("modo nota mínima: la faltante cuenta como 1.0", () => {
    const config = { ...configBase, notas_faltantes: "nota_minima" as const };
    const r = calcularNotaFinal({ config, evaluaciones: SIMPLE, notas: { s1: 5, s2: 6 } });
    expect(r.nota_final).toBe(3.7); // 1.5 + 1.8 + 0.4
    expect(r.estado).toBe("Reprobado");
    expect(r.faltantes).toEqual([]);
    expect(r.motivos).toContain("Sin nota, cuentan como 1.0: Tarea.");
  });
});

describe("redondeo en el límite (estilo UDP)", () => {
  it("3.95 sube a 4.0 aunque la coma flotante dé 3.9499999…", () => {
    const notas = { s1: 1.4, s2: 4.3, t: 5.6 };
    const ingenuo = 1.4 * 0.3 + 4.3 * 0.3 + 5.6 * 0.4;
    expect(Math.round(ingenuo * 10) / 10).toBe(3.9); // el error que se evita
    const r = calcularNotaFinal({ config: configBase, evaluaciones: SIMPLE, notas });
    expect(r.nota_final).toBe(4);
    expect(r.estado).toBe("Aprobado");
  });

  it("3.94 baja a 3.9 y reprueba", () => {
    const r = calcularNotaFinal({ config: configBase, evaluaciones: SIMPLE, notas: { s1: 3.9, s2: 3.9, t: 4 } });
    expect(r.nota_final).toBe(3.9);
    expect(r.estado).toBe("Reprobado");
  });
});

describe("restricción: mínimo 4.0 en solemnes", () => {
  const restriccion = { tipo_evaluacion: "solemne" as const, nota_minima: 4, descripcion: "" };
  const notas = { ...regularesDemo(3.5, 4, 7), ex: 7 };

  it("criterio promedio: reprueba con motivo y NO cambia la nota final", () => {
    const config = { ...configDemo, restricciones: [{ ...restriccion, criterio: "promedio" as const }] };
    const r = calcularNotaFinal({ config, evaluaciones: DEMO, notas });
    expect(r.nota_presentacion).toBe(5); // (3.5·25 + 4·25 + 7·30) / 80 = 4.97
    expect(r.nota_final).toBe(5.4); // 5.0·0.8 + 7.0·0.2
    expect(r.estado).toBe("Reprobado");
    expect(r.motivos).toContain("Promedio de solemnes 3.8 < 4.0.");
  });

  it("criterio cada una: indica qué evaluación no cumple", () => {
    const config = { ...configDemo, restricciones: [{ ...restriccion, criterio: "cada_una" as const }] };
    const r = calcularNotaFinal({ config, evaluaciones: DEMO, notas });
    expect(r.estado).toBe("Reprobado");
    expect(r.motivos).toContain("Solemne 1: 3.5 < 4.0 (mínimo en cada una de las solemnes).");
  });

  it("si cumple la restricción, aprueba", () => {
    const config = { ...configDemo, restricciones: [{ ...restriccion, criterio: "promedio" as const }] };
    const r = calcularNotaFinal({ config, evaluaciones: DEMO, notas: { ...regularesDemo(4, 4.5, 5), ex: 5 } });
    expect(r.estado).toBe("Aprobado");
  });

  it("no se evalúa mientras falte una solemne", () => {
    const config = { ...configDemo, restricciones: [{ ...restriccion, criterio: "promedio" as const }] };
    const r = calcularNotaFinal({ config, evaluaciones: DEMO, notas: { s1: 2, t1: 5, t2: 5, t3: 5 } });
    expect(r.estado).toBe("Pendiente");
    expect(r.motivos.some((m) => m.startsWith("Promedio de solemnes"))).toBe(false);
  });
});

describe("examen y nota de presentación", () => {
  it("con NP sobre la nota de eximición no rinde examen y la NF es la NP", () => {
    const r = calcularNotaFinal({ config: configDemo, evaluaciones: DEMO, notas: regularesDemo(6, 6, 6) });
    expect(r.eximido).toBe(true);
    expect(r.nota_final).toBe(6);
    expect(r.faltantes).toEqual([]); // el examen no hace falta
    expect(r.estado).toBe("Aprobado");
  });

  it("combina NP y examen según la ponderación del examen", () => {
    const r = calcularNotaFinal({ config: configDemo, evaluaciones: DEMO, notas: { ...regularesDemo(4.5, 4.5, 4.5), ex: 3 } });
    expect(r.nota_presentacion).toBe(4.5);
    expect(r.nota_final).toBe(4.2); // 4.5·0.8 + 3.0·0.2
    expect(r.estado).toBe("Aprobado");
  });

  it("queda pendiente si falta el examen y no está eximido", () => {
    const r = calcularNotaFinal({ config: configDemo, evaluaciones: DEMO, notas: regularesDemo(4.5, 4.5, 4.5) });
    expect(r.estado).toBe("Pendiente");
    expect(r.faltantes).toEqual(["Examen"]);
  });

  it("bajo la nota mínima para rendir examen reprueba sin derecho a examen", () => {
    const config = { ...configDemo, nota_minima_examen: 3 };
    const r = calcularNotaFinal({ config, evaluaciones: DEMO, notas: regularesDemo(2.5, 2.5, 2.5) });
    expect(r.nota_final).toBe(2.5);
    expect(r.estado).toBe("Reprobado");
    expect(r.motivos).toContain("Sin derecho a examen (NP 2.5 < 3.0).");
  });
});

describe("décimas", () => {
  it("se suman a la nota final con tope de décimas totales", () => {
    const notas = { s1: 4.5, s2: 4.5, t: 4.5 };
    const config = { ...configBase, decimas_totales: 0.5 };
    const r = calcularNotaFinal({ config, evaluaciones: SIMPLE, notas, decimas: 0.8 });
    expect(r.decimas_aplicadas).toBe(0.5);
    expect(r.nota_final).toBe(5);
  });

  it("la nota final no supera la nota máxima", () => {
    const config = { ...configBase, decimas_totales: 0.5 };
    const r = calcularNotaFinal({ config, evaluaciones: SIMPLE, notas: { s1: 6.9, s2: 6.9, t: 6.9 }, decimas: 0.3 });
    expect(r.nota_final).toBe(7);
  });

  it("no se aplican si el curso no tiene décimas configuradas o la nota está pendiente", () => {
    const sinDecimas = calcularNotaFinal({ config: configBase, evaluaciones: SIMPLE, notas: { s1: 5, s2: 5, t: 5 }, decimas: 0.3 });
    expect(sinDecimas.nota_final).toBe(5);
    expect(sinDecimas.decimas_aplicadas).toBe(0);
    const config = { ...configBase, decimas_totales: 0.5 };
    const pendiente = calcularNotaFinal({ config, evaluaciones: SIMPLE, notas: { s1: 5 }, decimas: 0.3 });
    expect(pendiente.decimas_aplicadas).toBe(0);
  });
});
