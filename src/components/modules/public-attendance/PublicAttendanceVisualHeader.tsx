"use client";

import React from "react";
import { GraduationCap, ShieldCheck, Search, X, Award, CheckCircle2, AlertTriangle } from "lucide-react";
import { CourseSection } from "@/types/attendance";

interface PublicAttendanceVisualHeaderProps {
  section: CourseSection;
  totalStudents: number;
  filteredCount: number;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  conditionFilter: "all" | "ok" | "risk";
  onConditionChange: (filter: "all" | "ok" | "risk") => void;
  highlightedStudent: {
    nombreCompleto?: string;
    rut?: string;
    decimas: number;
    trabajosRealizados: number;
    pct: number;
    asistidas: number;
    validas: number;
    ok: boolean;
  } | null;
  totalTrabajos: number;
  decimasPorTrabajo?: number;
  onOpenAppealModal?: () => void;
}

export const PublicAttendanceVisualHeader: React.FC<PublicAttendanceVisualHeaderProps> = ({
  section,
  totalStudents,
  filteredCount,
  searchTerm,
  onSearchChange,
  conditionFilter,
  onConditionChange,
  highlightedStudent,
  totalTrabajos,
  decimasPorTrabajo = 0.2,
  onOpenAppealModal,
}) => {
  return (
    <div className="space-y-4">
      {/* Encabezado Oficial UDP */}
      <header className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-[4px] bg-[#C8102E] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <GraduationCap size={26} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Universidad Diego Portales • FING
              </span>
              <span className="text-[11px] font-mono text-[#008EE2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold">
                {section.codigo}
              </span>
              <span className="text-[11px] font-mono text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                <ShieldCheck size={12} /> Nómina Oficial de Estudiantes
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#2D3B45] tracking-tight mt-0.5">
              {section.cursoNombre || "Asignatura UDP"} — {section.nombre}
            </h1>
            <p className="text-xs text-[#6B7780] mt-0.5">
              Profesor: <span className="font-semibold text-[#2D3B45]">{section.profesor?.trim() || "No identificado"}</span> • Ayudante:{" "}
              <span className="font-semibold text-[#2D3B45]">{section.ayudante?.trim() || "No identificado"}</span>
            </p>
          </div>
        </div>
      </header>

      {/* Buscador de Estudiantes y Filtros */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3.5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar estudiante por nombre o apellido..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-[4px] text-[#2D3B45] focus:bg-white focus:border-[#008EE2] focus:outline-hidden"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-[4px] border border-gray-200 shrink-0">
              <button
                type="button"
                onClick={() => onConditionChange("all")}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-[3px] transition-colors cursor-pointer ${
                  conditionFilter === "all" ? "bg-white text-[#2D3B45] shadow-xs" : "text-[#6B7780] hover:text-[#2D3B45]"
                }`}
              >
                Todos ({totalStudents})
              </button>
              <button
                type="button"
                onClick={() => onConditionChange("ok")}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-[3px] transition-colors cursor-pointer ${
                  conditionFilter === "ok" ? "bg-emerald-600 text-white shadow-xs" : "text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                ≥75%
              </button>
              <button
                type="button"
                onClick={() => onConditionChange("risk")}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-[3px] transition-colors cursor-pointer ${
                  conditionFilter === "risk" ? "bg-red-600 text-white shadow-xs" : "text-red-700 hover:bg-red-50"
                }`}
              >
                &lt;75%
              </button>
            </div>

            {onOpenAppealModal && (
              <button
                type="button"
                onClick={onOpenAppealModal}
                className="px-3 py-1.5 text-[11px] font-bold bg-[#C8102E] hover:bg-[#A00D24] text-white rounded-[4px] transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Apelar asistencia de una clase pasada o de hoy"
              >
                <AlertTriangle size={13} />
                <span>Apelar Asistencia</span>
              </button>
            )}
          </div>
        </div>

        {/* Ficha individual al consultar RUT propio */}
        {highlightedStudent && (
          <div className="bg-blue-50/80 border border-blue-200 rounded-[4px] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
            <div>
              <span className="text-[10px] font-bold text-[#008EE2] uppercase tracking-wider block">
                Ficha Personal de Asistencia (UDP)
              </span>
              <h3 className="text-sm font-bold text-[#2D3B45]">
                {highlightedStudent.nombreCompleto || highlightedStudent.rut || "Estudiante"}
              </h3>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="text-center">
                <span className="text-[10px] text-gray-500 font-semibold block uppercase">Trabajos</span>
                <span className="text-sm font-black text-indigo-900 font-mono">
                  {highlightedStudent.trabajosRealizados} / {totalTrabajos}
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-gray-500 font-semibold block uppercase">Décimas</span>
                <span className="text-sm font-black text-amber-800 font-mono">
                  +{highlightedStudent.decimas.toFixed(1)}d
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-gray-500 font-semibold block uppercase">Asistencia</span>
                <span className={`text-sm font-black font-mono ${highlightedStudent.ok ? "text-emerald-700" : "text-red-700"}`}>
                  {highlightedStudent.pct}% ({highlightedStudent.asistidas}/{highlightedStudent.validas})
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-gray-500 font-semibold block uppercase">Condición</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                  highlightedStudent.ok ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-red-100 text-red-800 border border-red-300"
                }`}>
                  {highlightedStudent.ok ? "✓ Al Día" : "⚠ Riesgo RI"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
