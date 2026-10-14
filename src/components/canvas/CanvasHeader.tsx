"use client";

import React from "react";
import { Menu, Glasses, ChevronRight, Clock } from "lucide-react";

interface CanvasHeaderProps {
  courseCode?: string;
  courseName?: string;
  scheduleText?: string;
  salaText?: string;
  currentPageTitle?: string;
  isStudentView?: boolean;
  onToggleStudentView?: () => void;
  onToggleCourseNav?: () => void;
}

export const CanvasHeader: React.FC<CanvasHeaderProps> = ({
  courseCode = "CIT3203_CA01",
  courseName,
  scheduleText,
  salaText,
  currentPageTitle = "Módulos",
  isStudentView = false,
  onToggleStudentView,
  onToggleCourseNav,
}) => {
  return (
    <header className="h-14 bg-white border-b border-[#E0E3E6] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 select-none gap-3">
      {/* Botón hamburguesa rojo UDP + Breadcrumbs Oficiales Canvas (#breadcrumbs) + Horario */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={onToggleCourseNav}
          className="text-[#B71C1C] hover:text-[#7F1010] p-1.5 rounded hover:bg-red-50 transition-colors cursor-pointer shrink-0"
          aria-label="Alternar menú de navegación de cursos"
          title="Ocultar/mostrar menú de navegación"
        >
          <Menu size={20} className="stroke-[2.5]" />
        </button>

        {/* Breadcrumb Oficial Canvas LMS (#breadcrumbs) */}
        <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-sm sm:text-base font-semibold truncate">
          <span className="text-[#B71C1C] font-bold shrink-0">
            {courseCode}
          </span>
          {courseName && (
            <span className="text-[#2D3B45] font-semibold truncate hidden md:inline max-w-xs">
              {courseName}
            </span>
          )}
          <ChevronRight size={15} className="text-[#6B7780] shrink-0" />
          <span className="text-[#2D3B45] font-bold truncate">
            {currentPageTitle}
          </span>
        </nav>

        {/* Información del curso en la Navbar Superior (Horario y Sala) */}
        {(scheduleText || (salaText && salaText !== "NO DEFINIDA")) && (
          <div className="hidden lg:flex items-center gap-2 text-xs text-[#55636E] bg-[#F5F6F8] px-2.5 py-1 rounded-[3px] border border-[#C7CDD1] shrink-0 ml-1">
            <Clock size={13} className="text-[#6B7780] shrink-0" />
            {scheduleText && <span>{scheduleText}</span>}
            {scheduleText && salaText && salaText !== "NO DEFINIDA" && (
              <span className="text-gray-300">•</span>
            )}
            {salaText && salaText !== "NO DEFINIDA" && (
              <span className="font-mono text-[#2D3B45] font-semibold">{salaText}</span>
            )}
          </div>
        )}
      </div>

      {/* Lado derecho: Botón Canvas "Ver como estudiante" */}
      {onToggleStudentView && (
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleStudentView}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-[3px] border transition-colors cursor-pointer shadow-2xs ${
              isStudentView
                ? "bg-[#B71C1C] text-white border-[#A60D24]"
                : "bg-[#F5F6F8] hover:bg-gray-100 text-[#2D3B45] border-[#C7CDD1]"
            }`}
            title="Alternar vista de estudiante"
          >
            <Glasses size={16} />
            <span className="hidden sm:inline">
              {isStudentView ? "Salir de vista estudiante" : "Ver como estudiante"}
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
