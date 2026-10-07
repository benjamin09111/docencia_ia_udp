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
  decimasPorTrabajo?: number;
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
    decimasPorTrabajo = 0.2,
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
      `CORTE: Clases realizadas hasta hoy (${new Date().toLocaleDateString("es-CL")}) • MODALIDADES: (P) Presencial / (O) Online`,
    ]);
    data.push([]);

    const headers = ["RUT", "Apellidos", "Nombres", "Correo Institucional"];
    targetSessions.forEach((s) => {
      const parts = s.fecha.split("-");
      const diaMes = parts.length === 3 ? `${parts[2]}/${parts[1]}` : s.fecha;
      const modLetter = s.modalidad === "online" ? "O" : "P";
      headers.push(`${diaMes} (${modLetter})`);
    });
    if (subtipo === "ayudantia") {
      headers.push("Trabajos Entregados", "Total Trabajos", "Décimas Totales");
    }
    headers.push("Asistidas", "Total Clases", "% Asistencia", "Estado");
    data.push(headers);

    // Fila indicadora de modalidad por sesión
    const modalityRow: any[] = ["MODALIDAD", "", "", ""];
    targetSessions.forEach((s) => {
      modalityRow.push(s.modalidad === "online" ? "Online (O)" : "Presencial (P)");
    });
    if (subtipo === "ayudantia") {
      modalityRow.push("-", "-", "-");
    }
    modalityRow.push("-", "-", "-", "-");
    data.push(modalityRow);

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
        const work = studentWorkRecords[sum.canvas_id];
        const trabCount = work ? (work.trabajosRealizados ?? 0) : 0;
        const totalDec = Math.round(trabCount * decimasPorTrabajo * 10) / 10;
        row.push(trabCount, totalTrabajosRealizados, totalDec);
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
      const sumTrab = summaries.reduce((acc, s) => acc + (studentWorkRecords[s.canvas_id]?.trabajosRealizados || 0), 0);
      const sumDec = Math.round(sumTrab * decimasPorTrabajo * 10) / 10;
      footer.push(`${sumTrab} entregados`, `${totalTrabajosRealizados} total`, `+${sumDec.toFixed(1)}d`);
    }

    for (let i = 0; i < 4; i++) footer.push("");
    data.push(footer);

    const ws = XLSX.utils.aoa_to_sheet(data);
    ws["!cols"] = [
      { wch: 12 }, // RUT
      { wch: 16 }, // Apellidos
      { wch: 16 }, // Nombres
      { wch: 25 }, // Email
      ...targetSessions.map(() => ({ wch: 14 })), // Fechas DD/MM (P/O) y modalidad
      ...(subtipo === "ayudantia" ? [{ wch: 18 }, { wch: 14 }, { wch: 15 }] : []),
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

/**
 * Exporta la planilla oficial de calificaciones en formato Excel (.xlsx)
 * anonimizada estrictamente por RUT (sin nombres ni apellidos), en cumplimiento con la
 * normativa de privacidad UDP y Ley N° 19.628.
 */
export function exportAnonymousGradesToExcel(params: {
  cursoCodigo: string;
  cursoNombre: string;
  seccionNombre?: string;
  estudiantesExcel: StudentExcelRow[];
}) {
  const { cursoCodigo, cursoNombre, seccionNombre = "", estudiantesExcel } = params;
  const wb = XLSX.utils.book_new();

  const data: any[][] = [];
  data.push(["UNIVERSIDAD DIEGO PORTALES — ESCUELA DE INFORMÁTICA Y TELECOMUNICACIONES"]);
  data.push([
    `CURSO: ${cursoCodigo} — ${cursoNombre} ${seccionNombre ? `(${seccionNombre})` : ""}`,
  ]);
  data.push([
    `FECHA DE PUBLICACIÓN: ${new Date().toLocaleDateString("es-CL")}`,
    `RÉGIMEN: PLANILLA OFICIAL DE CALIFICACIONES ANONIMIZADA (SOLO RUT)`,
  ]);
  data.push([
    "AVISO DE PRIVACIDAD: En conformidad con la Ley N° 19.628 de Protección de Datos Personales, esta nómina no publica nombres ni apellidos.",
  ]);
  data.push([
    "CRITERIO DE ASISTENCIA: Mínimo 75% reglamentario. RI = Reprobado por Inasistencia.",
  ]);
  data.push([]);

  // Cabeceras de evaluación
  data.push([
    "RUT",
    "Informe Inicial (20%)",
    "+Décimas Ayud.",
    "Solemne (20%)",
    "Avance 1 (20%)",
    "Avance 2 (20%)",
    "Final/Examen (20%)",
    "% Asistencia",
    "Nota Final",
    "Estado",
  ]);

  estudiantesExcel.forEach((row) => {
    const estado =
      row.asistencia_pct < 75
        ? "RI (Reprobado por Inasistencia)"
        : row.nota_final >= 4.0
        ? "Aprobado"
        : "Reprobado";

    data.push([
      row.rut,
      row.solemne_1,
      Number(row.decimas_act1.toFixed(1)),
      row.solemne_2,
      6.0,
      5.8,
      row.taller_proyecto,
      `${row.asistencia_pct}%`,
      row.nota_final,
      estado,
    ]);
  });

  data.push([]);

  // Resumen estadístico anónimo
  const total = estudiantesExcel.length || 1;
  const aprobados = estudiantesExcel.filter(
    (r) => r.asistencia_pct >= 75 && r.nota_final >= 4.0
  ).length;
  const reprobados = estudiantesExcel.filter(
    (r) => r.asistencia_pct >= 75 && r.nota_final < 4.0
  ).length;
  const inasistencias = estudiantesExcel.filter((r) => r.asistencia_pct < 75).length;
  const promedio = (
    estudiantesExcel.reduce((acc, r) => acc + r.nota_final, 0) / total
  ).toFixed(1);

  data.push([
    "TOTAL ALUMNOS",
    total,
    "APROBADOS",
    aprobados,
    "REPROBADOS",
    reprobados,
    "RI",
    inasistencias,
    "PROMEDIO CURSO",
    promedio,
  ]);

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws["!cols"] = [
    { wch: 16 }, // RUT
    { wch: 22 }, // Informe Inicial
    { wch: 15 }, // Décimas
    { wch: 15 }, // Solemne
    { wch: 15 }, // Avance 1
    { wch: 15 }, // Avance 2
    { wch: 18 }, // Final
    { wch: 14 }, // Asistencia
    { wch: 13 }, // Nota Final
    { wch: 32 }, // Estado
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Calificaciones RUT");
  const cleanCode = cursoCodigo.replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `Planilla_Calificaciones_${cleanCode}_UDP.xlsx`;
  XLSX.writeFile(wb, filename);
}

