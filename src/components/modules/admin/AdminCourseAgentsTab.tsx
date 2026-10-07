"use client";

import React, { useMemo } from "react";
import { CourseSection } from "@/types/attendance";
import { BookOpen, Bot, Brain, Sparkles } from "lucide-react";
import { CanvasActionMenu } from "@/components/canvas/CanvasActionMenu";
import { formatSectionSchedule, getSectionByCourseCode } from "@/services/attendanceStore";
import { COURSE_AGENTS_METADATA } from "@/constants/courseAgentsCatalog";

interface AdminCourseAgentsTabProps {
  sections: CourseSection[];
  onSelectSection: (section: CourseSection) => void;
}

export const AdminCourseAgentsTab: React.FC<AdminCourseAgentsTabProps> = ({
  sections,
  onSelectSection,
}) => {
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

  return (
    <div className="space-y-4">
      {/* Banner Informativo */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
            <BookOpen size={16} className="text-[#008EE2]" />
            Jerarquía Multi-Agente: 1 Agente Teórico por Curso + Agentes Técnicos por Sección
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5">
            El <strong>Agente Teórico</strong> es único por asignatura y no se duplica (unifica PMBOK, RAPs y corpus metodológico). Los <strong>Agentes Técnicos</strong> son contextuales y varían según la sección: profesor titular, horario, sala y condición de eximición.
          </p>
        </div>
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded border border-emerald-200 shrink-0">
          3 Cursos • 5 Secciones Activas
        </span>
      </div>

      <div className="space-y-4">
        {dynamicCourses.map((course) => (
          <div
            key={course.courseCode}
            className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card overflow-hidden"
          >
            {/* Cabecera del Curso y su Agente Teórico Único */}
            <div className="p-4 bg-[#FAFBFB] border-b border-[#E0E3E6] flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#008EE2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {course.courseCode}
                  </span>
                  <h3 className="font-bold text-sm text-[#2D3B45]">
                    {course.courseName}
                  </h3>
                  <span className="text-[11px] text-[#6B7780] font-medium">
                    • {course.level}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#1E272E] text-white rounded text-[11px] font-bold">
                    <Brain size={12} className="text-purple-300" />
                    <span>{course.teorico.name}</span>
                    <span className="text-[9px] bg-purple-900/60 text-purple-200 px-1 py-0.2 rounded font-normal uppercase">
                      Único
                    </span>
                  </span>
                  <span className="text-[11px] text-[#55636E]">
                    {course.teorico.corpus}
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                <CanvasActionMenu
                  ariaLabel={`Acciones para ${course.courseName}`}
                  items={[
                    {
                      label: "Ver y editar curso",
                      icon: <BookOpen size={14} className="text-[#008EE2]" />,
                      onClick: () => {
                        const matched = getSectionByCourseCode(course.courseCode, sections);
                        onSelectSection(matched);
                      },
                    },
                  ]}
                />
              </div>
            </div>

            {/* Sub-tabla: Agentes Técnicos Contextuales por Sección */}
            <div className="p-3 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2 px-1">
                <span className="text-[11px] font-bold text-[#6B7780] uppercase tracking-wider flex items-center gap-1.5">
                  <Bot size={13} className="text-[#C8102E]" />
                  Agentes Técnicos de Sección ({course.sections.length} {course.sections.length === 1 ? "sección" : "secciones"} con parámetros particulares de profesor)
                </span>
                <span className="text-[11px] text-[#6B7780]">
                  El agente técnico adapta horarios, nombre del docente y reglas de eximición
                </span>
              </div>

              <div className="border border-gray-200 rounded-[3px] overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[680px]">
                  <thead className="bg-[#F5F6F8] text-[#55636E] uppercase font-bold text-[10px] border-b border-gray-200">
                    <tr>
                      <th className="p-2.5">Sección & Código</th>
                      <th className="p-2.5">Profesor Titular</th>
                      <th className="p-2.5">Horario Ayudantía & Sala</th>
                      <th className="p-2.5">Condición de Eximición</th>
                      <th className="p-2.5 text-center">Agente Técnico</th>
                      <th className="p-2.5 text-right w-14">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {course.sections.map((sec) => (
                      <tr key={sec.code} className="hover:bg-blue-50/20 transition-colors">
                        <td className="p-2.5 font-medium text-[#2D3B45]">
                          <span className="font-bold text-[#008EE2]">{sec.name}</span>
                          <span className="block font-mono text-[10px] text-gray-500">{sec.code}</span>
                        </td>
                        <td className="p-2.5 text-[#2D3B45]">
                          <span className="font-semibold block">{sec.profesor}</span>
                          <span className="text-[10px] text-[#6B7780]">Ayudante: {sec.ayudante}</span>
                        </td>
                        <td className="p-2.5 text-[#2D3B45]">
                          <span className="block font-medium">{sec.horarioAyudantia}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{sec.sala}</span>
                        </td>
                        <td className="p-2.5 text-[#2D3B45]">
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded text-[11px] font-medium block w-fit">
                            {sec.eximicion}
                          </span>
                        </td>
                        <td className="p-2.5 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-[#C8102E] border border-red-200 rounded text-[11px] font-semibold">
                            <BookOpen size={11} />
                            <span>Técnico {sec.name}</span>
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          <CanvasActionMenu
                            ariaLabel={`Acciones para ${sec.code}`}
                            items={[
                              {
                                label: "Ver y editar curso",
                                icon: <BookOpen size={14} className="text-[#008EE2]" />,
                                onClick: () => onSelectSection(sec.rawSection),
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#F0F8FF] border border-[#B3E5FC] rounded-[4px] p-3.5 flex items-center justify-between text-xs text-[#0277BD]">
        <div className="flex items-center gap-2">
          <Sparkles size={16} />
          <span>
            <strong>Arquitectura CREA UDP:</strong> 1 Agente Teórico unificado por curso garantiza que el contenido académico sea idéntico entre secciones, mientras que los Agentes Técnicos preservan la autonomía docente y las particularidades de cada profesor.
          </span>
        </div>
      </div>
    </div>
  );
};
