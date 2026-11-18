import { describe, expect, it } from "vitest";
import type { CursoConEvaluaciones } from "@/types/gestion";
import { borradorDesdeCurso, borradorVacio, semestreActual, validarBorrador, type CursoBorrador } from "./borradorCurso";

function borradorCompleto(): CursoBorrador {
  const b = borradorVacio();
  return {
    ...b,
    nombre: "Arquitectura de Software (Demo)",
    codigo: "CIT3000",
    seccion: "2",
    semestre: "2026-2",
    docente_nombre: "  ",
    supuestos: ["  Promedio de solemnes ≥ 4.0  ", ""],
    evaluaciones: [
      { clave: "a", nombre: "Solemne 1", tipo: "solemne", ponderacion: 60 },
      { clave: "b", nombre: "Tarea 1", tipo: "tarea", ponderacion: 40 },
    ],
  };
}

describe("borradorVacio", () => {
  it("parte con la escala UDP y no es válido hasta completar los datos", () => {
    const b = borradorVacio();
    expect([b.nota_minima, b.nota_maxima, b.nota_aprobacion, b.exigencia_pct]).toEqual([1, 7, 4, 60]);
    const r = validarBorrador(b);
    expect(r.ok).toBe(false);
    expect(Object.keys(r.errores)).toEqual(
      expect.arrayContaining(["nombre", "codigo", "evaluaciones.0.nombre", "evaluaciones.0.ponderacion"])
    );
  });
});

describe("validarBorrador", () => {
  it("convierte un borrador completo en el input que guarda el servidor", () => {
    const r = validarBorrador(borradorCompleto());
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.input.docente_nombre).toBeNull(); // vacío → null
    expect(r.input.supuestos).toEqual(["Promedio de solemnes ≥ 4.0"]); // recortado y sin líneas vacías
    expect(r.input.evaluaciones[0]).not.toHaveProperty("clave");
  });

  it("indica el campo vacío de una nota obligatoria", () => {
    const r = validarBorrador({ ...borradorCompleto(), nota_aprobacion: null });
    expect(r.ok).toBe(false);
    expect(r.errores.nota_aprobacion).toBe("Ingresa una nota.");
  });

  it("bloquea si las ponderaciones no suman 100", () => {
    const b = borradorCompleto();
    b.evaluaciones[1].ponderacion = 30;
    expect(validarBorrador(b).errores.evaluaciones).toBe("Las ponderaciones suman 90%; deben sumar 100%.");
  });
});

describe("borradorDesdeCurso", () => {
  it("conserva ids de evaluaciones para no perder notas al editar", () => {
    const id = crypto.randomUUID();
    const curso = {
      id: crypto.randomUUID(),
      owner_user_id: "usr_docente_1",
      nombre: "Curso",
      codigo: "CIT3000",
      seccion: "2",
      semestre: "2026-2",
      docente_nombre: null,
      origen: "manual",
      programa_archivo: null,
      nota_minima: 1,
      nota_maxima: 7,
      nota_aprobacion: 4,
      exigencia_pct: 60,
      nota_eximicion: null,
      nota_minima_examen: null,
      decimas_totales: 0.5,
      asistencia_minima_pct: 75,
      notas_faltantes: "pendiente",
      restricciones: [],
      supuestos: [],
      created_at: "",
      updated_at: "",
      evaluaciones: [{ id, curso_id: "c", nombre: "Solemne", tipo: "solemne", ponderacion: 100, orden: 0 }],
    } as CursoConEvaluaciones;
    const r = validarBorrador(borradorDesdeCurso(curso));
    expect(r.ok).toBe(true);
    expect(r.ok && r.input.evaluaciones[0].id).toBe(id);
    expect(r.ok && r.input.decimas_totales).toBe(0.5);
  });
});

describe("semestreActual", () => {
  it("usa el calendario académico chileno", () => {
    expect(semestreActual(new Date(2026, 3, 10))).toBe("2026-1");
    expect(semestreActual(new Date(2026, 10, 18))).toBe("2026-2");
    expect(semestreActual(new Date(2027, 0, 15))).toBe("2026-2");
  });
});
