"use client";

import React, { useState } from "react";
import { InstitutionalFaculty, InstitutionalCareer } from "@/constants/institutionalHierarchy";
import { AdminFacultySelector } from "@/components/modules/admin/hierarchy/AdminFacultySelector";
import { AdminCareerSelector } from "@/components/modules/admin/hierarchy/AdminCareerSelector";
import { AdminWorkspaceView } from "@/components/modules/admin/AdminWorkspaceView";
import { AdminAgentsTableTab } from "@/components/modules/admin/AdminAgentsTableTab";
import { INSTITUTIONAL_ADMIN_AGENTS } from "@/constants/systemAgentsCatalog";
import { Building2, Bot } from "lucide-react";

export const AdminView: React.FC = () => {
  // Pestañas principales a nivel Admin: FACULTADES | AGENTES
  const [adminMainTab, setAdminMainTab] = useState<"facultades" | "agentes">("facultades");

  // Estado de navegación jerárquica para la pestaña FACULTADES
  const [selectedFaculty, setSelectedFaculty] = useState<InstitutionalFaculty | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<InstitutionalCareer | null>(null);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Selector Superior Canónico Canvas: FACULTADES | AGENTES */}
      <div className="flex items-center gap-6 border-b border-[#E0E3E6] pb-0">
        <button
          type="button"
          onClick={() => setAdminMainTab("facultades")}
          className={`pb-2.5 text-sm font-semibold transition-all relative cursor-pointer flex items-center gap-2 ${
            adminMainTab === "facultades"
              ? "text-[#2D3B45] border-b-2 border-[#B71C1C] font-bold"
              : "text-[#6B7780] hover:text-[#2D3B45]"
          }`}
        >
          <Building2 size={16} className={adminMainTab === "facultades" ? "text-[#B71C1C]" : "text-gray-400"} />
          <span>FACULTADES</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminMainTab("agentes")}
          className={`pb-2.5 text-sm font-semibold transition-all relative cursor-pointer flex items-center gap-2 ${
            adminMainTab === "agentes"
              ? "text-[#2D3B45] border-b-2 border-[#B71C1C] font-bold"
              : "text-[#6B7780] hover:text-[#2D3B45]"
          }`}
        >
          <Bot size={16} className={adminMainTab === "agentes" ? "text-[#B71C1C]" : "text-gray-400"} />
          <span>AGENTES</span>
          <span className="text-xs bg-red-50 text-[#B71C1C] border border-red-200 px-2 py-0.5 rounded-full font-bold">
            {INSTITUTIONAL_ADMIN_AGENTS.length}
          </span>
        </button>
      </div>

      {/* Pestaña 1: AGENTES INSTITUCIONALES / GENERALES */}
      {adminMainTab === "agentes" && (
        <div className="space-y-4 animate-fadeIn">
          <AdminAgentsTableTab
            agents={INSTITUTIONAL_ADMIN_AGENTS}
            showTierFilters={false}
            searchPlaceholder="Buscar por agente, código o modelo OpenRouter..."
          />
        </div>
      )}

      {/* Pestaña 2: FACULTADES, CARRERAS Y CURSOS */}
      {adminMainTab === "facultades" && (
        <div className="animate-fadeIn">
          {!selectedFaculty ? (
            <AdminFacultySelector
              onSelectFaculty={(fac) => {
                setSelectedFaculty(fac);
                setSelectedCareer(null);
              }}
              onQuickSelect={(faculty, career) => {
                setSelectedFaculty(faculty);
                setSelectedCareer(career);
              }}
            />
          ) : !selectedCareer ? (
            <AdminCareerSelector
              faculty={selectedFaculty}
              onSelectCareer={(car) => setSelectedCareer(car)}
              onBack={() => setSelectedFaculty(null)}
            />
          ) : (
            <AdminWorkspaceView
              faculty={selectedFaculty}
              career={selectedCareer}
              onBackToCareers={() => setSelectedCareer(null)}
              onBackToFaculties={() => {
                setSelectedCareer(null);
                setSelectedFaculty(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
