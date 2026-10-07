"use client";

import React, { useState, useEffect } from "react";
import { CourseSection } from "@/types/attendance";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { AdminSectionScheduleEditor } from "./AdminSectionScheduleEditor";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  MapPin,
  Bot,
  Brain,
  BookOpen,
  FileText,
  Upload,
  Database,
  BarChart3,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Save,
  Check,
  Send,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  ThumbsUp,
  Award,
} from "lucide-react";

interface AdminCourseDetailViewProps {
  section: CourseSection;
  onBack: () => void;
  onSaveSection?: (updated: CourseSection) => void;
}

export const AdminCourseDetailView: React.FC<AdminCourseDetailViewProps> = ({
  section,
  onBack,
  onSaveSection,
}) => {
  const [activeTab, setActiveTab] = useState<
    "info" | "agents" | "files" | "history" | "feedback"
  >("info");

  const [profesorTitular, setProfesorTitular] = useState(section.profesor || "Prof. Titular UDP");
  const [ayudanteTitular, setAyudanteTitular] = useState(section.ayudante || "Ayudante UDP");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setProfesorTitular(section.profesor || "Prof. Titular UDP");
    setAyudanteTitular(section.ayudante || "Ayudante UDP");
  }, [section]);

  const handleSaveScheduleData = (updatedData: {
    profesor: string;
    ayudante: string;
    horarioAyudantia: any;
    horarioAyudantia2?: any;
  }) => {
    setProfesorTitular(updatedData.profesor);
    setAyudanteTitular(updatedData.ayudante);
    if (onSaveSection) {
      onSaveSection({
        ...section,
        profesor: updatedData.profesor,
        ayudante: updatedData.ayudante,
        horarioAyudantia: updatedData.horarioAyudantia,
        horarioAyudantia2: updatedData.horarioAyudantia2,
      });
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Mock de Archivos subidos
  const [selectedFileId, setSelectedFileId] = useState("f1");
  const mockFiles = [
    {
      id: "f1",
      nombre: "01_programa_oficial.md",
      agente: "Agente Técnico de Sección",
      tipo: "Descriptor Oficial UDP",
      tamano: "7.6 KB",
      actualizado: "Vigencia Marzo 2026",
      contenido: `# Descriptor Oficial: ${section.cursoNombre || "Proyecto en TICs II"} (${section.codigo})
- Créditos: 6 SCT | Semestre: 10 | Régimen: Semestral
- Horario Ayudantía: ${section.horarioAyudantia?.sala || "SALA X"} (${section.horarioAyudantia?.horaInicio || "14:30"} - ${section.horarioAyudantia?.horaFin || "16:00"} hrs)
- Asistencia Mínima: 75% obligatoria (Riesgo RI por inasistencia)
- 6 Resultados de Aprendizaje (RAPs):
  1. Evalúa una problemática TIC real en una organización.
  2. Diseña una solución TIC alineada con el mandante.
  3. Planifica actividades, esfuerzo, costos, riesgos PMBOK y calidad.
  4. Identifica tipos de contrato y modelos de adquisición TIC.
  5. Trabaja colaborativamente en gestión ágil de proyectos.
  6. Comunica efectivamente de manera oral y escrita.`,
    },
    {
      id: "f2",
      nombre: "02_guia_pmbok_agil_udp.md",
      agente: "Agente Teórico Centralizado",
      tipo: "Marco Metodológico",
      tamano: "18.6 KB",
      actualizado: "2026-09-25",
      contenido: `# Bibliografía Oficial Obligatoria — EIT UDP
1. Joseph Phillips, "IT Project Management: On Track from Start to Finish", McGraw-Hill.
2. Project Management Institute (PMI), "PMBOK Guide 7th Edition" (12 principios y 8 dominios).

### Directrices para Evaluaciones:
- Estimación con Story Points y serie Fibonacci en Scrum.
- Modelado de arquitectura de software y coherencia del Definition of Done (DoD).
- Matrices de impacto y probabilidad de riesgos técnicos.`,
    },
    {
      id: "f3",
      nombre: "03_criterios_evaluacion_avances.md",
      agente: "Agente Teórico Centralizado",
      tipo: "Pautas de Evaluación",
      tamano: "8.1 KB",
      actualizado: "2026-09-25",
      contenido: `# Pauta Oficial de Corrección para Reportes de Avance
- Dimensión Técnica (40%): Arquitectura, integración de APIs y testing automatizado.
- Dimensión Gestión (40%): WBS, control de costos y mitigación de riesgos.
- Dimensión Comunicación (20%): Calidad del informe y resolución de observaciones previas.`,
    },
  ];

  const selectedFile = mockFiles.find((f) => f.id === selectedFileId) || mockFiles[0];

  // Mock de Semestres Históricos
  const historicalSemesters = [
    { periodo: "2024-1", inscritos: 28, asistProm: 82.4, aprobados: 25, repitentes: 3, notaProm: 5.4 },
    { periodo: "2024-2", inscritos: 31, asistProm: 85.1, aprobados: 29, repitentes: 2, notaProm: 5.5 },
    { periodo: "2025-1", inscritos: 29, asistProm: 88.0, aprobados: 27, repitentes: 2, notaProm: 5.7 },
    { periodo: "2025-2", inscritos: 32, asistProm: 91.5, aprobados: 31, repitentes: 1, notaProm: 5.8 },
    { periodo: "2026-1", inscritos: 28, asistProm: 94.2, aprobados: 28, repitentes: 0, notaProm: 6.2 },
  ];

  // Mock de Retroalimentación de Alumnos
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const studentFeedbackList = [
    {
      id: "fb_1",
      estudiante: "Alumno Anónimo • Sección 1",
      fecha: "Hace 3 días",
      satisfaccion: 5,
      comentario:
        "Los talleres prácticos de ayudantía han sido clave para entender la rúbrica antes de entregar el informe oficial. La corrección previa con el agente aclara los puntos del PMBOK.",
      tema: "Metodología & Rúbricas",
      tipo: "positivo",
    },
    {
      id: "fb_2",
      estudiante: "Alumno Anónimo • Sección 1",
      fecha: "Hace 1 semana",
      satisfaccion: 4,
      comentario:
        "La matriz de riesgos en el Avance 1 fue el punto más difícil. Sería genial tener un taller dedicado a matrices de impacto antes de la fecha límite.",
      tema: "Planificación & Riesgos",
      tipo: "sugerencia",
    },
    {
      id: "fb_3",
      estudiante: "Alumno Anónimo • Sección 1",
      fecha: "Hace 2 semanas",
      satisfaccion: 5,
      comentario:
        "El sistema de pasar asistencia por el link del día con el código en la pizarra es rapidísimo y no perdemos 15 minutos pasando la lista.",
      tema: "Gestión de Asistencia",
      tipo: "positivo",
    },
  ];

  const currentDayOfWeek = typeof window !== "undefined" ? new Date().getDay() : 2;
  const diasNombres = [
    { val: 1, label: currentDayOfWeek === 1 ? "Lunes (Hoy)" : "Lunes" },
    { val: 2, label: currentDayOfWeek === 2 ? "Martes (Hoy, 06 de oct)" : currentDayOfWeek === 1 ? "Martes (Mañana)" : "Martes" },
    { val: 3, label: currentDayOfWeek === 3 ? "Miércoles (Hoy)" : currentDayOfWeek === 2 ? "Miércoles (Mañana, 07 de oct)" : "Miércoles" },
    { val: 4, label: currentDayOfWeek === 4 ? "Jueves (Hoy)" : currentDayOfWeek === 3 ? "Jueves (Mañana)" : "Jueves" },
    { val: 5, label: currentDayOfWeek === 5 ? "Viernes (Hoy)" : currentDayOfWeek === 4 ? "Viernes (Mañana)" : "Viernes" },
  ];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Header con Botón Volver y Metadatos del Curso */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              title="Volver a Cursos"
              aria-label="Volver a Cursos"
              className="w-8 h-8 rounded-[4px] border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-100 text-[#2D3B45] hover:text-[#008EE2] transition-colors flex items-center justify-center shrink-0 shadow-2xs"
            >
              <ArrowLeft size={16} />
            </button>
            <span className="font-mono text-xs font-bold text-[#008EE2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {section.codigo}
            </span>
            <CanvasBadge variant="udp">Régimen Semestral</CanvasBadge>
            <CanvasBadge variant="success">6 Créditos SCT</CanvasBadge>
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#2D3B45]">
              {section.cursoNombre || "PROYECTO EN TICS II"} — {section.nombre}
            </h1>
            <p className="text-xs text-[#6B7780] mt-0.5">
              Profesor Titular: <strong>{profesorTitular}</strong> • Ayudante: <strong>{ayudanteTitular}</strong>
            </p>
          </div>
        </div>

        {/* Indicador de Estado del Sistema */}
        <div className="text-left md:text-right text-xs text-[#6B7780] space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 font-semibold text-[11px]">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Curso Vinculado al Ecosistema CREA</span>
          </div>
          <span className="block text-[11px] font-mono text-gray-500">
            ID Sección: {section.id} • Campus Toesca
          </span>
        </div>
      </div>

      {/* 2. Barra de Navegación de 5 Tabs Requeridas */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card px-2 pt-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-nowrap border-b border-gray-200 pb-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`px-3.5 py-2.5 font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "info"
                ? "border-[#008EE2] text-[#008EE2] bg-blue-50/50 rounded-t-[3px]"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-50"
            }`}
          >
            <BookOpen size={14} />
            <span>Información General</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("agents")}
            className={`px-3.5 py-2.5 font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "agents"
                ? "border-[#008EE2] text-[#008EE2] bg-blue-50/50 rounded-t-[3px]"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-50"
            }`}
          >
            <Bot size={14} />
            <span>Agentes Asignados</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-[#008EE2] font-mono font-bold">
              2
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("files")}
            className={`px-3.5 py-2.5 font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "files"
                ? "border-[#008EE2] text-[#008EE2] bg-blue-50/50 rounded-t-[3px]"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-50"
            }`}
          >
            <FileText size={14} />
            <span>Archivos Subidos</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 font-mono font-bold">
              {mockFiles.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-3.5 py-2.5 font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "history"
                ? "border-[#008EE2] text-[#008EE2] bg-blue-50/50 rounded-t-[3px]"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-50"
            }`}
          >
            <BarChart3 size={14} />
            <span>Métricas Históricas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("feedback")}
            className={`px-3.5 py-2.5 font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "feedback"
                ? "border-[#008EE2] text-[#008EE2] bg-blue-50/50 rounded-t-[3px]"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-50"
            }`}
          >
            <MessageSquare size={14} />
            <span>Retroalimentación</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-mono font-bold">
              {studentFeedbackList.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: INFORMACIÓN GENERAL & HORARIOS (Con Visor Google Maps al lado)      */}
      {/* ========================================================================= */}
      {activeTab === "info" && (
        <div className="space-y-4">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[4px] flex items-center gap-2 shadow-xs">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>
                Datos y horario oficial guardados con éxito. Sincronizado con la App de Salas de la Escuela.
              </span>
            </div>
          )}

          {/* Banner de Sincronización Oficial */}
          <div className="bg-[#F0F8FF] border border-[#B3E5FC] rounded-[4px] p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#0277BD]">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="shrink-0 text-[#008EE2]" />
              <span>
                <strong>Sincronizado con la App de Salas Facultad Ingeniería y Ciencias:</strong>{" "}
                Los horarios y salas se actualizan automáticamente de acuerdo con la disponibilidad institucional.
              </span>
            </div>
            <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#B3E5FC] shrink-0 font-bold">
              Horario Vigente 2026-02
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Formulario Modular de Horarios (Principal y Secundario) y Docentes */}
            <div className="lg:col-span-7">
              <AdminSectionScheduleEditor
                section={section}
                onSave={handleSaveScheduleData}
                saveSuccess={saveSuccess}
              />
            </div>

            {/* Ubicación Física y Mini Visor Google Maps (5 Cols) */}
            <div className="lg:col-span-5 bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card space-y-4">
              <div className="border-b border-gray-200 pb-3 flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-[#2D3B45] flex items-center gap-1.5">
                    <MapPin size={16} className="text-[#C8102E]" />
                    Ubicación Física Obligatoria
                  </h3>
                  <p className="text-xs text-[#6B7780] mt-0.5">
                    Facultad de Ingeniería y Ciencias UDP (Cerca de Metro Toesca).
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                  GPS Activo
                </span>
              </div>

              <div className="p-3 bg-[#FAFBFB] rounded border border-gray-200 space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <Building2 size={16} className="text-[#C8102E] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#2D3B45] block">
                      Facultad de Ingeniería y Ciencias (UDP)
                    </strong>
                    <span className="text-gray-600 block text-[11px]">
                      Av. Ejército Libertador 441, Santiago Centro
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-0.5 font-mono">
                      Cuadrante: Metro Toesca (Línea 2) & Los Héroes (Línea 1)
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 text-[11px] text-emerald-900 bg-emerald-50/70 p-2 rounded flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
                  <span>
                    <strong>Validación Mandatoria:</strong> Todo alumno debe estar físicamente en la facultad al marcar su asistencia con el enlace del día.
                  </span>
                </div>
              </div>

              {/* Mini Visor Estilizado de Google Maps */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#2D3B45] flex items-center gap-1">
                    <MapPin size={13} className="text-[#008EE2]" />
                    Vista Previa de Google Maps:
                  </span>
                  <a
                    href="https://maps.google.com/?q=Facultad+de+Ingenieria+y+Ciencias+UDP+Ejercito+441"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#008EE2] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Abrir en Google Maps</span>
                    <ExternalLink size={11} />
                  </a>
                </div>

                {/* Google Maps iframe embebido */}
                <div className="w-full h-44 rounded-[4px] overflow-hidden border border-gray-300 relative shadow-inner bg-gray-100">
                  <iframe
                    title="Ubicación Facultad de Ingeniería UDP"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://maps.google.com/maps?q=-33.4501,-70.6622&hl=es&z=16&output=embed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ficha Descriptor Oficial */}
          <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card space-y-3">
            <h3 className="text-xs font-bold text-[#2D3B45] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} className="text-[#008EE2]" />
              Resultados de Aprendizaje Principales (RAPs) del Descriptor
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <strong className="text-[#2D3B45] block">RAP 1 & 2: Análisis & Solución TIC</strong>
                <p className="text-[11px] text-[#6B7780] mt-1">
                  Evalúa problemáticas reales en organizaciones y formula soluciones de software alineadas con el mandante.
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <strong className="text-[#2D3B45] block">RAP 3: Planificación & Riesgos PMBOK</strong>
                <p className="text-[11px] text-[#6B7780] mt-1">
                  Estima esfuerzo, costos, WBS y matrices de contingencia siguiendo los 12 principios de la Guía PMBOK 7ma Edición.
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <strong className="text-[#2D3B45] block">RAP 5 & 6: Trabajo en Equipo & Comunicación</strong>
                <p className="text-[11px] text-[#6B7780] mt-1">
                  Resolución de imprevistos en equipo y comunicación efectiva ante comisiones evaluadoras y contrapartes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AGENTES ASIGNADOS                                                  */}
      {/* ========================================================================= */}
      {activeTab === "agents" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Agente Teórico */}
            <div className="bg-white border border-[#008EE2] rounded-[4px] p-5 shadow-canvas-card space-y-3 ring-1 ring-[#008EE2]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded bg-blue-100 text-blue-800 flex items-center justify-center">
                    <Brain size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2D3B45]">Agente Teórico (1 por Curso)</h3>
                    <span className="text-[11px] text-[#6B7780]">Especialista Conceptual Unificado</span>
                  </div>
                </div>
                <CanvasBadge variant="info">Centralizado</CanvasBadge>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed bg-[#F9FAFB] p-3 rounded border border-gray-200">
                Custodia el corpus teórico y bibliografía obligatoria para todas las secciones: Guía PMBOK 7ma Edición, IT Project Management (Joseph Phillips), estimación de Story Points y matrices de riesgo.
              </p>
              <div className="text-xs space-y-1 text-[#55636E]">
                <strong className="block text-[11px] text-[#2D3B45] uppercase">Parámetros:</strong>
                <div>• Modelo: GPT-4o / Claude 3.5 Sonnet institucional</div>
                <div>• Temperatura: 0.2 (Rigor académico y citas textuales)</div>
                <div>• RAG: Vectorial indexado con 12 principios PMBOK</div>
              </div>
            </div>

            {/* Agente Técnico */}
            <div className="bg-white border border-[#C8102E] rounded-[4px] p-5 shadow-canvas-card space-y-3 ring-1 ring-[#C8102E]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded bg-red-100 text-[#C8102E] flex items-center justify-center">
                    <Bot size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2D3B45]">Agente Técnico de Sección</h3>
                    <span className="text-[11px] text-[#6B7780]">Contexto Particular de la Sección</span>
                  </div>
                </div>
                <CanvasBadge variant="udp">{section.nombre}</CanvasBadge>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed bg-[#F9FAFB] p-3 rounded border border-gray-200">
                Custodia los parámetros de la sección: Profesor {profesorTitular}, horario {section.horarioAyudantia?.horaInicio || "14:30"} - {section.horarioAyudantia?.horaFin || "16:00"}, Sala {section.horarioAyudantia?.sala || "LAB-COMP 2"}, condición de eximición (nota ≥ 5.5) y asistencia mínima del 75%.
              </p>
              <div className="text-xs space-y-1 text-[#55636E]">
                <strong className="block text-[11px] text-[#2D3B45] uppercase">Parámetros:</strong>
                <div>• Horario Principal: {section.horarioAyudantia?.horaInicio || "14:30"} - {section.horarioAyudantia?.horaFin || "16:00"} hrs</div>
                {section.horarioAyudantia2 && (
                  <div>• Horario Secundario: {section.horarioAyudantia2.horaInicio} - {section.horarioAyudantia2.horaFin} hrs</div>
                )}
                <div>• Sala oficial: {section.horarioAyudantia?.sala || "SALA X"}</div>
                <div>• RAG: Descriptor oficial de la sección y reglamento RI</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ARCHIVOS SUBIDOS (RAG que consumen los agentes)                     */}
      {/* ========================================================================= */}
      {activeTab === "files" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Lista de Archivos (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-xs font-bold text-[#2D3B45] uppercase tracking-wider flex items-center gap-1.5">
                <Database size={14} className="text-[#008EE2]" />
                Documentos Indexados ({mockFiles.length})
              </h3>
            </div>

            <div className="space-y-2">
              {mockFiles.map((file) => {
                const isSelected = selectedFile.id === file.id;
                return (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFileId(file.id)}
                    className={`p-3 rounded-[4px] border cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#008EE2] bg-[#F0F8FF] ring-1 ring-[#008EE2]"
                        : "border-[#E0E3E6] hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-xs font-bold text-[#2D3B45] truncate">
                        {file.nombre}
                      </span>
                      <span className="text-[10px] text-gray-500">{file.tamano}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-500 mt-2">
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[#2D3B45] font-medium">
                        {file.agente}
                      </span>
                      <span>{file.actualizado}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Zona de Subida */}
            <div className="border border-dashed border-[#C7CDD1] rounded-[4px] p-4 bg-gray-50 text-center space-y-2">
              <Upload size={20} className="mx-auto text-gray-400" />
              <span className="text-xs font-bold text-[#2D3B45] block">
                Subir Nuevo Documento (.md o .pdf)
              </span>
              <p className="text-[11px] text-[#6B7780]">
                Los archivos se vectorizan y asignan automáticamente al corpus del curso.
              </p>
            </div>
          </div>

          {/* Visor de Contenido (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card space-y-3">
            <div className="border-b border-gray-200 pb-2.5 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#008EE2] uppercase">
                  {selectedFile.tipo}
                </span>
                <h3 className="text-sm font-bold text-[#2D3B45]">{selectedFile.nombre}</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                {selectedFile.agente}
              </span>
            </div>

            <div className="bg-[#F9FAFB] border border-[#E0E3E6] rounded-[4px] p-4 font-mono text-xs text-[#2D3B45] whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto">
              {selectedFile.contenido}
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs text-[#6B7780]">
              <span>Indexado con Embeddings Vectoriales UDP</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 size={13} /> Sincronizado
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MÉTRICAS HISTÓRICAS (Asistencias, Repitentes y Rendimiento)         */}
      {/* ========================================================================= */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card">
              <span className="text-[10px] text-gray-500 uppercase font-bold block">
                Tasa de Aprobación Histórica
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-700 block mt-1">
                89.2%
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5 block">5 semestres auditados</span>
            </div>

            <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card">
              <span className="text-[10px] text-gray-500 uppercase font-bold block">
                Asistencia Promedio
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#008EE2] block mt-1">
                88.2%
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                Sobre el 75% obligatorio
              </span>
            </div>

            <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card">
              <span className="text-[10px] text-gray-500 uppercase font-bold block">
                Alumnos Históricos
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#2D3B45] block mt-1">
                148
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5 block">Total inscritos</span>
            </div>

            <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card">
              <span className="text-[10px] text-gray-500 uppercase font-bold block">
                Promedio de Notas
              </span>
              <span className="text-xl sm:text-2xl font-black text-purple-900 block mt-1">
                5.6
              </span>
              <span className="text-[10px] text-purple-700 font-semibold mt-0.5 block">
                Escala 1.0 a 7.0
              </span>
            </div>
          </div>

          {/* Tabla de Rendimiento Semestre a Semestre */}
          <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card space-y-3">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#2D3B45] flex items-center gap-1.5">
                  <TrendingUp size={16} className="text-[#008EE2]" />
                  Evolución Semestre a Semestre: Asistencia y Repitentes
                </h3>
                <p className="text-xs text-[#6B7780] mt-0.5">
                  Registro histórico de reprobaciones por inasistencia (RI) y porcentaje de asistencia promedio.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[620px]">
                <thead className="bg-[#2D3B45] text-white">
                  <tr>
                    <th className="p-2.5">Semestre / Periodo</th>
                    <th className="p-2.5 text-center">Inscritos</th>
                    <th className="p-2.5 text-center">Asistencia Promedio</th>
                    <th className="p-2.5 text-center">Aprobados</th>
                    <th className="p-2.5 text-center">Repitentes (RI / Académico)</th>
                    <th className="p-2.5 text-right">Nota Promedio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {historicalSemesters.map((sem, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="p-2.5 font-bold font-mono text-[#008EE2]">{sem.periodo}</td>
                      <td className="p-2.5 text-center font-semibold text-[#2D3B45]">{sem.inscritos}</td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            sem.asistProm >= 85
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {sem.asistProm}%
                        </span>
                      </td>
                      <td className="p-2.5 text-center text-emerald-800 font-semibold">{sem.aprobados}</td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded font-bold font-mono ${
                            sem.repitentes === 0
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {sem.repitentes}
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-bold text-[#2D3B45]">{sem.notaProm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: RETROALIMENTACIÓN DE ALUMNOS (Quejas y Sugerencias de Mejora)      */}
      {/* ========================================================================= */}
      {activeTab === "feedback" && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#2D3B45] flex items-center gap-1.5">
                <MessageSquare size={16} className="text-[#008EE2]" />
                Opiniones y Encuestas de Satisfacción de Alumnos
              </h3>
              <p className="text-xs text-[#6B7780] mt-0.5">
                Respuestas recopiladas mediante formularios compartidos para evaluar la experiencia de cátedra y ayudantías.
              </p>
            </div>

            <CanvasButton
              variant="primary-udp"
              size="sm"
              onClick={() => {
                setFeedbackSuccess(true);
                setTimeout(() => setFeedbackSuccess(false), 3500);
              }}
              icon={<Send size={13} />}
              title="Compartir encuesta de satisfacción a los alumnos de la sección"
            >
              Compartir encuesta
            </CanvasButton>
          </div>

          {feedbackSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[4px] flex items-center gap-2 shadow-xs">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>
                ¡Enlace del formulario de feedback generado! Los estudiantes pueden responder desde su portal de alumno.
              </span>
            </div>
          )}

          {/* Tarjetas de Métricas de Satisfacción */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card space-y-1">
              <span className="text-[10px] text-gray-500 uppercase font-bold block">
                Satisfacción General de Ayudantías
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-700">4.7</span>
                <span className="text-xs text-gray-400">/ 5.0</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">94% valoraciones favorables</span>
            </div>

            <div className="p-3.5 bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card space-y-1">
              <span className="text-[10px] text-gray-500 uppercase font-bold block">
                Claridad de las Rúbricas
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#008EE2]">4.8</span>
                <span className="text-xs text-gray-400">/ 5.0</span>
              </div>
              <span className="text-[10px] text-blue-700 font-medium">Criterios objetivos valorados</span>
            </div>

            <div className="p-3.5 bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card space-y-1">
              <span className="text-[10px] text-gray-500 uppercase font-bold block">
                Facilidad Registro Asistencia
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-900">4.9</span>
                <span className="text-xs text-gray-400">/ 5.0</span>
              </div>
              <span className="text-[10px] text-purple-700 font-medium">Link del día con PIN en pizarra</span>
            </div>
          </div>

          {/* Lista de Comentarios y Feedback */}
          <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card space-y-3">
            <h3 className="text-xs font-bold text-[#2D3B45] uppercase tracking-wider">
              Comentarios Recientes y Oportunidades de Mejora
            </h3>

            <div className="space-y-3">
              {studentFeedbackList.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-[4px] border border-gray-200 bg-[#FAFBFB] text-xs space-y-1.5"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2D3B45]">{item.estudiante}</span>
                      <span className="px-2 py-0.2 bg-blue-50 text-[#008EE2] text-[10px] font-bold rounded border border-blue-200">
                        {item.tema}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">{item.fecha}</span>
                  </div>

                  <p className="text-[#55636E] leading-relaxed italic bg-white p-2.5 rounded border border-gray-200">
                    &quot;{item.comentario}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
