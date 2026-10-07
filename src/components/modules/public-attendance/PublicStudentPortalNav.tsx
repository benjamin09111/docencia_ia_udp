"use client";

import React from "react";
import { Lock, FileSpreadsheet, CalendarCheck, PieChart, ChevronRight, Eye, Sparkles } from "lucide-react";
import { CourseSection } from "@/types/attendance";

export type PublicMainModule = "notas" | "asistencia" | "resumen";
export type PublicAttendanceSubmodule = "ayudantias" | "catedras" | "resumen";

interface PublicStudentPortalNavProps {
  section: CourseSection;
  activeMainModule: PublicMainModule;
  onSelectMainModule: (mod: PublicMainModule) => void;
  activeAttendanceSub: PublicAttendanceSubmodule;
  onSelectAttendanceSub: (sub: PublicAttendanceSubmodule) => void;
}

export const PublicStudentPortalNav: React.FC<PublicStudentPortalNavProps> = ({
  section,
  activeMainModule,
  onSelectMainModule,
  activeAttendanceSub,
  onSelectAttendanceSub,
}) => {
  return (
    <div className="space-y-3">
      {/* Breadcrumbs y Barra de Modo Lectura */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-white border border-[#E0E3E6] rounded-[4px] px-3.5 py-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[#6B7780] flex-wrap">
          <span className="hover:text-[#2D3B45]">Cursos UDP</span>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="font-semibold text-[#2D3B45] truncate max-w-[200px] sm:max-w-none">
            {section.cursoNombre || section.codigo}
          </span>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-[#008EE2] font-semibold">{section.nombre}</span>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-gray-400 font-medium">Portal Estudiante</span>
        </nav>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Eye size={12} /> Modo Lectura
          </span>
          <span className="text-[11px] text-[#6B7780] font-mono hidden md:inline">
            Semestre 2026-02
          </span>
        </div>
      </div>

      {/* Pestañas Principales Estilo Canvas */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-xs overflow-hidden">
        <div className="flex items-center border-b border-[#E0E3E6] overflow-x-auto bg-[#FAFBFB]">
          {/* Módulo: Notas [Candado] */}
          <button
            type="button"
            onClick={() => onSelectMainModule("notas")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeMainModule === "notas"
                ? "border-[#C8102E] text-[#C8102E] bg-white"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-50"
            }`}
          >
            <FileSpreadsheet size={15} />
            <span>Notas</span>
            <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-500 border border-gray-200">
              <Lock size={9} /> Bloqueado
            </span>
          </button>

          {/* Módulo: Asistencia (Activo) */}
          <button
            type="button"
            onClick={() => onSelectMainModule("asistencia")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeMainModule === "asistencia"
                ? "border-[#008EE2] text-[#008EE2] bg-white"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-50"
            }`}
          >
            <CalendarCheck size={15} />
            <span>Asistencia</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-[#008EE2] font-black border border-blue-200">
              Activo
            </span>
          </button>

          {/* Módulo: Resumen [Candado] */}
          <button
            type="button"
            onClick={() => onSelectMainModule("resumen")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeMainModule === "resumen"
                ? "border-[#C8102E] text-[#C8102E] bg-white"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-50"
            }`}
          >
            <PieChart size={15} />
            <span>Resumen</span>
            <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-500 border border-gray-200">
              <Lock size={9} /> Bloqueado
            </span>
          </button>
        </div>

        {/* Submódulos de Asistencia (Solo si está en pestaña Asistencia) */}
        {activeMainModule === "asistencia" && (
          <div className="p-2.5 bg-white flex items-center justify-between flex-wrap gap-2 border-t border-[#F0F2F4]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-[#6B7780] uppercase tracking-wider mr-1">
                Submódulo:
              </span>

              {/* Submódulo: Ayudantías (Activo) */}
              <button
                type="button"
                onClick={() => onSelectAttendanceSub("ayudantias")}
                className={`px-3 py-1 rounded-[4px] text-xs font-semibold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  activeAttendanceSub === "ayudantias"
                    ? "bg-[#2D3B45] text-white border-[#2D3B45] shadow-xs"
                    : "bg-white text-[#55636E] border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span>Ayudantías</span>
                <span className="text-[10px] px-1 py-0.1 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  Disponible
                </span>
              </button>

              {/* Submódulo: Cátedra [Candado] */}
              <button
                type="button"
                onClick={() => onSelectAttendanceSub("catedras")}
                className={`px-3 py-1 rounded-[4px] text-xs font-semibold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  activeAttendanceSub === "catedras"
                    ? "bg-rose-50 text-[#C8102E] border-rose-300 shadow-xs"
                    : "bg-gray-50 text-gray-400 border-gray-200 hover:text-[#55636E]"
                }`}
              >
                <Lock size={11} />
                <span>Cátedra</span>
              </button>

              {/* Submódulo: Resumen Asistencia [Candado] */}
              <button
                type="button"
                onClick={() => onSelectAttendanceSub("resumen")}
                className={`px-3 py-1 rounded-[4px] text-xs font-semibold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  activeAttendanceSub === "resumen"
                    ? "bg-rose-50 text-[#C8102E] border-rose-300 shadow-xs"
                    : "bg-gray-50 text-gray-400 border-gray-200 hover:text-[#55636E]"
                }`}
              >
                <Lock size={11} />
                <span>Resumen Asistencia</span>
              </button>
            </div>

            <span className="text-[11px] text-[#6B7780] font-medium flex items-center gap-1">
              <Sparkles size={12} className="text-[#008EE2]" />
              Visualizador Oficial de Ayudantías UDP
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
