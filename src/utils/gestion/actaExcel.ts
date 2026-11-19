import ExcelJS from "exceljs";
import type { Alumno, CursoConEvaluaciones } from "@/types/gestion";
import type { EstadoAlumno, ResultadoCalculo } from "./calcularNotaFinal";
import type { NotasPorAlumno } from "./calcularTabla";
import { nombreArchivoSeguro } from "./descargarArchivo";
import { formatearNota } from "./redondeo";

/**
 * Acta oficial de calificaciones en Excel (.xlsx), con exceljs.
 * Encabezado del curso + columnas: Nombres, Apellidos, RUT, Correo, una por evaluación,
 * Nota final y Aprobado/No aprobado. Función pura: recibe los datos ya calculados.
 */

export interface DatosActa {
  curso: CursoConEvaluaciones;
  alumnos: Alumno[];
  notas: NotasPorAlumno;
  resultados: Record<string, ResultadoCalculo>;
  fecha?: Date;
}

export const ETIQUETA_ESTADO_ACTA: Record<EstadoAlumno, string> = {
  Aprobado: "Aprobado",
  Reprobado: "No aprobado",
  Pendiente: "Pendiente",
};

const ROJO_UDP = "FFB71C1C";
const BORDE: Partial<ExcelJS.Borders> = {
  top: { style: "thin", color: { argb: "FFC7CDD1" } },
  bottom: { style: "thin", color: { argb: "FFC7CDD1" } },
  left: { style: "thin", color: { argb: "FFC7CDD1" } },
  right: { style: "thin", color: { argb: "FFC7CDD1" } },
};

export function nombreArchivoActa(curso: Pick<CursoConEvaluaciones, "codigo" | "seccion" | "semestre">): string {
  const seccion = curso.seccion ? `S${curso.seccion}` : null;
  return `${nombreArchivoSeguro("Acta", curso.codigo, seccion, curso.semestre)}.xlsx`;
}

export async function construirActaExcel({ curso, alumnos, notas, resultados, fecha = new Date() }: DatosActa): Promise<ArrayBuffer> {
  const libro = new ExcelJS.Workbook();
  libro.creator = "Act-IA · Módulo 1";
  const hoja = libro.addWorksheet("Acta");
  const encabezados = [
    "Nombres",
    "Apellidos",
    "RUT",
    "Correo",
    ...curso.evaluaciones.map((e) => `${e.nombre} (${e.ponderacion}%)`),
    "Nota final",
    "Aprobado/No aprobado",
  ];
  const totalColumnas = encabezados.length;

  // 1. Encabezado del curso
  hoja.mergeCells(1, 1, 1, totalColumnas);
  const titulo = hoja.getCell(1, 1);
  titulo.value = "Universidad Diego Portales — Acta de calificaciones";
  titulo.font = { bold: true, size: 14, color: { argb: ROJO_UDP } };
  const datosCurso: Array<[string, string]> = [
    ["Curso", curso.nombre],
    ["Código", curso.codigo],
    ["Sección", curso.seccion || "—"],
    ["Semestre", curso.semestre],
    ["Docente", curso.docente_nombre || "—"],
    ["Fecha de emisión", fecha.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" })],
  ];
  datosCurso.forEach(([etiqueta, valor], i) => {
    const fila = hoja.getRow(2 + i);
    fila.getCell(1).value = etiqueta;
    fila.getCell(1).font = { bold: true };
    fila.getCell(2).value = valor;
  });

  // 2. Tabla de notas
  const filaEncabezado = 2 + datosCurso.length + 1;
  const encabezado = hoja.getRow(filaEncabezado);
  encabezado.values = encabezados;
  encabezado.height = 30;
  encabezado.eachCell((celda) => {
    celda.font = { bold: true, color: { argb: "FFFFFFFF" } };
    celda.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ROJO_UDP } };
    celda.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    celda.border = BORDE;
  });

  alumnos.forEach((a, i) => {
    const r = resultados[a.id];
    const notasAlumno = notas[a.id] ?? {};
    const fila = hoja.getRow(filaEncabezado + 1 + i);
    fila.values = [
      a.nombres,
      a.apellidos,
      a.rut,
      a.correo,
      ...curso.evaluaciones.map((e) => notasAlumno[e.id] ?? null),
      r?.nota_final ?? null,
      r ? ETIQUETA_ESTADO_ACTA[r.estado] : "Pendiente",
    ];
    fila.eachCell({ includeEmpty: true }, (celda, col) => {
      celda.border = BORDE;
      if (col > 4 && col <= totalColumnas - 1) {
        celda.numFmt = "0.0";
        celda.alignment = { horizontal: "center" };
      }
    });
    const celdaFinal = fila.getCell(totalColumnas - 1);
    celdaFinal.font = { bold: true };
    const celdaEstado = fila.getCell(totalColumnas);
    celdaEstado.alignment = { horizontal: "center" };
    celdaEstado.font = {
      bold: true,
      color: { argb: r?.estado === "Aprobado" ? "FF2E7D32" : r?.estado === "Reprobado" ? "FFC62828" : "FF6B7780" },
    };
  });

  // 3. Pie con las reglas usadas
  const filaPie = filaEncabezado + alumnos.length + 2;
  const reglas = [
    `Escala ${formatearNota(curso.nota_minima)}–${formatearNota(curso.nota_maxima)}`,
    `aprobación ${formatearNota(curso.nota_aprobacion)}`,
    `exigencia ${curso.exigencia_pct}%`,
    "notas redondeadas a un decimal (3.95 → 4.0)",
  ];
  if ((curso.decimas_totales ?? 0) > 0) reglas.push(`la nota final incluye décimas (máx. ${formatearNota(curso.decimas_totales)})`);
  hoja.getCell(filaPie, 1).value = `${reglas.join(" · ")}.`;
  hoja.getCell(filaPie, 1).font = { italic: true, size: 9, color: { argb: "FF6B7780" } };

  // 4. Formato general
  for (let col = 1; col <= totalColumnas; col++) {
    hoja.getColumn(col).width = col <= 2 ? 24 : col === 3 ? 14 : col === 4 ? 32 : col === totalColumnas ? 20 : 13;
  }
  hoja.views = [{ state: "frozen", ySplit: filaEncabezado, xSplit: 2 }];
  hoja.autoFilter = { from: { row: filaEncabezado, column: 1 }, to: { row: filaEncabezado, column: totalColumnas } };
  hoja.pageSetup = { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 };

  return libro.xlsx.writeBuffer() as Promise<ArrayBuffer>;
}
