"use client";

import React, { useMemo } from "react";
import { CanvasCourse } from "@/types";
import { Layers, Users, CheckSquare, Square, MinusSquare } from "lucide-react";
import { enrichCourseList, groupCoursesBySubject, SubjectCourseGroup, EnrichedCourseSection } from "@/utils/courseGrouping";
import { getSavedSections } from "@/services/attendanceStore";

interface QuickAnnouncementRecipientSelectorProps {
  courses: CanvasCourse[];
  selectedCourseIds: number[];
  onChange: (selectedIds: number[]) => void;
}

export const QuickAnnouncementRecipientSelector: React.FC<QuickAnnouncementRecipientSelectorProps> = ({
  courses,
  selectedCourseIds,
  onChange,
}) => {
  const sections = useMemo(() => getSavedSections(), []);

  const subjectGroups = useMemo(() => {
    const enriched = enrichCourseList(courses, sections);
    return groupCoursesBySubject(enriched);
  }, [courses, sections]);

  const totalSelectedStudents = useMemo(() => {
    return courses
      .filter((c) => selectedCourseIds.includes(c.id))
      .reduce((acc, curr) => acc + (curr.students_count || 0), 0);
  }, [courses, selectedCourseIds]);

  const selectAll = () => {
    onChange(courses.map((c) => c.id));
  };

  const deselectAll = () => {
    onChange([]);
  };

  const toggleSubjectAll = (group: SubjectCourseGroup) => {
    const groupIds = group.sections.map((s) => s.id);
    const allSelected = groupIds.every((id) => selectedCourseIds.includes(id));

    if (allSelected) {
      // Remove all sections of this subject
      onChange(selectedCourseIds.filter((id) => !groupIds.includes(id)));
    } else {
      // Add all sections of this subject
      const set = new Set([...selectedCourseIds, ...groupIds]);
      onChange(Array.from(set));
    }
  };

  const toggleSection = (id: number) => {
    if (selectedCourseIds.includes(id)) {
      onChange(selectedCourseIds.filter((item) => item !== id));
    } else {
      onChange([...selectedCourseIds, id]);
    }
  };

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card space-y-3">
      {/* Barra Superior de Selección */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-[#008EE2]" />
          <span className="text-xs font-bold text-[#2D3B45] uppercase tracking-wide">
            Destinatarios del Anuncio ({selectedCourseIds.length} de {courses.length} secciones)
          </span>
          <span className="text-[11px] bg-red-50 text-[#B71C1C] border border-red-200 px-2 py-0.5 rounded font-bold flex items-center gap-1">
            <Users size={12} />
            <span>{totalSelectedStudents} alumnos en total</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={selectAll}
            className="text-[#008EE2] hover:underline font-semibold"
          >
            Seleccionar todas
          </button>
          <span className="text-gray-300">•</span>
          <button
            type="button"
            onClick={deselectAll}
            className="text-[#6B7780] hover:underline font-medium"
          >
            Desmarcar todas
          </button>
        </div>
      </div>

      {/* Tarjetas Agrupadas por Asignatura */}
      <div className="space-y-2.5">
        {subjectGroups.map((group) => {
          const groupIds = group.sections.map((s) => s.id);
          const selectedInGroup = group.sections.filter((s) => selectedCourseIds.includes(s.id));
          const isAllSelected = groupIds.length > 0 && selectedInGroup.length === groupIds.length;
          const isPartiallySelected = selectedInGroup.length > 0 && selectedInGroup.length < groupIds.length;

          return (
            <div
              key={group.subjectCode}
              className={`border rounded transition-colors ${
                isAllSelected || isPartiallySelected
                  ? "border-red-200 bg-red-50/20"
                  : "border-gray-200 bg-gray-50/50"
              }`}
            >
              {/* Cabecera de Asignatura con Master Checkbox */}
              <div
                onClick={() => toggleSubjectAll(group)}
                className="flex items-center justify-between px-3 py-2 border-b border-gray-100 cursor-pointer select-none hover:bg-gray-100/60 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="text-[#B71C1C]">
                    {isAllSelected ? (
                      <CheckSquare size={16} className="fill-[#B71C1C] text-white" />
                    ) : isPartiallySelected ? (
                      <MinusSquare size={16} className="fill-[#B71C1C] text-white" />
                    ) : (
                      <Square size={16} className="text-gray-400" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#2D3B45] truncate">
                    {group.subjectName}
                  </span>
                  <span className="text-[11px] font-semibold text-[#6B7780]">
                    ({group.subjectCode})
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] text-[#55636E] font-medium">
                    {selectedInGroup.length} de {group.sectionsCount} {group.sectionsCount === 1 ? "sección" : "secciones"}
                  </span>
                  {group.sectionsCount > 1 && (
                    <span className="text-[10px] bg-blue-50 text-[#008EE2] border border-blue-200 px-1.5 py-0.5 rounded font-semibold hidden sm:inline">
                      Multisección
                    </span>
                  )}
                </div>
              </div>

              {/* Botones / Checkboxes de Secciones dentro de la Asignatura */}
              <div className="p-2.5 flex flex-wrap gap-2">
                {group.sections.map((sec: EnrichedCourseSection) => {
                  const isChecked = selectedCourseIds.includes(sec.id);
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => toggleSection(sec.id)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors border select-none ${
                        isChecked
                          ? "bg-red-50 border-[#B71C1C] text-[#B71C1C] font-bold shadow-2xs"
                          : "bg-white border-gray-300 text-[#55636E] hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        aria-label={`Seleccionar ${sec.sectionName} (${sec.code})`}
                        className="rounded text-[#B71C1C] focus:ring-0 pointer-events-none"
                      />
                      <span>{sec.sectionName}</span>
                      <span className="text-[10px] opacity-80">({sec.sectionCode})</span>
                      <span className="text-[10px] opacity-70 border-l border-current pl-1.5">
                        {sec.students_count || 0} al.
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
