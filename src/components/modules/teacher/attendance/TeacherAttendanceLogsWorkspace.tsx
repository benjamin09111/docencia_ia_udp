"use client";

import React, { useState, useMemo, useEffect } from "react";
import { CourseSection } from "@/types/attendance";
import { AttendanceCheckinLog, getSavedAttendanceLogs } from "@/services/attendanceLogsStore";
import { Search, History, Calendar, MapPin, KeyRound, UserCheck, ShieldCheck, Download, Copy, Check, Filter } from "lucide-react";

interface TeacherAttendanceLogsWorkspaceProps {
  section: CourseSection;
}

export const TeacherAttendanceLogsWorkspace: React.FC<TeacherAttendanceLogsWorkspaceProps> = ({ section }) => {
  const [logs, setLogs] = useState<AttendanceCheckinLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("todas");
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);

  const refreshLogs = () => {
    setLogs(getSavedAttendanceLogs(section.codigo || section.id));
  };

  useEffect(() => {
    refreshLogs();
    const handleUpdate = () => refreshLogs();
    window.addEventListener("udp_attendance_logs_updated", handleUpdate);
    window.addEventListener("udp_attendance_updated", handleUpdate);
    return () => {
      window.removeEventListener("udp_attendance_logs_updated", handleUpdate);
      window.removeEventListener("udp_attendance_updated", handleUpdate);
    };
  }, [section.id, section.codigo]);

  // Lista única de fechas para el filtro
  const availableDates = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.date));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [logs]);

  // Filtrado de logs
  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (selectedDateFilter !== "todas" && l.date !== selectedDateFilter) return false;
      if (!searchTerm) return true;
      const lower = searchTerm.toLowerCase();
      return (
        l.studentName.toLowerCase().includes(lower) ||
        (l.studentRut && l.studentRut.toLowerCase().includes(lower)) ||
        (l.studentEmail && l.studentEmail.toLowerCase().includes(lower)) ||
        l.method.toLowerCase().includes(lower)
      );
    });
  }, [logs, selectedDateFilter, searchTerm]);

  const handleCopySingleLog = async (log: AttendanceCheckinLog) => {
    const text = `[HISTORIAL ASISTENCIA UDP] ${log.studentName} (${log.studentRut || "S/RUT"}) marcó asistencia el ${log.date} a las ${log.time} hrs vía ${log.method}.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLogId(log.id);
      setTimeout(() => setCopiedLogId(null), 2000);
    } catch {}
  };

  const handleExportLogsCSV = () => {
    if (filteredLogs.length === 0) return;
    const header = "Fecha,Hora,Estudiante,RUT,Email,Metodo,Distancia_GPS_m\n";
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.date}","${l.time}","${l.studentName}","${l.studentRut || ""}","${l.studentEmail || ""}","${l.method}","${l.distanciaMetros ?? ""}"`
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
      {/* Header Informativo */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0">
            <History size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#2D3B45]">Historial Auditable de Registros</h3>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold rounded">
                {filteredLogs.length} marcajes registrados
              </span>
            </div>
            <p className="text-xs text-[#6B7780]">
              Bitácora inalterable de cada vez que un estudiante llena o marca su asistencia en el sistema.
            </p>
          </div>
        </div>

        {/* Filtros y Exportar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro Fecha */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 rounded-[4px] px-2 py-1">
            <Calendar size={13} className="text-gray-400" />
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="text-xs font-semibold bg-transparent border-none text-[#2D3B45] focus:outline-hidden cursor-pointer"
            >
              <option value="todas">Todas las fechas ({availableDates.length})</option>
              {availableDates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Buscador */}
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

          {/* Exportar CSV */}
          <button
            type="button"
            onClick={handleExportLogsCSV}
            className="px-3 py-1 bg-white hover:bg-gray-50 text-[#2D3B45] border border-[#C7CDD1] rounded-[4px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download size={13} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Tabla de Logs */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] overflow-hidden shadow-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <ShieldCheck size={28} className="mx-auto text-gray-300" />
            <p className="text-xs font-medium text-gray-500">
              No hay registros de marcaje que coincidan con los filtros seleccionados.
            </p>
            <p className="text-[11px] text-gray-400">
              Cada vez que un alumno ingrese su PIN o el profesor modifique una celda, aparecerá aquí el log con fecha y hora exactos.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#2D3B45] text-white text-[11px] uppercase tracking-wider font-bold border-b border-gray-700">
                  <th className="p-2 text-left w-[140px]">Fecha & Hora</th>
                  <th className="p-2 text-left">Estudiante</th>
                  <th className="p-2 text-left w-[120px]">RUT</th>
                  <th className="p-2 text-center w-[130px]">Método</th>
                  <th className="p-2 text-center w-[120px]">GPS / Distancia</th>
                  <th className="p-2 text-center w-[80px]">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="p-2 font-mono font-bold text-[#2D3B45]">
                      <div className="flex flex-col">
                        <span>{log.date}</span>
                        <span className="text-[10px] text-gray-500 font-normal">{log.time} hrs</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="font-semibold text-[#2D3B45]">{log.studentName}</div>
                      <div className="text-[10px] text-gray-500 truncate">{log.studentEmail || "Estudiante UDP"}</div>
                    </td>
                    <td className="p-2 font-mono text-gray-600">{log.studentRut || "—"}</td>
                    <td className="p-2 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          log.method.includes("GPS")
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : log.method.includes("Docente")
                            ? "bg-purple-100 text-purple-800 border border-purple-300"
                            : log.method.includes("Quórum")
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-blue-100 text-blue-800 border border-blue-300"
                        }`}
                      >
                        {log.method.includes("GPS") && <MapPin size={10} />}
                        {log.method.includes("PIN") && !log.method.includes("GPS") && <KeyRound size={10} />}
                        {log.method.includes("Docente") && <UserCheck size={10} />}
                        <span>{log.method}</span>
                      </span>
                    </td>
                    <td className="p-2 text-center font-mono text-[11px]">
                      {log.distanciaMetros !== undefined ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          {log.distanciaMetros}m campus
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleCopySingleLog(log)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-[#008EE2] transition-colors"
                        title="Copiar comprobante de este marcaje"
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
