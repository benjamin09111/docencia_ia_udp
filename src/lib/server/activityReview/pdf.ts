import { resolve } from "node:path";
import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { activityPoints, MAX_ACTIVITY_PDF_BYTES, type ReviewActivity } from "@/types/activityReview";

const PDFJS_ASSETS = resolve(process.cwd(), "node_modules/pdfjs-dist");
const MAX_PAGES = 20;
const MAX_TEXT = 12_000;

export async function readSubmissionPdf(pdf: File) {
  if (pdf.size < 5 || pdf.size > MAX_ACTIVITY_PDF_BYTES) return null;
  const bytes = Buffer.from(await pdf.arrayBuffer());
  if (bytes.toString("ascii", 0, 5) !== "%PDF-") return null;

  const loading = getDocument({
    data: new Uint8Array(bytes), stopAtErrors: true, useSystemFonts: false,
    standardFontDataUrl: PDFJS_ASSETS + "/standard_fonts/",
    cMapUrl: PDFJS_ASSETS + "/cmaps/",
  });
  try {
    const document = await loading.promise;
    if (document.numPages > MAX_PAGES) return null;
    const segments = [];
    let total = 0;
    for (let index = 1; index <= document.numPages; index++) {
      const page = await document.getPage(index);
      const content = await page.getTextContent();
      const text = content.items.map(item => "str" in item ? item.str + (item.hasEOL ? "\n" : " ") : "").join("");
      total += text.length;
      if (total > MAX_TEXT) return null;
      segments.push(text);
    }
    const solution = segments.join("\n").trim();
    return solution ? { solution, pdf: "\\x" + bytes.toString("hex") } : null;
  } catch {
    return null;
  } finally {
    await loading.destroy();
  }
}

function printable(input: string, font: PDFFont) {
  const chars = new Set(font.getCharacterSet());
  return [...input.normalize("NFC")].map(char => char === "\n" || chars.has(char.codePointAt(0)!) ? char : " ").join("");
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number) {
  const lines: string[] = [];
  for (const paragraph of printable(text, font).split("\n")) {
    let line = "";
    for (const word of paragraph.trim().split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        line = candidate;
        continue;
      }
      if (line) lines.push(line);
      line = "";
      for (const char of word) {
        if (font.widthOfTextAtSize(line + char, size) > maxWidth) {
          lines.push(line);
          line = "";
        }
        line += char;
      }
    }
    lines.push(line);
  }
  return lines;
}

export async function makeActivityPdf(activity: ReviewActivity, rubricOnly: boolean) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(activity.title);
  pdf.setLanguage("es-CL");
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const red = rgb(0.72, 0.11, 0.11);
  const ink = rgb(0.18, 0.23, 0.27);
  const margin = 54;
  const width = 595;
  const height = 842;
  let page = pdf.addPage([width, height]);
  let y = height - margin;

  function section(text: string, size = 11, font = regular, color = ink) {
    for (const line of wrap(text, font, size, width - margin * 2)) {
      if (y < 64) {
        page = pdf.addPage([width, height]);
        y = height - margin;
      }
      if (line) page.drawText(line, { x: margin, y, font, size, color });
      y -= size * 1.4;
    }
    y -= 10;
  }

  section("UNIVERSIDAD DIEGO PORTALES  /  ESCUELA DE INFORMÁTICA Y TELECOMUNICACIONES", 9, bold, red);
  section(rubricOnly ? `Pauta de evaluación · ${activity.title}` : activity.title, 23, bold);
  section(`Arquitectura de Software · CIT3000   |   ${activity.type}`, 11, bold);
  if (!rubricOnly) {
    section("Instrucciones de la tarea", 14, bold, red);
    section(activity.instructions);
    section("Entrega individual en PDF.");
  }
  section(rubricOnly ? "Criterios y puntajes" : "Pauta de evaluación", 14, bold, red);
  const scale = activity.assessment === "nota"
    ? `Nota de ${activity.gradeBase.toFixed(1)} a 7.0 · 60 % de exigencia para el 4.0`
    : `Hasta ${activity.maxDecimas.toFixed(1)} décimas, proporcionales al puntaje obtenido`;
  section(`${activityPoints(activity)} puntos totales   |   ${scale}`);
  activity.rubric.forEach((criterion, index) => {
    if (y < 105) {
      page = pdf.addPage([width, height]);
      y = height - margin;
    }
    section(`${index + 1}. ${criterion.name} (${criterion.points} puntos)`, 11, bold);
    section(criterion.description);
  });

  const pages = pdf.getPages();
  pages.forEach((item, index) => {
    item.drawText(`CIT3000  |  ${index + 1} de ${pages.length}`, { x: margin, y: 34, font: regular, size: 9, color: ink });
  });
  return pdf.save();
}
