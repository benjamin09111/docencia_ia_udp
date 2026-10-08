"use client";

import React from "react";
import { InstitutionalFaculty, INSTITUTIONAL_FACULTIES } from "@/constants/institutionalHierarchy";
import { Building2, ChevronRight, Sparkles, BookOpen, Bot, MapPin, CheckCircle2 } from "lucide-react";

interface AdminFacultySelectorProps {
  onSelectFaculty: (faculty: InstitutionalFaculty) => void;
}

export const AdminFacultySelector: React.FC<AdminFacultySelectorProps> = ({ onSelectFaculty }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      {/* Encabezado y Breadcrumb */}
      <div className="border-b border-[#E0E3E6] pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7780] mb-1">
          <span className="text-[#B71C1C]">UDP IA</span>
          <span>&gt;</span>
          <span className="text-[#2D3B45]">Facultades UDP</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#2D3B45] flex items-center gap-2.5">
          <Building2 size={24} className="text-[#B71C1C]" />
          Selecciona una Facultad
        </h1>
        <p className="text-xs text-[#6B7780] mt-1">
          Paso 1 de 3: Elige la facultad para auditar y orquestar los agentes de IA, cursos y asignaturas departamentales.
        </p>
      </div>

      {/* Grid de Facultades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {INSTITUTIONAL_FACULTIES.map((fac) => {
          const isActive = fac.estado === "activo";
          return (
            <div
              key={fac.id}
              onClick={() => isActive && onSelectFaculty(fac)}
              className={`bg-white border rounded-[4px] p-5 transition-all select-none flex flex-col justify-between ${
                isActive
                  ? "border-[#C7CDD1] hover:border-[#B71C1C] hover:shadow-md cursor-pointer group shadow-canvas-card"
                  : "border-gray-200 opacity-60 cursor-not-allowed bg-gray-50/70"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-10 h-10 rounded-[4px] flex items-center justify-center font-bold text-sm shrink-0 ${
                      isActive
                        ? "bg-red-50 text-[#B71C1C] border border-red-200 group-hover:bg-[#B71C1C] group-hover:text-white transition-colors"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {fac.sigla}
                  </div>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={11} />
                      En Pilotaje IA
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-200 text-gray-600">
                      Próximamente
                    </span>
                  )}
                </div>

                <div>
                  <h3
                    className={`text-sm font-bold leading-snug ${
                      isActive ? "text-[#2D3B45] group-hover:text-[#B71C1C] transition-colors" : "text-gray-500"
                    }`}
                  >
                    {fac.nombre}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-[#6B7780] mt-1">
                    <MapPin size={11} className="shrink-0" />
                    <span className="truncate">{fac.campus}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#6B7780] leading-relaxed line-clamp-2">
                  {fac.descripcion}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                {isActive ? (
                  <>
                    <div className="flex items-center gap-3 text-[11px] text-[#6B7780]">
                      <span className="flex items-center gap-1 font-semibold text-[#2D3B45]">
                        <BookOpen size={12} className="text-[#008EE2]" />
                        {fac.cursosActivos} cursos
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-[#2D3B45]">
                        <Bot size={12} className="text-purple-600" />
                        {fac.agentesActivos} agentes
                      </span>
                    </div>
                    <span className="text-[#B71C1C] font-bold text-xs flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Ingresar <ChevronRight size={14} />
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] text-gray-400 italic">No habilitada en esta fase</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
