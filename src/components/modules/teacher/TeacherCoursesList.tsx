"use client";

import React, { useState, useMemo } from "react";
import { CanvasCourse } from "@/types";
import { CourseSection } from "@/types/attendance";
import { BookOpen, Sparkles, Filter } from "lucide-react";
import { CanvasItemGroup, CanvasItemRow } from "@/components/canvas/CanvasItemGroup";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";
import { formatSectionSchedule, getSectionByCourseCode } from "@/services/attendanceStore";

interface TeacherCoursesListProps {
  courses: CanvasCourse[];
  sections: CourseSection[];
  onOpenCourse: (courseId: number) => void;
  onOpenImportModal: () => void;
}

export const TeacherCoursesList: React.FC<TeacherCoursesListProps> = ({
  courses,
  sections,
  onOpenCourse,
  onOpenImportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyAutomated, setOnlyAutomated] = useState<boolean>(true);

  const enrichedCourses = useMemo(() => {
    return courses.map((course) => {
      const sec = getSectionByCourseCode(course.code, sections);
      const sched = formatSectionSchedule(sec);

      const agentName = course.code.includes("CIT3203")
        ? "Agente PMBOK + Ágil (CIT3203)"
        : course.code.includes("CIT3100")
        ? "Agente Arq Cloud (CIT3100)"
        : course.code.includes("CIT2206")
        ? "Agente Teoría Org (CIT2206)"
        : "Agente EIT Oficial";

      return {
        ...course,
        sectionDetails: sec,
        ayudantiaFormatted: sched.ayudantia,
        catedraFormatted: sched.catedra,
        salaFormatted: sched.ayudantiaSala || "SALA X",
        profesor: sec.profesor || "Profesor Titular",
        ayudante: sec.ayudante || "Benjamín Morales Pizarro",
        agentName,
        isAutomated: course.is_automated !== false,
      };
    });
  }, [courses, sections]);

  const filteredCourses = useMemo(() => {
    return enrichedCourses.filter((c) => {
      if (onlyAutomated && !c.isAutomated) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.profesor.toLowerCase().includes(q)
      );
    });
  }, [enrichedCourses, searchQuery, onlyAutomated]);

  return (
    <div className="space-y-5">
      {/* Barra de herramientas Canvas */}
      <CanvasToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar asignatura, código o profesor..."
        primaryButtonLabel="+ Asignatura"
        onPrimaryClick={() => {}}
        secondaryButtonLabel="Importar Curso desde Excel"
        onSecondaryClick={onOpenImportModal}
      />

      {/* Filtro de Cursos Automatizados estilo Canvas */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50/80 border border-[#C7CDD1] rounded-[3px] text-xs">
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
            {filteredCourses.length} activos
          </span>
        </label>

        <span className="text-[11px] text-[#6B7780] hidden sm:inline">
          Haz clic en cualquier asignatura para ingresar a su espacio de trabajo
        </span>
      </div>

      {/* Grupo Oficial de Cursos */}
      <CanvasItemGroup
        title="Asignaturas y Cursos Semestre Primavera (2026-2)"
        weightBadge={`${filteredCourses.length} asignaturas activas`}
      >
        {filteredCourses.map((c) => (
          <CanvasItemRow
            key={c.id}
            id={c.id}
            icon={<BookOpen size={19} className="text-[#008EE2]" />}
            indicatorColor="green"
            isPublished={true}
            title={
              <span className="flex items-center gap-2">
                <span className="font-bold">{c.name}</span>
                <span className="text-xs sm:text-[13px] font-normal text-[#6B7780]">
                  ({c.code})
                </span>
                <span className="text-[10px] bg-blue-50 text-[#008EE2] px-2 py-0.5 rounded font-medium border border-blue-200 flex items-center gap-1">
                  <Sparkles size={11} />
                  <span>{c.agentName}</span>
                </span>
              </span>
            }
            subtitle={
              <span suppressHydrationWarning>
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
    </div>
  );
};
