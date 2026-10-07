"use client";

import React, { useState, useMemo } from "react";
import { ClassSession, StudentAttendanceSummary, AttendanceValue, TodaySessionInfo, StudentWorkRecord } from "@/types/attendance";
import { Check, X, AlertTriangle, ChevronDown, ChevronRight, ChevronsRight, ChevronsLeft, Calendar, Zap, Award, CalendarX, Ban } from "lucide-react";

interface AttendanceMatrixTableProps {
  sessions: ClassSession[];
  summaries: StudentAttendanceSummary[];
  attendanceMap: Record<string, AttendanceValue>;
  filterType?: "catedras" | "ayudantias";
  incluirAyudantiasEnFinal?: boolean;
  todaySessionInfo?: TodaySessionInfo;
  showOnlyUpToToday?: boolean;
  onToggleShowOnlyUpToToday?: () => void;
  studentWorkRecords?: Record<number, StudentWorkRecord>;
  totalTrabajosRealizados?: number;
  onUpdateTotalTrabajos?: (total: number) => void;
  decimasPorTrabajo?: number;
  onUpdateDecimasPorTrabajo?: (val: number) => void;
  onUpdateWorkRecord?: (studentId: number, decimas: number, trabajosRealizados: number) => void;
  onToggleAttendance: (sessionId: string, studentId: number) => void;
  onOpenCancelModal: (session: ClassSession) => void;
  onReactivateSession?: (sessionId: string) => void;
  onToggleModality?: (sessionId: string) => void;
}

const MONTH_NAMES: Record<string, { short: string; full: string }> = {
  "01": { short: "Ene", full: "Enero" },
  "02": { short: "Feb", full: "Febrero" },
  "03": { short: "Mar", full: "Marzo" },
  "04": { short: "Abr", full: "Abril" },
  "05": { short: "May", full: "Mayo" },
  "06": { short: "Jun", full: "Junio" },
  "07": { short: "Jul", full: "Julio" },
  "08": { short: "Ago", full: "Agosto" },
  "09": { short: "Sep", full: "Septiembre" },
  "10": { short: "Oct", full: "Octubre" },
  "11": { short: "Nov", full: "Noviembre" },
  "12": { short: "Dic", full: "Diciembre" },
};

const STORAGE_COLLAPSED_KEY = "udp_attendance_collapsed_months_v1";

export const AttendanceMatrixTable: React.FC<AttendanceMatrixTableProps> = ({
  sessions,
  summaries,
  attendanceMap,
  filterType = "catedras",
  incluirAyudantiasEnFinal = false,
  todaySessionInfo,
  showOnlyUpToToday = true,
  onToggleShowOnlyUpToToday,
  studentWorkRecords = {},
  totalTrabajosRealizados = 3,
  onUpdateTotalTrabajos,
  decimasPorTrabajo = 0.2,
  onUpdateDecimasPorTrabajo,
  onUpdateWorkRecord,
  onToggleAttendance,
  onOpenCancelModal,
  onReactivateSession,
  onToggleModality,
}) => {
  const isAyud = filterType === "ayudantias";
  const hasSessionToday = Boolean(todaySessionInfo?.todaySession);

  // Agrupar sesiones por mes cronológico
  const monthGroups = useMemo(() => {
    const groups: {
      key: string;
      monthNum: string;
      name: string;
      shortName: string;
      sessions: ClassSession[];
    }[] = [];

    sessions.forEach((s) => {
      const parts = s.fecha.split("-");
      const key = `${parts[0]}-${parts[1]}`;
      const mNum = parts[1];
      let grp = groups.find((g) => g.key === key);
      if (!grp) {
        const meta = MONTH_NAMES[mNum] || { short: mNum, full: `Mes ${mNum}` };
        grp = {
          key,
          monthNum: mNum,
          name: meta.full,
          shortName: meta.short,
          sessions: [],
        };
        groups.push(grp);
      }
      grp.sessions.push(s);
    });

    return groups;
  }, [sessions]);

  // Estado de meses colapsados con persistencia en localStorage (parte todo abierto por defecto)
  const [collapsedMonths, setCollapsedMonths] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COLLAPSED_KEY);
      if (saved) setCollapsedMonths(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const toggleMonth = (monthKey: string) => {
    setCollapsedMonths((prev) => {
      const next = { ...prev, [monthKey]: !prev[monthKey] };
      try {
        localStorage.setItem(STORAGE_COLLAPSED_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Error guardando meses colapsados", e);
      }
      return next;
    });
  };

  const expandAll = () => {
    setCollapsedMonths({});
    try {
      localStorage.setItem(STORAGE_COLLAPSED_KEY, JSON.stringify({}));
    } catch (e) {
      console.error(e);
    }
  };

  const collapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    monthGroups.forEach((g) => {
      allCollapsed[g.key] = true;
    });
    setCollapsedMonths(allCollapsed);
    try {
      localStorage.setItem(STORAGE_COLLAPSED_KEY, JSON.stringify(allCollapsed));
    } catch (e) {
      console.error(e);
    }
  };

  const anyCollapsed = Object.values(collapsedMonths).some(Boolean);

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card overflow-hidden">
      {/* Barra de control de meses horizontales */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3 py-2 bg-[#FAFBFB] border-b border-[#E0E3E6] text-xs gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-[#2D3B45]">
          <Calendar size={14} className="text-[#008EE2] shrink-0" />
          <span className="font-semibold">Acordeón Horizontal por Meses:</span>
          <span className="text-[11px] text-[#6B7780]">
            Haz clic en la cabecera de cualquier mes para contraerlo/expandirlo y ahorrar espacio
          </span>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto flex-wrap">
          {onToggleShowOnlyUpToToday && (
            <button
              type="button"
              onClick={onToggleShowOnlyUpToToday}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                showOnlyUpToToday
                  ? "bg-blue-50 border-blue-300 text-[#008EE2]"
                  : "bg-white border-gray-300 text-[#6B7780] hover:text-[#2D3B45]"
              }`}
              title="Alternar entre ver solo las fechas hasta hoy o todo el semestre"
            >
              <Calendar size={12} className={showOnlyUpToToday ? "text-[#008EE2]" : "text-gray-400"} />
              <span>{showOnlyUpToToday ? "Fechas a la fecha (Hasta hoy)" : "Semestre completo"}</span>
            </button>
          )}

          {anyCollapsed ? (
            <button
              type="button"
              onClick={expandAll}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-300 hover:bg-gray-50 rounded text-[11px] font-medium text-[#2D3B45] transition-colors"
            >
              <ChevronsRight size={12} className="text-[#008EE2]" />
              Expandir todos
            </button>
          ) : (
            <button
              type="button"
              onClick={collapseAll}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-300 hover:bg-gray-50 rounded text-[11px] font-medium text-[#2D3B45] transition-colors"
            >
              <ChevronsLeft size={12} className="text-[#C8102E]" />
              Contraer todos
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto max-w-full">
        <table className="w-full text-xs border-collapse min-w-[760px]">
          <thead>
            {/* Fila 1: Grupos de Meses (Acordeones Horizontales) */}
            <tr className="bg-[#2D3B45] text-white border-b border-gray-700">
              <th
                rowSpan={2}
                className="p-2 text-left sticky left-0 z-20 bg-[#2D3B45] w-[150px] min-w-[140px] max-w-[160px] text-[11px] font-bold uppercase tracking-wider border-r border-white/20"
              >
                Estudiante
              </th>

              {/* Columna de Asistencia Rápida: Hoy */}
              <th
                rowSpan={2}
                className="p-1 px-1 text-center bg-[#1E272E] text-white border-r border-white/20 w-[96px] min-w-[92px] text-[10px] font-bold uppercase"
                title={
                  hasSessionToday
                    ? `Sesión activa de hoy (${todaySessionInfo?.todayDateStr}). Clic para marcar presencia`
                    : `Hoy (${todaySessionInfo?.diaActualNombre}) no hay clase programada. Horario: ${todaySessionInfo?.diasConfigurados}`
                }
              >
                <div className="flex flex-col items-center justify-center leading-tight">
                  <span className="text-[#008EE2] font-extrabold flex items-center gap-1">
                    <Zap size={11} className={hasSessionToday ? "text-amber-400 fill-amber-400" : "text-gray-400"} />
                    <span>Asist. Hoy</span>
                  </span>
                  <span className="text-[9px] text-gray-300 font-mono">
                    {hasSessionToday ? todaySessionInfo?.todayDateStr.slice(5) : "Sin Clase"}
                  </span>
                </div>
              </th>

              {monthGroups.map((grp) => {
                const isCollapsed = Boolean(collapsedMonths[grp.key]);

                if (isCollapsed) {
                  return (
                    <th
                      key={grp.key}
                      rowSpan={2}
                      onClick={() => toggleMonth(grp.key)}
                      className="p-1 px-1.5 text-center bg-[#1E272E] hover:bg-[#25323B] cursor-pointer border-l border-white/20 select-none transition-colors w-[46px] min-w-[44px] group"
                      title={`Mes ${grp.name} contraído. Haz clic para expandir las ${grp.sessions.length} clases`}
                    >
                      <div className="flex flex-col items-center justify-center gap-0.5 py-1">
                        <div className="flex items-center gap-0.5 text-blue-300 group-hover:text-white">
                          <ChevronRight size={12} />
                          <span className="text-[11px] font-extrabold font-mono uppercase">
                            {grp.shortName}
                          </span>
                        </div>
                        <span className="text-[9px] text-gray-400 font-normal leading-none">
                          {grp.sessions.length} cl.
                        </span>
                        <span className="text-[8px] text-emerald-400 font-mono mt-0.5 bg-emerald-950/60 px-1 py-0.2 rounded">
                          Ver +
                        </span>
                      </div>
                    </th>
                  );
                }

                return (
                  <th
                    key={grp.key}
                    colSpan={grp.sessions.length}
                    onClick={() => toggleMonth(grp.key)}
                    className="p-1.5 text-center bg-[#25323B] hover:bg-[#1E272E] cursor-pointer border-l border-white/20 select-none transition-colors group"
                    title={`Haz clic para contraer el mes de ${grp.name}`}
                  >
                    <div className="flex items-center justify-center gap-1.5 text-white/95">
                      <ChevronDown size={13} className="text-[#008EE2] group-hover:text-white" />
                      <span className="text-[11px] font-bold tracking-wide uppercase">
                        {grp.name}
                      </span>
                      <span className="text-[10px] text-gray-300 font-normal font-mono bg-black/20 px-1.5 py-0.2 rounded">
                        {grp.sessions.length} {grp.sessions.length === 1 ? "clase" : "clases"}
                      </span>
                    </div>
                  </th>
                );
              })}

              {/* Resúmenes Contextuales según Tab */}
              {isAyud && (
                <>
                  <th
                    rowSpan={2}
                    className="p-1 px-1.5 text-center bg-[#1E272E] text-white border-l border-white/20 w-[96px] min-w-[90px] text-[10px] font-bold uppercase"
                    title="Trabajos en ayudantía realizados por el alumno / Total de trabajos a la fecha"
                  >
                    <div className="flex flex-col items-center justify-center leading-tight gap-0.5">
                      <span className="text-amber-300 font-extrabold flex items-center gap-1">
                        <Award size={11} />
                        <span>Trabajos</span>
                      </span>
                      <div className="flex items-center gap-1 text-[9px] text-gray-300 font-normal">
                        <span>Total:</span>
                        <input
                          type="number"
                          min={0}
                          max={50}
                          value={totalTrabajosRealizados}
                          onChange={(e) => onUpdateTotalTrabajos && onUpdateTotalTrabajos(Math.max(0, parseInt(e.target.value, 10) || 0))}
                          className="w-7 h-4 text-center font-bold text-[10px] bg-black/40 border border-amber-300/50 rounded text-amber-200 focus:outline-none focus:border-amber-400"
                          title="Total de trabajos realizados a la fecha para toda la sección"
                        />
                      </div>
                    </div>
                  </th>
                  <th
                    rowSpan={2}
                    className="p-1 px-1.5 text-center bg-[#1E272E] text-white border-l border-white/10 w-[88px] min-w-[80px] text-[10px] font-bold uppercase"
                    title="Décimas asignadas por trabajo y décimas totales acumuladas a la fecha"
                  >
                    <div className="flex flex-col items-center justify-center leading-tight gap-0.5">
                      <span className="text-emerald-300 font-extrabold flex items-center gap-0.5">
                        <span>Décimas</span>
                      </span>
                      <div className="flex items-center gap-0.5 text-[9px] text-gray-300 font-normal">
                        <span>c/u:</span>
                        <input
                          type="number"
                          step="0.1"
                          min={0}
                          max={5}
                          value={decimasPorTrabajo}
                          onChange={(e) => onUpdateDecimasPorTrabajo && onUpdateDecimasPorTrabajo(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-8 h-4 text-center font-bold text-[10px] bg-black/40 border border-emerald-300/50 rounded text-emerald-200 focus:outline-none focus:border-emerald-400"
                          title="Décimas otorgadas por cada trabajo entregado (ej. 0.2)"
                        />
                      </div>
                    </div>
                  </th>
                </>
              )}
              <th
                rowSpan={2}
                className="p-1 text-center bg-[#1E272E] text-white border-l border-white/20 w-[54px] min-w-[50px] text-[10px] font-bold uppercase"
                title={isAyud ? "Asistencia a Ayudantías" : "Asistencia a Cátedras"}
              >
                {isAyud ? "Ayud." : "Cát."}
              </th>
              <th
                rowSpan={2}
                className="p-1 text-center bg-[#1E272E] text-white border-l border-white/10 w-[48px] min-w-[44px] text-[10px] font-bold uppercase"
              >
                %
              </th>
              <th
                rowSpan={2}
                className="p-1 text-center bg-[#1E272E] text-white border-l border-white/10 w-[46px] min-w-[42px] text-[10px] font-bold uppercase"
              >
                Estado
              </th>
            </tr>

            {/* Fila 2: Columnas de Fechas individuales (solo de meses expandidos) */}
            <tr className="bg-[#1E272E] text-white border-b border-gray-700">
              {monthGroups.map((grp) => {
                const isCollapsed = Boolean(collapsedMonths[grp.key]);
                if (isCollapsed) return null;

                return grp.sessions.map((s) => {
                  const parts = s.fecha.split("-");
                  const diaMes = parts.length === 3 ? `${parts[2]}/${parts[1]}` : s.fecha;
                  const isCancelled = s.estado === "cancelada";

                  return (
                    <th
                      key={s.id}
                      className={`p-1 text-center border-l border-white/10 w-[42px] min-w-[38px] max-w-[44px] transition-colors ${
                        isCancelled ? "bg-rose-950/80 border-rose-900" : "bg-[#1E272E]"
                      }`}
                      title={
                        isCancelled
                          ? `Sesión CANCELADA (${s.motivoCancelacion || "Sin clase"}). Clic para reactivar o ver motivo`
                          : `Ayudantía del ${s.fecha} (${s.diaSemana}). Clic en el calendario para marcar que no hubo clase`
                      }
                    >
                      <div className="flex flex-col items-center justify-center leading-none py-1">
                        <span
                          className={`text-[11px] font-bold font-mono tracking-tight ${
                            isCancelled ? "line-through text-rose-300" : "text-white"
                          }`}
                        >
                          {diaMes}
                        </span>

                        <div className="flex items-center justify-center gap-0.5 mt-1">
                          {!isCancelled ? (
                            <>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleModality?.(s.id);
                                }}
                                title={`Modalidad actual: ${s.modalidad === "online" ? "Online (O)" : "Presencial (P)"}. Clic para cambiar P/O`}
                                className={`w-3.5 h-3.5 rounded text-[8px] font-black uppercase flex items-center justify-center transition-all cursor-pointer ${
                                  s.modalidad === "online"
                                    ? "bg-purple-600 hover:bg-purple-500 text-white shadow-sm ring-1 ring-purple-400"
                                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm ring-1 ring-emerald-400"
                                }`}
                              >
                                {s.modalidad === "online" ? "O" : "P"}
                              </button>

                              <button
                                type="button"
                                title="Marcar que NO hubo ayudantía / suspender clase"
                                onClick={() => onOpenCancelModal(s)}
                                className="p-0.5 hover:bg-rose-900/60 rounded text-gray-400 hover:text-rose-300 transition-colors"
                              >
                                <CalendarX size={11} />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onOpenCancelModal(s)}
                              title={`Sesión suspendida: ${s.motivoCancelacion || "Sin clase"}. Clic para reactivar`}
                              className="px-1 py-0.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded text-[8px] font-bold uppercase transition-colors"
                            >
                              Susp.
                            </button>
                          )}
                        </div>
                      </div>
                    </th>
                  );
                });
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {summaries.map((sum) => {
              const asist = isAyud ? sum.ayudantiasAsistidas : sum.catedrasAsistidas;
              const val = isAyud ? sum.ayudantiasValidas : sum.catedrasValidas;
              const pct = isAyud ? sum.ayudantiasPct : sum.totalPct;

              return (
                <tr key={sum.canvas_id} className="hover:bg-blue-50/20 transition-colors">
                  {/* Nombre Estudiante (Sticky) */}
                  <td className="p-1.5 px-2 sticky left-0 z-10 bg-white border-r border-gray-200 w-[150px] min-w-[140px] max-w-[160px]">
                    <div
                      className="font-semibold text-[#2D3B45] text-xs truncate"
                      title={`${sum.apellidos}, ${sum.nombres}`}
                    >
                      {sum.nombres.split(" ")[0]} {sum.apellidos.split(" ")[0]}
                    </div>
                  </td>

                  {/* Celda Asistencia Hoy */}
                  <td className="p-1 text-center border-r border-gray-200 bg-blue-50/20 w-[96px]">
                    {hasSessionToday && todaySessionInfo?.todaySession ? (
                      <button
                        type="button"
                        onClick={() => onToggleAttendance(todaySessionInfo.todaySession!.id, sum.canvas_id)}
                        className={`px-2 py-1 text-[11px] font-bold rounded-[3px] transition-all active:scale-90 inline-flex items-center gap-1 ${
                          (attendanceMap[`${todaySessionInfo.todaySession.id}_${sum.canvas_id}`] ?? 0) === 1
                            ? "bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700"
                            : "bg-white border border-[#008EE2] text-[#008EE2] hover:bg-blue-50"
                        }`}
                        title={
                          (attendanceMap[`${todaySessionInfo.todaySession.id}_${sum.canvas_id}`] ?? 0) === 1
                            ? "Presente hoy (clic para alternar)"
                            : "Marcar presente hoy"
                        }
                      >
                        {(attendanceMap[`${todaySessionInfo.todaySession.id}_${sum.canvas_id}`] ?? 0) === 1 ? (
                          <>
                            <Check size={11} className="stroke-[3]" />
                            <span>Presente</span>
                          </>
                        ) : (
                          <span>Marcar</span>
                        )}
                      </button>
                    ) : (
                      <span
                        className="text-[10px] text-gray-400 font-mono block"
                        title={`Hoy no hay ayudantía. Próxima: ${todaySessionInfo?.nextSession?.fecha || "N/A"}`}
                      >
                        -
                      </span>
                    )}
                  </td>

                  {/* Celdas por Mes (Expandidas o Contraídas) */}
                  {monthGroups.map((grp) => {
                    const isCollapsed = Boolean(collapsedMonths[grp.key]);

                    // Si el mes está colapsado: muestra una sola celda compacta con el acumulado mensual
                    if (isCollapsed) {
                      const activeSessionsInGrp = grp.sessions.filter((s) => s.estado !== "cancelada");
                      const mesAsistidas = activeSessionsInGrp.filter(
                        (s) => attendanceMap[`${s.id}_${sum.canvas_id}`] === 1
                      ).length;
                      const mesTotal = activeSessionsInGrp.length;
                      const mesPct = mesTotal > 0 ? Math.round((mesAsistidas / mesTotal) * 100) : 0;

                      return (
                        <td
                          key={grp.key}
                          className="p-1 text-center bg-gray-50/70 border-l border-gray-200 w-[46px] min-w-[44px]"
                          title={`${grp.name}: ${mesAsistidas} de ${mesTotal} asistencias (${mesPct}%)`}
                        >
                          <div className="flex flex-col items-center justify-center leading-tight">
                            <span
                              className={`text-[10px] font-bold font-mono ${
                                mesPct >= 75 ? "text-emerald-700" : "text-[#C8102E]"
                              }`}
                            >
                              {mesAsistidas}/{mesTotal}
                            </span>
                            <span className="text-[9px] text-gray-500 font-mono">
                              {mesPct}%
                            </span>
                          </div>
                        </td>
                      );
                    }

                    // Si el mes está expandido: muestra cada fecha normalmente con botón 1 / 0 (o guión si está cancelada)
                    return grp.sessions.map((s) => {
                      const isCancelled = s.estado === "cancelada";

                      if (isCancelled) {
                        return (
                          <td
                            key={s.id}
                            className="p-0.5 text-center border-l border-gray-100 w-[42px] bg-gray-50/80"
                            title={`Sesión cancelada (${s.motivoCancelacion || "Sin clase"}). Clic para reactivar y registrar asistencia.`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                if (onReactivateSession) {
                                  onReactivateSession(s.id);
                                }
                                onToggleAttendance(s.id, sum.canvas_id);
                              }}
                              className="w-6 h-6 rounded-[2px] font-mono text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 text-xs inline-flex items-center justify-center select-none bg-gray-100 border border-gray-200 transition-colors cursor-pointer"
                              title="Sesión suspendida. Clic para reactivar y registrar asistencia"
                            >
                              —
                            </button>
                          </td>
                        );
                      }

                      const key = `${s.id}_${sum.canvas_id}`;
                      const val = attendanceMap[key] ?? 0;

                      return (
                        <td key={s.id} className="p-0.5 text-center border-l border-gray-100 w-[42px]">
                          <button
                            type="button"
                            onClick={() => onToggleAttendance(s.id, sum.canvas_id)}
                            className={`w-6 h-6 rounded-[2px] font-bold text-[11px] transition-all active:scale-90 inline-flex items-center justify-center ${
                              val === 1
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                            }`}
                          >
                            {val === 1 ? "1" : "0"}
                          </button>
                        </td>
                      );
                    });
                  })}

                  {/* Trabajos Realizados y Décimas Calculadas */}
                  {isAyud && (
                    <>
                      {/* Columna 1: Trabajos Realizados / Total */}
                      <td className="p-1 text-center bg-amber-50/20 border-l border-gray-200 w-[96px]">
                        <div className="flex items-center justify-center gap-1 font-mono text-xs">
                          <input
                            type="number"
                            min={0}
                            max={totalTrabajosRealizados || 50}
                            value={studentWorkRecords[sum.canvas_id]?.trabajosRealizados ?? 0}
                            onChange={(e) => {
                              const trab = Math.max(0, parseInt(e.target.value, 10) || 0);
                              const dec = Math.round(trab * decimasPorTrabajo * 10) / 10;
                              onUpdateWorkRecord && onUpdateWorkRecord(sum.canvas_id, dec, trab);
                            }}
                            className="w-8 h-6 text-center font-bold text-amber-950 bg-amber-100/70 border border-amber-300 rounded focus:bg-white focus:border-[#008EE2] focus:outline-hidden"
                            title="Trabajos entregados por este estudiante"
                          />
                          <span className="text-gray-400 font-bold">/</span>
                          <span
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 rounded"
                            title={`Total de trabajos a la fecha: ${totalTrabajosRealizados}`}
                          >
                            {totalTrabajosRealizados}
                          </span>
                        </div>
                      </td>

                      {/* Columna 2: Décimas Totales Calculadas */}
                      <td className="p-1 text-center bg-emerald-50/25 border-l border-gray-200 w-[88px]">
                        {(() => {
                          const trab = studentWorkRecords[sum.canvas_id]?.trabajosRealizados ?? 0;
                          const dec = Math.round(trab * decimasPorTrabajo * 10) / 10;
                          return (
                            <span
                              className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                                dec > 0
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : "text-gray-400 bg-gray-50 border border-gray-200"
                              }`}
                              title={`${trab} trabajo(s) × ${decimasPorTrabajo} déc. = +${dec.toFixed(1)} décimas`}
                            >
                              {dec > 0 ? `+${dec.toFixed(1)}d` : "0.0d"}
                            </span>
                          );
                        })()}
                      </td>
                    </>
                  )}

                  {/* Resúmenes Globales y Condición RI */}
                  <td className="p-1 text-center font-mono text-[11px] text-[#2D3B45] bg-gray-50/80 border-l border-gray-200">
                    {asist}/{val}
                  </td>
                  <td className="p-1 text-center font-bold text-xs bg-gray-50/80">
                    <span className={pct >= 75 ? "text-emerald-700" : "text-[#C8102E]"}>
                      {pct}%
                    </span>
                  </td>
                  <td className="p-1 text-center bg-gray-50/80">
                    {sum.enRiesgoRI ? (
                      <span className="text-[9px] font-bold text-white bg-[#C8102E] px-1.5 py-0.5 rounded inline-block" title="Bajo 75% mínimo de asistencia">
                        RI
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded inline-block" title="Habilitado (75% o más)">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Fila Totalizadora Inferior */}
          <tfoot>
            <tr className="bg-gray-100 font-extrabold text-[#2D3B45] border-t border-gray-300">
              <td className="p-1.5 px-2 sticky left-0 z-10 bg-gray-100 border-r border-gray-300 uppercase text-[10px] text-gray-600">
                Total Presentes
              </td>

              {/* Total Hoy */}
              <td className="p-1 text-center font-mono text-[11px] border-r border-gray-300 bg-gray-200/40">
                {hasSessionToday && todaySessionInfo?.todaySession ? (
                  <span className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-emerald-800 font-bold">
                    {summaries.filter((s) => attendanceMap[`${todaySessionInfo.todaySession!.id}_${s.canvas_id}`] === 1).length}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400">-</span>
                )}
              </td>

              {monthGroups.map((grp) => {
                const isCollapsed = Boolean(collapsedMonths[grp.key]);

                if (isCollapsed) {
                  // Promedio de presentes en el mes contraído
                  const totalPresentesMes = grp.sessions.reduce((acc, sess) => {
                    return acc + summaries.filter((sum) => attendanceMap[`${sess.id}_${sum.canvas_id}`] === 1).length;
                  }, 0);
                  const promMes = grp.sessions.length > 0 ? Math.round(totalPresentesMes / grp.sessions.length) : 0;

                  return (
                    <td
                      key={grp.key}
                      className="p-1 text-center font-mono text-[10px] border-l border-gray-200 bg-gray-200/50"
                      title={`Promedio de presentes por clase en ${grp.name}: ${promMes}`}
                    >
                      <span className="px-1 py-0.5 bg-white border border-gray-300 rounded text-[#2D3B45] font-bold">
                        ~{promMes}
                      </span>
                    </td>
                  );
                }

                return grp.sessions.map((s) => {
                  const count = summaries.filter((sum) => attendanceMap[`${s.id}_${sum.canvas_id}`] === 1).length;
                  return (
                    <td key={`tot_${s.id}`} className="p-1 text-center font-mono text-[11px] border-l border-gray-200">
                      <span className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-emerald-800 font-bold">
                        {count}
                      </span>
                    </td>
                  );
                });
              })}

              {isAyud && (
                <>
                  <td className="p-1 text-center font-mono text-[10px] border-l border-gray-300 bg-amber-50 text-amber-950 font-bold">
                    {summaries.reduce((acc, s) => acc + (studentWorkRecords[s.canvas_id]?.trabajosRealizados || 0), 0)} trab.
                  </td>
                  <td className="p-1 text-center font-mono text-[10px] border-l border-gray-300 bg-emerald-50 text-emerald-950 font-bold">
                    +{summaries.reduce((acc, s) => acc + ((studentWorkRecords[s.canvas_id]?.trabajosRealizados || 0) * decimasPorTrabajo), 0).toFixed(1)}d
                  </td>
                </>
              )}

              <td colSpan={3} className="p-1 text-center text-[10px] text-[#6B7780] font-medium border-l border-gray-300">
                75% Mín. UDP
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
