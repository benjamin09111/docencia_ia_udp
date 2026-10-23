"use client";

import React from "react";
import { Compass, Layers, BookOpen, FileText } from "lucide-react";

interface CourseHomePageInternalNavProps {
  internalSection: "todas" | "portada" | "entregables";
  onSelectSection: (section: "todas" | "portada" | "entregables") => void;
}

export const CourseHomePageInternalNav: React.FC<CourseHomePageInternalNavProps> = ({
  internalSection,
  onSelectSection,
}) => {
  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] px-4 py-2.5 shadow-canvas-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <span className="font-bold text-[#2D3B45] uppercase tracking-wider text-xs flex items-center gap-1.5">
          <Compass size={14} className="text-[#008EE2]" />
          Índice de Secciones:
        </span>
        <span className="text-xs text-[#6B7780]">Navegación interna docente</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onSelectSection("todas")}
          className={`px-3 py-1.5 rounded-[4px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
            internalSection === "todas"
              ? "bg-[#2D3B45] text-white shadow-2xs"
              : "bg-gray-100 hover:bg-gray-200 text-[#55636E]"
          }`}
        >
          <Layers size={13} />
          <span>Ver todo</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectSection("portada")}
          className={`px-3 py-1.5 rounded-[4px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
            internalSection === "portada"
              ? "bg-[#008EE2] text-white shadow-2xs"
              : "bg-gray-100 hover:bg-gray-200 text-[#55636E]"
          }`}
        >
          <BookOpen size={13} />
          <span>1. Portada Canvas (Wiki)</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectSection("entregables")}
          className={`px-3 py-1.5 rounded-[4px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
            internalSection === "entregables"
              ? "bg-[#C8102E] text-white shadow-2xs"
              : "bg-gray-100 hover:bg-gray-200 text-[#55636E]"
          }`}
        >
          <FileText size={13} />
          <span>2. Entregables Oficiales (Tareas Canvas)</span>
        </button>
      </div>
    </div>
  );
};
