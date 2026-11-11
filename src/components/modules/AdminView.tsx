"use client";

import React, { useState } from "react";
import { Bot, Building2, LockKeyhole, Users, LayoutDashboard } from "lucide-react";
import { InstitutionalFaculty, INSTITUTIONAL_FACULTIES } from "@/constants/institutionalHierarchy";
import { CanvasCourseNav, CourseNavItem } from "@/components/canvas/CanvasCourseNav";
import { AdminFacultySelector } from "./admin/hierarchy/AdminFacultySelector";
import { AdminAgentsTableTab } from "./admin/AdminAgentsTableTab";
import { AdminFacultyWorkspace } from "./admin/AdminFacultyWorkspace";
import { AdminLockedPanel } from "./admin/AdminLockedPanel";
import { AdminPrincipalView } from "./admin/AdminPrincipalView";

type AdminTab = "principal" | "facultades" | "agentes" | "ayudantes" | "docentes" | "noticias";

const navItems: CourseNavItem[] = [
  { id: "principal", label: "Panel Principal", icon: <LayoutDashboard size={15} /> },
  { id: "facultades", label: "Facultades y Cursos", icon: <Building2 size={15} /> },
  { id: "agentes", label: "Agentes IA", icon: <Bot size={15} /> },
  { id: "ayudantes", label: "Ayudantías", icon: <Users size={15} />, badge: <LockKeyhole size={12} /> },
  { id: "docentes", label: "Docentes", icon: <LockKeyhole size={15} />, badge: <LockKeyhole size={12} /> },
  { id: "noticias", label: "Noticias UDP", icon: <LockKeyhole size={15} />, badge: <LockKeyhole size={12} /> },
];

export const AdminView: React.FC = () => {
  const ficFaculty = INSTITUTIONAL_FACULTIES.find((f) => f.id === "fac_ingenieria") || INSTITUTIONAL_FACULTIES[0];
  const [activeTab, setActiveTab] = useState<AdminTab>("facultades");
  const [faculty, setFaculty] = useState<InstitutionalFaculty | null>(ficFaculty);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId as AdminTab);
  };

  const renderContent = () => {
    if (activeTab === "principal") {
      return <AdminPrincipalView />;
    }
    if (activeTab === "agentes") {
      return <AdminAgentsTableTab searchPlaceholder="Buscar todos los agentes de la plataforma..." />;
    }
    if (activeTab === "facultades") {
      return faculty ? (
        <AdminFacultyWorkspace faculty={faculty} onBack={() => setFaculty(null)} />
      ) : (
        <AdminFacultySelector onSelectFaculty={setFaculty} />
      );
    }

    const label = navItems.find((tab) => tab.id === activeTab)?.label || "Módulo";
    return (
      <AdminLockedPanel
        title={`${label} bloqueado`}
        description="Este módulo está reservado para una próxima etapa de habilitación institucional."
      />
    );
  };

  return (
    <div className="flex gap-8 lg:gap-10 items-start w-full min-h-[calc(100vh-6rem)] animate-fadeIn">
      {/* Navegación lateral oficial Canvas LMS (#section-tabs) */}
      <CanvasCourseNav
        termText="2026-2"
        sectionText="ADMINISTRACIÓN"
        items={navItems}
        activeId={activeTab}
        onSelect={handleSelectTab}
      />

      {/* Contenido principal según pestaña seleccionada */}
      <div className="flex-1 min-w-0">{renderContent()}</div>
    </div>
  );
};
