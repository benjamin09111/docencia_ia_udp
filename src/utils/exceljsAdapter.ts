import ExcelJS from "exceljs";

type ColumnWidth = { wch?: number };

export interface ExcelSheetData {
  data: unknown[][];
  "!cols"?: ColumnWidth[];
}

export interface ExcelWorkbookData {
  sheets: Array<{ name: string; sheet: ExcelSheetData }>;
}

function triggerDownload(bytes: ArrayBuffer, filename: string): void {
  const blob = new Blob([bytes], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function saveWorkbook(workbookData: ExcelWorkbookData, filename: string): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  for (const { name, sheet } of workbookData.sheets) {
    const worksheet = workbook.addWorksheet(name);
    worksheet.addRows(sheet.data);
    if (sheet["!cols"]) {
      worksheet.columns = sheet["!cols"].map((column) => ({ width: column.wch || 10 }));
    }
  }
  triggerDownload(await workbook.xlsx.writeBuffer(), filename);
}

/**
 * Adaptador transitorio compatible con las pocas operaciones XLSX que usa la
 * aplicación. Mantiene las exportaciones sólo en navegador y evita SheetJS.
 */
export const XLSX = {
  utils: {
    book_new: (): ExcelWorkbookData => ({ sheets: [] }),
    aoa_to_sheet: (data: unknown[][]): ExcelSheetData => ({ data }),
    book_append_sheet: (workbook: ExcelWorkbookData, sheet: ExcelSheetData, name: string): void => {
      workbook.sheets.push({ name, sheet });
    },
  },
  writeFile: (workbook: ExcelWorkbookData, filename: string): void => {
    void saveWorkbook(workbook, filename).catch(() => {
      console.error("No se pudo generar el archivo Excel.");
    });
  },
};
