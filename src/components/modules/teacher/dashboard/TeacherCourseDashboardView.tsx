"use client";

import React from "react";
import { CanvasCourse, StudentExcelRow } from "@/types";
import { CourseSection, ClassSession } from "@/types/attendance";
import { DashboardPerformanceKpisSection } from "./DashboardPerformanceKpisSection";
import { DashboardScheduleProgressSection } from "./DashboardScheduleProgressSection";
import { DashboardGradingRulesSection } from "./DashboardGradingRulesSection";
import { DashboardStaffAndBioSection } from "./DashboardStaffAndBioSection";
import { CourseWorkspaceTab } from "../CourseWorkspaceContent";
import { LayoutDashboard } from "lucide-react";

interface TeacherCourseDashboardViewProps {
  course: CanvasCourse;
  section: CourseSection;
  estudiantesExcel: StudentExcelRow[];
  totalActivitiesCount: number;
  courseSessions: ClassSession[];
  onNavigateTab: (tab: CourseWorkspaceTab) => void;
}

export const TeacherCourseDashboardView: React.FC<TeacherCourseDashboardViewProps> = ({
  course,
  section,
  estudiantesExcel,
  totalActivitiesCount,
  courseSessions,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Banner Resumen Canvas */}
      <div className="bg-[#F5F6F8] border border-[#C7CDD1] rounded-[4px] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[4px] bg-red-100 border border-red-200 flex items-center justify-center shrink-0 text-[#B71C1C]">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#2D3B45]">
              Panel de Control Docente: {course.name} ({section.codigo || course.code})
            </h2>
            <p className="text-xs text-[#6B7780]">
              Monitoreo integral del curso, avance curricular, alertas de rendimiento y reglas académicas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded font-semibold text-[#2D3B45]">
            {estudiantesExcel.length} Estudiantes Matriculados
          </span>
        </div>
      </div>

      {/* 1. KPIs Generales de Rendimiento & Alertas */}
      <DashboardPerformanceKpisSection
        estudiantesExcel={estudiantesExcel}
        totalActivitiesCount={totalActivitiesCount}
        onNavigateTab={(tabId) => onNavigateTab(tabId as CourseWorkspaceTab)}
      />

      {/* 2. Avance del Semestre y Cronograma Oficial */}
      <DashboardScheduleProgressSection
        courseCode={course.code}
        courseSessions={courseSessions}
      />

      {/* 3. Cálculos de Nota Final, Ponderaciones y Reglamento */}
      <DashboardGradingRulesSection courseCode={course.code} />

      {/* 4. Equipo Docente y Presentación del Profesor */}
      <DashboardStaffAndBioSection
        courseCode={course.code}
        studentsCount={estudiantesExcel.length}
      />
    </div>
  );
};
