import ExcelJS from "exceljs";
import type { FilaAlumnoCruda } from "./validarAlumnos";

/**
 * Plantilla y lectura del Excel de alumnos (exceljs; corre en el navegador y en tests).
 * Columnas: nombres, apellidos, rut, correo. Se aceptan sinónimos y mayúsculas/tildes.
 */

export const COLUMNAS_PLANTILLA = ["nombres", "apellidos", "rut", "correo"] as const;
type Columna = (typeof COLUMNAS_PLANTILLA)[number];

const SINONIMOS: Record<string, Columna> = {
  nombres: "nombres",
  nombre: "nombres",
  apellidos: "apellidos",
  apellido: "apellidos",
  rut: "rut",
  run: "rut",
  correo: "correo",
  email: "correo",
  mail: "correo",
  "correo electronico": "correo",
  "correo institucional": "correo",
};

export class ErrorExcel extends Error {}

const normalizar = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

export async function crearPlantillaAlumnos(): Promise<ArrayBuffer> {
  const libro = new ExcelJS.Workbook();
  const hoja = libro.addWorksheet("Alumnos");
  hoja.columns = [
    { header: "nombres", key: "nombres", width: 26 },
    { header: "apellidos", key: "apellidos", width: 26 },
    { header: "rut", key: "rut", width: 16 },
    { header: "correo", key: "correo", width: 34 },
  ];
  const encabezado = hoja.getRow(1);
  encabezado.font = { bold: true, color: { argb: "FFFFFFFF" } };
  encabezado.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFB71C1C" } };
  hoja.views = [{ state: "frozen", ySplit: 1 }];
  hoja.getColumn("rut").numFmt = "@"; // texto: conserva la K y el guion

  const ayuda = libro.addWorksheet("Instrucciones");
  ayuda.getColumn(1).width = 100;
  [
    "Completa una fila por alumno en la hoja «Alumnos», desde la fila 2.",
    "nombres y apellidos: texto libre.",
    "rut: con o sin puntos y con guion (se valida el dígito verificador y se guarda como cuerpo-DV).",
    "correo: correo del alumno; no puede repetirse dentro del curso.",
    "Al subir el archivo verás una vista previa con los errores marcados antes de confirmar la carga.",
  ].forEach((texto) => ayuda.addRow([texto]));
  return libro.xlsx.writeBuffer() as Promise<ArrayBuffer>;
}

/** Lee la primera hoja con encabezados reconocibles. Lanza ErrorExcel si no los encuentra. */
export async function leerExcelAlumnos(contenido: ArrayBuffer): Promise<FilaAlumnoCruda[]> {
  const libro = new ExcelJS.Workbook();
  try {
    await libro.xlsx.load(contenido);
  } catch {
    throw new ErrorExcel("No se pudo abrir el archivo. Usa un Excel .xlsx (puedes partir desde la plantilla).");
  }

  for (const hoja of libro.worksheets) {
    // Busca la fila de encabezados en las primeras 10 filas
    for (let n = 1; n <= Math.min(10, hoja.rowCount); n++) {
      const indices: Partial<Record<Columna, number>> = {};
      hoja.getRow(n).eachCell((celda, col) => {
        const columna = SINONIMOS[normalizar(celda.text)];
        if (columna && indices[columna] === undefined) indices[columna] = col;
      });
      if (COLUMNAS_PLANTILLA.every((c) => indices[c] !== undefined)) {
        return leerFilas(hoja, n, indices as Record<Columna, number>);
      }
    }
  }
  throw new ErrorExcel("No encontré las columnas nombres, apellidos, rut y correo. Descarga la plantilla y úsala como base.");
}

function leerFilas(hoja: ExcelJS.Worksheet, filaEncabezado: number, indices: Record<Columna, number>): FilaAlumnoCruda[] {
  const filas: FilaAlumnoCruda[] = [];
  for (let n = filaEncabezado + 1; n <= hoja.rowCount; n++) {
    const fila = hoja.getRow(n);
    const valor = (c: Columna) => fila.getCell(indices[c]).text.trim();
    const datos = { nombres: valor("nombres"), apellidos: valor("apellidos"), rut: valor("rut"), correo: valor("correo") };
    if (Object.values(datos).every((v) => v === "")) continue; // fila vacía
    filas.push({ fila: n, ...datos });
  }
  return filas;
}
