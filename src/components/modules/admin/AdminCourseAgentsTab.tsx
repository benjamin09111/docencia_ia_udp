"use client";

import React, { useMemo, useState } from "react";
import { CourseSection } from "@/types/attendance";
import { BookOpen, Bot, Brain, Rocket, Plus } from "lucide-react";
import { formatSectionSchedule, getSectionByCourseCode } from "@/services/attendanceStore";
import { COURSE_AGENTS_METADATA } from "@/constants/courseAgentsCatalog";
import { CanvasItemGroup, CanvasItemRow } from "@/components/canvas/CanvasItemGroup";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";

interface AdminCourseAgentsTabProps {
  sections: CourseSection[];
  onSelectSection: (section: CourseSection) => void;
  onOpenCreateSection?: () => void;
}

export const AdminCourseAgentsTab: React.FC<AdminCourseAgentsTabProps> = ({
  sections,
  onSelectSection,
  onOpenCreateSection,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Solo el primer curso aparece expandido por defecto siempre; los demás cerrados
  const [expandedCourseCodes, setExpandedCourseCodes] = useState<Set<string>>(() => {
    const firstCode = COURSE_AGENTS_METADATA[0]?.courseCode;
    return new Set(firstCode ? [firstCode] : []);
  });

  const toggleCourseExpand = (courseCode: string) => {
    setExpandedCourseCodes((prev) => {
      const next = new Set(prev);
      if (next.has(courseCode)) {
        next.delete(courseCode);
      } else {
        next.add(courseCode);
      }
      return next;
    });
  };

  const collapseAll = () => setExpandedCourseCodes(new Set());
  const expandAll = () => setExpandedCourseCodes(new Set(filteredCourses.map((c) => c.courseCode)));

  const dynamicCourses = useMemo(() => {
    return COURSE_AGENTS_METADATA.map((c) => {
      const resolvedSections = c.sectionCodes.map((sc) => {
        const sec = getSectionByCourseCode(sc.code, sections);
        const sched = formatSectionSchedule(sec);
        return {
          rawSection: sec,
          code: sec.codigo,
          name: sec.nombre || sc.name,
          profesor: sec.profesor,
          ayudante: sec.ayudante,
          horarioAyudantia: sched.ayudantia,
          sala: sched.ayudantiaSala || "SALA X",
          eximicion: sc.eximicion,
        };
      });

      return {
        ...c,
        sections: resolvedSections,
      };
    });
  }, [sections]);

  // Filtrado por buscador estilo Canvas
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return dynamicCourses;
    const q = searchQuery.toLowerCase();
    return dynamicCourses
      .map((c) => {
        const matchesCourse =
          c.courseCode.toLowerCase().includes(q) || c.courseName.toLowerCase().includes(q);
        const matchingSections = c.sections.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.profesor.toLowerCase().includes(q) ||
            s.code.toLowerCase().includes(q)
        );
        if (matchesCourse) return c;
        if (matchingSections.length > 0) return { ...c, sections: matchingSections };
        return null;
      })
      .filter(Boolean) as typeof dynamicCourses;
  }, [dynamicCourses, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Barra de herramientas superior estilo Canvas LMS (Buscar... | + Grupo | + Tarea/Sección) */}
      <CanvasToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar curso, sección o profesor..."
        primaryButtonLabel="+ Sección"
        onPrimaryClick={onOpenCreateSection}
        secondaryButtonLabel="+ Curso"
        onSecondaryClick={onOpenCreateSection}
        menuItems={[
          { label: "Colapsar todos los grupos", onClick: collapseAll },
          { label: "Expandir todos los grupos", onClick: expandAll },
        ]}
      />

      {/* Lista de Grupos Canvas (Canvas Item Groups idénticos a Canvas Tareas) */}
      <div className="space-y-4">
        {filteredCourses.map((course) => (
          <CanvasItemGroup
            key={course.courseCode}
            title={`${course.courseCode} — ${course.courseName}`}
            weightBadge={`${course.sections.length} secciones activas`}
            isExpanded={expandedCourseCodes.has(course.courseCode)}
            onToggleExpanded={() => toggleCourseExpand(course.courseCode)}
            onAddClick={onOpenCreateSection}
            headerActions={[
              {
                label: "Ver detalles de curso",
                icon: <BookOpen size={14} className="text-[#008EE2]" />,
                onClick: () => {
                  const matched = getSectionByCourseCode(course.courseCode, sections);
                  onSelectSection(matched);
                },
              },
            ]}
          >
            {course.sections.map((sec) => (
              <CanvasItemRow
                key={sec.code}
                id={sec.code}
                icon={<Rocket size={19} className="text-emerald-700" />}
                indicatorColor="green"
                isPublished={true}
                title={
                  <span className="flex items-center gap-2">
                    <span className="font-bold">{sec.name} ({sec.code})</span>
                    <span className="text-xs sm:text-[13px] font-normal text-[#6B7780]">
                      — {sec.profesor}
                    </span>
                  </span>
                }
                subtitle={
                  <span suppressHydrationWarning>
                    Ayudante: {sec.ayudante} • Horario: {String(sec.horarioAyudantia)} ({sec.sala}) • Eximición: {sec.eximicion}
                  </span>
                }
                onClick={() => onSelectSection(sec.rawSection)}
                actionItems={[
                  {
                    label: "Abrir sección del curso",
                    icon: <BookOpen size={14} className="text-[#008EE2]" />,
                    onClick: () => onSelectSection(sec.rawSection),
                  },
                ]}
              />
            ))}
          </CanvasItemGroup>
        ))}
      </div>
    </div>
  );
};
