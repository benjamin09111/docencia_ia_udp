"use client";

import React, { useState } from "react";
import { Users, GraduationCap, Network, Sparkles, Building2 } from "lucide-react";
import { AyudantesManagementTab } from "./AyudantesManagementTab";
import { AyudantePedagogyTab } from "./AyudantePedagogyTab";
import { AyudanteCommunityPortalTab } from "./AyudanteCommunityPortalTab";

export const AdminAyudantiasView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ayudantes" | "pedagogia" | "portal">("ayudantes");

  return (
    <div className="space-y-4">
      {/* Banner Introductorio del Alcance de la Demo */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-[#008EE2] text-[10px] font-bold rounded uppercase tracking-wider">
              Investigación & Desarrollo CREA
            </span>
            <span className="text-xs text-[#6B7780]">Escuela de Informática UDP</span>
          </div>
          <h2 className="text-base font-bold text-[#2D3B45] mt-1 flex items-center gap-2">
            <GraduationCap size={18} className="text-[#C8102E]" />
            Ecosistema Integral de Ayudantías y Red Bidireccional
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Automatización de selección, formación didáctica docente, control de honorarios y espacio comunitario de estudio.
          </p>
        </div>

        <span className="text-[11px] font-medium text-[#55636E] bg-gray-50 px-2.5 py-1 rounded border border-gray-200 shrink-0">
          Alcance de Plataforma • Modo Piloto
        </span>
      </div>

      {/* Sub-tabs de Ayudantías */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card px-2 pt-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-nowrap border-b border-gray-200 pb-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("ayudantes")}
            className={`px-3.5 py-2.5 font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "ayudantes"
                ? "border-[#008EE2] text-[#008EE2] bg-blue-50/50 rounded-t-[3px]"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-50"
            }`}
          >
            <Users size={14} />
            <span>Ayudantes (Selección, Anuncios & Pagos)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pedagogia")}
            className={`px-3.5 py-2.5 font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "pedagogia"
                ? "border-[#008EE2] text-[#008EE2] bg-blue-50/50 rounded-t-[3px]"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-50"
            }`}
          >
            <GraduationCap size={14} />
            <span>Pedagogía & Formación Docente</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("portal")}
            className={`px-3.5 py-2.5 font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "portal"
                ? "border-[#008EE2] text-[#008EE2] bg-blue-50/50 rounded-t-[3px]"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-50"
            }`}
          >
            <Network size={14} />
            <span>Portal & Red Bidireccional</span>
          </button>
        </div>
      </div>

      {/* Vistas según sub-tab */}
      {activeTab === "ayudantes" && <AyudantesManagementTab />}
      {activeTab === "pedagogia" && <AyudantePedagogyTab />}
      {activeTab === "portal" && <AyudanteCommunityPortalTab />}
    </div>
  );
};
