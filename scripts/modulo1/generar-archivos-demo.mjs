/**
 * Regenera los archivos de la demo del Módulo 1 en seed/modulo1/:
 *   - programa-demo.pdf        (desde programa-demo.md)
 *   - alumnos-demo.xlsx        (10 alumnos ficticios con RUT válidos)
 *   - alumnos-con-errores.xlsx (filas con errores a propósito, para la vista previa)
 *
 * Uso: npm run seed:m1:archivos   (no toca la base de datos)
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ExcelJS from "exceljs";
import { crearPdf } from "./pdf-simple.mjs";
import { ALUMNOS, FILAS_CON_ERRORES, correo, rut, rutConPuntos } from "../../seed/modulo1/datos-demo.mjs";

const carpeta = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../seed/modulo1");

async function escribirExcel(nombre, filas) {
  const libro = new ExcelJS.Workbook();
  libro.created = new Date(2026, 10, 18); // fecha fija: el archivo no cambia en cada regeneración
  libro.modified = libro.created;
  const hoja = libro.addWorksheet("Alumnos");
  hoja.columns = [
    { header: "nombres", key: "nombres", width: 24 },
    { header: "apellidos", key: "apellidos", width: 24 },
    { header: "rut", key: "rut", width: 16 },
    { header: "correo", key: "correo", width: 36 },
  ];
  hoja.getRow(1).font = { bold: true };
  filas.forEach((f) => hoja.addRow(f));
  await libro.xlsx.writeFile(path.join(carpeta, nombre));
  console.log(`✓ ${nombre} (${filas.length} filas)`);
}

const markdown = readFileSync(path.join(carpeta, "programa-demo.md"), "utf8");
writeFileSync(path.join(carpeta, "programa-demo.pdf"), crearPdf(markdown, "Programa Arquitectura de Software (demo)"));
console.log("✓ programa-demo.pdf");

// Mitad de los RUT con puntos y mitad sin puntos, para mostrar la normalización.
await escribirExcel(
  "alumnos-demo.xlsx",
  ALUMNOS.map((a, i) => ({
    nombres: a.nombres,
    apellidos: a.apellidos,
    rut: i % 2 === 0 ? rutConPuntos(a.cuerpo) : rut(a.cuerpo),
    correo: correo(a),
  }))
);
await escribirExcel(
  "alumnos-con-errores.xlsx",
  FILAS_CON_ERRORES.map((f) => ({ nombres: f.nombres, apellidos: f.apellidos, rut: f.rut(), correo: f.correo }))
);
