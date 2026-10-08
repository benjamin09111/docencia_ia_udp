"use client";

import React from "react";
import { GraduationCap, User, Calendar, Clock } from "lucide-react";

interface StudentCourseHeaderProps {
  courseCode?: string;
  courseName?: string;
  profesor?: string;
  ayudante?: string;
  horario?: string;
}

export const StudentCourseHeader: React.FC<StudentCourseHeaderProps> = ({
  courseCode = "CIT3000_CA02",
  courseName = "ARQUITECTURA DE SOFTWARE & GESTIÓN TIC",
  profesor = "Jorge Esteban Cruz León",
  ayudante = "Benjamín Morales Pizarro",
  horario = "Mié 16:00 - 17:20 | Bloque 2: Mié 20:10 - 21:30",
}) => {
  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card mb-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 text-[#2D3B45] border border-[#C7CDD1] uppercase tracking-wide">
              {courseCode}
            </span>
            <span className="text-xs text-[#6B7780]">
              Semestre 2026-2 • Escuela de Informática y Telecomunicaciones UDP
            </span>
          </div>

          <h1 className="text-lg font-bold text-[#2D3B45] mt-1.5 flex items-center gap-2">
            <GraduationCap size={22} className="text-[#B71C1C]" />
            {courseName}
          </h1>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-[#6B7780]">
            <span className="flex items-center gap-1.5">
              <User size={13} className="text-[#2D3B45]" />
              <strong className="text-[#2D3B45]">Profesor:</strong> {profesor}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={13} className="text-[#2D3B45]" />
              <strong className="text-[#2D3B45]">Ayudante:</strong> {ayudante}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-[#2D3B45]" />
              <strong className="text-[#2D3B45]">Horario:</strong> {horario}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 bg-[#F5F6F8] border border-[#C7CDD1] rounded-[3px] text-xs flex items-center gap-2 text-[#2D3B45]">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            <span className="font-semibold">Estudiante Activo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
