"use client";

import React, { useState, useMemo, useEffect } from "react";
import { CanvasCourse, CourseDeliverable, StudentExcelRow, StudentSubmission } from "@/types";
import { CourseSection } from "@/types/attendance";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CourseMetricsView } from "./CourseMetricsView";
import { CourseDeliverablesView } from "./CourseDeliverablesView";
import { CourseActivitiesView } from "./CourseActivitiesView";
import { TeacherAttendanceWorkspace } from "./TeacherAttendanceWorkspace";
import { getSectionByCourseCode, formatSectionSchedule, getSavedSections } from "@/services/attendanceStore";
import { fetchSectionsFromSupabase, isSupabaseConfigured } from "@/services/attendanceDbService";
import {
  FileSpreadsheet,
  Sparkles,
  Plus,
  CheckCircle2,
  Download,
  Layers,
  ArrowLeft,
  BarChart3,
  CalendarCheck,
  Clock,
  Calendar,
  Building2,
} from "lucide-react";

interface AutomatedCourseWorkspaceProps {
  course: CanvasCourse;
  entregables: CourseDeliverable[];
  estudiantesExcel: StudentExcelRow[];
  entregasAlumnos?: StudentSubmission[];
  onBack: () => void;
  onAddDeliverable: (d: CourseDeliverable) => void;
  onUpdateGrade: (canvasId: number, field: keyof StudentExcelRow, value: number) => void;
  onResolveAppeal?: (submissionId: string, action: "aceptar" | "ratificar") => void;
}

export const AutomatedCourseWorkspace: React.FC<AutomatedCourseWorkspaceProps> = ({
  course,
  entregables,
  estudiantesExcel,
  entregasAlumnos = [],
  onBack,
  onAddDeliverable,
  onUpdateGrade,
  onResolveAppeal,
}) => {
  const [activeTab, setActiveTab] = useState<"entregables" | "actividades" | "asistencia" | "excel" | "metricas">("entregables");
  const [excelSuccess, setExcelSuccess] = useState(false);

  const [sections, setSections] = useState<CourseSection[]>(() => getSavedSections());

  // Escuchar cambios de horarios y secciones desde la pestaña de Admin
  useEffect(() => {
    const handleSync = () => {
      setSections(getSavedSections());
    };
    window.addEventListener("udp_sections_updated", handleSync);
    return () => window.removeEventListener("udp_sections_updated", handleSync);
  }, []);

  // También sincronizar desde Supabase al entrar al curso
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchSectionsFromSupabase().then((cloudSections) => {
        if (cloudSections && cloudSections.length > 0) {
          setSections(cloudSections);
        }
      });
    }
  }, []);

  const section = useMemo(() => getSectionByCourseCode(course.code, sections), [course.code, sections]);
  const scheduleInfo = useMemo(() => formatSectionSchedule(section), [section]);

  const handleDownloadExcel = () => {
    setExcelSuccess(true);
    setTimeout(() => setExcelSuccess(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Header del Curso Automatizado */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <CanvasButton variant="outline" size="sm" onClick={onBack} icon={<ArrowLeft size={14} />}>
              Volver a Cursos
            </CanvasButton>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-gray-500">{course.code}</span>
                <CanvasBadge variant="success">Agente Activo: CIT3621</CanvasBadge>
              </div>
              <h1 className="text-lg font-bold text-[#2D3B45] mt-0.5">{course.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CanvasBadge variant="udp">Pauta Oficial 5 x 20%</CanvasBadge>
          </div>
        </div>

        {/* Horarios Oficiales del Curso (Ayudantía activa) */}
        <div className="flex flex-wrap items-center gap-2.5 mt-3.5 pt-3 border-t border-gray-100 text-xs">
          {/* Cátedra oculto temporalmente */}
          {false && (
            <div className="flex items-center gap-1.5 bg-blue-50/80 border border-blue-200/70 rounded-[4px] px-2.5 py-1 text-blue-950 font-medium">
              <Calendar size={13} className="text-[#008EE2]" />
              <span>
                <strong>Cátedra:</strong> {scheduleInfo.catedra}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-blue-800 text-[11px] font-mono flex items-center gap-0.5">
                <Building2 size={11} /> {scheduleInfo.catedraSala}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 bg-purple-50/80 border border-purple-200/70 rounded-[4px] px-2.5 py-1 text-purple-950 font-medium">
            <Calendar size={13} className="text-purple-600" />
            <span>
              <strong>Ayudantía:</strong> {scheduleInfo.ayudantia}
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-purple-800 text-[11px] font-mono flex items-center gap-0.5">
              <Building2 size={11} /> {scheduleInfo.ayudantiaSala}
            </span>
          </div>
        </div>

        {/* Las 4 Tabs solicitadas */}
        <div className="flex gap-4 border-b border-gray-200 mt-5 pt-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab("entregables")}
            className={`pb-2.5 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "entregables"
                ? "border-[#008EE2] text-[#008EE2] font-bold"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
            }`}
          >
            <Layers size={14} />
            <span>Entregables oficiales</span>
          </button>

          <button
            onClick={() => setActiveTab("actividades")}
            className={`pb-2.5 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "actividades"
                ? "border-[#008EE2] text-[#008EE2] font-bold"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
            }`}
          >
            <Sparkles size={14} />
            <span>Actividades</span>
          </button>

          <button
            onClick={() => setActiveTab("asistencia")}
            className={`pb-2.5 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "asistencia"
                ? "border-[#008EE2] text-[#008EE2] font-bold"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
            }`}
          >
            <CalendarCheck size={14} />
            <span>Asistencia</span>
          </button>

          <button
            onClick={() => setActiveTab("excel")}
            className={`pb-2.5 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "excel"
                ? "border-[#008EE2] text-[#008EE2] font-bold"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
            }`}
          >
            <FileSpreadsheet size={14} />
            <span>Excel final</span>
          </button>

          <button
            onClick={() => setActiveTab("metricas")}
            className={`pb-2.5 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "metricas"
                ? "border-[#008EE2] text-[#008EE2] font-bold"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
            }`}
          >
            <BarChart3 size={14} />
            <span>Métricas</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Entregables oficiales sincronizados con Canvas Tareas */}
      {activeTab === "entregables" && (
        <CourseDeliverablesView courseId={course.id} courseCode={course.code} />
      )}

      {/* TAB 2: Actividades Dinámicas (Diseñadas por Sub-Agentes) */}
      {activeTab === "actividades" && (
        <CourseActivitiesView
          courseId={course.id}
          entregables={entregables}
          entregasAlumnos={entregasAlumnos}
          onAddDeliverable={onAddDeliverable}
          onResolveAppeal={onResolveAppeal}
        />
      )}

      {/* TAB 3: Control de Asistencia y Planilla de la Sección */}
      {activeTab === "asistencia" && (
        <TeacherAttendanceWorkspace
          courseCode={course.code}
          courseName={course.name}
          canvasCourseId={course.id}
          estudiantesExcel={estudiantesExcel}
          onUpdateGrade={onUpdateGrade}
        />
      )}

      {/* TAB 4: Excel (Privacidad: solo primer nombre) */}
      {activeTab === "excel" && (
        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
            <div>
              <h3 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-emerald-700" />
                Planilla Oficial del Curso (Excel UDP en Vivo)
              </h3>
              <p className="text-xs text-[#6B7780]">
                Privacidad protegida: solo primer nombre para demostración. 75% de asistencia mínima obligatoria.
              </p>
            </div>

            <CanvasButton
              variant="outline"
              size="sm"
              onClick={handleDownloadExcel}
              icon={<Download size={14} />}
              className="text-emerald-800 border-emerald-300 hover:bg-emerald-50"
            >
              Descargar .XLSX Oficial UDP
            </CanvasButton>
          </div>

          {excelSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Planilla descargada con fórmulas oficiales de la Escuela de Informática.</span>
            </div>
          )}

          <div className="overflow-x-auto border border-gray-300 rounded-[4px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 font-bold border-b border-gray-300 text-[11px] uppercase">
                  <th className="p-2.5 border-r border-gray-300">Estudiante</th>
                  <th className="p-2.5 border-r border-gray-300 text-center bg-blue-50/70">Informe Ini (20%)</th>
                  <th className="p-2.5 border-r border-gray-300 text-center bg-purple-50/70">+Décimas Ayud.</th>
                  <th className="p-2.5 border-r border-gray-300 text-center">Solemne (20%)</th>
                  <th className="p-2.5 border-r border-gray-300 text-center">Avance 1 (20%)</th>
                  <th className="p-2.5 border-r border-gray-300 text-center">Avance 2 (20%)</th>
                  <th className="p-2.5 border-r border-gray-300 text-center">Final (20%)</th>
                  <th className="p-2.5 border-r border-gray-300 text-center">Asist %</th>
                  <th className="p-2.5 border-r border-gray-300 text-center font-extrabold bg-yellow-100/60">Nota Final</th>
                  <th className="p-2.5 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {estudiantesExcel.map((row) => {
                  const primerNombre = row.nombres.split(" ")[0];
                  return (
                    <tr key={row.canvas_id} className="border-b border-gray-200 hover:bg-gray-50/80">
                      <td className="p-2.5 font-bold text-[#2D3B45] border-r border-gray-200">{primerNombre}</td>
                      <td className="p-1.5 text-center border-r border-gray-200 bg-blue-50/30">
                        <input
                          type="number"
                          step="0.1"
                          min="1.0"
                          max="7.0"
                          value={row.solemne_1}
                          onChange={(e) => onUpdateGrade(row.canvas_id, "solemne_1", parseFloat(e.target.value) || 1.0)}
                          className="w-14 text-center p-1 border border-gray-300 rounded font-semibold text-xs"
                        />
                      </td>
                      <td className="p-1.5 text-center border-r border-gray-200 bg-purple-50/30">
                        <span className="font-bold text-purple-800 px-2 py-0.5 bg-purple-100 rounded text-[11px]">
                          +{row.decimas_act1.toFixed(1)}
                        </span>
                      </td>
                      <td className="p-2.5 text-center border-r border-gray-200">{row.solemne_2.toFixed(1)}</td>
                      <td className="p-2.5 text-center border-r border-gray-200">6.0</td>
                      <td className="p-2.5 text-center border-r border-gray-200">5.8</td>
                      <td className="p-2.5 text-center border-r border-gray-200">{row.taller_proyecto.toFixed(1)}</td>
                      <td className="p-2.5 text-center border-r border-gray-200 font-semibold">{row.asistencia_pct}%</td>
                      <td className="p-2.5 text-center font-extrabold text-xs bg-yellow-50 border-r border-gray-200">{row.nota_final.toFixed(1)}</td>
                      <td className="p-2 text-center">
                        <CanvasBadge variant={row.asistencia_pct < 75 ? "danger" : row.nota_final >= 4.0 ? "success" : "danger"}>
                          {row.asistencia_pct < 75 ? "RI" : row.nota_final >= 4.0 ? "Aprobado" : "Reprobado"}
                        </CanvasBadge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Métricas (Generales y por Alumno) */}
      {activeTab === "metricas" && <CourseMetricsView />}
    </div>
  );
};
