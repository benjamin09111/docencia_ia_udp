"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { CourseSection } from "@/types/attendance";
import { CloudCheckinLog, fetchCheckinLogs } from "@/services/attendanceCloudService";
import { Search, History, Calendar, KeyRound, UserCheck, ShieldCheck, Download, Copy, Check, RotateCcw } from "lucide-react";

interface TeacherAttendanceLogsWorkspaceProps {
  section: CourseSection;
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
const formatDateTime = (iso: string) => new Date(iso).toLocaleString("es-CL");

export const TeacherAttendanceLogsWorkspace: React.FC<TeacherAttendanceLogsWorkspaceProps> = ({ section }) => {
  const [logs, setLogs] = useState<CloudCheckinLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("todas");
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);

  const sectionCode = section.codigo || section.id;
  const refreshLogs = useCallback(() => {
    fetchCheckinLogs(sectionCode).then(setLogs);
  }, [sectionCode]);

  // El historial vive en Supabase: se recarga periódicamente para ver marcajes en vivo
  useEffect(() => {
    refreshLogs();
    const interval = setInterval(refreshLogs, 15000);
    return () => clearInterval(interval);
  }, [refreshLogs]);

  const availableDates = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.date));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (selectedDateFilter !== "todas" && l.date !== selectedDateFilter) return false;
      if (!searchTerm) return true;
      const lower = searchTerm.toLowerCase();
      return (
        l.studentName.toLowerCase().includes(lower) ||
        (l.studentEmail && l.studentEmail.toLowerCase().includes(lower)) ||
        l.method.toLowerCase().includes(lower)
      );
    });
  }, [logs, selectedDateFilter, searchTerm]);

  const handleCopySingleLog = async (log: CloudCheckinLog) => {
    const accion = log.value === 1 ? "quedó PRESENTE" : "quedó AUSENTE";
    const text = `[HISTORIAL ASISTENCIA UDP] ${log.studentName} ${accion} en la clase del ${log.date} (${section.codigo}). Registrado el ${formatDateTime(log.createdAt)} vía ${log.method}${log.scheduleLabel ? `, horario ${log.scheduleLabel}` : ""}.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLogId(log.id);
      setTimeout(() => setCopiedLogId(null), 2000);
    } catch {}
  };

  const handleExportLogsCSV = () => {
    if (filteredLogs.length === 0) return;
    const header = "Clase,Registrado el,Estudiante,Email,Valor,Metodo,Horario\n";
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.date}","${formatDateTime(l.createdAt)}","${l.studentName}","${l.studentEmail || ""}","${l.value}","${l.method}","${l.scheduleLabel || ""}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Historial_Asistencia_${section.codigo || "UDP"}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3 animate-fadeIn">
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-[#2D3B45] text-white flex items-center justify-center font-bold shrink-0">
            <History size={16} className="text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#2D3B45]">Historial Auditable de Registros</h3>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold rounded">
                {filteredLogs.length} registros
              </span>
            </div>
            <p className="text-xs text-[#6B7780]">
              Bitácora inalterable en la nube: cada marcaje de un alumno y cada cambio manual, con fecha y hora exactas.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {availableDates.length > 0 && (
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 rounded-[4px] px-2 py-1">
              <Calendar size={13} className="text-gray-400" />
              <select
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="text-xs font-semibold bg-transparent border-none text-[#2D3B45] focus:outline-hidden cursor-pointer"
              >
                <option value="todas">Todas las clases ({availableDates.length})</option>
                {availableDates.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}

          <div className="relative w-40 sm:w-48">
            <Search size={13} className="absolute left-2.5 top-2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar estudiante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-3 py-1 text-xs bg-gray-50 border border-gray-300 rounded-[4px] focus:bg-white focus:outline-hidden focus:border-[#008EE2]"
            />
          </div>

          <button
            type="button"
            onClick={refreshLogs}
            className="p-1.5 text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-[4px] cursor-pointer"
            title="Recargar historial"
          >
            <RotateCcw size={13} />
          </button>

          {filteredLogs.length > 0 && (
            <button
              type="button"
              onClick={handleExportLogsCSV}
              className="px-3 py-1 bg-white hover:bg-gray-50 text-[#2D3B45] border border-[#C7CDD1] rounded-[4px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download size={13} />
              <span>Exportar CSV</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#E0E3E6] rounded-[4px] overflow-hidden shadow-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <ShieldCheck size={32} className="mx-auto text-emerald-600" />
            <p className="text-xs font-bold text-[#2D3B45]">Sin registros todavía</p>
            <p className="text-[11px] text-gray-500 max-w-md mx-auto">
              Cuando los estudiantes marquen su asistencia (o cuando modifiques una celda), cada registro aparecerá aquí con su fecha y hora exactas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#2D3B45] text-white text-[11px] uppercase tracking-wider font-bold border-b border-gray-700">
                  <th className="p-2 text-left w-[150px]">Clase & Hora</th>
                  <th className="p-2 text-left">Estudiante</th>
                  <th className="p-2 text-center w-[70px]">Valor</th>
                  <th className="p-2 text-center w-[170px]">Método / Horario</th>
                  <th className="p-2 text-center w-[80px]">Comprobante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="p-2 font-mono font-bold text-[#2D3B45]">
                      <div className="flex flex-col">
                        <span>{log.date}</span>
                        <span className="text-[10px] text-gray-500 font-normal">{formatTime(log.createdAt)} hrs</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="font-semibold text-[#2D3B45]">{log.studentName}</div>
                      <div className="text-[10px] text-gray-500 truncate">{log.studentEmail || "Estudiante UDP"}</div>
                    </td>
                    <td className="p-2 text-center font-bold">
                      <span className={log.value === 1 ? "text-emerald-700" : "text-rose-700"}>{log.value}</span>
                    </td>
                    <td className="p-2 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          log.method.includes("Docente") || log.method.includes("Apelación")
                            ? "bg-purple-100 text-purple-800 border border-purple-300"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        }`}
                      >
                        {log.method.includes("PIN") ? <KeyRound size={10} /> : <UserCheck size={10} />}
                        <span>{log.method}</span>
                      </span>
                      {log.scheduleLabel && <div className="text-[10px] text-gray-500 mt-0.5">{log.scheduleLabel}</div>}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleCopySingleLog(log)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-[#008EE2] transition-colors"
                        title="Copiar comprobante de este registro"
                      >
                        {copiedLogId === log.id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
