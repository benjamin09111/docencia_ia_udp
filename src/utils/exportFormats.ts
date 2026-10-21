import { SectionAttendanceSummaryReport } from "@/services/attendanceReportService";

export function exportSummaryToCSV(reports: SectionAttendanceSummaryReport[], filename = "resumen_asistencia.csv") {
  const lines: string[] = [];
  lines.push("\uFEFF"); // BOM UTF-8 para Excel
  lines.push("REPORTE CONSOLIDADO DE ASISTENCIA — UNIVERSIDAD DIEGO PORTALES");
  lines.push(`Fecha de Emisión: ${new Date().toLocaleDateString("es-CL")};Secciones Analizadas: ${reports.length}`);
  lines.push("");

  lines.push("=== RESUMEN EJECUTIVO POR SECCIÓN ===");
  lines.push("Código Sección;Nombre Sección;Profesor;Ayudante;Estudiantes;Clases Realizadas;Asistencia Promedio;Regulares;En Riesgo (RI)");
  for (const rep of reports) {
    lines.push([
      `"${rep.seccionCodigo}"`,
      `"${rep.seccionNombre}"`,
      `"${rep.profesor}"`,
      `"${rep.ayudante}"`,
      rep.totalEstudiantes,
      rep.clasesRealizadas,
      `${rep.asistenciaPromedio}%`,
      rep.alumnosRegulares,
      rep.alumnosEnRiesgo,
    ].join(";"));
  }

  lines.push("");
  lines.push("=== NÓMINA DETALLADA DE ESTUDIANTES ===");
  lines.push("Sección;RUT;Canvas ID;Estudiante;Clases Asistidas;Clases Válidas;% Asistencia;Condición");
  for (const rep of reports) {
    for (const est of rep.estudiantes) {
      lines.push([
        `"${est.seccionCodigo}"`,
        `"${est.rut || "—"}"`,
        est.canvasId,
        `"${est.nombreCompleto}"`,
        est.asistidas,
        est.validas,
        `${est.porcentaje}%`,
        `"${est.estado}"`,
      ].join(";"));
    }
  }

  const blob = new Blob([lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename.endsWith(".csv") ? filename : `${filename}.csv`);
}

export function exportSummaryToExcel(reports: SectionAttendanceSummaryReport[], filename = "resumen_asistencia.xls") {
  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
  <style>
    body { font-family: Arial, sans-serif; font-size: 11px; }
    .header-main { background-color: #B71C1C; color: #FFFFFF; font-size: 14px; font-weight: bold; text-align: center; }
    .header-sec { background-color: #2D3B45; color: #FFFFFF; font-size: 12px; font-weight: bold; }
    .th-col { background-color: #F5F6F8; color: #2D3B45; font-weight: bold; border: 1px solid #C7CDD1; }
    .td-cell { border: 1px solid #E0E3E6; mso-number-format:"\\@"; }
    .td-num { border: 1px solid #E0E3E6; text-align: right; }
    .td-risk { background-color: #FFEBEE; color: #C8102E; font-weight: bold; border: 1px solid #E0E3E6; }
    .td-ok { color: #2E7D32; font-weight: bold; border: 1px solid #E0E3E6; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="9" class="header-main">REPORTE CONSOLIDADO DE ASISTENCIA — UNIVERSIDAD DIEGO PORTALES</td></tr>
    <tr><td colspan="9">Fecha de Generación: ${new Date().toLocaleDateString("es-CL")} • Total Secciones: ${reports.length}</td></tr>
    <tr><td colspan="9"></td></tr>
    <tr><td colspan="9" class="header-sec">RESUMEN EJECUTIVO POR SECCIÓN</td></tr>
    <tr>
      <th class="th-col">Código</th>
      <th class="th-col">Sección</th>
      <th class="th-col">Profesor</th>
      <th class="th-col">Ayudante</th>
      <th class="th-col">Estudiantes</th>
      <th class="th-col">Clases</th>
      <th class="th-col">Promedio Asistencia</th>
      <th class="th-col">Alumnos Regulares</th>
      <th class="th-col">Alumnos En Riesgo (RI)</th>
    </tr>`;

  for (const rep of reports) {
    html += `<tr>
      <td class="td-cell">${rep.seccionCodigo}</td>
      <td class="td-cell">${rep.seccionNombre}</td>
      <td class="td-cell">${rep.profesor}</td>
      <td class="td-cell">${rep.ayudante}</td>
      <td class="td-num">${rep.totalEstudiantes}</td>
      <td class="td-num">${rep.clasesRealizadas}</td>
      <td class="td-num">${rep.asistenciaPromedio}%</td>
      <td class="td-num td-ok">${rep.alumnosRegulares}</td>
      <td class="td-num ${rep.alumnosEnRiesgo > 0 ? "td-risk" : ""}">${rep.alumnosEnRiesgo}</td>
    </tr>`;
  }

  html += `<tr><td colspan="9"></td></tr>
    <tr><td colspan="9" class="header-sec">NÓMINA DETALLADA DE ESTUDIANTES</td></tr>
    <tr>
      <th class="th-col">Sección</th>
      <th class="th-col">RUT</th>
      <th class="th-col">Canvas ID</th>
      <th class="th-col">Estudiante</th>
      <th class="th-col">Clases Asistidas</th>
      <th class="th-col">Clases Válidas</th>
      <th class="th-col">% Asistencia</th>
      <th class="th-col">Estado</th>
      <th class="th-col"></th>
    </tr>`;

  for (const rep of reports) {
    for (const est of rep.estudiantes) {
      const isRisk = est.estado === "En Riesgo (RI)";
      html += `<tr>
        <td class="td-cell">${est.seccionCodigo}</td>
        <td class="td-cell">${est.rut || "—"}</td>
        <td class="td-cell">${est.canvasId}</td>
        <td class="td-cell">${est.nombreCompleto}</td>
        <td class="td-num">${est.asistidas}</td>
        <td class="td-num">${est.validas}</td>
        <td class="td-num ${isRisk ? "td-risk" : "td-ok"}">${est.porcentaje}%</td>
        <td class="td-cell ${isRisk ? "td-risk" : "td-ok"}">${est.estado}</td>
        <td></td>
      </tr>`;
    }
  }

  html += `</table></body></html>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
  triggerDownload(blob, filename.endsWith(".xls") ? filename : `${filename}.xls`);
}

export function exportSummaryToPDF(reports: SectionAttendanceSummaryReport[], title = "Resumen de Asistencia") {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Por favor permite las ventanas emergentes en tu navegador para generar el PDF.");
    return;
  }

  let rowsHtml = "";
  for (const rep of reports) {
    rowsHtml += `
      <div style="margin-top: 20px; page-break-inside: avoid;">
        <h3 style="font-size: 13px; color: #2D3B45; border-bottom: 2px solid #B71C1C; padding-bottom: 4px; margin-bottom: 8px;">
          ${rep.seccionNombre} (${rep.seccionCodigo}) • Prof: ${rep.profesor} • Ayud: ${rep.ayudante}
        </h3>
        <p style="font-size: 11px; color: #55636E; margin-bottom: 8px;">
          Estudiantes: <strong>${rep.totalEstudiantes}</strong> | Clases realizadas: <strong>${rep.clasesRealizadas}</strong> | Promedio: <strong>${rep.asistenciaPromedio}%</strong> | En Riesgo: <strong style="color: ${rep.alumnosEnRiesgo > 0 ? '#C8102E' : '#2D3B45'}">${rep.alumnosEnRiesgo}</strong>
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 16px;">
          <thead>
            <tr style="background: #F5F6F8; color: #2D3B45; text-align: left;">
              <th style="padding: 4px 6px; border: 1px solid #D9D9D9;">RUT</th>
              <th style="padding: 4px 6px; border: 1px solid #D9D9D9;">Estudiante</th>
              <th style="padding: 4px 6px; border: 1px solid #D9D9D9; text-align: center;">Asistidas</th>
              <th style="padding: 4px 6px; border: 1px solid #D9D9D9; text-align: center;">Válidas</th>
              <th style="padding: 4px 6px; border: 1px solid #D9D9D9; text-align: center;">% Asist.</th>
              <th style="padding: 4px 6px; border: 1px solid #D9D9D9; text-align: center;">Condición</th>
            </tr>
          </thead>
          <tbody>
            ${rep.estudiantes.map((e) => `
              <tr style="border-bottom: 1px solid #EEEEEE; ${e.estado === 'En Riesgo (RI)' ? 'background-color: #FFF5F5;' : ''}">
                <td style="padding: 3px 6px; border: 1px solid #E5E5E5;">${e.rut || "—"}</td>
                <td style="padding: 3px 6px; border: 1px solid #E5E5E5;">${e.nombreCompleto}</td>
                <td style="padding: 3px 6px; border: 1px solid #E5E5E5; text-align: center;">${e.asistidas}</td>
                <td style="padding: 3px 6px; border: 1px solid #E5E5E5; text-align: center;">${e.validas}</td>
                <td style="padding: 3px 6px; border: 1px solid #E5E5E5; text-align: center; font-weight: bold; color: ${e.porcentaje < 75 ? '#C8102E' : '#2E7D32'};">${e.porcentaje}%</td>
                <td style="padding: 3px 6px; border: 1px solid #E5E5E5; text-align: center; font-weight: bold; color: ${e.estado === 'En Riesgo (RI)' ? '#C8102E' : '#2E7D32'};">${e.estado}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} — UDP</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 24px; color: #2D3B45; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #B71C1C; padding-bottom: 12px;">
          <div>
            <h1 style="font-size: 16px; margin: 0; color: #B71C1C; text-transform: uppercase; font-weight: 800;">Universidad Diego Portales</h1>
            <h2 style="font-size: 13px; margin: 4px 0 0 0; color: #2D3B45; font-weight: 600;">Facultad de Ingeniería y Ciencias • Escuela de Informática</h2>
          </div>
          <div style="text-align: right; font-size: 10px; color: #6B7780;">
            <p style="margin: 0;">Fecha: ${new Date().toLocaleDateString("es-CL")}</p>
            <p style="margin: 2px 0 0 0;">Reporte Oficial de Asistencia</p>
          </div>
        </div>
        <h2 style="font-size: 14px; margin-top: 16px; margin-bottom: 0;">${title}</h2>
        ${rowsHtml}
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
