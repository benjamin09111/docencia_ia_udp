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
  Home,
  Share2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Check,
  Search,
  X,
  Megaphone,
  FileText,
  Send,
  AlertTriangle,
  Edit3,
  Lock,
} from "lucide-react";
import { CourseHomePageView } from "./CourseHomePageView";
import { CourseEvaluacionesView } from "./evaluaciones/CourseEvaluacionesView";
import { CourseSolemnesView } from "./CourseSolemnesView";
import { CourseCronogramaView } from "./CourseCronogramaView";
import { CourseAnnouncementsView } from "./CourseAnnouncementsView";
import { exportAnonymousGradesToExcel } from "@/services/excelExportService";

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
  const [activeTab, setActiveTab] = useState<
    | "inicio"
    | "evaluaciones"
    | "actividades"
    | "cronograma"
    | "anuncios"
    | "asistencia"
    | "excel"
    | "metricas"
    | "entregables"
    | "solemnes"
  >("inicio");
  const [excelSuccess, setExcelSuccess] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedAnnouncement, setCopiedAnnouncement] = useState(false);
  const [excelRutFilter, setExcelRutFilter] = useState("");

  // Control de Modo Edición Oficial y Envío a la Escuela
  const [isEditingExcel, setIsEditingExcel] = useState(false);
  const [showSendSchoolModal, setShowSendSchoolModal] = useState(false);
  const [schoolSendSuccess, setSchoolSendSuccess] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

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

  const publicShareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/calificaciones/${encodeURIComponent(course.code)}`
    : `/calificaciones/${encodeURIComponent(course.code)}`;

  const handleDownloadExcel = () => {
    exportAnonymousGradesToExcel({
      cursoCodigo: course.code,
      cursoNombre: course.name,
      seccionNombre: section?.nombre,
      estudiantesExcel,
    });
    setExcelSuccess(true);
    setTimeout(() => setExcelSuccess(false), 3500);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(publicShareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyAnnouncement = () => {
    if (typeof window !== "undefined") {
      const msg = `Estimados y estimadas estudiantes:\n\nYa se encuentra disponible la nómina oficial anonimizada de calificaciones del curso ${course.name} (${course.code}).\n\nPueden revisar sus notas ponderadas, décimas acumuladas y estado de aprobación ingresando con su RUT en el siguiente enlace oficial:\n${publicShareUrl}\n\nConforme a la normativa institucional y Ley N° 19.628, los nombres y apellidos se encuentran estrictamente resguardados.\n\nSaludos cordiales,\nEquipo Docente UDP`;
      navigator.clipboard.writeText(msg);
      setCopiedAnnouncement(true);
      setTimeout(() => setCopiedAnnouncement(false), 2500);
    }
  };

  const handleSaveExcelEdits = () => {
    setIsEditingExcel(false);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  const handleConfirmSendToSchool = () => {
    setShowSendSchoolModal(false);
    setSchoolSendSuccess(true);
    setTimeout(() => setSchoolSendSuccess(false), 6000);
  };

  const filteredExcelStudents = useMemo(() => {
    if (!excelRutFilter.trim()) return estudiantesExcel;
    const cleanSearch = excelRutFilter.replace(/[\.\-\s]/g, "").toLowerCase();
    return estudiantesExcel.filter((s) =>
      s.rut.replace(/[\.\-\s]/g, "").toLowerCase().includes(cleanSearch)
    );
  }, [estudiantesExcel, excelRutFilter]);

  return (
    <div className="space-y-5">
      {/* Header del Curso Automatizado */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card">
        {/* Breadcrumb Institucional Canvas */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#6B7780] pb-2.5 border-b border-gray-100 mb-3 flex-wrap">
          <span className="hover:underline cursor-pointer hover:text-[#008EE2]" onClick={onBack}>
            Universidad Diego Portales
          </span>
          <span className="text-gray-400">&gt;</span>
          <span className="hover:underline cursor-pointer hover:text-[#008EE2]" onClick={onBack}>
            Facultad de Ingeniería
          </span>
          <span className="text-gray-400">&gt;</span>
          <span className="hover:underline cursor-pointer hover:text-[#008EE2]" onClick={onBack}>
            Ingeniería Civil en Informática y Telecomunicaciones
          </span>
          <span className="text-gray-400">&gt;</span>
          <span className="font-bold text-[#2D3B45]">{course.code}</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Botón Volver tipo icono compacto y profesional */}
            <button
              type="button"
              onClick={onBack}
              title="Volver a lista de cursos"
              aria-label="Volver a Cursos"
              className="w-8 h-8 rounded-[4px] border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-100 text-[#2D3B45] hover:text-[#008EE2] transition-colors flex items-center justify-center shrink-0 shadow-2xs"
            >
              <ArrowLeft size={16} />
            </button>

            {/* Código, Horario al lado del título en tonos neutros */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono font-bold text-[#008EE2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {course.code}
                </span>
                <span className="text-[#55636E] font-medium flex items-center gap-1.5">
                  <Clock size={12} className="text-[#6B7780]" />
                  <span>Ayudantía: {scheduleInfo.ayudantia}</span>
                  <span className="text-gray-300">•</span>
                  <span className="font-mono text-[#55636E]">{scheduleInfo.ayudantiaSala}</span>
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-[#2D3B45] mt-0.5 truncate">
                {course.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <span className="text-[11px] font-medium text-[#55636E] bg-gray-100 px-2.5 py-1 rounded border border-gray-200 flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#008EE2]" />
              <span>Agente Activo: {course.code.includes("CIT2206") ? "CIT2206" : course.code.includes("CIT3100") ? "CIT3100" : "CIT3621"}</span>
            </span>
          </div>
        </div>

        {/* Tabs del Workspace Docente */}
        <div className="flex gap-4 border-b border-gray-200 mt-5 pt-1 text-xs font-medium overflow-x-auto no-scrollbar flex-nowrap">
          <button
            onClick={() => setActiveTab("inicio")}
            className={`pb-2.5 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "inicio"
                ? "border-[#008EE2] text-[#008EE2] font-bold"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
            }`}
          >
            <Home size={14} />
            <span>Página de inicio</span>
          </button>

          <button
            onClick={() => setActiveTab("evaluaciones")}
            className={`pb-2.5 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "evaluaciones" || activeTab === "solemnes"
                ? "border-[#008EE2] text-[#008EE2] font-bold"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
            }`}
          >
            <FileText size={14} />
            <span>Evaluaciones</span>
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
            <span>Actividades extra</span>
          </button>

          <button
            onClick={() => setActiveTab("cronograma")}
            className={`pb-2.5 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "cronograma"
                ? "border-[#008EE2] text-[#008EE2] font-bold"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
            }`}
          >
            <Calendar size={14} />
            <span>Cronograma</span>
          </button>

          <button
            onClick={() => setActiveTab("anuncios")}
            className={`pb-2.5 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "anuncios"
                ? "border-[#008EE2] text-[#008EE2] font-bold"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
            }`}
          >
            <Megaphone size={14} />
            <span>Anuncios</span>
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
            <span>Métricas e Informe</span>
          </button>
        </div>
      </div>

      {/* TAB 0: Página de Inicio (Portada + Entregables Oficiales con Índice Interno) */}
      {(activeTab === "inicio" || activeTab === "entregables") && (
        <CourseHomePageView
          courseId={course.id}
          courseCode={course.code}
          courseName={course.name}
        />
      )}

      {/* TAB 1: Evaluaciones Estandarizadas UDP (Pruebas, Solemnes, Controles, etc.) */}
      {(activeTab === "evaluaciones" || activeTab === "solemnes") && (
        <CourseEvaluacionesView
          courseCode={course.code}
          courseName={course.name}
        />
      )}

      {/* TAB 2: Actividades Extra Formativas (Décimas, Ayudantías) */}
      {activeTab === "actividades" && (
        <CourseActivitiesView
          courseId={course.id}
          entregables={entregables}
          entregasAlumnos={entregasAlumnos}
          onAddDeliverable={onAddDeliverable}
          onResolveAppeal={onResolveAppeal}
        />
      )}

      {/* TAB 4: Cronograma Oficial (Clon exacto cronograma.pdf editable/imprimible) */}
      {activeTab === "cronograma" && (
        <CourseCronogramaView courseCode={course.code} courseName={course.name} />
      )}

      {/* TAB 5: Anuncios Automatizados (Plantillas rápidas 1 clic a Canvas) */}
      {activeTab === "anuncios" && (
        <CourseAnnouncementsView courseCode={course.code} courseName={course.name} />
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

      {/* TAB 4: Excel (Planilla Oficial Anonimizada: solo RUTs) */}
      {activeTab === "excel" && (
        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
            <div>
              <h3 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-emerald-700" />
                Planilla Oficial del Curso (Excel Final UDP)
              </h3>
              <p className="text-xs text-[#6B7780]">
                Publicación anonimizada: solo se exhiben RUTs para resguardar la privacidad (Ley N° 19.628). Asistencia mínima: 75%.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Botón Mock: Enviar Excel a la Escuela */}
              <CanvasButton
                variant="primary-udp"
                size="sm"
                onClick={() => setShowSendSchoolModal(true)}
                icon={<Send size={14} />}
                title="Enviar la planilla oficial consolidada a la Dirección de Escuela"
              >
                Enviar Excel a la Escuela
              </CanvasButton>

              {/* Botón para alternar Modo Edición */}
              {!isEditingExcel ? (
                <CanvasButton
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingExcel(true)}
                  icon={<Edit3 size={14} />}
                  title="Habilitar edición de calificaciones oficiales"
                >
                  Modo Edición
                </CanvasButton>
              ) : (
                <>
                  <CanvasButton
                    variant="primary-canvas"
                    size="sm"
                    onClick={handleSaveExcelEdits}
                    icon={<Check size={14} />}
                    title="Guardar cambios en la planilla oficial"
                  >
                    Guardar
                  </CanvasButton>
                  <CanvasButton
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingExcel(false)}
                  >
                    Cancelar
                  </CanvasButton>
                </>
              )}

              <CanvasButton
                variant="outline"
                size="sm"
                onClick={() => setShowShareModal(true)}
                icon={<Share2 size={14} />}
                title="Compartir enlace público con los alumnos del curso"
              >
                Compartir con Alumnos
              </CanvasButton>

              <CanvasButton
                variant="outline"
                size="sm"
                onClick={handleDownloadExcel}
                icon={<Download size={14} />}
                title="Descargar planilla de calificaciones anonimizada (.xlsx)"
                className="text-emerald-800 border-emerald-300 hover:bg-emerald-50"
              >
                Descargar Excel
              </CanvasButton>
            </div>
          </div>

          {/* Banner de Restricción Docente en Modo Edición */}
          {isEditingExcel && (
            <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-[4px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <AlertTriangle size={18} className="text-amber-700 shrink-0" />
                <div>
                  <span className="font-bold block text-amber-900">
                    Control de Edición Oficial — Restricción Docente UDP
                  </span>
                  <span className="text-[11px] text-amber-800 block">
                    Solo puede editar el profesor a cargo (no el ayudante) ya que es lo que se entrega oficialmente a la escuela.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditingExcel(false)}
                  className="px-2.5 py-1 text-xs border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveExcelEdits}
                  className="px-3 py-1 text-xs font-semibold rounded bg-[#008EE2] text-white hover:bg-[#0077BE] flex items-center gap-1 shadow-xs"
                >
                  <Check size={13} />
                  Guardar Calificaciones
                </button>
              </div>
            </div>
          )}

          {/* Notificación de Éxito al Guardar Edición */}
          {saveSuccessToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Calificaciones guardadas exitosamente y recalculadas para la entrega oficial.</span>
            </div>
          )}

          {/* Notificación de Envío a la Escuela */}
          {schoolSendSuccess && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs rounded flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#C8102E] shrink-0" />
                <span>
                  <strong>Acta Despachada:</strong> Planilla oficial enviada con éxito a la Escuela de Informática y Telecomunicaciones (Acta N° ACTA-2026-CIT3000-02). Comprobante emitido con firma digital docente.
                </span>
              </div>
            </div>
          )}

          {excelSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Planilla descargada con fórmulas oficiales UDP anonimizada por RUT (sin nombres).</span>
            </div>
          )}

          {/* Barra de Filtro por RUT */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={excelRutFilter}
                onChange={(e) => setExcelRutFilter(e.target.value)}
                placeholder="Filtrar por RUT..."
                className="w-full pl-8 pr-7 py-1.5 border border-gray-300 rounded-[4px] text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
              />
              {excelRutFilter && (
                <button
                  type="button"
                  onClick={() => setExcelRutFilter("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="text-[11px] text-[#6B7780] flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>
                Mostrando {filteredExcelStudents.length} de {estudiantesExcel.length} estudiantes • {isEditingExcel ? "Modo Edición Activo" : "Solo Lectura Oficial"}
              </span>
            </div>
          </div>

          <div className={`overflow-x-auto border rounded-[4px] transition-colors ${isEditingExcel ? "border-blue-400 ring-1 ring-blue-300" : "border-gray-300"}`}>
            <table className="w-full text-left text-xs border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-100 text-gray-700 font-bold border-b border-gray-300 text-[11px] uppercase">
                  <th className="p-2.5 border-r border-gray-300 w-36">RUT</th>
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
                {filteredExcelStudents.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-6 text-center text-gray-500 text-xs">
                      No se encontraron alumnos con el RUT especificado.
                    </td>
                  </tr>
                ) : (
                  filteredExcelStudents.map((row) => (
                    <tr key={row.canvas_id} className="border-b border-gray-200 hover:bg-gray-50/80">
                      {/* Solo RUT, sin nombres */}
                      <td className="p-2.5 font-mono font-bold text-[#2D3B45] border-r border-gray-200">
                        {row.rut}
                      </td>
                      <td className="p-1.5 text-center border-r border-gray-200 bg-blue-50/30">
                        {isEditingExcel ? (
                          <input
                            type="number"
                            step="0.1"
                            min="1.0"
                            max="7.0"
                            value={row.solemne_1}
                            onChange={(e) => onUpdateGrade(row.canvas_id, "solemne_1", parseFloat(e.target.value) || 1.0)}
                            className="w-14 text-center p-1 border border-blue-400 bg-white rounded font-bold text-xs focus:ring-1 focus:ring-[#008EE2]"
                          />
                        ) : (
                          <span className="font-semibold text-gray-800">{row.solemne_1.toFixed(1)}</span>
                        )}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Métricas e Informe (Generales, por Alumno y Dossier Final) */}
      {activeTab === "metricas" && <CourseMetricsView course={course} />}

      {/* Modal Mock: Enviar Excel a la Escuela */}
      {showSendSchoolModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-2xl max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-gray-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#2D3B45]">
                    Enviar Planilla Oficial a Dirección de Escuela
                  </h3>
                  <span className="text-[10px] bg-red-100 text-red-800 font-mono font-bold px-1.5 py-0.5 rounded border border-red-200">
                    Cierre Oficial
                  </span>
                </div>
                <p className="text-xs text-[#6B7780] mt-0.5">
                  Escuela de Informática y Telecomunicaciones • Envío de actas finales consolidadas
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSendSchoolModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
              >
                <X size={18} />
              </button>
            </div>

            {/* Resumen Académico del Envío */}
            <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs space-y-2">
              <div className="flex justify-between text-gray-700">
                <span className="font-semibold">Asignatura:</span>
                <span className="font-mono text-gray-900">{course.code} — {course.name}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-semibold">Profesor Titular a Cargo:</span>
                <span className="font-medium text-gray-900">Jorge Esteban Cruz León</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-semibold">Nómina Estudiantes:</span>
                <span>{estudiantesExcel.length} alumnos registrados (solo RUT)</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-semibold">Promedio General del Curso:</span>
                <span className="font-bold text-[#008EE2]">
                  {(estudiantesExcel.reduce((acc, r) => acc + r.nota_final, 0) / (estudiantesExcel.length || 1)).toFixed(1)}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900 space-y-1">
              <span className="font-bold block text-blue-950">
                📋 Certificación y Cierre Académico:
              </span>
              <span className="text-[11px] block leading-relaxed text-blue-900">
                Al confirmar el envío, la planilla final anonimizada por RUT con el 100% de las notas y cálculo de asistencia quedará radicada en la Secretaría de Estudios de la Escuela de Informática. Se emitirá el comprobante oficial de recepción con folio electrónico.
              </span>
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer pt-1">
              <input type="checkbox" defaultChecked className="rounded text-[#C8102E] focus:ring-[#C8102E]" />
              <span className="text-[11px]">
                Declaro que he revisado las calificaciones y asistencia conforme al reglamento académico UDP.
              </span>
            </label>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <CanvasButton
                variant="outline"
                size="sm"
                onClick={() => setShowSendSchoolModal(false)}
              >
                Cancelar
              </CanvasButton>
              <CanvasButton
                variant="primary-udp"
                size="sm"
                icon={<Send size={14} />}
                onClick={handleConfirmSendToSchool}
              >
                Confirmar Envío a la Escuela
              </CanvasButton>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Compartir Planilla con Alumnos */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-2xl max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-gray-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#2D3B45]">
                    Compartir Planilla Oficial con Estudiantes
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                    Solo RUTs
                  </span>
                </div>
                <p className="text-xs text-[#6B7780] mt-0.5">
                  Enlace público seguro para que los alumnos revisen sus notas y estado de aprobación.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
              >
                <X size={18} />
              </button>
            </div>

            {/* Enlace Directo */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                Enlace Público del Curso
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={publicShareUrl}
                  className="flex-1 px-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded font-mono text-gray-700 focus:outline-none select-all"
                />
                <CanvasButton
                  variant="primary-canvas"
                  size="sm"
                  icon={copiedLink ? <Check size={14} /> : <Copy size={14} />}
                  onClick={handleCopyLink}
                >
                  {copiedLink ? "¡Copiado!" : "Copiar"}
                </CanvasButton>
                <a
                  href={publicShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                  title="Abrir vista pública en nueva pestaña"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Plantilla de Anuncio para Canvas */}
            <div className="space-y-1.5 bg-gray-50 p-3 rounded border border-gray-200 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700 text-[11px] uppercase tracking-wider">
                  Plantilla para Anuncio en Canvas
                </span>
                <button
                  type="button"
                  onClick={handleCopyAnnouncement}
                  className="text-[11px] text-[#008EE2] hover:underline flex items-center gap-1 font-semibold"
                >
                  {copiedAnnouncement ? (
                    <>
                      <Check size={12} className="text-emerald-600" />
                      <span className="text-emerald-700">¡Texto Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-gray-600 font-mono leading-relaxed bg-white p-2 rounded border border-gray-200 whitespace-pre-line select-all">
                {`Estimados/as estudiantes:
Ya se encuentra disponible la nómina oficial anonimizada de calificaciones del curso ${course.name} (${course.code}).
Pueden revisar sus notas ponderadas, décimas acumuladas y estado de aprobación ingresando con su RUT en el siguiente enlace oficial:
${publicShareUrl}`}
              </p>
            </div>

            {/* Aviso de Privacidad y Cumplimiento Normativo */}
            <div className="bg-emerald-50 border border-emerald-200 rounded p-3 flex items-start gap-2.5 text-xs text-emerald-900">
              <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-800">
                  Garantía de Privacidad UDP (Ley N° 19.628)
                </span>
                <span className="text-[11px] text-emerald-700 block mt-0.5">
                  La vista compartida solo muestra RUTs y notas ponderadas. En ningún caso se exponen nombres, apellidos ni correos electrónicos de los estudiantes.
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <CanvasButton
                variant="outline"
                size="sm"
                onClick={() => setShowShareModal(false)}
              >
                Cerrar
              </CanvasButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

