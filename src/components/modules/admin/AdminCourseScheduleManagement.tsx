"use client";

import React, { useState, useMemo, useEffect } from "react";
import { CourseSection } from "@/types/attendance";
import { getSavedSections, saveSections, getCourseNameByCode } from "@/services/attendanceStore";
import { CanvasTable, CanvasTableHeader, CanvasTableRow, CanvasTableCell } from "@/components/canvas/CanvasTable";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasActionMenu } from "@/components/canvas/CanvasActionMenu";
import { AdminCourseDetailView } from "./AdminCourseDetailView";
import { AdminCourseSectionTable } from "./AdminCourseSectionTable";
import { BookOpen, Building2, CheckCircle2, RefreshCw, ChevronDown, ChevronRight } from "lucide-react";
import { updateSectionScheduleInSupabase, fetchSectionsFromSupabase, isSupabaseConfigured } from "@/services/attendanceDbService";

interface GroupedCourse {
  baseCode: string;
  courseName: string;
  sections: CourseSection[];
}

export const AdminCourseScheduleManagement: React.FC = () => {
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [selectedCourseSection, setSelectedCourseSection] = useState<CourseSection | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(() => {
    const initial = getSavedSections();
    const firstCode = initial[0]?.codigo?.includes("_") ? initial[0].codigo.split("_")[0] : initial[0]?.codigo || "CIT3203";
    return new Set([firstCode]);
  });

  useEffect(() => {
    setSections(getSavedSections());
    const handleSync = () => setSections(getSavedSections());
    window.addEventListener("udp_sections_updated", handleSync);
    return () => window.removeEventListener("udp_sections_updated", handleSync);
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchSectionsFromSupabase().then((cloudSections) => {
        if (cloudSections && cloudSections.length > 0) {
          const valid = cloudSections.filter((s) => s.codigo.includes("CIT3203") || s.codigo.includes("CIT2206") || s.codigo.includes("CIT3100"));
          const toUse = valid.length > 0 ? valid : cloudSections;
          setSections(toUse);
          saveSections(toUse);
        }
      });
    }
  }, []);

  const groupedCourses = useMemo<GroupedCourse[]>(() => {
    const map = new Map<string, GroupedCourse>();
    sections.forEach((sec) => {
      const baseCode = sec.codigo.includes("_") ? sec.codigo.split("_")[0] : sec.codigo;
      const courseName = sec.cursoNombre || getCourseNameByCode(sec.codigo);
      if (!map.has(baseCode)) {
        map.set(baseCode, { baseCode, courseName, sections: [] });
      }
      map.get(baseCode)!.sections.push(sec);
    });
    return Array.from(map.values());
  }, [sections]);

  const toggleExpandCourse = (baseCode: string) => {
    setExpandedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(baseCode)) next.delete(baseCode);
      else next.add(baseCode);
      return next;
    });
  };

  const handleRefreshCourses = async () => {
    setIsRefreshing(true);
    try {
      if (isSupabaseConfigured()) {
        const cloud = await fetchSectionsFromSupabase();
        if (cloud && cloud.length > 0) {
          setSections(cloud);
          saveSections(cloud);
          setSaveSuccess("Catálogo actualizado.");
          return;
        }
      }
      const local = getSavedSections();
      setSections(local);
      saveSections(local);
      setSaveSuccess("Catálogo actualizado.");
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setSaveSuccess(null), 3500);
    }
  };

  const handleSaveSection = (updated: CourseSection) => {
    const updatedSections = sections.map((s) => (s.id === updated.id || s.codigo === updated.codigo ? updated : s));
    setSections(updatedSections);
    saveSections(updatedSections);
    if (selectedCourseSection && (selectedCourseSection.id === updated.id || selectedCourseSection.codigo === updated.codigo)) {
      setSelectedCourseSection(updated);
    }
    updateSectionScheduleInSupabase(updated).catch(console.warn);
    setSaveSuccess(`Curso ${updated.codigo} actualizado.`);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const getDiasTexto = (dias: number[]) => {
    const nombres = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    return dias.map((d) => nombres[d]).join(" y ");
  };

  if (selectedCourseSection) {
    return <AdminCourseDetailView section={selectedCourseSection} onBack={() => setSelectedCourseSection(null)} onSaveSection={handleSaveSection} />;
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h2 className="text-base font-bold text-[#2D3B45] flex items-center gap-2">
          <BookOpen size={18} className="text-[#008EE2]" />
          Catálogo Oficial de Cursos
        </h2>
        <CanvasButton variant="outline" size="sm" onClick={handleRefreshCourses} disabled={isRefreshing} icon={<RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />}>
          <span>{isRefreshing ? "Actualizando..." : "Sincronizar oferta"}</span>
        </CanvasButton>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[4px] flex items-center gap-2">
          <CheckCircle2 size={15} className="text-emerald-600" />
          <span>{saveSuccess}</span>
        </div>
      )}

      <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card overflow-hidden">
        <CanvasTable tableClassName="min-w-[700px]">
          <CanvasTableHeader>
            <tr>
              <th className="p-3">Código y Asignatura</th>
              <th className="p-3 text-center w-48">Secciones</th>
              <th className="p-3">Horario Resumen</th>
              <th className="p-3">Ubicación</th>
              <th className="p-3 text-right w-16">Acciones</th>
            </tr>
          </CanvasTableHeader>
          <tbody>
            {groupedCourses.map((course) => {
              const isExpanded = expandedCourses.has(course.baseCode);
              const firstSection = course.sections[0];
              return (
                <React.Fragment key={course.baseCode}>
                  <CanvasTableRow className="hover:bg-blue-50/20 transition-colors">
                    <CanvasTableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#008EE2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {course.baseCode}
                        </span>
                        <strong className="text-sm text-[#2D3B45]">{course.courseName}</strong>
                      </div>
                    </CanvasTableCell>
                    <CanvasTableCell align="center">
                      <button
                        type="button"
                        onClick={() => toggleExpandCourse(course.baseCode)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-[3px] border transition-colors ${
                          isExpanded ? "bg-blue-100 text-[#008EE2] border-blue-300" : "bg-gray-50 hover:bg-gray-100 text-[#2D3B45] border-gray-300"
                        }`}
                      >
                        {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                        <span>{isExpanded ? "Ocultar" : "Expandir"} ({course.sections.length})</span>
                      </button>
                    </CanvasTableCell>
                    <CanvasTableCell>
                      <span className="text-xs text-[#55636E]">
                        {course.sections.length > 1
                          ? `${course.sections.length} secciones con horario`
                          : `${getDiasTexto(firstSection.horarioAyudantia.dias)} ${firstSection.horarioAyudantia.horaInicio} - ${firstSection.horarioAyudantia.horaFin}`}
                      </span>
                    </CanvasTableCell>
                    <CanvasTableCell>
                      <span className="text-xs text-gray-700 flex items-center gap-1.5">
                        <Building2 size={13} className="text-[#008EE2] shrink-0" />
                        Facultad de Ingeniería y Ciencias (Toesca)
                      </span>
                    </CanvasTableCell>
                    <CanvasTableCell align="right">
                      <CanvasActionMenu
                        ariaLabel={`Acciones para ${course.baseCode}`}
                        items={[
                          { label: "Ver y editar curso", icon: <BookOpen size={14} className="text-[#008EE2]" />, onClick: () => setSelectedCourseSection(firstSection) },
                          { label: isExpanded ? "Colapsar secciones" : "Expandir secciones", icon: isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />, onClick: () => toggleExpandCourse(course.baseCode) },
                        ]}
                      />
                    </CanvasTableCell>
                  </CanvasTableRow>
                  {isExpanded && (
                    <tr className="bg-[#FAFBFD] border-b border-gray-200">
                      <td colSpan={5} className="p-3 pl-6 sm:pl-10">
                        <AdminCourseSectionTable sections={course.sections} onSelectSection={setSelectedCourseSection} getDiasTexto={getDiasTexto} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </CanvasTable>
      </div>
    </div>
  );
};
