"use client";

import React, { useState, useMemo, useEffect } from "react";
import { CourseSection } from "@/types/attendance";
import { getSavedSections, saveSections, getCourseNameByCode } from "@/services/attendanceStore";
import {
  CanvasTable,
  CanvasTableHeader,
  CanvasTableRow,
  CanvasTableCell,
} from "@/components/canvas/CanvasTable";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasActionMenu } from "@/components/canvas/CanvasActionMenu";
import { AdminCourseDetailView } from "./AdminCourseDetailView";
import {
  BookOpen,
  Clock,
  Building2,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Layers,
  User,
} from "lucide-react";
import {
  updateSectionScheduleInSupabase,
  fetchSectionsFromSupabase,
  isSupabaseConfigured,
} from "@/services/attendanceDbService";

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

  // Estado del acordeón: qué cursos tienen sus secciones expandidas
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(
    () => new Set(["CIT3203"]) // Expandido por defecto para visualización inmediata
  );

  // Sincronización reactiva ante cambios en cualquier vista
  useEffect(() => {
    setSections(getSavedSections());
    const handleSync = () => {
      setSections(getSavedSections());
    };
    window.addEventListener("udp_sections_updated", handleSync);
    return () => window.removeEventListener("udp_sections_updated", handleSync);
  }, []);

  // Cargar secciones actualizadas desde Supabase al montar
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchSectionsFromSupabase().then((cloudSections) => {
        if (cloudSections && cloudSections.length > 0) {
          const validCourses = cloudSections.filter(
            (s) =>
              s.codigo.includes("CIT3203") ||
              s.codigo.includes("CIT2206") ||
              s.codigo.includes("CIT3100")
          );
          const sectionsToUse = validCourses.length > 0 ? validCourses : cloudSections;
          setSections(sectionsToUse);
          saveSections(sectionsToUse);
        }
      });
    }
  }, []);

  // Agrupar secciones por código base de curso (ej: CIT3203_CA01, CIT3203_CA02 -> CIT3203)
  const groupedCourses = useMemo<GroupedCourse[]>(() => {
    const map = new Map<string, GroupedCourse>();

    sections.forEach((sec) => {
      // Extrae la parte antes del guion bajo (ej. "CIT3203" desde "CIT3203_CA01")
      const baseCode = sec.codigo.includes("_") ? sec.codigo.split("_")[0] : sec.codigo;
      const courseName = sec.cursoNombre || getCourseNameByCode(sec.codigo);

      if (!map.has(baseCode)) {
        map.set(baseCode, {
          baseCode,
          courseName,
          sections: [],
        });
      }
      map.get(baseCode)!.sections.push(sec);
    });

    return Array.from(map.values());
  }, [sections]);

  const toggleExpandCourse = (baseCode: string) => {
    setExpandedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(baseCode)) {
        next.delete(baseCode);
      } else {
        next.add(baseCode);
      }
      return next;
    });
  };

  const handleRefreshCourses = async () => {
    setIsRefreshing(true);
    try {
      if (isSupabaseConfigured()) {
        const cloudSections = await fetchSectionsFromSupabase();
        if (cloudSections && cloudSections.length > 0) {
          const validCourses = cloudSections.filter(
            (s) =>
              s.codigo.includes("CIT3203") ||
              s.codigo.includes("CIT2206") ||
              s.codigo.includes("CIT3100")
          );
          const sectionsToUse = validCourses.length > 0 ? validCourses : cloudSections;
          setSections(sectionsToUse);
          saveSections(sectionsToUse);
          setSaveSuccess("Catálogo de cursos actualizado.");
          return;
        }
      }
      const localRefreshed = getSavedSections();
      setSections(localRefreshed);
      saveSections(localRefreshed);
      setSaveSuccess("Catálogo de cursos actualizado.");
    } catch {
      const fallback = getSavedSections();
      setSections(fallback);
      saveSections(fallback);
      setSaveSuccess("Catálogo de cursos revalidado.");
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setSaveSuccess(null), 3500);
    }
  };

  const handleSaveSection = (updated: CourseSection) => {
    const updatedSections = sections.map((s) =>
      s.id === updated.id || s.codigo === updated.codigo ? updated : s
    );
    setSections(updatedSections);
    saveSections(updatedSections);
    if (selectedCourseSection && (selectedCourseSection.id === updated.id || selectedCourseSection.codigo === updated.codigo)) {
      setSelectedCourseSection(updated);
    }

    // Guardar en la base de datos Supabase
    updateSectionScheduleInSupabase(updated).catch((err) =>
      console.warn("Aviso guardando horario en Supabase:", err)
    );

    setSaveSuccess(`Curso ${updated.codigo} actualizado correctamente.`);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const getDiasTexto = (dias: number[]) => {
    const nombres = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    return dias.map((d) => nombres[d]).join(" y ");
  };

  // Si el usuario seleccionó un curso para ver y editar, renderizamos la página dedicada
  if (selectedCourseSection) {
    return (
      <AdminCourseDetailView
        section={selectedCourseSection}
        onBack={() => setSelectedCourseSection(null)}
        onSaveSection={handleSaveSection}
      />
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Cabecera Minimalista */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <span className="text-[10px] font-bold text-[#C8102E] uppercase tracking-wider block">
            Vicerrectoría Académica • Escuela de Informática UDP
          </span>
          <h2 className="text-base font-bold text-[#2D3B45] mt-0.5 flex items-center gap-2">
            <BookOpen size={18} className="text-[#008EE2]" />
            Catálogo Oficial de Cursos
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Organización por asignatura. Expande cada curso para gestionar sus secciones y horarios individuales.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <CanvasButton
            variant="outline"
            size="sm"
            onClick={handleRefreshCourses}
            disabled={isRefreshing}
            icon={<RefreshCw size={13} className={`text-[#008EE2] ${isRefreshing ? "animate-spin" : ""}`} />}
          >
            <span>{isRefreshing ? "Actualizando..." : "Sincronizar oferta"}</span>
          </CanvasButton>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[4px] flex items-center gap-2 shadow-xs">
          <CheckCircle2 size={15} className="text-emerald-600" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Tabla Oficial de Cursos con Acordeón de Secciones */}
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
                  {/* Fila Principal de la Asignatura */}
                  <CanvasTableRow
                    className="hover:bg-blue-50/20 transition-colors"
                  >
                    <CanvasTableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#008EE2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {course.baseCode}
                        </span>
                        <strong className="text-xs text-[#2D3B45]">
                          {course.courseName}
                        </strong>
                      </div>
                    </CanvasTableCell>

                    {/* Botón de Acordeón "Expandir secciones" */}
                    <CanvasTableCell align="center">
                      <button
                        type="button"
                        onClick={() => toggleExpandCourse(course.baseCode)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-[3px] border transition-colors ${
                          isExpanded
                            ? "bg-blue-100 text-[#008EE2] border-blue-300"
                            : "bg-gray-50 hover:bg-gray-100 text-[#2D3B45] border-gray-300"
                        }`}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronDown size={13} className="text-[#008EE2]" />
                            <span>Ocultar ({course.sections.length})</span>
                          </>
                        ) : (
                          <>
                            <ChevronRight size={13} className="text-[#6B7780]" />
                            <span>Expandir secciones ({course.sections.length})</span>
                          </>
                        )}
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
                        <Building2 size={12} className="text-[#008EE2] shrink-0" />
                        Facultad de Ingeniería y Ciencias (Toesca)
                      </span>
                    </CanvasTableCell>

                    <CanvasTableCell align="right">
                      <CanvasActionMenu
                        ariaLabel={`Acciones para ${course.baseCode}`}
                        items={[
                          {
                            label: "Ver y editar curso",
                            icon: <BookOpen size={14} className="text-[#008EE2]" />,
                            onClick: () => setSelectedCourseSection(firstSection),
                          },
                          {
                            label: isExpanded ? "Colapsar secciones" : "Expandir secciones",
                            icon: isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />,
                            onClick: () => toggleExpandCourse(course.baseCode),
                          },
                        ]}
                      />
                    </CanvasTableCell>
                  </CanvasTableRow>

                  {/* Panel de Acordeón con las Secciones Desplegadas */}
                  {isExpanded && (
                    <tr className="bg-[#FAFBFD] border-b border-gray-200">
                      <td colSpan={5} className="p-3 pl-6 sm:pl-10">
                        <div className="bg-white border border-gray-200 rounded-[3px] shadow-2xs overflow-hidden">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-[#F5F6F8] text-[#55636E] uppercase font-bold text-[10px] border-b border-gray-200">
                              <tr>
                                <th className="p-2.5">Código Sección</th>
                                <th className="p-2.5">Sección</th>
                                <th className="p-2.5">Profesor Titular</th>
                                <th className="p-2.5">Ayudantía (Días & Horario)</th>
                                <th className="p-2.5">Sala</th>
                                <th className="p-2.5 text-right w-14">Acciones</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {course.sections.map((sec) => (
                                <tr
                                  key={sec.codigo}
                                  onClick={() => setSelectedCourseSection(sec)}
                                  className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                                >
                                  <td className="p-2.5 font-mono font-bold text-[#008EE2]">
                                    {sec.codigo}
                                  </td>
                                  <td className="p-2.5 font-semibold text-[#2D3B45]">
                                    {sec.nombre}
                                  </td>
                                  <td className="p-2.5 text-[#55636E]">
                                    <span className="flex items-center gap-1">
                                      <User size={12} className="text-gray-400" />
                                      <span>{sec.profesor}</span>
                                    </span>
                                  </td>
                                  <td className="p-2.5 text-purple-950 font-medium">
                                    <div className="space-y-0.5">
                                      <span className="flex items-center gap-1">
                                        <Clock size={11} className="text-purple-600" />
                                        <span>{getDiasTexto(sec.horarioAyudantia.dias)} {sec.horarioAyudantia.horaInicio} - {sec.horarioAyudantia.horaFin}</span>
                                      </span>
                                      {sec.horarioAyudantia2 && (
                                        <span className="flex items-center gap-1 text-[11px] text-amber-700">
                                          <Clock size={10} className="text-amber-600" />
                                          <span>Bloque 2: {getDiasTexto(sec.horarioAyudantia2.dias)} {sec.horarioAyudantia2.horaInicio} - {sec.horarioAyudantia2.horaFin}</span>
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="p-2.5 font-mono text-gray-600">
                                    <div>{sec.horarioAyudantia.sala}</div>
                                    {sec.horarioAyudantia2 && (
                                      <div className="text-[11px] text-gray-500">{sec.horarioAyudantia2.sala}</div>
                                    )}
                                  </td>
                                  <td
                                    className="p-2.5 text-right"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <CanvasActionMenu
                                      ariaLabel={`Acciones para ${sec.codigo}`}
                                      items={[
                                        {
                                          label: "Ver y editar curso",
                                          icon: <BookOpen size={14} className="text-[#008EE2]" />,
                                          onClick: () => setSelectedCourseSection(sec),
                                        },
                                      ]}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
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
