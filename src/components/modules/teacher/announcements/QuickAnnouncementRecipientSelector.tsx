"use client";

import React, { useState, useMemo } from "react";
import { CanvasCourse } from "@/types";
import { CourseSection } from "@/types/attendance";
import { BookOpen, Users, Sparkles, Search, CheckSquare } from "lucide-react";
import { CanvasItemGroup, CanvasItemRow } from "@/components/canvas/CanvasItemGroup";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { enrichCourseList, groupCoursesBySubject, EnrichedCourseSection } from "@/utils/courseGrouping";
import { getSavedSections } from "@/services/attendanceStore";

interface QuickAnnouncementRecipientSelectorProps {
  courses: CanvasCourse[];
  sections?: CourseSection[];
  selectedCourseIds: number[];
  onChange: (selectedIds: number[]) => void;
}

export const QuickAnnouncementRecipientSelector: React.FC<QuickAnnouncementRecipientSelectorProps> = ({
  courses,
  sections,
  selectedCourseIds,
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const currentSections = useMemo(() => sections || getSavedSections(), [sections]);

  const baseEnriched = useMemo(() => {
    return enrichCourseList(courses, currentSections).filter((c) => c.isAutomated);
  }, [courses, currentSections]);

  const filteredEnriched = useMemo(() => {
    if (!searchQuery.trim()) return baseEnriched;
    const q = searchQuery.toLowerCase().trim();
    return baseEnriched.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.baseCode.toLowerCase().includes(q) ||
        c.sectionName.toLowerCase().includes(q) ||
        c.profesor.toLowerCase().includes(q)
    );
  }, [baseEnriched, searchQuery]);

  const groupedSubjects = useMemo(() => groupCoursesBySubject(filteredEnriched), [filteredEnriched]);

  const totalSelectedStudents = useMemo(() => {
    return baseEnriched
      .filter((c) => selectedCourseIds.includes(c.id))
      .reduce((acc, curr) => acc + (curr.students_count || 0), 0);
  }, [baseEnriched, selectedCourseIds]);

  const selectAll = () => onChange(baseEnriched.map((c) => c.id));
  const deselectAll = () => onChange([]);

  const toggleSection = (id: number) => {
    onChange(
      selectedCourseIds.includes(id)
        ? selectedCourseIds.filter((item) => item !== id)
        : [...selectedCourseIds, id]
    );
  };

  const toggleSubject = (secIds: number[]) => {
    const allSelected = secIds.every((id) => selectedCourseIds.includes(id));
    if (allSelected) {
      onChange(selectedCourseIds.filter((id) => !secIds.includes(id)));
    } else {
      onChange(Array.from(new Set([...selectedCourseIds, ...secIds])));
    }
  };

  return (
    <div className="space-y-3 pt-1">
      {/* Barra de Búsqueda y Botones de Selección Rápida */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-gray-50/90 border border-[#C7CDD1] rounded-[3px] p-2.5 text-xs">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por asignatura o sección..."
            className="w-full pl-8 pr-3 py-1 bg-white text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#B71C1C]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <CanvasButton variant="outline" size="sm" onClick={selectAll} icon={<CheckSquare size={13} className="text-[#B71C1C]" />}>
            Seleccionar todos
          </CanvasButton>
          <button type="button" onClick={deselectAll} className="text-xs text-[#6B7780] hover:text-[#2D3B45] hover:underline px-1.5 py-1 font-medium cursor-pointer">
            Desmarcar todos
          </button>
          <span className="text-[11px] bg-red-50 text-[#B71C1C] font-bold px-2 py-1 rounded border border-red-200 flex items-center gap-1">
            <Users size={12} />
            <span>{selectedCourseIds.length} secciones ({totalSelectedStudents} alumnos)</span>
          </span>
        </div>
      </div>

      {/* Acordeones idénticos a 'Mis Cursos' con Checkbox */}
      <div className="space-y-3">
        {groupedSubjects.map((grp) => {
          const groupSecIds = grp.sections.map((s) => s.id);
          const selectedInGroup = grp.sections.filter((s) => selectedCourseIds.includes(s.id));
          const allInGroupSelected = groupSecIds.length > 0 && selectedInGroup.length === groupSecIds.length;

          return (
            <CanvasItemGroup
              key={grp.subjectCode}
              title={`${grp.subjectName} (${grp.subjectCode})`}
              weightBadge={`${selectedInGroup.length} de ${grp.sectionsCount} secciones`}
              defaultExpanded={true}
              countBadge={
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSubject(groupSecIds);
                  }}
                  className="ml-2 text-[11px] font-semibold text-[#008EE2] hover:underline cursor-pointer"
                >
                  {allInGroupSelected ? "Deseleccionar grupo" : "Seleccionar grupo"}
                </button>
              }
            >
              {grp.sections.map((sec: EnrichedCourseSection) => {
                const isChecked = selectedCourseIds.includes(sec.id);
                return (
                  <CanvasItemRow
                    key={sec.id}
                    id={sec.id}
                    indicatorColor={isChecked ? "green" : "gray"}
                    icon={
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSection(sec.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 text-[#B71C1C] rounded border-gray-300 focus:ring-[#B71C1C] cursor-pointer"
                        />
                        <BookOpen size={16} className={isChecked ? "text-[#008EE2]" : "text-gray-400"} />
                      </div>
                    }
                    title={
                      <span className="flex items-center gap-2 flex-wrap">
                        <span className={`font-bold text-sm ${isChecked ? "text-[#2D3B45]" : "text-gray-500"}`}>{sec.sectionName}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-[#55636E] border border-gray-200">{sec.code}</span>
                        <span className="text-xs font-normal text-[#6B7780] flex items-center gap-1"><Users size={12} /><span>{sec.students_count || 0} al.</span></span>
                        <span className="text-xs bg-blue-50 text-[#008EE2] px-2 py-0.5 rounded font-medium border border-blue-200 flex items-center gap-1"><Sparkles size={11} /><span>{sec.agentName}</span></span>
                      </span>
                    }
                    subtitle={
                      <span suppressHydrationWarning className="text-xs text-[#6B7780]">
                        Profesor: <strong>{sec.profesor}</strong> • Horario Cátedra: {sec.catedraFormatted} • Sala: <strong>{sec.salaFormatted}</strong>
                      </span>
                    }
                    onClick={() => toggleSection(sec.id)}
                  />
                );
              })}
            </CanvasItemGroup>
          );
        })}

        {groupedSubjects.length === 0 && (
          <div className="p-6 text-center text-xs text-[#6B7780] bg-white border border-[#E0E3E6] rounded">
            No se encontraron cursos o secciones para la búsqueda &quot;{searchQuery}&quot;.
          </div>
        )}
      </div>
    </div>
  );
};
