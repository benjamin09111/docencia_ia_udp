"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { CourseSection, AttendanceValue } from "@/types/attendance";
import {
  CloudCheckinLog,
  fetchCheckinHistoryDates,
  fetchCheckinHistoryPage,
} from "@/services/attendanceCloudService";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { CanvasPagination } from "@/components/canvas/CanvasPagination";
import { CheckinHistoryTable } from "./CheckinHistoryTable";
import { AttendanceLogsToolbar } from "./AttendanceLogsToolbar";
import { ShieldCheck } from "lucide-react";
import { useCheckinSheetSync } from "@/hooks/useCheckinSheetSync";

interface Filters {
  sectionCode: string;
  date: string;
  search: string;
}

interface TeacherAttendanceLogsWorkspaceProps {
  section: CourseSection;
  attendanceMap?: Record<string, AttendanceValue>;
  onMarkPresent?: (sessionCode: string, studentCanvasId: number) => Promise<boolean>;
  onSyncBatch?: (records: Array<{ sessionCode: string; studentCanvasId: number }>) => Promise<boolean>;
}

const formatDateTime = (iso: string) => new Date(iso).toLocaleString("es-CL");
const fetchPage = ({ page, pageSize, filters }: { page: number; pageSize: number; filters: Filters }) =>
  fetchCheckinHistoryPage({ ...filters, page, pageSize });

const CANONICAL_MAP: Record<string, string> = {
  sec_1: "CIT3203_CA01", sec_2: "CIT3203_CA02", sec_3: "CIT3203_CA03",
  sec_arq_emergentes: "CIT3100_CA02", sec_gestion_org: "CIT2206_CA01", sec_arq_soft: "CIT3000_CA02",
};

const resolveCode = (sec: CourseSection) => {
  if (sec.codigo && sec.codigo.startsWith("CIT")) return sec.codigo;
  return CANONICAL_MAP[sec.id] || CANONICAL_MAP[sec.codigo] || sec.codigo || sec.id;
};

export const TeacherAttendanceLogsWorkspace: React.FC<TeacherAttendanceLogsWorkspaceProps> = ({
  section,
  attendanceMap,
  onMarkPresent,
  onSyncBatch,
}) => {
  const sectionCode = resolveCode(section);
  const [dates, setDates] = useState<Array<{ date: string; total: number }>>([]);
  const [date, setDate] = useState<string>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);

  // Cargar lista de fechas que tienen marcajes reales de alumnos
  useEffect(() => {
    let alive = true;
    fetchCheckinHistoryDates(sectionCode).then((list) => {
      if (!alive) return;
      setDates(list);
    });
    return () => { alive = false; };
  }, [sectionCode]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const filters: Filters = { sectionCode, date: date === "all" ? "" : date, search };
  const { rows, total, page, pageSize, loading, error, setPage, setPageSize, reload } =
    usePaginatedQuery<CloudCheckinLog, Filters>(fetchPage, filters, {
      pageSize: 25,
      refreshMs: 20000,
      enabled: Boolean(sectionCode),
    });

  const [scheduleFilter, setScheduleFilter] = useState<"all" | "h1" | "h2">("all");

  const scheduleStats = useMemo(() => {
    const h2Count = rows.filter((r) => r.scheduleLabel?.includes("Horario 2") || r.scheduleLabel?.includes("Secundario")).length;
    const h1Count = rows.length - h2Count;
    return { total: rows.length, h1Count, h2Count };
  }, [rows]);

  const displayedRows = useMemo(() => {
    if (scheduleFilter === "h1") return rows.filter((r) => !r.scheduleLabel?.includes("Horario 2") && !r.scheduleLabel?.includes("Secundario"));
    if (scheduleFilter === "h2") return rows.filter((r) => r.scheduleLabel?.includes("Horario 2") || r.scheduleLabel?.includes("Secundario"));
    return rows;
  }, [rows, scheduleFilter]);

  const {
    isStudentPresentInSheet,
    missingInSheetLogs,
    markingLogIds,
    isSyncingAll,
    handleMarkSingle,
    handleSyncAllMissing,
  } = useCheckinSheetSync({ rows: displayedRows, attendanceMap, onMarkPresent, onSyncBatch });

  const handleCopy = useCallback(async (log: CloudCheckinLog) => {
    const text = `[ASISTENCIA UDP] ${log.studentName} marcó presente en la clase del ${log.date} (${sectionCode}) el ${formatDateTime(log.createdAt)} vía ${log.method}${log.scheduleLabel ? `, horario ${log.scheduleLabel}` : ""}.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLogId(log.id);
      setTimeout(() => setCopiedLogId(null), 2000);
    } catch {}
  }, [sectionCode]);

  const handleExportCSV = async () => {
    const all: CloudCheckinLog[] = [];
    for (let p = 1; p <= 50; p++) {
      const res = await fetchCheckinHistoryPage({ ...filters, page: p, pageSize: 100 });
      all.push(...res.rows);
      if (all.length >= res.total || res.rows.length === 0) break;
    }
    const q = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = "Clase,Registrado el,Estudiante,Email,Metodo,Horario,En Planilla\n" +
      all.map((l) => [
        l.date,
        formatDateTime(l.createdAt),
        l.studentName,
        l.studentEmail || "",
        l.method,
        l.scheduleLabel || "",
        isStudentPresentInSheet(l.sessionCode, l.studentCanvasId) ? "Presente (1)" : "Ausente (0)",
      ].map(q).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `Marcajes_${sectionCode}_${date === "all" ? "todos" : date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3 animate-fadeIn">
      <AttendanceLogsToolbar
        sectionName={section.nombre}
        total={total}
        dates={dates}
        date={date}
        onDateChange={setDate}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onReload={reload}
        onExportCSV={handleExportCSV}
        missingInSheetCount={missingInSheetLogs.length}
        onSyncAllMissing={handleSyncAllMissing}
        isSyncingAll={isSyncingAll}
        scheduleStats={scheduleStats}
        scheduleFilter={scheduleFilter}
        onScheduleFilterChange={setScheduleFilter}
      />

      <div className="bg-white border border-[#E0E3E6] rounded-[4px] overflow-hidden shadow-xs">
        {error ? (
          <div className="p-8 text-center text-xs text-rose-700 font-semibold">
            No se pudo cargar el historial. Revisa tu conexión y pulsa recargar.
          </div>
        ) : displayedRows.length === 0 && !loading ? (
          <div className="p-8 text-center space-y-2.5">
            <ShieldCheck size={32} className="mx-auto text-emerald-600" />
            <p className="text-xs font-bold text-[#2D3B45]">
              {scheduleFilter !== "all" ? `Sin marcajes para Horario ${scheduleFilter === "h2" ? "2" : "1"}` : date !== "all" ? `Sin marcajes para el día ${date}` : search ? `Sin resultados para "${search}"` : `Sin marcajes en ${section.nombre}`}
            </p>
            <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
              {scheduleFilter !== "all" || date !== "all" || search ? "Hay filtros activos que ocultan otros registros." : "Cuando un alumno marque su asistencia aparecerá aquí con su hora exacta."}
            </p>
            {(scheduleFilter !== "all" || date !== "all" || search) && (
              <button type="button" onClick={() => { setScheduleFilter("all"); setDate("all"); setSearchInput(""); setSearch(""); }} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-xs font-semibold rounded cursor-pointer transition-colors">
                Ver todo el historial de la sección
              </button>
            )}
          </div>
        ) : (
          <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
            <CheckinHistoryTable
              logs={displayedRows}
              copiedLogId={copiedLogId}
              onCopy={handleCopy}
              isStudentPresentInSheet={isStudentPresentInSheet}
              onMarkPresent={handleMarkSingle}
              markingLogIds={markingLogIds}
            />
          </div>
        )}
        <CanvasPagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={setPageSize} disabled={loading} />
      </div>
    </div>
  );
};
