"use client";

import React, { useState, useMemo, useEffect } from "react";
import { CanvasCourse, CourseDeliverable, StudentExcelRow } from "@/types";
import { CourseSection } from "@/types/attendance";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  CanvasTable,
  CanvasTableHeader,
  CanvasTableRow,
  CanvasTableCell,
} from "@/components/canvas/CanvasTable";
import { AutomatedCourseWorkspace } from "./teacher/AutomatedCourseWorkspace";
import { TeacherAttendanceWorkspace } from "./teacher/TeacherAttendanceWorkspace";
import { getSectionByCourseCode, formatSectionSchedule, getSavedSections, saveSections } from "@/services/attendanceStore";
import { fetchSectionsFromSupabase, isSupabaseConfigured } from "@/services/attendanceDbService";
import { BookOpen, Sparkles, CheckCircle2, ArrowRight, CalendarCheck, Calendar, Clock, Building2 } from "lucide-react";

import { StudentSubmission } from "@/types";

interface TeacherViewProps {
  canvasCourses: CanvasCourse[];
  entregables: CourseDeliverable[];
  estudiantesExcel: StudentExcelRow[];
  entregasAlumnos?: StudentSubmission[];
  onAddDeliverable: (d: CourseDeliverable) => void;
  onUpdateGrade: (canvasId: number, field: keyof StudentExcelRow, value: number) => void;
  onResolveAppeal?: (submissionId: string, action: "aceptar" | "ratificar") => void;
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  canvasCourses,
  entregables,
  estudiantesExcel,
  entregasAlumnos = [],
  onAddDeliverable,
  onUpdateGrade,
  onResolveAppeal,
}) => {
  const TEACHER_COURSE_IDS = [44999, 45002, 47552, 47047, 44988];
  const [onlyAutomated, setOnlyAutomated] = useState<boolean>(false);
  const [automatedCourseIds, setAutomatedCourseIds] = useState<number[]>(TEACHER_COURSE_IDS);
  const [openedCourseId, setOpenedCourseId] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Estado sincronizado de secciones y horarios (modificados por Admin)
  const [sections, setSections] = useState<CourseSection[]>(() => getSavedSections());

  // Escuchar cambios de horarios realizados por el administrador
  useEffect(() => {
    const handleSync = () => {
      setSections(getSavedSections());
    };
    window.addEventListener("udp_sections_updated", handleSync);
    return () => window.removeEventListener("udp_sections_updated", handleSync);
  }, []);

  // También consultar Supabase al montar para tener siempre los datos más frescos
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchSectionsFromSupabase().then((cloudSections) => {
        if (cloudSections && cloudSections.length > 0) {
          setSections(cloudSections);
          saveSections(cloudSections);
        }
      });
    }
  }, []);

  const handleAutomateCourse = (courseId: number) => {
    if (!automatedCourseIds.includes(courseId)) {
      setAutomatedCourseIds((prev) => [...prev, courseId]);
      setNotification("Curso vinculado con éxito al Agente Institucional CREA UDP.");
      setTimeout(() => setNotification(null), 3500);
    }
  };

  // Extraer los 5 cursos/secciones: las 3 secciones de TICs II, Gestión Organizacional y Arquitecturas Emergentes
  const eligibleCourses = useMemo(() => {
    const list = canvasCourses.filter((course) => {
      return (
        TEACHER_COURSE_IDS.includes(course.id) ||
        (course.code && (
          course.code.includes("CIT3203") ||
          course.code.includes("CIT2206") ||
          course.code.includes("CIT3100")
        ))
      );
    });

    // Si algún curso no venía en la lista de favoritos de Canvas, aseguramos que esté presente
    const existingIds = new Set(list.map((c) => c.id));
    const fallbackTeacherCourses: CanvasCourse[] = [
      { id: 44999, name: "202602 - PROYECTO EN TICS II", code: "CIT3203_CA01", term: "2026-02 Semestre Primavera", students_count: 28, is_automated: true },
      { id: 45002, name: "PROYECTO EN TICS II", code: "CIT3203_CA02", term: "2026-02 Semestre Primavera", students_count: 30, is_automated: true },
      { id: 47552, name: "PROYECTO EN TICS II", code: "CIT3203_CA03", term: "2026-02 Semestre Primavera", students_count: 28, is_automated: true },
      { id: 47047, name: "GESTIÓN ORGANIZACIONAL", code: "CIT2206_CA01", term: "2026-02 Semestre Primavera", students_count: 44, is_automated: true },
      { id: 44988, name: "ARQUITECTURAS EMERGENTES", code: "CIT3100_CA02", term: "2026-02 Semestre Primavera", students_count: 23, is_automated: true },
    ];

    fallbackTeacherCourses.forEach((fb) => {
      if (!existingIds.has(fb.id)) {
        list.push(fb);
      }
    });

    return list;
  }, [canvasCourses]);

  const openedCourse = useMemo(() => {
    if (!openedCourseId) return null;
    return eligibleCourses.find((c) => c.id === openedCourseId) || null;
  }, [openedCourseId, eligibleCourses]);

  const automatedCoursesList = useMemo(() => {
    return eligibleCourses.filter((c: CanvasCourse) => automatedCourseIds.includes(c.id));
  }, [eligibleCourses, automatedCourseIds]);

  const displayedCourses = useMemo(() => {
    if (onlyAutomated) {
      return eligibleCourses.filter((c) => automatedCourseIds.includes(c.id));
    }
    return eligibleCourses;
  }, [eligibleCourses, automatedCourseIds, onlyAutomated]);

  // Si el docente abrió un curso automatizado, mostramos su workspace interno
  if (openedCourseId && openedCourse) {
    return (
      <AutomatedCourseWorkspace
        course={openedCourse}
        entregables={entregables}
        estudiantesExcel={estudiantesExcel}
        entregasAlumnos={entregasAlumnos}
        onBack={() => setOpenedCourseId(null)}
        onAddDeliverable={onAddDeliverable}
        onUpdateGrade={onUpdateGrade}
        onResolveAppeal={onResolveAppeal}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner Superior Docente con las 2 Tabs */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#E3F2FD] text-[#0277BD] text-[11px] font-bold rounded uppercase tracking-wider">
              Portal Docente & Ayudantías
            </span>
            <span className="text-xs text-[#6B7780]">Canvas UDP Sincronizado</span>
          </div>
          <h1 className="text-xl font-bold text-[#2D3B45] mt-1">
            Gestión de Cursos y Automatización IA
          </h1>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Asignaturas del Tablero oficial de Canvas vinculables con agentes de cátedra.
          </p>
        </div>
      </div>

      {/* Filtro y Barra de Estado */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-canvas-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyAutomated}
            onChange={(e) => setOnlyAutomated(e.target.checked)}
            className="w-4 h-4 text-[#008EE2] rounded border-gray-300 focus:ring-[#008EE2] cursor-pointer"
          />
          <span className="text-xs font-semibold text-[#2D3B45]">
            Mostrar solo cursos automatizados
          </span>
          <span className="px-1.5 py-0.5 bg-blue-50 text-[#008EE2] rounded-full text-[10px] font-bold border border-blue-200">
            {automatedCoursesList.length} de {eligibleCourses.length}
          </span>
        </label>

        <span className="text-xs text-[#6B7780]">
          Haz clic en cualquier curso para acceder a su panel de ayudantía y calificaciones
        </span>
      </div>

      {/* Alerta / Notificación de sincronización */}
      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[4px] flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabla Unificada de Cursos de Canvas */}
      <div className="space-y-3">
        <CanvasTable>
          <CanvasTableHeader>
            <tr>
              <th className="p-3">Código Canvas</th>
              <th className="p-3">Nombre de Asignatura</th>
              <th className="p-3">Horario Ayudantía</th>
              <th className="p-3 text-center">Agente Institucional</th>
              <th className="p-3 text-center">Estado</th>
              <th className="p-3 text-right">Acción</th>
            </tr>
          </CanvasTableHeader>
          <tbody>
            {displayedCourses.length === 0 ? (
              <CanvasTableRow hoverable={false}>
                <CanvasTableCell colSpan={6} align="center">
                  <div className="py-8 text-center text-xs text-[#6B7780]">
                    No se encontraron cursos automatizados. Desmarca el filtro para ver todos los cursos de Canvas.
                  </div>
                </CanvasTableCell>
              </CanvasTableRow>
            ) : (
              displayedCourses.map((course: CanvasCourse) => {
                const isAutomated = automatedCourseIds.includes(course.id);
                const sec = getSectionByCourseCode(course.code, sections);
                const sched = formatSectionSchedule(sec);

                return (
                  <CanvasTableRow
                    key={course.id}
                    onClick={() => (isAutomated ? setOpenedCourseId(course.id) : handleAutomateCourse(course.id))}
                  >
                    <CanvasTableCell>
                      <span className="font-mono font-bold text-[#008EE2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {course.code}
                      </span>
                    </CanvasTableCell>

                    <CanvasTableCell>
                      <div>
                        <span className="font-bold text-[#2D3B45] text-xs hover:text-[#008EE2] transition-colors">
                          {course.name}
                        </span>
                        <span className="block text-[11px] text-[#6B7780]">
                          Canvas ID: {course.id} • {sec.nombre} (Prof. {sec.profesor})
                        </span>
                      </div>
                    </CanvasTableCell>

                    <CanvasTableCell>
                      <div className="space-y-0.5 text-[11px] leading-tight min-w-[170px]">
                        <div className="flex items-center gap-1.5 text-purple-950 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                          <span><strong>Ayudantía:</strong> {sched.ayudantia}</span>
                        </div>
                        <div className="text-[10px] text-[#6B7780] pl-3 font-mono flex items-center gap-1">
                          <Building2 size={11} className="text-[#C8102E]" />
                          <span>{sched.ayudantiaSala || "SALA X"}</span>
                        </div>
                      </div>
                    </CanvasTableCell>

                    <CanvasTableCell align="center">
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#2D3B45] bg-[#F5F6F8] px-2 py-0.5 rounded border border-[#E0E3E6]">
                        <Sparkles size={12} className="text-[#C8102E]" />
                        <span>
                          {course.code.includes("CIT2206")
                            ? "Agente Teoría Org (CIT2206)"
                            : course.code.includes("CIT3100")
                            ? "Agente Arq Cloud (CIT3100)"
                            : "Agente PMBOK + Ágil (CIT3203)"}
                        </span>
                      </span>
                    </CanvasTableCell>

                    <CanvasTableCell align="center">
                      {isAutomated ? (
                        <CanvasBadge variant="success">✓ Automatizado</CanvasBadge>
                      ) : (
                        <CanvasBadge variant="neutral">Sin Vincular</CanvasBadge>
                      )}
                    </CanvasTableCell>

                    <CanvasTableCell align="right">
                      {isAutomated ? (
                        <CanvasButton
                          variant="primary-canvas"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenedCourseId(course.id);
                          }}
                          icon={<ArrowRight size={13} />}
                        >
                          Abrir Panel
                        </CanvasButton>
                      ) : (
                        <CanvasButton
                          variant="primary-udp"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAutomateCourse(course.id);
                          }}
                          icon={<Sparkles size={13} />}
                        >
                          Automatizar con IA
                        </CanvasButton>
                      )}
                    </CanvasTableCell>
                  </CanvasTableRow>
                );
              })
            )}
          </tbody>
        </CanvasTable>
      </div>
    </div>
  );
};
