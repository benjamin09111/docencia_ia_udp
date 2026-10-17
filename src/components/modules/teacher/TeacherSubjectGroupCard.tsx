"use client";

import React from "react";
import { BookOpen, Sparkles, Layers, Megaphone, Users } from "lucide-react";
import { CanvasItemGroup, CanvasItemRow } from "@/components/canvas/CanvasItemGroup";
import { SubjectCourseGroup, EnrichedCourseSection } from "@/utils/courseGrouping";

interface TeacherSubjectGroupCardProps {
  group: SubjectCourseGroup;
  onOpenCourse: (courseId: number) => void;
  onAnnounceCourses: (courseIds: number[]) => void;
}

export const TeacherSubjectGroupCard: React.FC<TeacherSubjectGroupCardProps> = ({
  group,
  onOpenCourse,
  onAnnounceCourses,
}) => {
  const isMultiSection = group.sectionsCount > 1;

  const headerActions = [
    {
      label: isMultiSection
        ? `Enviar anuncio a las ${group.sectionsCount} secciones`
        : "Enviar anuncio a esta sección",
      icon: <Megaphone size={14} className="text-[#B71C1C]" />,
      onClick: () => onAnnounceCourses(group.sections.map((s) => s.id)),
    },
  ];

  return (
    <CanvasItemGroup
      title={`${group.subjectName} (${group.subjectCode})`}
      weightBadge={`${group.sectionsCount} ${
        group.sectionsCount === 1 ? "sección" : "secciones"
      } • ${group.totalStudents} estudiantes`}
      headerActions={headerActions}
      className="transition-shadow hover:shadow-sm"
    >
      {/* Banner de Sincronización y Anuncio Multisección */}
      {isMultiSection && (
        <div className="bg-[#F8F9FA] px-4 py-2 border-b border-[#E0E3E6] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#55636E]">
            <span className="inline-flex items-center gap-1 font-semibold text-[#008EE2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              <Layers size={12} />
              <span>Multisección unificada</span>
            </span>
            <span className="text-[11px] text-[#6B7780]">
              Tus {group.sectionsCount} secciones comparten contenido y pueden recibir comunicados unificados.
            </span>
          </div>

          <button
            type="button"
            onClick={() => onAnnounceCourses(group.sections.map((s) => s.id))}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B71C1C] hover:text-[#8E1010] bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded transition-colors"
          >
            <Megaphone size={13} />
            <span>Publicar anuncio a las {group.sectionsCount} secciones (1 clic)</span>
          </button>
        </div>
      )}

      {/* Filas de Secciones */}
      {group.sections.map((sec: EnrichedCourseSection) => (
        <CanvasItemRow
          key={sec.id}
          id={sec.id}
          icon={<BookOpen size={18} className="text-[#008EE2]" />}
          indicatorColor="green"
          isPublished={true}
          title={
            <span className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-[#2D3B45]">
                {sec.sectionName}
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-[#55636E] border border-gray-200">
                {sec.code}
              </span>
              <span className="text-[11px] font-normal text-[#6B7780] flex items-center gap-1">
                <Users size={12} />
                <span>{sec.students_count || 0} alumnos</span>
              </span>
              <span className="text-[10px] bg-blue-50 text-[#008EE2] px-2 py-0.5 rounded font-medium border border-blue-200 flex items-center gap-1">
                <Sparkles size={11} />
                <span>{sec.agentName}</span>
              </span>
            </span>
          }
          subtitle={
            <span suppressHydrationWarning className="text-xs text-[#6B7780]">
              Profesor: <strong className="text-[#2D3B45]">{sec.profesor}</strong> • Ayudante: {sec.ayudante} • Horario Ayudantía: {sec.ayudantiaFormatted} • Cátedra: {sec.catedraFormatted} • Sala: <strong className="text-[#2D3B45]">{sec.salaFormatted}</strong>
            </span>
          }
          onClick={() => onOpenCourse(sec.id)}
          actionItems={[
            {
              label: "Abrir espacio de la sección",
              icon: <BookOpen size={14} className="text-[#008EE2]" />,
              onClick: () => onOpenCourse(sec.id),
            },
            {
              label: "Enviar anuncio rápido a esta sección",
              icon: <Megaphone size={14} className="text-[#B71C1C]" />,
              onClick: () => onAnnounceCourses([sec.id]),
            },
          ]}
        />
      ))}
    </CanvasItemGroup>
  );
};
