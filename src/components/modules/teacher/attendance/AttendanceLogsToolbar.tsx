"use client";

import React from "react";
import { History, Calendar, Search, RotateCcw, Download, CheckCheck, AlertTriangle, Loader2 } from "lucide-react";

export interface AttendanceLogsToolbarProps {
  sectionName: string;
  total: number;
  dates: Array<{ date: string; total: number }>;
  date: string;
  onDateChange: (newDate: string) => void;
  searchInput: string;
  onSearchInputChange: (val: string) => void;
  onReload: () => void;
  onExportCSV: () => void;
  missingInSheetCount: number;
  onSyncAllMissing: () => void;
  isSyncingAll: boolean;
  scheduleStats?: { total: number; h1Count: number; h2Count: number };
  scheduleFilter?: "all" | "h1" | "h2";
  onScheduleFilterChange?: (f: "all" | "h1" | "h2") => void;
}

export const AttendanceLogsToolbar: React.FC<AttendanceLogsToolbarProps> = ({
  sectionName,
  total,
  dates,
  date,
  onDateChange,
  searchInput,
  onSearchInputChange,
  onReload,
  onExportCSV,
  missingInSheetCount,
  onSyncAllMissing,
  isSyncingAll,
  scheduleStats,
  scheduleFilter = "all",
  onScheduleFilterChange,
}) => {
  return (
    <div className="space-y-2">
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-[#2D3B45] flex items-center justify-center shrink-0">
            <History size={16} className="text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-[#2D3B45]">Marcajes de Asistencia</h3>
              <span className="px-2 py-0.5 bg-gray-100 text-[#2D3B45] border border-gray-300 text-[11px] font-bold rounded">
                Total: {total}
              </span>
              {scheduleStats && (
                <>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    H1: {scheduleStats.h1Count}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-300 text-[11px] font-bold rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#008EE2]"></span>
                    H2: {scheduleStats.h2Count}
                  </span>
                </>
              )}
              {missingInSheetCount > 0 && (
                <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold rounded flex items-center gap-1">
                  <AlertTriangle size={11} className="text-amber-600" />
                  {missingInSheetCount} sin registrar en planilla
                </span>
              )}
            </div>
            <p className="text-xs text-[#6B7780]">Historial inalterable de quién marcó en {sectionName}, con fecha y hora exacta.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {missingInSheetCount > 0 && (
            <button
              type="button"
              onClick={onSyncAllMissing}
              disabled={isSyncingAll}
              className="h-8 px-3 bg-[#B71C1C] hover:bg-[#8B0000] text-white rounded-[4px] text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors disabled:opacity-50"
              title="Poner como presentes en la planilla a todos los alumnos que marcaron en el portal"
            >
              {isSyncingAll ? <Loader2 size={13} className="animate-spin" /> : <CheckCheck size={13} />}
              <span>Sincronizar a Planilla ({missingInSheetCount})</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-gray-50 border border-[#C7CDD1] rounded-[4px] px-2 h-8">
            <Calendar size={13} className="text-gray-400" />
            <select
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="text-xs font-semibold bg-transparent text-[#2D3B45] focus:outline-hidden cursor-pointer"
            >
              {dates.map((d) => (
                <option key={d.date} value={d.date}>{d.date} ({d.total})</option>
              ))}
              <option value="all">Todos los días</option>
            </select>
          </div>

          {onScheduleFilterChange && (
            <div className="flex items-center bg-gray-100 p-0.5 rounded border border-[#C7CDD1] text-xs h-8">
              <button
                type="button"
                onClick={() => onScheduleFilterChange("all")}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  scheduleFilter === "all" ? "bg-white text-[#2D3B45] shadow-xs" : "text-[#6B7780] hover:text-[#2D3B45]"
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => onScheduleFilterChange("h1")}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  scheduleFilter === "h1" ? "bg-emerald-600 text-white shadow-xs" : "text-[#6B7780] hover:text-emerald-800"
                }`}
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => onScheduleFilterChange("h2")}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  scheduleFilter === "h2" ? "bg-[#008EE2] text-white shadow-xs" : "text-[#6B7780] hover:text-blue-800"
                }`}
              >
                H2
              </button>
            </div>
          )}

          <div className="relative w-full sm:w-44">
            <Search size={13} className="absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar estudiante..."
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              className="w-full h-8 pl-7 pr-3 text-xs bg-gray-50 border border-[#C7CDD1] rounded-[4px] focus:bg-white focus:outline-hidden focus:border-[#008EE2]"
            />
          </div>

          <button
            type="button"
            onClick={onReload}
            title="Recargar historial"
            className="h-8 w-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 border border-[#C7CDD1] rounded-[4px] cursor-pointer"
          >
            <RotateCcw size={13} />
          </button>

          {total > 0 && (
            <button
              type="button"
              onClick={onExportCSV}
              className="h-8 px-3 bg-white hover:bg-gray-50 text-[#2D3B45] border border-[#C7CDD1] rounded-[4px] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={13} /> Exportar CSV
            </button>
          )}
        </div>
      </div>

      {missingInSheetCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-[4px] p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-600 shrink-0" />
            <span>
              Hay <strong>{missingInSheetCount}</strong> {missingInSheetCount === 1 ? "alumno que registró" : "alumnos que registraron"} asistencia pero figuran ausentes (0) en la planilla. Puedes sincronizarlos uno a uno o todos juntos.
            </span>
          </div>
          <button
            type="button"
            onClick={onSyncAllMissing}
            disabled={isSyncingAll}
            className="px-2.5 py-1 bg-[#B71C1C] hover:bg-[#8B0000] text-white font-bold text-[11px] rounded shadow-xs cursor-pointer shrink-0 self-start sm:self-auto"
          >
            Ponerles Presente a Todos ({missingInSheetCount})
          </button>
        </div>
      )}
    </div>
  );
};
