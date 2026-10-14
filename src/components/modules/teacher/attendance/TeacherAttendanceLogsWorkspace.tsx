"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CourseSection } from "@/types/attendance";
import {
  CloudCheckinLog,
  fetchCheckinHistoryDates,
  fetchCheckinHistoryPage,
} from "@/services/attendanceCloudService";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { CanvasPagination } from "@/components/canvas/CanvasPagination";
import { CheckinHistoryTable } from "./CheckinHistoryTable";
import { Search, History, Calendar, ShieldCheck, Download, RotateCcw } from "lucide-react";

interface Filters {
  sectionCode: string;
  date: string;
  search: string;
}

const formatDateTime = (iso: string) => new Date(iso).toLocaleString("es-CL");
const fetchPage = ({ page, pageSize, filters }: { page: number; pageSize: number; filters: Filters }) =>
  fetchCheckinHistoryPage({ ...filters, page, pageSize });

export const TeacherAttendanceLogsWorkspace: React.FC<{ section: CourseSection }> = ({ section }) => {
  const sectionCode = section.codigo || section.id;
  const [dates, setDates] = useState<Array<{ date: string; total: number }>>([]);
  const [date, setDate] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);

  // Días con marcajes: por defecto se muestra la clase más reciente (nunca "todo el semestre")
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

  // Búsqueda con retardo para no consultar en cada tecla
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

  const handleCopy = useCallback(async (log: CloudCheckinLog) => {
    const text = `[ASISTENCIA UDP] ${log.studentName} marcó presente en la clase del ${log.date} (${sectionCode}) el ${formatDateTime(log.createdAt)} vía ${log.method}${log.scheduleLabel ? `, horario ${log.scheduleLabel}` : ""}.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLogId(log.id);
      setTimeout(() => setCopiedLogId(null), 2000);
    } catch {}
  }, [sectionCode]);

  // Exporta TODO el día filtrado (no solo la página visible), de a 100 por consulta
  const handleExportCSV = async () => {
    const all: CloudCheckinLog[] = [];
    for (let p = 1; p <= 50; p++) {
      const res = await fetchCheckinHistoryPage({ ...filters, page: p, pageSize: 100 });
      all.push(...res.rows);
      if (all.length >= res.total || res.rows.length === 0) break;
    }
    const q = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = "Clase,Registrado el,Estudiante,Email,Metodo,Horario\n" +
      all.map((l) => [l.date, formatDateTime(l.createdAt), l.studentName, l.studentEmail || "", l.method, l.scheduleLabel || ""].map(q).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `Marcajes_${sectionCode}_${date === "all" ? "todos" : date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3 animate-fadeIn">
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-[#2D3B45] flex items-center justify-center shrink-0">
            <History size={16} className="text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#2D3B45]">Marcajes de Asistencia</h3>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold rounded">
                {total} {total === 1 ? "alumno" : "alumnos"}
              </span>
            </div>
            <p className="text-xs text-[#6B7780]">Quién marcó su asistencia en {section.nombre}, y a qué día y hora.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-50 border border-[#C7CDD1] rounded-[4px] px-2 h-8">
            <Calendar size={13} className="text-gray-400" />
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-xs font-semibold bg-transparent text-[#2D3B45] focus:outline-hidden cursor-pointer"
            >
              {dates.map((d) => (
                <option key={d.date} value={d.date}>{d.date} ({d.total})</option>
              ))}
              <option value="all">Todos los días</option>
            </select>
          </div>

          <div className="relative w-full sm:w-48">
            <Search size={13} className="absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar estudiante..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-8 pl-7 pr-3 text-xs bg-gray-50 border border-[#C7CDD1] rounded-[4px] focus:bg-white focus:outline-hidden focus:border-[#008EE2]"
            />
          </div>

          <button type="button" onClick={reload} title="Recargar" className="h-8 w-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 border border-[#C7CDD1] rounded-[4px] cursor-pointer">
            <RotateCcw size={13} />
          </button>
          {total > 0 && (
            <button type="button" onClick={handleExportCSV} className="h-8 px-3 bg-white hover:bg-gray-50 text-[#2D3B45] border border-[#C7CDD1] rounded-[4px] text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <Download size={13} /> Exportar CSV
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#E0E3E6] rounded-[4px] overflow-hidden shadow-xs">
        {error ? (
          <div className="p-8 text-center text-xs text-rose-700 font-semibold">
            No se pudo cargar el historial. Revisa tu conexión y pulsa recargar.
          </div>
        ) : rows.length === 0 && !loading ? (
          <div className="p-8 text-center space-y-2">
            <ShieldCheck size={32} className="mx-auto text-emerald-600" />
            <p className="text-xs font-bold text-[#2D3B45]">Sin marcajes para este filtro</p>
            <p className="text-[11px] text-gray-500">Cuando un alumno marque su asistencia aparecerá aquí con su hora exacta.</p>
          </div>
        ) : (
          <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
            <CheckinHistoryTable logs={rows} copiedLogId={copiedLogId} onCopy={handleCopy} />
          </div>
        )}
        <CanvasPagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={setPageSize} disabled={loading} />
      </div>
    </div>
  );
};
