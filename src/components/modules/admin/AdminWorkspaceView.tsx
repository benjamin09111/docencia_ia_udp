"use client";

import React, { useState, useEffect } from "react";
import { InstitutionalFaculty, InstitutionalCareer } from "@/constants/institutionalHierarchy";
import { CanvasCourseNav, CourseNavItem } from "@/components/canvas/CanvasCourseNav";
import { AdminCourseAgentsTab } from "@/components/modules/admin/AdminCourseAgentsTab";
import { AdminTechnicalAgentsTab } from "@/components/modules/admin/AdminTechnicalAgentsTab";
import { AdminCourseScheduleManagement } from "@/components/modules/admin/AdminCourseScheduleManagement";
import { AdminCourseDetailView } from "@/components/modules/admin/AdminCourseDetailView";
import { AdminAyudantiasView } from "@/components/modules/admin/ayudantias/AdminAyudantiasView";
import { AdminGradeScaleTab } from "@/components/modules/admin/AdminGradeScaleTab";
import { AgentHistoryModal, TechnicalAgentItem } from "@/components/modules/admin/AgentHistoryModal";
import { AgentEditModal } from "@/components/modules/admin/AgentEditModal";
import { AdminEndSemesterModal } from "@/components/modules/admin/AdminEndSemesterModal";
import { getSavedSections, saveSections, INITIAL_SECTIONS } from "@/services/attendanceStore";
import { updateSectionScheduleInSupabase, fetchSectionsFromSupabase, isSupabaseConfigured } from "@/services/attendanceDbService";
import { CourseSection } from "@/types/attendance";
import { INITIAL_TECHNICAL_AGENTS } from "@/constants/technicalAgentsCatalog";
import { Bot, Cpu, Calendar, Users, Award, CheckCircle2, ArrowLeft, GraduationCap } from "lucide-react";

interface AdminWorkspaceViewProps {
  faculty: InstitutionalFaculty;
  career: InstitutionalCareer;
  onBackToCareers: () => void;
  onBackToFaculties: () => void;
}

export const AdminWorkspaceView: React.FC<AdminWorkspaceViewProps> = ({
  faculty,
  career,
  onBackToCareers,
  onBackToFaculties,
}) => {
  const [activeTab, setActiveTab] = useState<
    "course_agents" | "technical_agents" | "course_schedules" | "ayudantias" | "grade_scale"
  >("course_agents");

  const [selectedDetailSection, setSelectedDetailSection] = useState<CourseSection | null>(null);
  const [selectedHistoryAgent, setSelectedHistoryAgent] = useState<TechnicalAgentItem | null>(null);
  const [selectedEditAgent, setSelectedEditAgent] = useState<TechnicalAgentItem | null>(null);
  const [technicalAgents, setTechnicalAgents] = useState<TechnicalAgentItem[]>(INITIAL_TECHNICAL_AGENTS);
  const [isEndSemesterModalOpen, setIsEndSemesterModalOpen] = useState(false);
  const [sections, setSections] = useState<CourseSection[]>(INITIAL_SECTIONS);

  useEffect(() => {
    setSections(getSavedSections());
    const handleSync = () => setSections(getSavedSections());
    window.addEventListener("udp_sections_updated", handleSync);
    return () => window.removeEventListener("udp_sections_updated", handleSync);
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchSectionsFromSupabase().then((cloudSections) => {
        if (cloudSections && cloudSections.length > 0) {
          setSections(cloudSections);
          saveSections(cloudSections);
        }
      });
    }
  }, []);

  const navItems: CourseNavItem[] = [
    { id: "course_agents", label: "Sistemas de agentes", icon: <Bot size={15} /> },
    { id: "technical_agents", label: "Agentes técnicos", icon: <Cpu size={15} /> },
    { id: "course_schedules", label: "Cursos y Horarios", icon: <Calendar size={15} /> },
    { id: "ayudantias", label: "Ayudantías", icon: <Users size={15} /> },
    { id: "grade_scale", label: "Escala y Notas", icon: <Award size={15} /> },
    { id: "end_semester", label: "Cierre de semestre", icon: <CheckCircle2 size={15} /> },
  ];

  const handleNavSelect = (id: string) => {
    if (id === "end_semester") {
      setIsEndSemesterModalOpen(true);
      return;
    }
    setActiveTab(id as any);
  };

  if (selectedDetailSection) {
    return (
      <AdminCourseDetailView
        section={selectedDetailSection}
        onBack={() => setSelectedDetailSection(null)}
        onSaveSection={async (updated) => {
          const all = getSavedSections();
          const updatedAll = all.map((s) => (s.id === updated.id || s.codigo === updated.codigo ? updated : s));
          saveSections(updatedAll);
          setSections(updatedAll);
          setSelectedDetailSection(updated);
          await updateSectionScheduleInSupabase(updated);
        }}
      />
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Barra de Contexto Jerárquico Superior */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] px-4 py-2.5 shadow-canvas-card flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onBackToFaculties}
            className="text-[#B71C1C] hover:underline font-semibold cursor-pointer"
          >
            {faculty.sigla}
          </button>
          <span className="text-gray-400">&gt;</span>
          <span className="font-bold text-[#2D3B45] flex items-center gap-1.5">
            <GraduationCap size={15} className="text-[#008EE2]" />
            {career.nombre} ({career.codigo})
          </span>
        </div>

        <button
          type="button"
          onClick={onBackToCareers}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B71C1C] hover:underline cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft size={13} /> Cambiar Carrera
        </button>
      </div>

      <div className="flex gap-8 lg:gap-10 items-start w-full min-h-[calc(100vh-8rem)]">
        {/* Menú Lateral Canvas (#section-tabs) */}
        <CanvasCourseNav
          termText="2026-2"
          sectionText={career.codigo}
          items={navItems}
          activeId={activeTab}
          onSelect={handleNavSelect}
        />

        {/* Área de Contenido Principal (#content) */}
        <div className="flex-1 min-w-0">
          {activeTab === "course_agents" && (
            <AdminCourseAgentsTab
              sections={sections}
              onSelectSection={(sec) => setSelectedDetailSection(sec)}
            />
          )}

          {activeTab === "technical_agents" && (
            <AdminTechnicalAgentsTab
              technicalAgents={technicalAgents}
              onOpenHistory={(agent) => setSelectedHistoryAgent(agent)}
              onOpenEdit={(agent) => setSelectedEditAgent(agent)}
            />
          )}

          {activeTab === "course_schedules" && <AdminCourseScheduleManagement />}
          {activeTab === "ayudantias" && <AdminAyudantiasView />}
          {activeTab === "grade_scale" && <AdminGradeScaleTab />}
        </div>

        {/* Modales Canónicos Reutilizables */}
        <AgentHistoryModal
          isOpen={Boolean(selectedHistoryAgent)}
          onClose={() => setSelectedHistoryAgent(null)}
          agent={selectedHistoryAgent}
        />

        <AgentEditModal
          isOpen={Boolean(selectedEditAgent)}
          onClose={() => setSelectedEditAgent(null)}
          agent={selectedEditAgent}
          onSave={(updated) => {
            setTechnicalAgents((prev) =>
              prev.map((a) => (a.id === updated.id ? updated : a))
            );
          }}
        />

        <AdminEndSemesterModal
          isOpen={isEndSemesterModalOpen}
          onClose={() => setIsEndSemesterModalOpen(false)}
        />
      </div>
    </div>
  );
};
