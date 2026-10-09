"use client";

import React from "react";
import { ActividadFormativa } from "@/types/actividadesFormativas";
import {
  Clock,
  Users,
  Calendar,
  CheckCircle2,
  Sparkles,
  Lightbulb,
  Wrench,
  GraduationCap,
  HelpCircle,
  PlayCircle,
  UserCheck,
} from "lucide-react";

interface ActividadPedagogicaDetalleCardProps {
  actividad: ActividadFormativa;
}

export const ActividadPedagogicaDetalleCard: React.FC<ActividadPedagogicaDetalleCardProps> = ({
  actividad,
}) => {
  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card overflow-hidden transition-all">
      {/* Encabezado con información clave Canvas */}
      <div className="p-4 bg-gray-50/80 border-b border-[#E0E3E6] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#008EE2] border border-blue-200">
              {actividad.categoria}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-200 text-[#2D3B45]">
              {actividad.faseClase}
            </span>
          </div>
          <h3 className="text-base font-bold text-[#2D3B45] flex items-center gap-2">
            <GraduationCap size={18} className="text-[#B71C1C]" />
            {actividad.nombre}
          </h3>
          <p className="text-xs text-[#55636E] mt-0.5 italic">
            "{actividad.descripcion}"
          </p>
        </div>

        {/* Badges rápidos de ejecución */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#2D3B45]">
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded border border-gray-200 font-medium shadow-xs">
            <Clock size={13} className="text-[#008EE2]" />
            <span>{actividad.duracionSugerida}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded border border-gray-200 font-medium shadow-xs">
            <Users size={13} className="text-[#2E7D32]" />
            <span>{actividad.agrupacion}</span>
          </div>
        </div>
      </div>

      {/* Cuerpo en dos columnas limpias */}
      <div className="p-4 sm:p-5 space-y-4 text-xs">
        {/* ¿Qué hace? */}
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[4px] p-3.5">
          <div className="flex items-center gap-2 font-bold text-[#2D3B45] text-xs mb-1.5">
            <HelpCircle size={15} className="text-[#008EE2]" />
            <span>¿Qué hace esta actividad?</span>
          </div>
          <p className="text-[#374151] leading-relaxed text-[12px]">
            {actividad.queHace}
          </p>
        </div>

        {/* ¿Cómo funciona? (Pasos en aula) */}
        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3.5">
          <div className="flex items-center gap-2 font-bold text-[#2D3B45] text-xs mb-2">
            <PlayCircle size={15} className="text-[#B71C1C]" />
            <span>¿Cómo funciona en el aula? (Paso a paso)</span>
          </div>
          <div className="space-y-2">
            {actividad.comoFunciona.map((paso, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-[#374151] text-[11.5px] leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-red-50 text-[#B71C1C] border border-red-200 flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{paso.replace(/^\d+\.\s*/, "")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ejemplo práctico en cátedra / taller */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-[4px] p-3.5">
          <div className="flex items-center gap-2 font-bold text-[#8A5300] text-xs mb-1">
            <Lightbulb size={14} className="text-[#E65100]" />
            <span>Ejemplo práctico en ingeniería / cátedra:</span>
          </div>
          <p className="text-[#5D4037] text-[11.5px] leading-relaxed italic">
            {actividad.ejemploPractico}
          </p>
        </div>

        {/* Ventajas Pedagógicas y Recursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-[4px]">
            <div className="flex items-center gap-1.5 font-bold text-[#1B5E20] text-[11.5px] mb-1">
              <Sparkles size={13} className="text-[#2E7D32]" />
              <span>Ventajas pedagógicas clave</span>
            </div>
            <p className="text-[#2E7D32] text-[11px] leading-relaxed">
              {actividad.ventajasPedagogicas}
            </p>
          </div>

          <div className="p-3 bg-gray-50 border border-gray-200 rounded-[4px]">
            <div className="flex items-center gap-1.5 font-bold text-[#2D3B45] text-[11.5px] mb-1">
              <Wrench size={13} className="text-[#008EE2]" />
              <span>Recursos y herramientas recomendadas</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {actividad.recursosRequeridos.map((rec, i) => (
                <span
                  key={i}
                  className="bg-white border border-gray-300 text-gray-700 px-2 py-0.5 rounded text-[10.5px] font-medium"
                >
                  {rec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Roles del docente y del estudiante */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <span className="text-[11px] font-bold text-[#2D3B45] flex items-center gap-1 mb-0.5">
              <UserCheck size={12} className="text-[#008EE2]" />
              Rol del Docente:
            </span>
            <p className="text-[11px] text-[#55636E] leading-relaxed">
              {actividad.rolDocente}
            </p>
          </div>
          <div className="border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3 flex-1">
            <span className="text-[11px] font-bold text-[#2D3B45] flex items-center gap-1 mb-0.5">
              <GraduationCap size={12} className="text-[#2E7D32]" />
              Rol del Estudiante:
            </span>
            <p className="text-[11px] text-[#55636E] leading-relaxed">
              {actividad.rolEstudiante}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
