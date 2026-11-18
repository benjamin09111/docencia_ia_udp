import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import type { Alumno, CursoConEvaluaciones } from "@/types/gestion";
import { construirActaExcel, nombreArchivoActa } from "./actaExcel";
import { agruparNotas, calcularTabla } from "./calcularTabla";
import { rutDesdeCuerpo } from "./rut";

const curso = {
  id: "c1",
  nombre: "Arquitectura de Software (Demo)",
  codigo: "CIT3000",
  seccion: "2",
  semestre: "2026-2",
  docente_nombre: "Docente Demo",
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
  evaluaciones: [
    { id: "s1", curso_id: "c1", nombre: "Solemne 1", tipo: "solemne", ponderacion: 60, orden: 0 },
    { id: "t1", curso_id: "c1", nombre: "Tarea 1", tipo: "tarea", ponderacion: 40, orden: 1 },
  ],
} as unknown as CursoConEvaluaciones;

const alumno = (id: string, nombres: string, apellidos: string, cuerpo: number, decimas = 0): Alumno => ({
  id, curso_id: "c1", nombres, apellidos, rut: rutDesdeCuerpo(cuerpo), correo: `${id}@mail.udp.test`, decimas,
});

const alumnos = [alumno("a1", "Ana", "Pérez", 20_111_222, 0.3), alumno("a2", "Luis", "Soto", 19_333_444), alumno("a3", "Eva", "Rojas", 18_555_666)];
const notas = agruparNotas([
  { alumno_id: "a1", evaluacion_id: "s1", valor: 5 },
  { alumno_id: "a1", evaluacion_id: "t1", valor: 6 },
  { alumno_id: "a2", evaluacion_id: "s1", valor: 3 },
  { alumno_id: "a2", evaluacion_id: "t1", valor: 3.5 },
  { alumno_id: "a3", evaluacion_id: "s1", valor: 6 },
]);
const resultados = calcularTabla(curso, curso.evaluaciones, alumnos, notas);

async function leerActa() {
  const buffer = await construirActaExcel({ curso, alumnos, notas, resultados, fecha: new Date(2026, 10, 18) });
  const libro = new ExcelJS.Workbook();
  await libro.xlsx.load(buffer);
  return libro.getWorksheet("Acta")!;
}

describe("acta Excel", () => {
  it("incluye el encabezado del curso", async () => {
    const hoja = await leerActa();
    expect(hoja.getCell("A1").text).toBe("Universidad Diego Portales — Acta de calificaciones");
    const datos = Object.fromEntries([2, 3, 4, 5, 6, 7].map((n) => [hoja.getCell(n, 1).text, hoja.getCell(n, 2).text]));
    expect(datos).toMatchObject({ Curso: curso.nombre, Código: "CIT3000", Sección: "2", Semestre: "2026-2", "Fecha de emisión": "18-11-2026" });
  });

  it("tiene las columnas oficiales y una fila por alumno con nota final y estado", async () => {
    const hoja = await leerActa();
    const encabezado = (hoja.getRow(9).values as unknown[]).slice(1);
    expect(encabezado).toEqual(["Nombres", "Apellidos", "RUT", "Correo", "Solemne 1 (60%)", "Tarea 1 (40%)", "Nota final", "Aprobado/No aprobado"]);

    const fila = (n: number) => (hoja.getRow(n).values as unknown[]).slice(1);
    expect(fila(10)).toEqual(["Ana", "Pérez", alumnos[0].rut, "a1@mail.udp.test", 5, 6, 5.7, "Aprobado"]); // 5.4 + 0.3 décimas
    expect(fila(11).slice(4)).toEqual([3, 3.5, 3.2, "No aprobado"]);
    expect(fila(12).slice(4, 6)).toEqual([6, undefined]); // nota faltante: celda vacía
    expect(fila(12)[7]).toBe("Pendiente");
  });

  it("aplica formato de un decimal, panel fijo y pie con las reglas", async () => {
    const hoja = await leerActa();
    expect(hoja.getCell(10, 5).numFmt).toBe("0.0");
    expect(hoja.views[0]).toMatchObject({ state: "frozen", ySplit: 9 });
    expect(hoja.getCell(14, 1).text).toMatch(/Escala 1\.0–7\.0 · aprobación 4\.0 · exigencia 60%/);
  });

  it("arma un nombre de archivo seguro", () => {
    expect(nombreArchivoActa(curso)).toBe("Acta_CIT3000_S2_2026-2.xlsx");
    expect(nombreArchivoActa({ codigo: "Gestión Org", seccion: "", semestre: "2026-1" })).toBe("Acta_Gestion_Org_2026-1.xlsx");
  });
});
