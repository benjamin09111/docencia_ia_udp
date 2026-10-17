"use client";

import React, { useState, useMemo } from "react";
import { CanvasCourse } from "@/types";
import { CourseSection } from "@/types/attendance";
import { Layers, List, BookOpen, Sparkles } from "lucide-react";
import { CanvasItemGroup, CanvasItemRow } from "@/components/canvas/CanvasItemGroup";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";
import { enrichCourseList, groupCoursesBySubject, EnrichedCourseSection } from "@/utils/courseGrouping";
import { TeacherSubjectGroupCard } from "./TeacherSubjectGroupCard";

interface TeacherCoursesListProps {
  courses: CanvasCourse[];
  sections: CourseSection[];
  onOpenCourse: (courseId: number) => void;
  onOpenImportModal: () => void;
  onAnnounceCourses?: (courseIds: number[]) => void;
}

export const TeacherCoursesList: React.FC<TeacherCoursesListProps> = ({
  courses,
  sections,
  onOpenCourse,
  onOpenImportModal,
  onAnnounceCourses = () => {},
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyAutomated, setOnlyAutomated] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"grouped" | "flat">("grouped");

  const enrichedCourses = useMemo(() => {
    return enrichCourseList(courses, sections);
  }, [courses, sections]);

  const filteredEnriched = useMemo(() => {
    return enrichedCourses.filter((c) => {
      if (onlyAutomated && !c.isAutomated) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.baseCode.toLowerCase().includes(q) ||
        c.sectionName.toLowerCase().includes(q) ||
        c.profesor.toLowerCase().includes(q) ||
        c.ayudante.toLowerCase().includes(q)
      );
    });
  }, [enrichedCourses, searchQuery, onlyAutomated]);

  const groupedSubjects = useMemo(() => {
    return groupCoursesBySubject(filteredEnriched);
  }, [filteredEnriched]);

  return (
    <div className="space-y-5">
      {/* Barra de herramientas Canvas */}
      <CanvasToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar por asignatura, sección o profesor..."
        primaryButtonLabel="+ Asignatura"
        onPrimaryClick={() => {}}
        secondaryButtonLabel="Importar Curso desde Excel"
        onSecondaryClick={onOpenImportModal}
      />

      {/* Controles de visualización y filtros estilo Canvas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 py-2 bg-gray-50/90 border border-[#C7CDD1] rounded-[3px] text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyAutomated}
            onChange={(e) => setOnlyAutomated(e.target.checked)}
            className="w-4 h-4 text-[#B71C1C] rounded border-gray-300 focus:ring-[#B71C1C] cursor-pointer"
          />
          <span className="font-semibold text-[#2D3B45]">
            Mostrar solo cursos vinculados con agentes IA
          </span>
          <span className="text-[10px] bg-red-50 text-[#B71C1C] font-bold px-2 py-0.5 rounded border border-red-200">
            {filteredEnriched.length} secciones activas
          </span>
        </label>

        {/* Selector de modo de vista: Agrupado por Asignatura vs Lista Plana */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <span className="text-[#6B7780] text-[11px] font-medium mr-1">Vista:</span>
          <button
            type="button"
            onClick={() => setViewMode("grouped")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              viewMode === "grouped"
                ? "bg-white text-[#B71C1C] border border-[#B71C1C] shadow-2xs"
                : "text-[#55636E] hover:text-[#2D3B45] hover:bg-gray-200/60"
            }`}
            title="Agrupar secciones bajo su asignatura madre"
          >
            <Layers size={13} />
            <span>Por Asignaturas</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("flat")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              viewMode === "flat"
                ? "bg-white text-[#B71C1C] border border-[#B71C1C] shadow-2xs"
                : "text-[#55636E] hover:text-[#2D3B45] hover:bg-gray-200/60"
            }`}
            title="Ver todas las secciones individuales"
          >
            <List size={13} />
            <span>Todas las Secciones</span>
          </button>
        </div>
      </div>

      {/* Renderizado de Cursos según Modo */}
      {viewMode === "grouped" ? (
        <div className="space-y-4">
          {groupedSubjects.map((grp) => (
            <TeacherSubjectGroupCard
              key={grp.subjectCode}
              group={grp}
              onOpenCourse={onOpenCourse}
              onAnnounceCourses={onAnnounceCourses}
            />
          ))}
          {groupedSubjects.length === 0 && (
            <div className="p-8 text-center text-xs text-[#6B7780] bg-white border border-[#E0E3E6] rounded">
              No se encontraron asignaturas o secciones que coincidan con la búsqueda.
            </div>
          )}
        </div>
      ) : (
        <CanvasItemGroup
          title="Todas las Secciones Semestre Primavera (2026-2)"
          weightBadge={`${filteredEnriched.length} secciones activas`}
        >
          {filteredEnriched.map((c: EnrichedCourseSection) => (
            <CanvasItemRow
              key={c.id}
              id={c.id}
              icon={<BookOpen size={18} className="text-[#008EE2]" />}
              indicatorColor="green"
              isPublished={true}
              title={
                <span className="flex items-center gap-2">
                  <span className="font-bold text-[#2D3B45]">{c.name}</span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-[#55636E]">
                    {c.code}
                  </span>
                  <span className="text-[10px] bg-blue-50 text-[#008EE2] px-2 py-0.5 rounded font-medium border border-blue-200 flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>{c.agentName}</span>
                  </span>
                </span>
              }
              subtitle={
                <span suppressHydrationWarning className="text-xs text-[#6B7780]">
                  Profesor: <strong>{c.profesor}</strong> • Ayudante: {c.ayudante} • Horario Ayudantía: {c.ayudantiaFormatted} • Cátedra: {c.catedraFormatted} • Sala: <strong>{c.salaFormatted}</strong>
                </span>
              }
              onClick={() => onOpenCourse(c.id)}
              actionItems={[
                {
                  label: "Abrir espacio del curso",
                  icon: <BookOpen size={14} className="text-[#008EE2]" />,
                  onClick: () => onOpenCourse(c.id),
                },
              ]}
            />
          ))}
        </CanvasItemGroup>
      )}
    </div>
  );
};
