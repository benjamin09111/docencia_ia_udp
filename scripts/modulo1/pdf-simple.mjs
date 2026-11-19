/**
 * Generador de PDF mínimo, sin dependencias: solo texto (Helvetica, WinAnsi), A4,
 * con títulos ("# " y "## ") y ajuste de líneas. Suficiente para el programa demo.
 */

const ANCHO = 595;
const ALTO = 842;
const MARGEN = 56;
const ESTILOS = {
  h1: { fuente: "F2", tamano: 16, alto: 24, ancho: 60 },
  h2: { fuente: "F2", tamano: 12, alto: 20, ancho: 80 },
  p: { fuente: "F1", tamano: 10, alto: 14, ancho: 96 },
};

const REEMPLAZOS = { "—": "-", "–": "-", "≥": ">=", "≤": "<=", "→": "->", "“": '"', "”": '"', "’": "'" };

/** Texto → bytes WinAnsi (latin1) escapados para un string PDF. */
function aPdf(texto) {
  const limpio = [...texto].map((c) => REEMPLAZOS[c] ?? (c.charCodeAt(0) <= 0xff ? c : "?")).join("");
  return limpio.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function ajustar(texto, ancho) {
  const lineas = [];
  let actual = "";
  for (const palabra of texto.split(/\s+/)) {
    if ((actual + " " + palabra).trim().length > ancho) {
      lineas.push(actual);
      actual = palabra;
    } else actual = (actual + " " + palabra).trim();
  }
  if (actual) lineas.push(actual);
  return lineas.length ? lineas : [""];
}

/** Convierte un Markdown simple en páginas de comandos de texto PDF. */
function paginar(markdown) {
  const paginas = [[]];
  let y = ALTO - MARGEN;
  for (const linea of markdown.split("\n")) {
    const estilo = linea.startsWith("## ") ? ESTILOS.h2 : linea.startsWith("# ") ? ESTILOS.h1 : ESTILOS.p;
    const texto = linea.replace(/^#{1,2} /, "");
    if (estilo !== ESTILOS.p) y -= 6;
    for (const parte of ajustar(texto, estilo.ancho)) {
      if (y < MARGEN) {
        paginas.push([]);
        y = ALTO - MARGEN;
      }
      if (parte) paginas.at(-1).push(`BT /${estilo.fuente} ${estilo.tamano} Tf ${MARGEN} ${y} Td (${aPdf(parte)}) Tj ET`);
      y -= estilo.alto;
    }
  }
  return paginas;
}

export function crearPdf(markdown, titulo = "Documento") {
  const objetos = [];
  const agregar = (contenido) => objetos.push(contenido) && objetos.length;

  const catalogo = agregar(null);
  const paginasId = agregar(null);
  const f1 = agregar("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  const f2 = agregar("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const info = agregar(`<< /Title (${aPdf(titulo)}) /Producer (Act-IA demo) >>`);

  const kids = paginar(markdown).map((comandos) => {
    const flujo = comandos.join("\n");
    const contenido = agregar(`<< /Length ${Buffer.byteLength(flujo, "latin1")} >>\nstream\n${flujo}\nendstream`);
    return agregar(
      `<< /Type /Page /Parent ${paginasId} 0 R /MediaBox [0 0 ${ANCHO} ${ALTO}] ` +
        `/Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> /Contents ${contenido} 0 R >>`
    );
  });
  objetos[catalogo - 1] = `<< /Type /Catalog /Pages ${paginasId} 0 R >>`;
  objetos[paginasId - 1] = `<< /Type /Pages /Kids [${kids.map((k) => `${k} 0 R`).join(" ")}] /Count ${kids.length} >>`;

  let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets = objetos.map((obj, i) => {
    const offset = Buffer.byteLength(pdf, "latin1");
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
    return offset;
  });
  const xref = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objetos.length + 1} /Root ${catalogo} 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(pdf, "latin1");
}
