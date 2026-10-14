"use client";

import React from "react";
import { ActividadFormativa } from "@/types/actividadesFormativas";
import { Clock, Users, Lightbulb, HelpCircle, PlayCircle, UserCheck, GraduationCap } from "lucide-react";

interface ActividadPedagogicaDetalleCardProps {
  actividad: ActividadFormativa;
}

export const ActividadPedagogicaDetalleCard: React.FC<ActividadPedagogicaDetalleCardProps> = ({
  actividad,
}) => {
  return (
    <div className="space-y-4 text-sm text-[#2D3B45]">
      {/* Badges de Metadatos Minimalistas */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-[#55636E]">
        <span className="flex items-center gap-1.5 font-medium">
          <Clock size={14} className="text-[#6B7780]" />
          <span>{actividad.duracionSugerida}</span>
        </span>
        <span className="text-gray-300">•</span>
        <span className="flex items-center gap-1.5 font-medium">
          <Users size={14} className="text-[#6B7780]" />
          <span>{actividad.agrupacion}</span>
        </span>
        <span className="text-gray-300">•</span>
        <span className="flex items-center gap-1.5 font-semibold text-[#B71C1C]">
          <span>Momento: {actividad.faseClase}</span>
        </span>
      </div>

      {/* Cita / Enunciado del Desafío Minimalista */}
      <p className="text-[13.5px] text-[#2D3B45] leading-relaxed italic bg-[#F9FAFB] p-3 rounded-[3px] border-l-2 border-[#B71C1C]">
        &quot;{actividad.descripcion}&quot;
      </p>

      {/* Objetivo / Propósito */}
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-[#2D3B45] uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle size={14} className="text-[#6B7780]" />
          Objetivo y Propósito:
        </h4>
        <p className="text-[13px] text-[#55636E] leading-relaxed">
          {actividad.queHace}
        </p>
      </div>

      {/* Desarrollo de la Dinámica Paso a Paso */}
      <div className="space-y-2 pt-1">
        <h4 className="text-xs font-bold text-[#2D3B45] uppercase tracking-wider flex items-center gap-1.5">
          <PlayCircle size={14} className="text-[#B71C1C]" />
          Desarrollo en Aula:
        </h4>
        <div className="space-y-2">
          {actividad.comoFunciona.map((paso, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-[13px] leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-[#F5F6F8] text-[#2D3B45] border border-[#C7CDD1] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-[#2D3B45]">{paso.replace(/^\d+\.\s*/, "")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ejemplo Práctico Sutil */}
      <div className="pt-1">
        <div className="p-3 bg-[#F9FAFB] border-l-2 border-amber-500 rounded-r-[3px] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D3B45]">
            <Lightbulb size={13} className="text-amber-600" />
            <span>Ejemplo Práctico en Asignatura:</span>
          </div>
          <p className="text-[12.5px] text-[#55636E] italic leading-relaxed">
            {actividad.ejemploPractico}
          </p>
        </div>
      </div>

      {/* Roles Minimalistas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E0E3E6]">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#2D3B45] flex items-center gap-1.5">
            <UserCheck size={14} className="text-[#6B7780]" />
            Rol del Docente:
          </span>
          <p className="text-[12.5px] text-[#6B7780] leading-relaxed">
            {actividad.rolDocente}
          </p>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#2D3B45] flex items-center gap-1.5">
            <GraduationCap size={14} className="text-[#6B7780]" />
            Rol del Estudiante:
          </span>
          <p className="text-[12.5px] text-[#6B7780] leading-relaxed">
            {actividad.rolEstudiante}
          </p>
        </div>
      </div>
    </div>
  );
};
