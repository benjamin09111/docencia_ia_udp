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

export const TeacherAttendanceLogsWorkspace: React.FC<TeacherAttendanceLogsWorkspaceProps> = ({
  section,
  attendanceMap,
  onMarkPresent,
  onSyncBatch,
}) => {
  const sectionCode = section.codigo || section.id;
  const [dates, setDates] = useState<Array<{ date: string; total: number }>>([]);
  const [date, setDate] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);

  // Cargar lista de fechas que tienen marcajes reales de alumnos
  useEffect(() => {
    let alive = true;
    setDate("");
    fetchCheckinHistoryDates(sectionCode).then((list) => {
      if (!alive) return;
      setDates(list);
      setDate(list[0]?.date ?? "all");
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
      enabled: date !== "",
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
          <div className="p-8 text-center space-y-2">
            <ShieldCheck size={32} className="mx-auto text-emerald-600" />
            <p className="text-xs font-bold text-[#2D3B45]">Sin marcajes para este filtro</p>
            <p className="text-[11px] text-gray-500">Cuando un alumno marque su asistencia aparecerá aquí con su hora exacta.</p>
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
