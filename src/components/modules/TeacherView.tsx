"use client";

import React, { useState, useMemo, useEffect } from "react";
import { CanvasCourse, CourseDeliverable, StudentExcelRow, StudentSubmission } from "@/types";
import { CourseSection } from "@/types/attendance";
import { AutomatedCourseWorkspace } from "./teacher/AutomatedCourseWorkspace";
import { TeacherCoursesList } from "./teacher/TeacherCoursesList";
import { TeacherQuickAnnouncementsView } from "./teacher/TeacherQuickAnnouncementsView";
import { TeacherAgentProfileView } from "./teacher/TeacherAgentProfileView";
import { TeacherProfileView } from "./teacher/TeacherProfileView";
import { CanvasCourseNav, CourseNavItem } from "@/components/canvas/CanvasCourseNav";
import { getSavedSections, getSectionByCourseCode, INITIAL_SECTIONS } from "@/services/attendanceStore";
import { fetchSectionsFromSupabase, isSupabaseConfigured } from "@/services/attendanceDbService";
import { ImportCourseExcelModal } from "./common/ImportCourseExcelModal";
import { TeacherPendingSummary } from "./teacher/TeacherPendingSummary";
import { BookOpen, Megaphone, Bot, User } from "lucide-react";

interface TeacherViewProps {
  canvasCourses: CanvasCourse[];
  entregables: CourseDeliverable[];
  estudiantesExcel: StudentExcelRow[];
  entregasAlumnos?: StudentSubmission[];
  onAddDeliverable: (d: CourseDeliverable) => void;
  onUpdateGrade: (canvasId: number, field: keyof StudentExcelRow, value: number) => void;
  onResolveAppeal?: (submissionId: string, action: "aceptar" | "ratificar") => void;
  onActiveCourseChange?: (info: { courseCode: string; tabTitle: string } | null) => void;
}

const DEFAULT_TEACHER_COURSES: CanvasCourse[] = [
  { id: 44999, name: "202602 - PROYECTO EN TICS II", code: "CIT3203_CA01", term: "2026-02 Semestre Primavera", students_count: 28, is_automated: true },
  { id: 45002, name: "PROYECTO EN TICS II", code: "CIT3203_CA02", term: "2026-02 Semestre Primavera", students_count: 30, is_automated: true },
  { id: 47552, name: "PROYECTO EN TICS II", code: "CIT3203_CA03", term: "2026-02 Semestre Primavera", students_count: 28, is_automated: true },
  { id: 47047, name: "GESTIÓN ORGANIZACIONAL", code: "CIT2206_CA01", term: "2026-02 Semestre Primavera", students_count: 44, is_automated: true },
  { id: 44988, name: "ARQUITECTURAS EMERGENTES", code: "CIT3100_CA02", term: "2026-02 Semestre Primavera", students_count: 23, is_automated: true },
];

export const TeacherView: React.FC<TeacherViewProps> = ({
  canvasCourses,
  entregables,
  estudiantesExcel,
  entregasAlumnos = [],
  onAddDeliverable,
  onUpdateGrade,
  onResolveAppeal,
  onActiveCourseChange,
}) => {
  const [activeTab, setActiveTab] = useState<string>("courses");
  const [openedCourseId, setOpenedCourseId] = useState<number | null>(null);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [sections, setSections] = useState<CourseSection[]>(INITIAL_SECTIONS);

  useEffect(() => {
    if (!openedCourseId) {
      onActiveCourseChange?.(null);
    }
  }, [openedCourseId, onActiveCourseChange]);

  useEffect(() => {
    setSections(getSavedSections());
    const handleSync = () => setSections(getSavedSections());
    window.addEventListener("udp_sections_updated", handleSync);
    return () => window.removeEventListener("udp_sections_updated", handleSync);
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchSectionsFromSupabase().then((cloud) => {
        if (cloud && cloud.length > 0) setSections(cloud);
      });
    }
  }, []);

  const mergedCourses = useMemo(() => {
    const list = [...canvasCourses];
    const existingIds = new Set(list.map((c) => c.id));
    DEFAULT_TEACHER_COURSES.forEach((fb) => {
      if (!existingIds.has(fb.id)) list.push(fb);
    });
    return list;
  }, [canvasCourses]);

  const navItems: CourseNavItem[] = [
    { id: "courses", label: "Mis cursos", icon: <BookOpen size={15} /> },
    { id: "quick_announcements", label: "Anuncios rápidos", icon: <Megaphone size={15} /> },
    { id: "my_agent", label: "Mi agente", icon: <Bot size={15} /> },
    { id: "my_profile", label: "Mi perfil", icon: <User size={15} /> },
  ];

  const openedCourse = useMemo(() => {
    return mergedCourses.find((c) => c.id === openedCourseId) || null;
  }, [mergedCourses, openedCourseId]);

  const openedSection = useMemo(() => {
    if (!openedCourse) return null;
    return getSectionByCourseCode(openedCourse.code, sections);
  }, [openedCourse, sections]);

  if (openedCourse && openedSection) {
    return (
      <AutomatedCourseWorkspace
        course={openedCourse}
        section={openedSection}
        entregables={entregables}
        estudiantesExcel={estudiantesExcel}
        entregasAlumnos={entregasAlumnos}
        onBack={() => {
          onActiveCourseChange?.(null);
          setOpenedCourseId(null);
        }}
        onAddDeliverable={onAddDeliverable}
        onUpdateGrade={onUpdateGrade}
        onResolveAppeal={onResolveAppeal}
        onActiveCourseChange={onActiveCourseChange}
      />
    );
  }

  return (
    <div className="flex gap-8 lg:gap-10 items-start w-full min-h-[calc(100vh-6rem)]">
      {/* Menú Lateral Principal estilo Canvas (#section-tabs) */}
      <CanvasCourseNav
        termText="2026-2"
        items={navItems}
        activeId={activeTab}
        onSelect={(id) => setActiveTab(id)}
        bottomContent={
          <TeacherPendingSummary
            onSelectCourse={(code) => {
              const target = mergedCourses.find((c) => c.code === code || c.code.startsWith(code.split("_")[0]));
              if (target) setOpenedCourseId(target.id);
            }}
          />
        }
      />

      {/* Área Principal según Módulo Seleccionado */}
      <div className="flex-1 min-w-0">
        {activeTab === "courses" && (
          <TeacherCoursesList
            courses={mergedCourses}
            sections={sections}
            onOpenCourse={(id) => setOpenedCourseId(id)}
            onOpenImportModal={() => setShowImportModal(true)}
          />
        )}

        {activeTab === "quick_announcements" && (
          <TeacherQuickAnnouncementsView courses={mergedCourses} />
        )}

        {activeTab === "my_agent" && <TeacherAgentProfileView />}

        {activeTab === "my_profile" && <TeacherProfileView />}
      </div>

      <ImportCourseExcelModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onCourseCreated={() => setShowImportModal(false)}
      />
    </div>
  );
};
