"use client";

import React, { useState } from "react";
import { Bot, Building2, LockKeyhole, Users } from "lucide-react";
import { InstitutionalFaculty } from "@/constants/institutionalHierarchy";
import { AdminFacultySelector } from "./admin/hierarchy/AdminFacultySelector";
import { AdminAgentsTableTab } from "./admin/AdminAgentsTableTab";
import { AdminFacultyWorkspace } from "./admin/AdminFacultyWorkspace";
import { AdminLockedPanel } from "./admin/AdminLockedPanel";
import { AdminPrincipalView } from "./admin/AdminPrincipalView";

type AdminTab = "principal" | "facultades" | "agentes" | "ayudantes" | "docentes" | "noticias";

const tabs: Array<{ id: AdminTab; label: string; icon: React.ReactNode; locked?: boolean }> = [
  { id: "principal", label: "PRINCIPAL", icon: <Building2 size={15} /> },
  { id: "facultades", label: "FACULTADES", icon: <Building2 size={15} /> },
  { id: "agentes", label: "AGENTES", icon: <Bot size={15} /> },
  { id: "ayudantes", label: "AYUDANTES", icon: <Users size={15} />, locked: true },
  { id: "docentes", label: "DOCENTES", icon: <LockKeyhole size={15} />, locked: true },
  { id: "noticias", label: "NOTICIAS", icon: <LockKeyhole size={15} />, locked: true },
];

export const AdminView: React.FC = () => {
  const [active, setActive] = useState<AdminTab>("facultades");
  const [faculty, setFaculty] = useState<InstitutionalFaculty | null>(null);
  const selectTab = (tab: AdminTab, locked?: boolean) => { if (!locked) { setActive(tab); setFaculty(null); } };
  const content = () => {
    if (active === "principal") return <AdminPrincipalView />;
    if (active === "agentes") return <AdminAgentsTableTab searchPlaceholder="Buscar todos los agentes de la plataforma..." />;
    if (active === "facultades") return faculty ? <AdminFacultyWorkspace faculty={faculty} onBack={() => setFaculty(null)} /> : <AdminFacultySelector onSelectFaculty={setFaculty} />;
    const label = tabs.find((tab) => tab.id === active)?.label || "Módulo";
    return <AdminLockedPanel title={`${label} bloqueado`} description="Este módulo está reservado para una próxima etapa de habilitación institucional." />;
  };
  return <div className="space-y-4 animate-fadeIn"><nav className="flex gap-5 overflow-x-auto border-b border-[#E0E3E6]" aria-label="Administración institucional">{tabs.map((tab) => <button key={tab.id} type="button" disabled={tab.locked} onClick={() => selectTab(tab.id, tab.locked)} className={`pb-2.5 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap border-b-2 transition-colors ${active === tab.id ? "border-[#B71C1C] text-[#2D3B45]" : "border-transparent text-[#6B7780]"} ${tab.locked ? "opacity-50 cursor-not-allowed" : "hover:text-[#B71C1C] cursor-pointer"}`}>{tab.icon}{tab.label}{tab.locked && <LockKeyhole size={12} />}</button>)}</nav>{content()}</div>;
};
