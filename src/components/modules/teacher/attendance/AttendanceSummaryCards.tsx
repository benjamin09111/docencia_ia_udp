"use client";

import React, { useState } from "react";
import { StudentAttendanceSummary } from "@/types/attendance";
import { Users, CheckCircle2, AlertTriangle, CalendarCheck, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";

interface AttendanceSummaryCardsProps {
  summaries: StudentAttendanceSummary[];
  totalRealizadas: number;
}

export const AttendanceSummaryCards: React.FC<AttendanceSummaryCardsProps> = ({
  summaries,
  totalRealizadas,
}) => {
  // Acordeón cerrado por defecto a petición del usuario para ahorrar espacio
  const [isOpen, setIsOpen] = useState(false);

  const totalAlumnos = summaries.length;
  const enRiesgoCount = summaries.filter((s) => s.enRiesgoRI).length;

  const avgGlobal =
    totalAlumnos > 0
      ? Math.round(summaries.reduce((acc, s) => acc + s.totalPct, 0) / totalAlumnos)
      : 0;

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-xs overflow-hidden">
      {/* Cabecera del Acordeón (Interactiva) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#FAFBFB] hover:bg-[#F5F6F8] transition-colors text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <BarChart3 size={15} className="text-[#008EE2] shrink-0" />
          <span className="text-xs font-semibold text-[#2D3B45]">
            Estadísticas & Resumen del Curso
          </span>

          {/* Badges compactos visibles incluso cuando el acordeón está cerrado */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#6B7780]">
            <span className="inline-flex items-center gap-1 bg-white border border-[#E0E3E6] px-2 py-0.5 rounded-[3px]">
              Promedio: <strong className={avgGlobal >= 75 ? "text-emerald-700" : "text-rose-700"}>{avgGlobal}%</strong>
            </span>
            <span className="inline-flex items-center gap-1 bg-white border border-[#E0E3E6] px-2 py-0.5 rounded-[3px]">
              Habilitados: <strong className="text-emerald-700">{totalAlumnos - enRiesgoCount}/{totalAlumnos}</strong>
            </span>
            {enRiesgoCount > 0 && (
              <span className="inline-flex items-center gap-1 bg-rose-50 border border-rose-200 text-rose-700 px-2 py-0.5 rounded-[3px] font-semibold">
                ⚠️ {enRiesgoCount} en riesgo RI
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#008EE2] font-medium shrink-0">
          <span>{isOpen ? "Ocultar" : "Ver detalle"}</span>
          {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </div>
      </button>

      {/* Contenido desplegable con las 4 tarjetas de estadísticas */}
      {isOpen && (
        <div className="p-3 border-t border-[#E0E3E6] bg-white animate-fadeIn">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-[#FAFBFB] border border-[#E0E3E6] rounded-[4px]">
              <div className="flex items-center justify-between text-[#6B7780]">
                <span className="text-[11px] font-medium">Asistencia Global</span>
                <CalendarCheck size={14} className="text-[#008EE2]" />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className={`text-xl font-extrabold ${avgGlobal >= 75 ? "text-emerald-700" : "text-rose-700"}`}>
                  {avgGlobal}%
                </span>
                <span className="text-[10px] text-gray-500 font-normal">promedio curso</span>
              </div>
            </div>

            <div className="p-3 bg-[#FAFBFB] border border-[#E0E3E6] rounded-[4px]">
              <div className="flex items-center justify-between text-[#6B7780]">
                <span className="text-[11px] font-medium">Alumnos Habilitados</span>
                <CheckCircle2 size={14} className="text-emerald-600" />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-emerald-800">{totalAlumnos - enRiesgoCount}</span>
                <span className="text-[10px] text-gray-500 font-normal">de {totalAlumnos} alumnos</span>
              </div>
            </div>

            <div className="p-3 bg-[#FAFBFB] border border-[#E0E3E6] rounded-[4px]">
              <div className="flex items-center justify-between text-[#6B7780]">
                <span className="text-[11px] font-medium">Clases Dictadas</span>
                <Users size={14} className="text-[#2D3B45]" />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-[#2D3B45]">{totalRealizadas}</span>
                <span className="text-[10px] text-gray-500 font-normal">sesiones a la fecha</span>
              </div>
            </div>

            <div className="p-3 bg-[#FAFBFB] border border-[#E0E3E6] rounded-[4px]">
              <div className="flex items-center justify-between text-[#6B7780]">
                <span className="text-[11px] font-medium">Riesgo Inasistencia (RI)</span>
                <AlertTriangle size={14} className="text-[#C8102E]" />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className={`text-xl font-extrabold ${enRiesgoCount > 0 ? "text-[#C8102E]" : "text-emerald-700"}`}>
                  {enRiesgoCount}
                </span>
                <span className="text-[10px] text-gray-500 font-normal">bajo 75% mínimo</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
