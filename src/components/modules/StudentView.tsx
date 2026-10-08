"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CourseDeliverable, StudentExcelRow, StudentSubmission, StudentStudyMetrics } from "@/types";
import { CanvasCourseNav, CourseNavItem } from "@/components/canvas/CanvasCourseNav";
import { StudentCourseHeader } from "./student/StudentCourseHeader";
import { StudentHomeTab } from "./student/StudentHomeTab";
import { StudentSumativasTab } from "./student/StudentSumativasTab";
import { StudentActivitiesTab } from "./student/StudentActivitiesTab";
import { StudentLearnChatTab } from "./student/StudentLearnChatTab";
import { StudentPracticeLabTab } from "./student/StudentPracticeLabTab";
import { StudentAttendanceGradesTab } from "./student/StudentAttendanceGradesTab";
import { Home, FileText, Sparkles, Brain, ListChecks, CalendarCheck } from "lucide-react";

export type StudentWorkspaceTab = "inicio" | "sumativas" | "formativas" | "aprendizaje" | "practica" | "asistencia";

interface StudentViewProps {
  entregables?: CourseDeliverable[];
  entregasAlumnos?: StudentSubmission[];
  estudiantesExcel?: StudentExcelRow[];
  onSubmitActivity?: (deliverableId: string, solutionText: string) => void;
  onSendAppeal?: (submissionId: string, appealText: string) => void;
  onActiveCourseChange?: (info: { courseCode: string; tabTitle: string } | null) => void;
}

export const StudentView: React.FC<StudentViewProps> = ({
  entregables = [],
  entregasAlumnos = [],
  estudiantesExcel = [],
  onSubmitActivity = () => {},
  onSendAppeal = () => {},
  onActiveCourseChange,
}) => {
  const [activeTab, setActiveTab] = useState<StudentWorkspaceTab>("inicio");
  const [studyMetrics, setStudyMetrics] = useState<StudentStudyMetrics>({
    preguntasRealizadas: 14,
    actividadesCompletadas: 3,
    quizzesRespondidos: 2,
    casosResueltos: 1,
    puntosEstudio: 85,
  });

  const courseCode = "CIT3000_CA02";

  const navItems: CourseNavItem[] = useMemo(() => [
    { id: "inicio", label: "Página de inicio", icon: <Home size={15} /> },
    { id: "sumativas", label: "Evaluaciones sumativas", icon: <FileText size={15} /> },
    { id: "formativas", label: "Evaluaciones formativas", icon: <Sparkles size={15} /> },
    { id: "aprendizaje", label: "Tutor IA (Aprendizaje)", icon: <Brain size={15} /> },
    { id: "practica", label: "Laboratorio de Práctica", icon: <ListChecks size={15} /> },
    { id: "asistencia", label: "Calificaciones y Asistencia", icon: <CalendarCheck size={15} /> },
  ], []);

  useEffect(() => {
    const activeLabel = navItems.find((n) => n.id === activeTab)?.label || "Módulos";
    onActiveCourseChange?.({ courseCode, tabTitle: activeLabel });
    return () => onActiveCourseChange?.(null);
  }, [activeTab, navItems, onActiveCourseChange]);

  const handleUpdateMetrics = (patch: Partial<StudentStudyMetrics>) => {
    setStudyMetrics((prev) => ({ ...prev, ...patch }));
  };

  const handleQuestionInChat = () => {
    setStudyMetrics((prev) => ({
      ...prev,
      preguntasRealizadas: prev.preguntasRealizadas + 1,
      puntosEstudio: prev.puntosEstudio + 5,
    }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start w-full animate-fadeIn">
      {/* Mini Sidebar Canvas (#section-tabs) */}
      <CanvasCourseNav
        termText="2026-2"
        sectionText="CIT3000_CA02"
        items={navItems}
        activeId={activeTab}
        onSelect={(id) => setActiveTab(id as StudentWorkspaceTab)}
      />

      {/* Selector Móvil */}
      <div className="md:hidden w-full bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-canvas-card mb-2">
        <select
          value={activeTab}
          aria-label="Seleccionar módulo del estudiante"
          onChange={(e) => setActiveTab(e.target.value as StudentWorkspaceTab)}
          className="w-full border border-[#C7CDD1] rounded px-2.5 py-1.5 text-xs bg-white text-[#2D3B45] font-semibold"
        >
          {navItems.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
      </div>

      {/* Área Principal de Contenido */}
      <div className="flex-1 min-w-0 w-full">
        <StudentCourseHeader
          courseCode="CIT3000_CA02"
          courseName="ARQUITECTURA DE SOFTWARE & GESTIÓN TIC"
          profesor="Jorge Esteban Cruz León"
          ayudante="Benjamín Morales Pizarro"
          horario="Mié 16:00 - 17:20 | Bloque 2: Mié 20:10 - 21:30"
        />

        {activeTab === "inicio" && (
          <StudentHomeTab
            entregables={entregables}
            onNavigateTab={(tab) => setActiveTab(tab as StudentWorkspaceTab)}
          />
        )}

        {activeTab === "sumativas" && (
          <StudentSumativasTab
            entregables={entregables}
            entregasAlumnos={entregasAlumnos}
          />
        )}

        {activeTab === "formativas" && (
          <StudentActivitiesTab
            entregables={entregables}
            entregasAlumnos={entregasAlumnos}
            onSubmitActivity={onSubmitActivity}
            onSendAppeal={onSendAppeal}
          />
        )}

        {activeTab === "aprendizaje" && (
          <StudentLearnChatTab
            onQuestionAsked={handleQuestionInChat}
            preguntasContador={studyMetrics.preguntasRealizadas}
          />
        )}

        {activeTab === "practica" && (
          <StudentPracticeLabTab
            metrics={studyMetrics}
            onUpdateMetrics={handleUpdateMetrics}
          />
        )}

        {activeTab === "asistencia" && (
          <StudentAttendanceGradesTab
            estudiantesExcel={estudiantesExcel}
          />
        )}
      </div>
    </div>
  );
};
