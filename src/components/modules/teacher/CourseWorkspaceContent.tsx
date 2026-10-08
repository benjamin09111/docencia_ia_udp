"use client";

import React from "react";
import { CanvasCourse, CourseDeliverable, StudentExcelRow, StudentSubmission } from "@/types";
import { CourseSection, ClassSession } from "@/types/attendance";
import { TeacherCourseDashboardView } from "./dashboard/TeacherCourseDashboardView";
import { CourseHomePageView } from "./CourseHomePageView";
import { CourseEvaluacionesView } from "./evaluaciones/CourseEvaluacionesView";
import { CourseActivitiesView } from "./CourseActivitiesView";
import { CourseCronogramaView } from "./CourseCronogramaView";
import { CourseAnnouncementsView } from "./CourseAnnouncementsView";
import { TeacherAttendanceWorkspace } from "./TeacherAttendanceWorkspace";
import { CourseGroupsWorkspace } from "./groups/CourseGroupsWorkspace";
import { CourseAutomationsWorkspace } from "./automations/CourseAutomationsWorkspace";
import { CourseExcelFinalTab } from "./gradebook/CourseExcelFinalTab";
import { CourseMetricsView } from "./CourseMetricsView";
import { CourseLearningTraceabilityView } from "./learning/CourseLearningTraceabilityView";
import { StudentRosterItem } from "@/services/attendanceStore";

export type CourseWorkspaceTab =
  | "resumen"
  | "evaluaciones"
  | "actividades"
  | "cronograma"
  | "anuncios"
  | "asistencia"
  | "grupos"
  | "automatizaciones"
  | "excel"
  | "metricas"
  | "aprendizaje"
  | "inicio";

interface CourseWorkspaceContentProps {
  activeTab: CourseWorkspaceTab;
  course: CanvasCourse;
  section: CourseSection;
  entregables: CourseDeliverable[];
  estudiantesExcel: StudentExcelRow[];
  entregasAlumnos?: StudentSubmission[];
  rosterStudents: StudentRosterItem[];
  courseSessions: ClassSession[];
  onAddDeliverable: (d: CourseDeliverable) => void;
  onUpdateGrade: (canvasId: number, field: keyof StudentExcelRow, value: number) => void;
  onResolveAppeal?: (submissionId: string, action: "aceptar" | "ratificar") => void;
  onNavigateTab?: (tab: CourseWorkspaceTab) => void;
}

export const CourseWorkspaceContent: React.FC<CourseWorkspaceContentProps> = ({
  activeTab,
  course,
  section,
  entregables,
  estudiantesExcel,
  entregasAlumnos = [],
  rosterStudents,
  courseSessions,
  onAddDeliverable,
  onUpdateGrade,
  onResolveAppeal,
  onNavigateTab = () => {},
}) => {
  switch (activeTab) {
    case "resumen":
      return (
        <TeacherCourseDashboardView
          course={course}
          section={section}
          estudiantesExcel={estudiantesExcel}
          totalActivitiesCount={entregables.length}
          courseSessions={courseSessions}
          onNavigateTab={onNavigateTab}
        />
      );
    case "evaluaciones":
      return <CourseEvaluacionesView courseCode={course.code} courseName={course.name} />;
    case "actividades":
      return (
        <CourseActivitiesView
          courseId={course.id}
          entregables={entregables}
          entregasAlumnos={entregasAlumnos}
          onAddDeliverable={onAddDeliverable}
          onResolveAppeal={onResolveAppeal}
        />
      );
    case "cronograma":
      return <CourseCronogramaView courseCode={course.code} courseName={course.name} />;
    case "anuncios":
      return <CourseAnnouncementsView courseCode={course.code} courseName={course.name} />;
    case "asistencia":
      return (
        <TeacherAttendanceWorkspace
          courseCode={course.code}
          courseName={course.name}
          canvasCourseId={course.id}
          estudiantesExcel={estudiantesExcel}
          onUpdateGrade={onUpdateGrade}
        />
      );
    case "grupos":
      return (
        <CourseGroupsWorkspace
          courseCode={course.code}
          courseName={course.name}
          canvasCourseId={course.id}
          students={rosterStudents}
          sectionId={section.id}
        />
      );
    case "automatizaciones":
      return (
        <CourseAutomationsWorkspace
          courseCode={course.code}
          courseName={course.name}
          sessions={courseSessions}
        />
      );
    case "excel":
      return (
        <CourseExcelFinalTab
          course={course}
          section={section}
          estudiantesExcel={estudiantesExcel}
          onUpdateGrade={onUpdateGrade}
        />
      );
    case "metricas":
      return <CourseMetricsView course={course} />;
    case "aprendizaje":
      return <CourseLearningTraceabilityView course={course} section={section} />;
    case "inicio":
      return <CourseHomePageView courseId={course.id} courseCode={course.code} courseName={course.name} />;
    default:
      return null;
  }
};
