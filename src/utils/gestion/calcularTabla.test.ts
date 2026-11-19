import { describe, expect, it } from "vitest";
import { agruparNotas, calcularTabla, resumirTabla } from "./calcularTabla";
import type { ConfiguracionCalculo } from "./calcularNotaFinal";
import { formatearNota, promedioPonderado, redondearUnDecimal } from "./redondeo";

const config: ConfiguracionCalculo = {
  nota_minima: 1,
  nota_maxima: 7,
  nota_aprobacion: 4,
  nota_eximicion: null,
  nota_minima_examen: null,
  decimas_totales: 0.5,
  notas_faltantes: "pendiente",
  restricciones: [],
};

const evaluaciones = [
  { id: "e1", nombre: "Solemne 1", tipo: "solemne" as const, ponderacion: 50 },
  { id: "e2", nombre: "Solemne 2", tipo: "solemne" as const, ponderacion: 50 },
];

describe("calcularTabla", () => {
  const alumnos = [
    { id: "a1", decimas: 0 },
    { id: "a2", decimas: 0.2 },
    { id: "a3", decimas: 0 },
  ];
  const notas = agruparNotas([
    { alumno_id: "a1", evaluacion_id: "e1", valor: 5 },
    { alumno_id: "a1", evaluacion_id: "e2", valor: 6 },
    { alumno_id: "a2", evaluacion_id: "e1", valor: 3 },
    { alumno_id: "a2", evaluacion_id: "e2", valor: 4 },
    { alumno_id: "a3", evaluacion_id: "e1", valor: 6 },
  ]);

  it("calcula a cada alumno con sus notas y décimas", () => {
    const tabla = calcularTabla(config, evaluaciones, alumnos, notas);
    expect(tabla.a1.nota_final).toBe(5.5);
    expect(tabla.a2.nota_final).toBe(3.7); // 3.5 + 0.2 décimas
    expect(tabla.a2.estado).toBe("Reprobado");
    expect(tabla.a3.estado).toBe("Pendiente");
  });

  it("resume aprobados, reprobados, pendientes y promedio", () => {
    const resumen = resumirTabla(calcularTabla(config, evaluaciones, alumnos, notas));
    expect(resumen).toEqual({ total: 3, aprobados: 1, reprobados: 1, pendientes: 1, promedio: 4.6 });
  });

  it("un alumno sin notas queda pendiente", () => {
    const tabla = calcularTabla(config, evaluaciones, [{ id: "nuevo", decimas: 0 }], {});
    expect(tabla.nuevo.estado).toBe("Pendiente");
    expect(tabla.nuevo.faltantes).toEqual(["Solemne 1", "Solemne 2"]);
  });
});

describe("redondeo", () => {
  it("promedioPonderado re-normaliza pesos y redondea half-up", () => {
    expect(promedioPonderado([{ nota: 3.9, ponderacion: 1 }, { nota: 4, ponderacion: 1 }])).toBe(4);
    expect(promedioPonderado([])).toBeNull();
  });

  it("redondearUnDecimal corrige errores de coma flotante", () => {
    expect(redondearUnDecimal(1.4 * 0.3 + 4.3 * 0.3 + 5.6 * 0.4)).toBe(4);
    expect(redondearUnDecimal(3.94)).toBe(3.9);
  });

  it("formatearNota muestra un decimal o un guion", () => {
    expect(formatearNota(4)).toBe("4.0");
    expect(formatearNota(null)).toBe("—");
  });
});
