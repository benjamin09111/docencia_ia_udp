"use client";

import React from "react";
import { CanvasCourse } from "@/types";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";

interface CourseWorkspaceHeaderProps {
  course: CanvasCourse;
  scheduleInfo: {
    ayudantia: string;
    ayudantiaSala?: string;
    catedra?: string;
    catedraSala?: string;
  };
  onBack: () => void;
}

export const CourseWorkspaceHeader: React.FC<CourseWorkspaceHeaderProps> = ({
  course,
  scheduleInfo,
  onBack,
}) => {
  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card mb-4">
      {/* Breadcrumb Institucional Canvas */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#6B7780] pb-2.5 border-b border-gray-100 mb-3 flex-wrap">
        <span className="hover:underline cursor-pointer hover:text-[#008EE2]" onClick={onBack}>
          Universidad Diego Portales
        </span>
        <span className="text-gray-400">&gt;</span>
        <span className="hover:underline cursor-pointer hover:text-[#008EE2]" onClick={onBack}>
          Facultad de Ingeniería
        </span>
        <span className="text-gray-400">&gt;</span>
        <span className="hover:underline cursor-pointer hover:text-[#008EE2]" onClick={onBack}>
          Ingeniería Civil en Informática y Telecomunicaciones
        </span>
        <span className="text-gray-400">&gt;</span>
        <span className="font-bold text-[#2D3B45]">{course.code}</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            title="Volver a lista de cursos"
            aria-label="Volver a Cursos"
            className="w-8 h-8 rounded-[4px] border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-100 text-[#2D3B45] hover:text-[#B71C1C] transition-colors flex items-center justify-center shrink-0 shadow-2xs cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-bold text-[#008EE2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {course.code}
              </span>
              <span className="text-[#55636E] font-medium flex items-center gap-1.5">
                <Clock size={12} className="text-[#6B7780]" />
                <span>Ayudantía: {scheduleInfo.ayudantia}</span>
                <span className="text-gray-300">•</span>
                <span className="font-mono text-[#55636E]">{scheduleInfo.ayudantiaSala}</span>
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-[#2D3B45] mt-0.5 truncate">
              {course.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <span className="text-[11px] font-medium text-[#55636E] bg-gray-100 px-2.5 py-1 rounded border border-gray-200 flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#008EE2]" />
            <span>
              Agente Activo: {course.code.includes("CIT2206") ? "CIT2206" : course.code.includes("CIT3100") ? "CIT3100" : "CIT3621"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
