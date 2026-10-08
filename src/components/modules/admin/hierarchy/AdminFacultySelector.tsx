"use client";

import React from "react";
import { InstitutionalFaculty, InstitutionalCareer, INSTITUTIONAL_FACULTIES } from "@/constants/institutionalHierarchy";
import { Building2, ChevronRight, BookOpen, Bot, MapPin, CheckCircle2 } from "lucide-react";
import { AdminQuickAccessNav } from "@/components/modules/admin/hierarchy/AdminQuickAccessNav";

interface AdminFacultySelectorProps {
  onSelectFaculty: (faculty: InstitutionalFaculty) => void;
  onQuickSelect?: (faculty: InstitutionalFaculty, career: InstitutionalCareer) => void;
}

export const AdminFacultySelector: React.FC<AdminFacultySelectorProps> = ({
  onSelectFaculty,
  onQuickSelect,
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn pb-12">
      {/* Encabezado y Breadcrumb Oficial Canvas LMS */}
      <div className="border-b border-[#E0E3E6] pb-5">
        <div className="flex items-center gap-2 text-sm sm:text-[15px] font-semibold text-[#6B7780] mb-1.5">
          <span className="text-[#B71C1C] hover:underline cursor-pointer">UDP IA</span>
          <span>&gt;</span>
          <span className="text-[#2D3B45] font-bold">Facultades UDP</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2D3B45] flex items-center gap-3">
          <Building2 size={28} className="text-[#B71C1C]" />
          Selecciona una Facultad
        </h1>
        <p className="text-sm sm:text-[15px] text-[#6B7780] mt-1.5 leading-relaxed">
          Paso 1 de 3: Elige la facultad para auditar y orquestar los agentes de IA, cursos y asignaturas departamentales.
        </p>
      </div>

      {/* Contenedor con Menú Lateral Izquierdo de Accesos Rápidos y Grid Principal */}
      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
        {/* Menú lateral pequeño de Accesos Rápidos */}
        <AdminQuickAccessNav
          onQuickSelectCareer={(faculty, career) => {
            if (onQuickSelect) {
              onQuickSelect(faculty, career);
            } else {
              onSelectFaculty(faculty);
            }
          }}
        />

        {/* Grid de Facultades */}
        <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
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
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-11 h-11 rounded-[4px] flex items-center justify-center font-bold text-base shrink-0 ${
                      isActive
                        ? "bg-red-50 text-[#B71C1C] border border-red-200 group-hover:bg-[#B71C1C] group-hover:text-white transition-colors"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {fac.sigla}
                  </div>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={13} />
                      En Pilotaje IA
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-gray-200 text-gray-600">
                      Próximamente
                    </span>
                  )}
                </div>

                <div>
                  <h3
                    className={`text-base sm:text-[17px] font-bold leading-snug ${
                      isActive ? "text-[#2D3B45] group-hover:text-[#B71C1C] transition-colors" : "text-gray-500"
                    }`}
                  >
                    {fac.nombre}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs sm:text-[13px] text-[#6B7780] mt-1.5">
                    <MapPin size={13} className="shrink-0 text-gray-400" />
                    <span className="truncate">{fac.campus}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-[13px] text-[#6B7780] leading-relaxed line-clamp-3">
                  {fac.descripcion}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs sm:text-[13px]">
                {isActive ? (
                  <>
                    <div className="flex items-center gap-3 text-xs sm:text-[13px] text-[#6B7780]">
                      <span className="flex items-center gap-1 font-semibold text-[#2D3B45]">
                        <BookOpen size={13} className="text-[#008EE2]" />
                        {fac.cursosActivos} cursos
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-[#2D3B45]">
                        <Bot size={13} className="text-purple-600" />
                        {fac.agentesActivos} agentes
                      </span>
                    </div>
                    <span className="text-[#B71C1C] font-bold text-sm sm:text-[15px] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Ingresar <ChevronRight size={16} />
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-gray-400 italic">No habilitada en esta fase</span>
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};
