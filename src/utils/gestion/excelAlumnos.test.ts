import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { crearPlantillaAlumnos, ErrorExcel, leerExcelAlumnos } from "./excelAlumnos";
import { rutDesdeCuerpo } from "./rut";

const RUT = rutDesdeCuerpo(20_111_222);

async function libroDesde(filas: unknown[][]): Promise<ArrayBuffer> {
  const libro = new ExcelJS.Workbook();
  const hoja = libro.addWorksheet("Hoja1");
  filas.forEach((f) => hoja.addRow(f));
  return libro.xlsx.writeBuffer() as Promise<ArrayBuffer>;
}

describe("plantilla de alumnos", () => {
  it("tiene las columnas nombres, apellidos, rut y correo, y se puede leer de vuelta", async () => {
    const plantilla = await crearPlantillaAlumnos();
    const libro = new ExcelJS.Workbook();
    await libro.xlsx.load(plantilla);
    const hoja = libro.getWorksheet("Alumnos")!;
    expect(hoja.getRow(1).values).toEqual([undefined, "nombres", "apellidos", "rut", "correo"]);

    hoja.addRow(["Ana", "Pérez", RUT, "ana@mail.udp.test"]);
    const filas = await leerExcelAlumnos((await libro.xlsx.writeBuffer()) as ArrayBuffer);
    expect(filas).toEqual([{ fila: 2, nombres: "Ana", apellidos: "Pérez", rut: RUT, correo: "ana@mail.udp.test" }]);
  });
});

describe("leerExcelAlumnos", () => {
  it("acepta encabezados con mayúsculas, sinónimos, título previo y otro orden; salta filas vacías", async () => {
    const buffer = await libroDesde([
      ["Nómina Sección 2"],
      ["Correo Electrónico", "RUT", "Apellido", "Nombre"],
      ["ana@mail.udp.test", RUT, "Pérez", "Ana"],
      [],
      ["  luis@mail.udp.test ", 123, "Soto", "Luis"],
    ]);
    const filas = await leerExcelAlumnos(buffer);
    expect(filas).toEqual([
      { fila: 3, nombres: "Ana", apellidos: "Pérez", rut: RUT, correo: "ana@mail.udp.test" },
      { fila: 5, nombres: "Luis", apellidos: "Soto", rut: "123", correo: "luis@mail.udp.test" },
    ]);
  });

  it("explica el problema si faltan columnas o el archivo no es Excel", async () => {
    await expect(leerExcelAlumnos(await libroDesde([["nombre", "rut"]]))).rejects.toBeInstanceOf(ErrorExcel);
    await expect(leerExcelAlumnos(new TextEncoder().encode("hola").buffer as ArrayBuffer)).rejects.toThrow(/No se pudo abrir/);
  });
});
