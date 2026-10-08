"use client";

import React, { useState, useMemo, useEffect } from "react";
import { CanvasCourse, CourseDeliverable, StudentExcelRow, StudentSubmission } from "@/types";
import { CourseSection } from "@/types/attendance";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { AutomatedCourseWorkspace } from "./teacher/AutomatedCourseWorkspace";
import { TeacherCoursesTable } from "./teacher/TeacherCoursesTable";
import { getSavedSections, saveSections } from "@/services/attendanceStore";
import { fetchSectionsFromSupabase, isSupabaseConfigured } from "@/services/attendanceDbService";
import { CheckCircle2, TrendingUp, FileSpreadsheet } from "lucide-react";
import { ImportCourseExcelModal } from "./common/ImportCourseExcelModal";

interface TeacherViewProps {
  canvasCourses: CanvasCourse[];
  entregables: CourseDeliverable[];
  estudiantesExcel: StudentExcelRow[];
  entregasAlumnos?: StudentSubmission[];
  onAddDeliverable: (d: CourseDeliverable) => void;
  onUpdateGrade: (canvasId: number, field: keyof StudentExcelRow, value: number) => void;
  onResolveAppeal?: (submissionId: string, action: "aceptar" | "ratificar") => void;
}

const COURSES_ORDER_STORAGE_KEY = "udp_teacher_courses_order_v1";

export const TeacherView: React.FC<TeacherViewProps> = ({
  canvasCourses,
  entregables,
  estudiantesExcel,
  entregasAlumnos = [],
  onAddDeliverable,
  onUpdateGrade,
  onResolveAppeal,
}) => {
  const TEACHER_COURSE_IDS = [44999, 45002, 47552, 47047, 44988, 41010];
  const [onlyAutomated, setOnlyAutomated] = useState<boolean>(false);
  const [automatedCourseIds, setAutomatedCourseIds] = useState<number[]>([44999, 45002, 47552, 47047, 44988]);
  const [openedCourseId, setOpenedCourseId] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [customCourses, setCustomCourses] = useState<CanvasCourse[]>([]);
  const [savedOrderIds, setSavedOrderIds] = useState<number[]>([]);
  const [sections, setSections] = useState<CourseSection[]>([]);

  // Sincronizar estado local en cliente tras el montaje (previene errores de hidratación SSR)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(COURSES_ORDER_STORAGE_KEY);
      if (raw) {
        setSavedOrderIds(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
    setSections(getSavedSections());
  }, []);

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
    if (courseId === 41010) {
      setNotification("Curso Mock (PROGRAMACIÓN - Semestre 1): Demostración visual sin workspace activo para evaluar diferencia de dificultad.");
      setTimeout(() => setNotification(null), 3500);
      return;
    }
    if (!automatedCourseIds.includes(courseId)) {
      setAutomatedCourseIds((prev) => [...prev, courseId]);
      setNotification("Curso vinculado con éxito al Agente Institucional CREA UDP.");
      setTimeout(() => setNotification(null), 3500);
    }
  };

  // Extraer los cursos: TICs II (3 secciones), Gestión Organizacional, Arquitecturas Emergentes y Programación (Mock)
  const eligibleCourses = useMemo(() => {
    const list = canvasCourses.filter((course) => {
      return (
        TEACHER_COURSE_IDS.includes(course.id) ||
        (course.code && (
          course.code.includes("CIT3203") ||
          course.code.includes("CIT2206") ||
          course.code.includes("CIT3100") ||
          course.code.includes("CIT3000")
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
      { id: 41210, name: "ARQUITECTURA DE SOFTWARE (Curso Sandbox / Testing)", code: "CIT3000_CA02", term: "2026-01 Semestre Otoño", students_count: 5, is_automated: true },
    ];

    fallbackTeacherCourses.forEach((fb) => {
      if (!existingIds.has(fb.id)) {
        list.push(fb);
      }
    });

    customCourses.forEach((cc) => {
      if (!list.some((c) => c.id === cc.id)) {
        list.unshift(cc);
      }
    });

    // Aplicar orden personalizado arrastrado por el usuario
    if (savedOrderIds && savedOrderIds.length > 0) {
      return [...list].sort((a, b) => {
        const idxA = savedOrderIds.indexOf(a.id);
        const idxB = savedOrderIds.indexOf(b.id);
        if (idxA === -1 && idxB === -1) return 0;
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
      });
    }

    return list;
  }, [canvasCourses, customCourses, savedOrderIds]);

  const handleReorderCourses = (reordered: CanvasCourse[]) => {
    const newOrderIds = reordered.map((c) => c.id);
    setSavedOrderIds(newOrderIds);
    try {
      localStorage.setItem(COURSES_ORDER_STORAGE_KEY, JSON.stringify(newOrderIds));
    } catch (e) {
      console.error("Error saving courses order", e);
    }
    setNotification("Orden de asignaturas actualizado y guardado.");
    setTimeout(() => setNotification(null), 2500);
  };

  const handleResetOrder = () => {
    setSavedOrderIds([]);
    try {
      localStorage.removeItem(COURSES_ORDER_STORAGE_KEY);
    } catch (e) {
      console.error("Error clearing courses order", e);
    }
    setNotification("Disposición original predeterminada restaurada.");
    setTimeout(() => setNotification(null), 2500);
  };

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
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#E3F2FD] text-[#0277BD] text-[11px] font-bold rounded uppercase tracking-wider">
              Facultad de Ingeniería
            </span>
            <span className="text-xs text-[#6B7780]">
              Ingeniería Civil en Informática y Telecomunicaciones
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#2D3B45] mt-1">
            Gestión de Cursos y Automatización IA
          </h1>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Asignaturas del Tablero oficial de Canvas vinculables con agentes de cátedra.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CanvasButton
            variant="outline"
            size="sm"
            icon={<FileSpreadsheet size={15} className="text-emerald-700" />}
            onClick={() => setShowImportModal(true)}
          >
            Importar Curso desde Excel UDP
          </CanvasButton>
        </div>
      </div>

      {/* Métrica Analítica: Evaluar desempeño en cursos avanzados vs primerizos */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card space-y-2.5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-[#008EE2] rounded border border-blue-200">
              <TrendingUp size={16} />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#2D3B45] uppercase tracking-wide">
                Evaluar Desempeño: Cursos Primerizos vs. Cursos Avanzados
              </h2>
              <p className="text-[11px] text-[#6B7780]">
                Métrica comparativa de madurez académica y andamiaje pedagógico según el semestre de la carrera.
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono font-bold">
            Curva Didáctica UDP
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-[4px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Cursos Primerizos (Ej: Programación — Semestre 1)
              </span>
              <span className="text-[10px] font-bold bg-white text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">Dificultad Básica</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Mayor necesidad de andamiaje y nivelación inicial. Alto volumen de dudas sobre sintaxis y lógica (14.2 consultas/alumno al agente). La clave pedagógica está en la empatía y contención temprana de la frustración.
            </p>
          </div>

          <div className="p-3 bg-red-50/60 border border-red-200 rounded-[4px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-950 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C8102E]" />
                Cursos Avanzados (Ej: Proyecto en TICs II — Semestre 7)
              </span>
              <span className="text-[10px] font-bold bg-white text-red-800 px-1.5 py-0.5 rounded border border-red-200">Dificultad Alta / Capstone</span>
            </div>
            <p className="text-[11px] text-red-900 leading-relaxed">
              Estudiantes con alta autonomía técnica. Las consultas se enfocan en gestión de riesgos, estimaciones de WBS y criterios de rúbrica (6.8 consultas/alumno). Foco en perfil de egreso y acreditación de RAPs.
            </p>
          </div>
        </div>
      </div>

      {/* Filtro, Reset de Orden y Barra de Estado */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-canvas-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
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

          {savedOrderIds.length > 0 && (
            <button
              type="button"
              onClick={handleResetOrder}
              className="text-[11px] text-[#008EE2] hover:underline font-medium cursor-pointer"
              title="Volver a la disposición original por defecto"
            >
              Restablecer orden
            </button>
          )}
        </div>

        <span className="text-xs text-[#6B7780]">
          Haz clic en cualquier curso para acceder a su panel o arrástralo para ordenar
        </span>
      </div>

      {/* Alerta / Notificación de sincronización */}
      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[4px] flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabla Unificada de Cursos con Soporte Drag & Drop */}
      <TeacherCoursesTable
        courses={displayedCourses}
        sections={sections}
        automatedCourseIds={automatedCourseIds}
        onOpenCourse={(id) => setOpenedCourseId(id)}
        onAutomateCourse={handleAutomateCourse}
        onReorderCourses={handleReorderCourses}
        onMockNotice={() => {
          setNotification("Curso Mock (PROGRAMACIÓN - Semestre 1): Demostración visual sin workspace activo para evaluar diferencia de dificultad.");
          setTimeout(() => setNotification(null), 3500);
        }}
      />

      <ImportCourseExcelModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onCourseCreated={(newCourse) => {
          setCustomCourses((prev) => [newCourse, ...prev]);
          setAutomatedCourseIds((prev) => [...prev, newCourse.id]);
          setNotification(`Curso ${newCourse.name} (${newCourse.code}) importado exitosamente con su agente asignado.`);
          setTimeout(() => setNotification(null), 4000);
        }}
      />
    </div>
  );
};
