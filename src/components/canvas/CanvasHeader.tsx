"use client";

import React, { useState } from "react";
import { UserRole } from "@/types";
import { ShieldCheck, GraduationCap, School, CheckCircle2, Network } from "lucide-react";
import { FutureConnectionsModal } from "@/components/modules/common/FutureConnectionsModal";

interface CanvasHeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  breadcrumbs?: string[];
  userName?: string;
}

export const CanvasHeader: React.FC<CanvasHeaderProps> = ({
  currentRole,
  onRoleChange,
  breadcrumbs = [
    "Universidad Diego Portales",
    "Facultad de Ingeniería",
    "Ingeniería Civil en Informática y Telecomunicaciones",
  ],
  userName = "Benjamín Morales Pizarro",
}) => {
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-canvas-border-light px-3 sm:px-6 flex items-center justify-between shadow-canvas-card sticky top-0 z-20 gap-2">
      {/* Breadcrumbs Canvas Style */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-[13px] text-canvas-muted min-w-0 flex-1 overflow-x-auto no-scrollbar py-1">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <React.Fragment key={idx}>
              <span
                className={`whitespace-nowrap transition-colors ${
                  isLast
                    ? "font-bold text-canvas-dark text-[13px] sm:text-[14px]"
                    : "hover:underline cursor-pointer text-canvas-muted hover:text-[#008EE2]"
                }`}
              >
                {crumb}
              </span>
              {!isLast && (
                <span className="text-gray-400 font-light select-none shrink-0">
                  &gt;
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Botón Futuras Conexiones & Role Switcher for Demo */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <button
          type="button"
          onClick={() => setShowConnectionsModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] text-xs font-semibold border border-purple-200 bg-purple-50 text-purple-900 hover:bg-purple-100 transition-colors shadow-2xs"
          title="Ver visión de integración y futuras conexiones institucionales UDP"
        >
          <Network size={14} className="text-purple-700 shrink-0" />
          <span className="hidden md:inline">Futuras conexiones</span>
          <span className="text-[10px] bg-purple-200 text-purple-950 px-1.5 py-0.2 rounded font-bold">
            Visión
          </span>
        </button>

        <div className="flex items-center bg-gray-100 p-0.5 sm:p-1 rounded-[6px] border border-gray-200">
          <button
            onClick={() => onRoleChange("admin")}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-[4px] text-xs font-medium transition-all ${
              currentRole === "admin"
                ? "bg-white text-udp-red shadow-sm border border-gray-200 font-semibold"
                : "text-canvas-muted hover:text-canvas-dark"
            }`}
            title="Cambiar a vista Admin CREA"
          >
            <ShieldCheck size={13} className="sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Admin CREA</span>
            <span className="sm:hidden">Admin</span>
          </button>

          <button
            onClick={() => onRoleChange("teacher")}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-[4px] text-xs font-medium transition-all ${
              currentRole === "teacher"
                ? "bg-white text-canvas-blue shadow-sm border border-gray-200 font-semibold"
                : "text-canvas-muted hover:text-canvas-dark"
            }`}
            title="Cambiar a vista Docente / Ayudante"
          >
            <School size={13} className="sm:w-3.5 sm:h-3.5" />
            <span className="hidden lg:inline">Docente / Ayudante</span>
            <span className="lg:hidden">Docente</span>
          </button>

          <button
            onClick={() => onRoleChange("student")}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-[4px] text-xs font-medium transition-all ${
              currentRole === "student"
                ? "bg-white text-emerald-700 shadow-sm border border-gray-200 font-semibold"
                : "text-canvas-muted hover:text-canvas-dark"
            }`}
            title="Cambiar a vista Estudiante"
          >
            <GraduationCap size={13} className="sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Estudiante</span>
            <span className="sm:hidden">Alumno</span>
          </button>
        </div>

        <div className="h-6 w-px bg-gray-200 mx-0.5 hidden xl:block" />

        <div className="hidden xl:flex flex-col text-right">
          <span className="text-xs font-semibold text-canvas-dark leading-tight">{userName}</span>
          <span className="text-[11px] text-canvas-muted capitalize">
            {currentRole === "admin"
              ? "Líder CREA / Facultad"
              : currentRole === "teacher"
              ? "Ayudante / Profesor"
              : "Estudiante UDP"}
          </span>
        </div>
      </div>

      {/* Modal Futuras Conexiones */}
      <FutureConnectionsModal
        isOpen={showConnectionsModal}
        onClose={() => setShowConnectionsModal(false)}
      />
    </header>
  );
};
