"use client";

import React, { useState, useMemo, useEffect } from "react";
import { CanvasCourse, CourseDeliverable, StudentExcelRow, StudentSubmission } from "@/types";
import { CourseSection, ClassSession } from "@/types/attendance";
import { CanvasCourseNav, CourseNavItem } from "@/components/canvas/CanvasCourseNav";
import { CourseWorkspaceHeader } from "./CourseWorkspaceHeader";
import { CourseWorkspaceContent, CourseWorkspaceTab } from "./CourseWorkspaceContent";
import {
  getSectionByCourseCode,
  formatSectionSchedule,
  getSavedSections,
  generateSemesterSessions,
  StudentRosterItem,
} from "@/services/attendanceStore";
import { fetchSectionsFromSupabase, isSupabaseConfigured } from "@/services/attendanceDbService";

import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Calendar,
  Megaphone,
  CalendarCheck,
  Users,
  Zap,
  FileSpreadsheet,
  BarChart3,
  GraduationCap,
  Home,
} from "lucide-react";

interface AutomatedCourseWorkspaceProps {
  course: CanvasCourse;
  section?: CourseSection;
  entregables: CourseDeliverable[];
  estudiantesExcel: StudentExcelRow[];
  entregasAlumnos?: StudentSubmission[];
  onBack: () => void;
  onAddDeliverable: (d: CourseDeliverable) => void;
  onUpdateGrade: (canvasId: number, field: keyof StudentExcelRow, value: number) => void;
  onResolveAppeal?: (submissionId: string, action: "aceptar" | "ratificar") => void;
  onActiveCourseChange?: (info: { courseCode: string; tabTitle: string } | null) => void;
}

export const AutomatedCourseWorkspace: React.FC<AutomatedCourseWorkspaceProps> = ({
  course,
  section: propSection,
  entregables,
  estudiantesExcel,
  entregasAlumnos = [],
  onBack,
  onAddDeliverable,
  onUpdateGrade,
  onResolveAppeal,
  onActiveCourseChange,
}) => {
  const [activeTab, setActiveTab] = useState<CourseWorkspaceTab>("resumen");
  const section = useMemo(() => {
    return propSection || getSectionByCourseCode(course.code);
  }, [propSection, course.code]);

  const scheduleInfo = useMemo(() => formatSectionSchedule(section), [section]);

  const rosterStudents: StudentRosterItem[] = useMemo(() => {
    return estudiantesExcel.map((st) => ({
      canvas_id: st.canvas_id,
      nombres: st.nombres,
      apellidos: st.apellidos,
      rut: st.rut,
      email: st.email || "",
      seccionId: section.id,
    }));
  }, [estudiantesExcel, section.id]);

  const courseSessions: ClassSession[] = useMemo(() => {
    return generateSemesterSessions(section);
  }, [section]);

  const cleanCourseName = useMemo(() => {
    return course.name.replace(/^\d+\s*-\s*/, "");
  }, [course.name]);

  const sectionText = useMemo(() => {
    if (section?.nombre) {
      return section.nombre.toUpperCase();
    }
    const match = course.code.match(/CA0?(\d+)/i);
    return match ? `SECCIÓN ${match[1]}` : "SECCIÓN 1";
  }, [section?.nombre, course.code]);

  const navItems: CourseNavItem[] = useMemo(() => [
    { id: "resumen", label: cleanCourseName, icon: <LayoutDashboard size={15} /> },
    { id: "evaluaciones", label: "Evaluaciones sumativas", icon: <FileText size={15} /> },
    { id: "actividades", label: "Evaluaciones formativas", icon: <Sparkles size={15} /> },
    { id: "cronograma", label: "Cronograma", icon: <Calendar size={15} /> },
    { id: "anuncios", label: "Anuncios", icon: <Megaphone size={15} /> },
    { id: "asistencia", label: "Asistencia", icon: <CalendarCheck size={15} /> },
    { id: "grupos", label: "Grupos", icon: <Users size={15} /> },
    { id: "automatizaciones", label: "Automatizaciones", icon: <Zap size={15} /> },
    { id: "excel", label: "Excel final", icon: <FileSpreadsheet size={15} /> },
    { id: "metricas", label: "Métricas e Informe", icon: <BarChart3 size={15} /> },
    { id: "aprendizaje", label: "Aprendizaje y trazabilidad", icon: <GraduationCap size={15} /> },
    { id: "inicio", label: "Página de inicio", icon: <Home size={15} /> },
  ], [cleanCourseName]);

  // Sincronizar dinámicamente el código de sección y el módulo actual para los breadcrumbs de Canvas
  useEffect(() => {
    const sectionBreadcrumb = section?.codigo || course.code || "CIT3203_CA01";
    const currentTabLabel = navItems.find((item) => item.id === activeTab)?.label || "Módulos";
    onActiveCourseChange?.({ courseCode: sectionBreadcrumb, tabTitle: currentTabLabel });
    return () => {
      onActiveCourseChange?.(null);
    };
  }, [section?.codigo, course.code, activeTab, navItems, onActiveCourseChange]);

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start w-full">
      {/* Mini Sidebar Lateral Canvas (#section-tabs) */}
      <CanvasCourseNav
        termText="2026-2"
        sectionText={sectionText}
        items={navItems}
        activeId={activeTab}
        onSelect={(id) => setActiveTab(id as CourseWorkspaceTab)}
        backLink={{
          label: "Volver a Cursos",
          onBack: onBack,
        }}
      />

      {/* Selector Móvil de navegación rápida */}
      <div className="md:hidden w-full bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-canvas-card mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-[#B71C1C] hover:underline font-bold"
        >
          ← Cursos
        </button>
        <select
          value={activeTab}
          aria-label="Seleccionar módulo del curso"
          onChange={(e) => setActiveTab(e.target.value as CourseWorkspaceTab)}
          className="border border-gray-300 rounded px-2 py-1 text-xs bg-white text-[#2D3B45] font-semibold flex-1"
        >
          {navItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Área Principal de Contenido del Curso */}
      <div className="flex-1 min-w-0 w-full">
        <CourseWorkspaceHeader
          course={course}
          scheduleInfo={scheduleInfo}
          onBack={onBack}
        />

        <CourseWorkspaceContent
          activeTab={activeTab}
          course={course}
          section={section}
          entregables={entregables}
          estudiantesExcel={estudiantesExcel}
          entregasAlumnos={entregasAlumnos}
          rosterStudents={rosterStudents}
          courseSessions={courseSessions}
          onAddDeliverable={onAddDeliverable}
          onUpdateGrade={onUpdateGrade}
          onResolveAppeal={onResolveAppeal}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      </div>
    </div>
  );
};
