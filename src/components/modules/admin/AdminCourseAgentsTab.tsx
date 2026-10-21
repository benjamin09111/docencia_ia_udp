"use client";

import React, { useMemo, useState } from "react";
import { CourseSection } from "@/types/attendance";
import { BookOpen, Rocket, Download } from "lucide-react";
import { formatSectionSchedule, getSectionByCourseCode } from "@/services/attendanceStore";
import { COURSE_AGENTS_METADATA } from "@/constants/courseAgentsCatalog";
import { CanvasItemGroup, CanvasItemRow } from "@/components/canvas/CanvasItemGroup";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";
import { ExportAttendanceSummaryModal } from "@/components/modules/common/ExportAttendanceSummaryModal";

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
  const [exportConfig, setExportConfig] = useState<{
    isOpen: boolean;
    title: string;
    subjectName: string;
    sections: CourseSection[];
  }>({ isOpen: false, title: "", subjectName: "", sections: [] });

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

  const dynamicCourses = useMemo(() => COURSE_AGENTS_METADATA.map((c) => ({
    ...c,
    sections: c.sectionCodes.map((sc) => {
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
    }),
  })), [sections]);

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return dynamicCourses;
    const q = searchQuery.toLowerCase();
    return dynamicCourses
      .map((c) => {
        const matches = c.courseCode.toLowerCase().includes(q) || c.courseName.toLowerCase().includes(q);
        const matchedSecs = c.sections.filter((s) => s.name.toLowerCase().includes(q) || s.profesor.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
        if (matches) return c;
        return matchedSecs.length > 0 ? { ...c, sections: matchedSecs } : null;
      })
      .filter(Boolean) as typeof dynamicCourses;
  }, [dynamicCourses, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Barra de herramientas superior estilo Canvas LMS */}
      <CanvasToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar curso, sección o profesor..."
        primaryButtonLabel="+ Sección"
        onPrimaryClick={onOpenCreateSection}
        secondaryButtonLabel="+ Curso"
        onSecondaryClick={onOpenCreateSection}
        menuItems={[
          {
            label: "Descargar asistencia consolidada (Toda la Escuela)",
            onClick: () => {
              setExportConfig({
                isOpen: true,
                title: "Reporte de Asistencia Consolidado (Toda la Escuela)",
                subjectName: "Escuela de Informática y Telecomunicaciones",
                sections,
              });
            },
          },
          { label: "Colapsar todos los grupos", onClick: collapseAll },
          { label: "Expandir todos los grupos", onClick: expandAll },
        ]}
      />

      {/* Lista de Grupos Canvas */}
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
                onClick: () => onSelectSection(getSectionByCourseCode(course.courseCode, sections)),
              },
              {
                label: `Descargar resumen de asistencia (${course.sections.length} secciones)`,
                icon: <Download size={14} className="text-[#008EE2]" />,
                onClick: () => {
                  setExportConfig({
                    isOpen: true,
                    title: `Resumen de Asistencia — ${course.courseCode}`,
                    subjectName: course.courseName,
                    sections: course.sections.map((s) => s.rawSection),
                  });
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
                    <span className="text-xs sm:text-[13px] font-normal text-[#6B7780]">— {sec.profesor}</span>
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

      <ExportAttendanceSummaryModal
        isOpen={exportConfig.isOpen}
        onClose={() => setExportConfig((prev) => ({ ...prev, isOpen: false }))}
        title={exportConfig.title}
        subjectName={exportConfig.subjectName}
        sections={exportConfig.sections}
      />
    </div>
  );
};
