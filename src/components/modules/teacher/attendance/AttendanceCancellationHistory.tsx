"use client";

import React, { useState, useMemo } from "react";
import { ClassSession, CourseSection } from "@/types/attendance";
import {
  CalendarX,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  Info,
  Filter,
  Plus,
  ShieldCheck,
  Edit2,
} from "lucide-react";

interface AttendanceCancellationHistoryProps {
  sessions: ClassSession[];
  section: CourseSection;
  onReactivateSession: (sessionId: string) => void;
  onOpenCancelModal: (session: ClassSession) => void;
  onBackToMatrix?: () => void;
}

export const AttendanceCancellationHistory: React.FC<AttendanceCancellationHistoryProps> = ({
  sessions,
  section,
  onReactivateSession,
  onOpenCancelModal,
  onBackToMatrix,
}) => {
  const [filterType, setFilterType] = useState<"todas" | "ayudantias" | "catedras">("todas");
  const [searchTerm, setSearchTerm] = useState("");

  // Sesiones canceladas en la sección
  const cancelledSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (s.estado !== "cancelada") return false;
      if (filterType === "ayudantias" && s.tipo !== "ayudantia") return false;
      if (filterType === "catedras" && s.tipo !== "catedra") return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const dateMatches = s.fecha.includes(term) || s.diaSemana.toLowerCase().includes(term);
        const reasonMatches = (s.motivoCancelacion || "").toLowerCase().includes(term);
        return dateMatches || reasonMatches;
      }
      return true;
    });
  }, [sessions, filterType, searchTerm]);

  // Sesiones activas que podrían suspenderse
  const activeSessions = useMemo(() => {
    return sessions.filter((s) => s.estado !== "cancelada");
  }, [sessions]);

  const [selectedSessionToCancel, setSelectedSessionToCancel] = useState<string>("");

  const handleQuickCancelSelect = (sessionId: string) => {
    const target = sessions.find((s) => s.id === sessionId);
    if (target) {
      onOpenCancelModal(target);
      setSelectedSessionToCancel("");
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* 1. Header del Historial con Breadcrumb / Volver */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-red-50 text-[#C8102E] text-[11px] font-bold rounded uppercase tracking-wider border border-red-200 flex items-center gap-1">
              <CalendarX size={12} />
              Registro Oficial de Suspensión
            </span>
            <span className="text-xs text-[#6B7780] font-mono">
              {section.codigo} • {section.nombre}
            </span>
          </div>

          <h2 className="text-lg font-bold text-[#2D3B45] tracking-tight mt-1 flex items-center gap-2">
            <span>Historial de Clases No Realizadas y Cancelaciones</span>
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Registro formal de ayudantías y cátedras suspendidas. Estas sesiones no se contabilizan en el cálculo de asistencia del 75% reglamentario.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Selector rápido para suspender otra clase */}
          {activeSessions.length > 0 && (
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 rounded-[4px] px-2 py-1">
              <span className="text-[11px] text-[#55636E] font-medium hidden sm:inline">
                Suspender fecha:
              </span>
              <select
                value={selectedSessionToCancel}
                onChange={(e) => handleQuickCancelSelect(e.target.value)}
                className="text-xs bg-white border border-gray-300 rounded px-2 py-1 text-[#2D3B45] font-semibold focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
              >
                <option value="">Seleccionar sesión activa...</option>
                {activeSessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fecha} ({s.diaSemana}) — {s.tipo === "ayudantia" ? "Ayudantía" : "Cátedra"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {onBackToMatrix && (
            <button
              type="button"
              onClick={onBackToMatrix}
              className="px-3.5 py-1.5 bg-[#008EE2] hover:bg-[#0077BE] text-white rounded-[4px] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <ArrowLeft size={13} />
              <span>Volver a Planilla</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Tarjetas Resumen KPI del Historial */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-xs">
          <span className="text-[11px] font-semibold text-[#6B7780] block uppercase tracking-wider">
            Total Clases Suspendidas
          </span>
          <div className="flex items-center gap-2 mt-1">
            <CalendarX size={20} className="text-[#C8102E]" />
            <span className="text-2xl font-black text-[#2D3B45]">
              {cancelledSessions.length}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {cancelledSessions.length === 1 ? "sesión anulada" : "sesiones anuladas"}
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-xs">
          <span className="text-[11px] font-semibold text-[#6B7780] block uppercase tracking-wider">
            Impacto en Estudiantes
          </span>
          <div className="flex items-center gap-2 mt-1">
            <ShieldCheck size={20} className="text-emerald-600" />
            <span className="text-lg font-bold text-emerald-800">
              0% Penalización
            </span>
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Excluidas estrictamente del divisor total de asistencias.
          </p>
        </div>

        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-xs">
          <span className="text-[11px] font-semibold text-[#6B7780] block uppercase tracking-wider">
            Exigencia UDP Reglamentaria
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-[#008EE2]">75%</span>
            <span className="text-xs text-gray-500 font-medium">asistencia requerida</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Calculado únicamente sobre las clases válidas efectivas.
          </p>
        </div>
      </div>

      {/* 3. Filtros y Búsqueda de Cancelaciones */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-bold text-[#6B7780] flex items-center gap-1">
            <Filter size={13} /> Filtrar por:
          </span>
          <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-[4px] border border-gray-200">
            <button
              type="button"
              onClick={() => setFilterType("todas")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-[3px] transition-colors ${
                filterType === "todas"
                  ? "bg-white text-[#2D3B45] shadow-xs"
                  : "text-[#6B7780] hover:text-[#2D3B45]"
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setFilterType("ayudantias")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-[3px] transition-colors ${
                filterType === "ayudantias"
                  ? "bg-purple-700 text-white shadow-xs"
                  : "text-purple-900 hover:bg-purple-100"
              }`}
            >
              Ayudantías
            </button>
            <button
              type="button"
              onClick={() => setFilterType("catedras")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-[3px] transition-colors ${
                filterType === "catedras"
                  ? "bg-[#2D3B45] text-white shadow-xs"
                  : "text-[#6B7780] hover:text-[#2D3B45]"
              }`}
            >
              Cátedras
            </button>
          </div>
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar por fecha o motivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-[4px] text-[#2D3B45] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
          />
        </div>
      </div>

      {/* 4. Tabla de Cancelaciones o Estado Vacío */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-xs overflow-hidden">
        {cancelledSessions.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-3 bg-white">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-sm font-bold text-[#2D3B45]">
              No hay sesiones canceladas en este período
            </h3>
            <p className="text-xs text-[#6B7780] max-w-md mx-auto">
              Todas las sesiones programadas se encuentran activas y vigentes. Si alguna clase no se realiza, puedes suspenderla usando el ícono de calendario en la planilla o el selector superior.
            </p>
            {onBackToMatrix && (
              <button
                type="button"
                onClick={onBackToMatrix}
                className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#2D3B45] rounded-[4px] text-xs font-semibold border border-gray-300 transition-colors"
              >
                Volver a la Planilla de Asistencia
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[680px]">
              <thead className="bg-[#2D3B45] text-white">
                <tr>
                  <th className="p-2.5 border-r border-[#1E272E] w-12 text-center text-[10px] font-bold uppercase">
                    #
                  </th>
                  <th className="p-2.5 border-r border-[#1E272E] w-36 text-xs font-bold uppercase">
                    Fecha Sesión
                  </th>
                  <th className="p-2.5 border-r border-[#1E272E] w-28 text-center text-xs font-bold uppercase">
                    Tipo
                  </th>
                  <th className="p-2.5 border-r border-[#1E272E] w-48 text-xs font-bold uppercase">
                    Horario & Sala
                  </th>
                  <th className="p-2.5 border-r border-[#1E272E] text-xs font-bold uppercase">
                    Motivo Registrado
                  </th>
                  <th className="p-2.5 border-r border-[#1E272E] w-32 text-center text-xs font-bold uppercase">
                    Estado
                  </th>
                  <th className="p-2.5 text-right w-44 text-xs font-bold uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {cancelledSessions.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-red-50/20 transition-colors">
                    {/* Número de orden */}
                    <td className="p-2.5 text-center font-mono text-gray-400 border-r border-gray-200 text-xs">
                      {idx + 1}
                    </td>

                    {/* Fecha de la sesión */}
                    <td className="p-2.5 border-r border-gray-200">
                      <div className="font-bold text-[#2D3B45] text-xs font-mono">
                        {s.fecha}
                      </div>
                      <span className="text-[11px] text-gray-500 capitalize">
                        {s.diaSemana}
                      </span>
                    </td>

                    {/* Tipo de clase */}
                    <td className="p-2.5 text-center border-r border-gray-200">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          s.tipo === "ayudantia"
                            ? "bg-purple-100 text-purple-900 border border-purple-200"
                            : "bg-blue-100 text-blue-900 border border-blue-200"
                        }`}
                      >
                        {s.tipo}
                      </span>
                    </td>

                    {/* Horario y sala */}
                    <td className="p-2.5 border-r border-gray-200">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Clock size={12} className="text-gray-400" />
                        <span className="font-mono text-xs">
                          {s.horaInicio} - {s.horaFin}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mt-0.5">
                        <Building2 size={12} className="text-[#C8102E]" />
                        <span>{s.sala || "SALA X"}</span>
                      </div>
                    </td>

                    {/* Motivo registrado */}
                    <td className="p-2.5 border-r border-gray-200">
                      <div className="p-2 bg-amber-50/60 border border-amber-200 rounded-[4px]">
                        <span className="font-semibold text-amber-950 text-xs block">
                          {s.motivoCancelacion || "Sin motivo especificado"}
                        </span>
                        <span className="text-[10px] text-amber-800 block mt-0.5">
                          ✓ Excluida del cálculo de porcentaje de asistencia de los estudiantes.
                        </span>
                      </div>
                    </td>

                    {/* Estado badge */}
                    <td className="p-2.5 text-center border-r border-gray-200">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-100 text-red-900 border border-red-300 text-xs font-bold">
                        <CalendarX size={12} />
                        Cancelada
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="p-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenCancelModal(s)}
                          className="px-2 py-1 bg-white hover:bg-gray-100 text-gray-700 rounded border border-gray-300 text-xs font-medium flex items-center gap-1 transition-colors"
                          title="Modificar motivo de la suspensión"
                        >
                          <Edit2 size={11} />
                          <span>Editar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onReactivateSession(s.id)}
                          className="px-2.5 py-1 bg-[#008EE2] hover:bg-[#0077BE] text-white rounded text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
                          title="Reactivar esta sesión y devolverla a la planilla activa"
                        >
                          <RotateCcw size={11} />
                          <span>Reactivar</span>
                        </button>
                      </div>
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
