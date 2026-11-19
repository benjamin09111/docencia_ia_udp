import { describe, expect, it } from "vitest";
import { cursoInputSchema, erroresPorCampo } from "./esquemasCurso";
import { guardarNotasSchema } from "./esquemasNotas";

/** Curso válido de referencia: 2 solemnes, 3 tareas y examen = 100%. */
function cursoBase() {
  return {
    nombre: "Arquitectura de Software (Demo)",
    codigo: "CIT3000",
    seccion: "2",
    semestre: "2026-2",
    docente_nombre: "Docente Demo",
    origen: "manual",
    programa_archivo: null,
    nota_minima: 1,
    nota_maxima: 7,
    nota_aprobacion: 4,
    exigencia_pct: 60,
    nota_eximicion: 5.5,
    nota_minima_examen: null,
    decimas_totales: 0.5,
    asistencia_minima_pct: 75,
    notas_faltantes: "pendiente",
    restricciones: [{ tipo_evaluacion: "solemne", nota_minima: 4, criterio: "promedio", descripcion: "" }],
    supuestos: ["Promedio de solemnes mínimo 4.0 para aprobar."],
    evaluaciones: [
      { nombre: "Solemne 1", tipo: "solemne", ponderacion: 25 },
      { nombre: "Solemne 2", tipo: "solemne", ponderacion: 25 },
      { nombre: "Tarea 1", tipo: "tarea", ponderacion: 10 },
      { nombre: "Tarea 2", tipo: "tarea", ponderacion: 10 },
      { nombre: "Tarea 3", tipo: "tarea", ponderacion: 10 },
      { nombre: "Examen", tipo: "examen", ponderacion: 20 },
    ],
  };
}

function errores(input: unknown) {
  const r = cursoInputSchema.safeParse(input);
  return r.success ? {} : erroresPorCampo(r.error);
}

describe("cursoInputSchema", () => {
  it("acepta un curso válido", () => {
    expect(cursoInputSchema.safeParse(cursoBase()).success).toBe(true);
  });

  it("rechaza ponderaciones que no suman 100 y dice cuánto suman", () => {
    const curso = cursoBase();
    curso.evaluaciones[0].ponderacion = 15;
    expect(errores(curso).evaluaciones).toBe("Las ponderaciones suman 90%; deben sumar 100%.");
  });

  it("rechaza más de un examen", () => {
    const curso = cursoBase();
    curso.evaluaciones[1].tipo = "examen";
    expect(errores(curso).evaluaciones).toBe("Solo puede haber un examen.");
  });

  it("rechaza una escala incoherente", () => {
    const curso = cursoBase();
    curso.nota_aprobacion = 7.5;
    expect(errores(curso).nota_aprobacion).toBeDefined();
    curso.nota_aprobacion = 1;
    expect(errores(curso).nota_aprobacion).toMatch(/nota mínima < nota de aprobación/);
  });

  it("rechaza ponderaciones con más de 2 decimales y cursos sin evaluaciones", () => {
    const curso = cursoBase();
    curso.evaluaciones[0].ponderacion = 25.001;
    expect(errores(curso)["evaluaciones.0.ponderacion"]).toBe("Usa como máximo 2 decimales.");
    expect(errores({ ...cursoBase(), evaluaciones: [] }).evaluaciones).toBe("Agrega al menos una evaluación.");
  });

  it("recorta espacios y exige nombre, código y semestre", () => {
    const r = cursoInputSchema.safeParse({ ...cursoBase(), nombre: "  Curso  " });
    expect(r.success && r.data.nombre).toBe("Curso");
    const e = errores({ ...cursoBase(), nombre: " ", codigo: "", semestre: "" });
    expect(Object.keys(e)).toEqual(expect.arrayContaining(["nombre", "codigo", "semestre"]));
  });
});

describe("guardarNotasSchema", () => {
  const id = () => crypto.randomUUID();

  it("acepta notas válidas y null para borrar", () => {
    const r = guardarNotasSchema.safeParse({
      notas: [
        { evaluacion_id: id(), alumno_id: id(), valor: 5.5 },
        { evaluacion_id: id(), alumno_id: id(), valor: null },
      ],
    });
    expect(r.success).toBe(true);
    expect(r.success && r.data.decimas).toEqual([]);
  });

  it("rechaza notas fuera de rango y décimas negativas", () => {
    expect(guardarNotasSchema.safeParse({ notas: [{ evaluacion_id: id(), alumno_id: id(), valor: 8 }] }).success).toBe(false);
    expect(guardarNotasSchema.safeParse({ decimas: [{ alumno_id: id(), decimas: -0.1 }] }).success).toBe(false);
  });
});
