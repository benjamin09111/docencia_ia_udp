"use client";

import React from "react";
import { UserRole } from "@/types";
import { ShieldCheck, GraduationCap, School, CheckCircle2 } from "lucide-react";

interface CanvasHeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  breadcrumbs?: string[];
  userName?: string;
}

export const CanvasHeader: React.FC<CanvasHeaderProps> = ({
  currentRole,
  onRoleChange,
  breadcrumbs = ["Universidad Diego Portales", "Docencia IA", "Panel Oficial"],
  userName = "Benjamín Morales Pizarro",
}) => {
  return (
    <header className="h-16 bg-white border-b border-canvas-border-light px-6 flex items-center justify-between shadow-canvas-card sticky top-0 z-20">
      {/* Breadcrumbs Canvas Style */}
      <div className="flex items-center gap-2 text-sm text-canvas-muted">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <span
              className={
                idx === breadcrumbs.length - 1
                  ? "font-semibold text-canvas-dark text-[15px]"
                  : "hover:underline cursor-pointer text-canvas-muted"
              }
            >
              {crumb}
            </span>
            {idx < breadcrumbs.length - 1 && (
              <span className="text-gray-400 font-light">&gt;</span>
            )}
          </React.Fragment>
        ))}

        <div className="ml-4 hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
          <CheckCircle2 size={13} className="text-emerald-600" />
          <span>API Canvas UDP Conectada</span>
        </div>
      </div>

      {/* Role Switcher for Demo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-gray-100 p-1 rounded-[6px] border border-gray-200">
          <button
            onClick={() => onRoleChange("admin")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-xs font-medium transition-all ${
              currentRole === "admin"
                ? "bg-white text-udp-red shadow-sm border border-gray-200 font-semibold"
                : "text-canvas-muted hover:text-canvas-dark"
            }`}
          >
            <ShieldCheck size={14} />
            <span>Admin CREA</span>
          </button>

          <button
            onClick={() => onRoleChange("teacher")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-xs font-medium transition-all ${
              currentRole === "teacher"
                ? "bg-white text-canvas-blue shadow-sm border border-gray-200 font-semibold"
                : "text-canvas-muted hover:text-canvas-dark"
            }`}
          >
            <School size={14} />
            <span>Docente / Ayudante</span>
          </button>

          <button
            onClick={() => onRoleChange("student")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-xs font-medium transition-all ${
              currentRole === "student"
                ? "bg-white text-emerald-700 shadow-sm border border-gray-200 font-semibold"
                : "text-canvas-muted hover:text-canvas-dark"
            }`}
          >
            <GraduationCap size={14} />
            <span>Estudiante</span>
          </button>
        </div>

        <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

        <div className="hidden sm:flex flex-col text-right">
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
    </header>
  );
};
