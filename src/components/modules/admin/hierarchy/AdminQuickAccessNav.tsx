"use client";

import React from "react";
import {
  INSTITUTIONAL_FACULTIES,
  INSTITUTIONAL_CAREERS,
  InstitutionalFaculty,
  InstitutionalCareer,
} from "@/constants/institutionalHierarchy";
import { Zap, Building2, ChevronRight, Sparkles, CheckCircle2 } from "lucide-react";

interface AdminQuickAccessNavProps {
  onQuickSelectCareer: (faculty: InstitutionalFaculty, career: InstitutionalCareer) => void;
}

export const AdminQuickAccessNav: React.FC<AdminQuickAccessNavProps> = ({
  onQuickSelectCareer,
}) => {
  const ficFaculty = INSTITUTIONAL_FACULTIES.find((f) => f.id === "fac_ingenieria");
  const citiCareer = INSTITUTIONAL_CAREERS.find((c) => c.id === "car_citi");

  return (
    <aside
      aria-label="Menú lateral de accesos rápidos"
      className="w-full md:w-64 shrink-0 select-none space-y-3"
    >
      {/* Cabecera de Accesos Rápidos estilo Canvas #section-tabs */}
      <div className="text-xs font-semibold text-[#6B7780] pb-2.5 px-1 border-b border-[#E0E3E6] uppercase tracking-wide flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[#2D3B45] font-bold text-xs">
          <Zap size={14} className="text-[#B71C1C]" />
          Accesos Rápidos
        </span>
        <span className="text-xs font-medium text-[#6B7780]">2026-2</span>
      </div>

      {/* Ítem activo de vista actual */}
      <div className="w-full text-left text-sm py-2 px-3 flex items-center justify-between rounded-[2px] font-bold text-[#2D3B45] border-l-[3px] border-[#2D3B45] bg-gray-50/80">
        <span className="flex items-center gap-2">
          <Building2 size={16} className="text-[#2D3B45]" />
          Facultades UDP
        </span>
        <span className="text-xs text-[#6B7780] font-normal">Paso 1</span>
      </div>

      {/* Tarjeta de Acceso Directo a FIC - CIT */}
      {ficFaculty && citiCareer && (
        <button
          type="button"
          onClick={() => onQuickSelectCareer(ficFaculty, citiCareer)}
          className="w-full text-left p-3.5 rounded-[4px] border border-[#C7CDD1] hover:border-[#B71C1C] bg-white hover:bg-red-50/20 transition-all group shadow-canvas-card cursor-pointer block"
        >
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold bg-red-50 text-[#B71C1C] border border-red-200">
              <Sparkles size={11} />
              En uso actual
            </span>
            <span className="text-xs font-mono font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
              CIT
            </span>
          </div>

          <div className="text-sm sm:text-[15px] font-bold text-[#2D3B45] group-hover:text-[#B71C1C] transition-colors leading-snug">
            FIC — Ing. Civil en Informática y Telecomunicaciones
          </div>

          <div className="text-xs sm:text-[13px] text-[#6B7780] mt-1.5 flex items-center gap-1.5">
            <Building2 size={13} className="shrink-0 text-gray-400" />
            <span className="truncate">FIC • Av. Ejército 441</span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs sm:text-[13px]">
            <span className="text-[#6B7780] font-medium">5 cursos • 8 agentes</span>
            <span className="text-[#B71C1C] font-bold text-sm flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Ir directo <ChevronRight size={15} />
            </span>
          </div>
        </button>
      )}

      {/* Nota descriptiva */}
      <div className="p-3 rounded-[4px] bg-[#F5F6F8] border border-[#E0E3E6] text-xs sm:text-[13px] text-[#6B7780] leading-relaxed">
        <p className="font-bold text-sm text-[#2D3B45] mb-1 flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-emerald-600" />
          Espacio Operativo
        </p>
        Acceso directo a la carrera con agentes IA, secciones y rúbricas activas.
      </div>
    </aside>
  );
};
