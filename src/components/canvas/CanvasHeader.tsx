"use client";

import React from "react";
import { Menu, Glasses, ChevronRight } from "lucide-react";

interface CanvasHeaderProps {
  courseCode?: string;
  currentPageTitle?: string;
  isStudentView?: boolean;
  onToggleStudentView?: () => void;
  onToggleCourseNav?: () => void;
}

export const CanvasHeader: React.FC<CanvasHeaderProps> = ({
  courseCode = "CIT3203_CA01",
  currentPageTitle = "Módulos",
  isStudentView = false,
  onToggleStudentView,
  onToggleCourseNav,
}) => {
  return (
    <header className="h-14 bg-white border-b border-[#E0E3E6] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Botón hamburguesa rojo UDP + Breadcrumbs Oficiales Canvas (#breadcrumbs) */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <button
          type="button"
          onClick={onToggleCourseNav}
          className="text-[#B71C1C] hover:text-[#7F1010] p-1.5 rounded hover:bg-red-50 transition-colors cursor-pointer"
          aria-label="Alternar menú de navegación de cursos"
          title="Ocultar/mostrar menú de navegación"
        >
          <Menu size={22} className="stroke-[2.5]" />
        </button>

        {/* Breadcrumb Oficial Canvas LMS (#breadcrumbs) */}
        <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-base sm:text-[17px] font-semibold truncate">
          <span className="text-[#B71C1C] hover:underline cursor-pointer truncate">
            {courseCode}
          </span>
          <ChevronRight size={16} className="text-[#6B7780] shrink-0" />
          <span className="text-[#2D3B45] truncate font-bold" suppressHydrationWarning>
            {currentPageTitle}
          </span>
        </nav>
      </div>

      {/* Lado derecho: Botón Canvas "Ver como estudiante" */}
      {onToggleStudentView && (
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleStudentView}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-[3px] border transition-colors cursor-pointer shadow-2xs ${
              isStudentView
                ? "bg-[#B71C1C] text-white border-[#A60D24]"
                : "bg-[#F5F6F8] hover:bg-gray-100 text-[#2D3B45] border-[#C7CDD1]"
            }`}
            title="Alternar vista de estudiante"
          >
            <Glasses size={17} />
            <span className="hidden sm:inline" suppressHydrationWarning>
              {isStudentView ? "Salir de vista estudiante" : "Ver como estudiante"}
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
