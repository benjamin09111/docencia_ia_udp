import * as XLSX from "xlsx";
import { ClassSession, StudentAttendanceSummary, StudentWorkRecord } from "@/types/attendance";
import { StudentExcelRow } from "@/types";
import { getTodayDateStr } from "@/services/attendanceStore";

export type AttendanceExportScope = "catedras" | "ayudantias" | "ambas";

export function exportAttendanceToExcel(params: {
  cursoNombre: string;
  seccionNombre: string;
  sessions: ClassSession[];
  summaries: StudentAttendanceSummary[];
  attendanceMap: Record<string, 1 | 0>; // key: `${sessionId}_${canvasId}`
  estudiantesNotas?: StudentExcelRow[];
  studentWorkRecords?: Record<number, StudentWorkRecord>;
  totalTrabajosRealizados?: number;
  scope?: AttendanceExportScope;
  incluirAyudantiasEnFinal?: boolean;
}) {
  const {
    cursoNombre,
    seccionNombre,
    sessions,
    summaries,
    attendanceMap,
    estudiantesNotas,
    studentWorkRecords = {},
    totalTrabajosRealizados = 3,
    scope = "ambas",
    incluirAyudantiasEnFinal = false,
  } = params;

  const todayStr = getTodayDateStr();

  // Filtrar sesiones no canceladas, SIN fines de semana y solo HASTA la fecha actual (no meses futuros)
  const validSessions = sessions.filter(
    (s) =>
      s.estado !== "cancelada" &&
      s.diaSemana !== "Sábado" &&
      s.diaSemana !== "Domingo" &&
      s.fecha <= todayStr
  );

  const catSessions = validSessions.filter((s) => s.tipo === "catedra");
  const ayudSessions = validSessions.filter((s) => s.tipo === "ayudantia");

  const wb = XLSX.utils.book_new();

  // Helper para generar una hoja con matriz de fechas DD/MM
  const buildMatrixSheet = (
    sheetTitle: string,
    subtipo: "catedra" | "ayudantia",
    targetSessions: ClassSession[]
  ) => {
    const data: any[][] = [];
    data.push(["UNIVERSIDAD DIEGO PORTALES — ESCUELA DE INFORMÁTICA Y TELECOMUNICACIONES"]);
    data.push([
      `CURSO: ${cursoNombre}`,
      `SECCIÓN: ${seccionNombre}`,
      `TIPO: ${sheetTitle.toUpperCase()}`,
      `CORTE: Clases realizadas hasta hoy (${new Date().toLocaleDateString("es-CL")})`,
    ]);
    data.push([]);

    const headers = ["RUT", "Apellidos", "Nombres", "Correo Institucional"];
    targetSessions.forEach((s) => {
      const parts = s.fecha.split("-");
      const diaMes = parts.length === 3 ? `${parts[2]}/${parts[1]}` : s.fecha;
      headers.push(diaMes);
    });
    if (subtipo === "ayudantia") {
      headers.push("Décimas", "Trabajos Realizados");
    }
    headers.push("Asistidas", "Total Clases", "% Asistencia", "Estado");
    data.push(headers);

    summaries.forEach((sum) => {
      const row: any[] = [sum.rut, sum.apellidos, sum.nombres, sum.email];
      let asistidasCount = 0;

      targetSessions.forEach((s) => {
        const key = `${s.id}_${sum.canvas_id}`;
        const val = attendanceMap[key] ?? 0;
        if (val === 1) asistidasCount++;
        row.push(val);
      });

      const totalVal = targetSessions.length;
      const pct = totalVal > 0 ? Math.round((asistidasCount / totalVal) * 100) : 0;
      const ok = pct >= 75;

      if (subtipo === "ayudantia") {
        const work = studentWorkRecords[sum.canvas_id] || { decimas: 0, trabajosRealizados: totalTrabajosRealizados };
        const trabCount = work.trabajosRealizados && work.trabajosRealizados > 0 ? work.trabajosRealizados : totalTrabajosRealizados;
        row.push(work.decimas, trabCount);
      }

      row.push(asistidasCount, totalVal, `${pct}%`, ok ? "OK" : "RI");
      data.push(row);
    });

    // Fila totalizadora
    const footer: any[] = ["TOTAL ASISTENTES", "", "", ""];
    targetSessions.forEach((s) => {
      let count = 0;
      summaries.forEach((sum) => {
        const key = `${s.id}_${sum.canvas_id}`;
        if (attendanceMap[key] === 1) count++;
      });
      footer.push(count);
    });

    if (subtipo === "ayudantia") {
      const sumDec = summaries.reduce((acc, s) => acc + (studentWorkRecords[s.canvas_id]?.decimas || 0), 0);
      footer.push(`Total: ${sumDec}`, `${totalTrabajosRealizados} trabajos`);
    }

    for (let i = 0; i < 4; i++) footer.push("");
    data.push(footer);

    const ws = XLSX.utils.aoa_to_sheet(data);
    ws["!cols"] = [
      { wch: 12 }, // RUT
      { wch: 16 }, // Apellidos
      { wch: 16 }, // Nombres
      { wch: 25 }, // Email
      ...targetSessions.map(() => ({ wch: 7 })), // Fechas DD/MM
      ...(subtipo === "ayudantia" ? [{ wch: 10 }, { wch: 18 }] : []),
      { wch: 10 },
      { wch: 12 },
      { wch: 13 },
      { wch: 10 },
    ];
    return ws;
  };

  // 1. Si el scope incluye Cátedras
  if ((scope === "catedras" || scope === "ambas") && catSessions.length > 0) {
    const wsCat = buildMatrixSheet("Asistencia Cátedras", "catedra", catSessions);
    XLSX.utils.book_append_sheet(wb, wsCat, "Cátedras");
  }

  // 2. Si el scope incluye Ayudantías
  if ((scope === "ayudantias" || scope === "ambas") && ayudSessions.length > 0) {
    const wsAyud = buildMatrixSheet("Asistencia Ayudantías", "ayudantia", ayudSessions);
    XLSX.utils.book_append_sheet(wb, wsAyud, "Ayudantías");
  }

  // 3. Hoja Consolidada si se exportan ambas
  if (scope === "ambas") {
    const dataConsolidada: any[][] = [];
    dataConsolidada.push(["UNIVERSIDAD DIEGO PORTALES — RESUMEN CONSOLIDADO DE ASISTENCIA"]);
    dataConsolidada.push([
      `CURSO: ${cursoNombre}`,
      `SECCIÓN: ${seccionNombre}`,
      `CRITERIO ASISTENCIA FINAL: ${
        incluirAyudantiasEnFinal ? "CÁTEDRA + AYUDANTÍA (PONDERADO)" : "SOLO CÁTEDRA OFICIAL"
      }`,
    ]);
    dataConsolidada.push([]);
    dataConsolidada.push([
      "RUT",
      "Estudiante",
      "Correo",
      "Cátedras Asist.",
      "% Cátedras",
      "Ayudantías Asist.",
      "% Ayudantías",
      "% Asistencia Final",
      "Estado Final (<75%)",
    ]);

    summaries.forEach((sum) => {
      const asistFinalPct = incluirAyudantiasEnFinal ? sum.totalPct : sum.catedrasPct;
      const enRiesgo = asistFinalPct < 75;

      dataConsolidada.push([
        sum.rut,
        `${sum.apellidos}, ${sum.nombres}`,
        sum.email,
        `${sum.catedrasAsistidas}/${sum.catedrasValidas}`,
        `${sum.catedrasPct}%`,
        `${sum.ayudantiasAsistidas}/${sum.ayudantiasValidas}`,
        `${sum.ayudantiasPct}%`,
        `${asistFinalPct}%`,
        enRiesgo ? "RI" : "OK",
      ]);
    });

    const wsConsolidada = XLSX.utils.aoa_to_sheet(dataConsolidada);
    wsConsolidada["!cols"] = [
      { wch: 13 },
      { wch: 28 },
      { wch: 26 },
      { wch: 16 },
      { wch: 13 },
      { wch: 18 },
      { wch: 15 },
      { wch: 18 },
      { wch: 18 },
    ];
    XLSX.utils.book_append_sheet(wb, wsConsolidada, "Resumen Consolidado");
  }

  // Descargar archivo
  const prefijo = scope === "catedras" ? "Catedras" : scope === "ayudantias" ? "Ayudantias" : "Completo";
  const filename = `Asistencia_${prefijo}_${seccionNombre.replace(/\s+/g, "_")}_UDP.xlsx`;
  XLSX.writeFile(wb, filename);
}
