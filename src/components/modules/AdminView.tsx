"use client";

import React, { useState } from "react";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  CanvasTable,
  CanvasTableHeader,
  CanvasTableRow,
  CanvasTableCell,
} from "@/components/canvas/CanvasTable";
import { AgentKnowledgeDetail } from "@/components/modules/admin/AgentKnowledgeDetail";
import { AdminCourseScheduleManagement } from "@/components/modules/admin/AdminCourseScheduleManagement";
import { AdminCourseDetailView } from "@/components/modules/admin/AdminCourseDetailView";
import { CanvasActionMenu } from "@/components/canvas/CanvasActionMenu";
import {
  AgentHistoryModal,
  TechnicalAgentItem,
} from "@/components/modules/admin/AgentHistoryModal";
import { AgentEditModal } from "@/components/modules/admin/AgentEditModal";
import { getSavedSections, getSectionByCourseCode, saveSections } from "@/services/attendanceStore";
import { CourseSection } from "@/types/attendance";
import {
  Bot,
  BookOpen,
  Layers,
  ArrowRight,
  Sparkles,
  Cpu,
  FileSpreadsheet,
  CheckCircle2,
  Network,
  ShieldCheck,
  GraduationCap,
  Scale,
  Calendar,
  Brain,
  History,
  Edit3,
  CalendarX,
} from "lucide-react";
import { AdminEndSemesterModal } from "@/components/modules/admin/AdminEndSemesterModal";
import { AdminAyudantiasView } from "@/components/modules/admin/ayudantias/AdminAyudantiasView";

const INITIAL_TECHNICAL_AGENTS: TechnicalAgentItem[] = [
  {
    id: "agent_rubrics",
    codigo: "worker-rubric-engine:v1",
    nombre: "Agente de Rúbricas y Pautas",
    especialidad: "Taxonomía de Bloom & Criterios Objetivos",
    descripcion: "Genera rúbricas con indicadores medibles (Excelente, Aceptable, Insuficiente), desglosa puntajes y exige citas textuales obligatorias para evitar sesgos humanos.",
    ambito: "Transversal UDP",
    modelo: "claude-3-5-sonnet",
    temperatura: 0.1,
    systemPrompt: "Eres el Agente Oficial de Rúbricas de la Facultad de Ingeniería UDP. Genera rúbricas con descriptores observables y criterios objetivos alineados con la taxonomía de Bloom.",
    historial: [
      { id: "h1", timestamp: "Hoy, 10:45", curso: "CIT3203", accion: "Generación de rúbrica Avance 1 (WBS y Riesgos)", tokens: 1420, duracionMs: 820, estado: "completado" },
      { id: "h2", timestamp: "Ayer, 16:30", curso: "CIT2206", accion: "Validación de criterios de evaluación de caso Harvard", tokens: 980, duracionMs: 640, estado: "completado" },
      { id: "h3", timestamp: "28 Sep, 11:15", curso: "CIT3100", accion: "Estructuración de pauta para microservicios cloud", tokens: 1650, duracionMs: 910, estado: "completado" },
    ],
  },
  {
    id: "agent_excel",
    codigo: "worker-excel-sync:v1",
    nombre: "Agente de Excel y Actas Oficiales",
    especialidad: "Cálculo Matricial & Fórmulas Institucionales",
    descripcion: "Mantiene la plantilla oficial de la Escuela de Informática. Aplica automáticamente las décimas acumuladas en ayudantías y fiscaliza el 75% de asistencia mínima (alerta RI).",
    ambito: "Escuela de Informática",
    modelo: "gpt-4o",
    temperatura: 0.0,
    systemPrompt: "Eres el Motor de Cálculos y Auditoría de Actas UDP. Aplica fórmulas matriciales sin redondeos distorsivos y respeta la política de 75% de asistencia.",
    historial: [
      { id: "h4", timestamp: "Hoy, 11:02", curso: "CIT3203 Sección 1", accion: "Cálculo y auditoría de asistencia acumulada", tokens: 620, duracionMs: 310, estado: "completado" },
      { id: "h5", timestamp: "Hoy, 09:14", curso: "CIT3203 Sección 2", accion: "Recálculo de décimas de talleres (8 décimas)", tokens: 740, duracionMs: 340, estado: "completado" },
      { id: "h6", timestamp: "Ayer, 18:20", curso: "CIT2206", accion: "Verificación de alumnos bajo el 75% reglamentario", tokens: 530, duracionMs: 290, estado: "completado" },
    ],
  },
  {
    id: "agent_pedagogy",
    codigo: "worker-crea-pedagogy:v1",
    nombre: "Agente Docente y Pedagógico (CREA)",
    especialidad: "Metodologías Activas & Psicología del Aprendizaje",
    descripcion: "Modelado con las directrices del Centro CREA UDP. Asegura andamiaje cognitivo progresivo, clima de aula seguro, trato empático y constructivo, y retroalimentación formativa.",
    ambito: "Centro CREA UDP",
    modelo: "gpt-4o",
    temperatura: 0.3,
    systemPrompt: "Especialista pedagógico del Centro CREA UDP. Modela el aprendizaje con andamiaje progresivo, reduce la ansiedad ante evaluaciones y promueve autoeficacia.",
    historial: [
      { id: "h7", timestamp: "Hoy, 08:30", curso: "CIT3203", accion: "Revisión de carga cognitiva en taller de Scrum", tokens: 1120, duracionMs: 780, estado: "completado" },
      { id: "h8", timestamp: "Ayer, 15:40", curso: "CIT3100", accion: "Propuesta de dinámica activa de arquitectura por pares", tokens: 1340, duracionMs: 820, estado: "completado" },
    ],
  },
  {
    id: "agent_equity",
    codigo: "worker-gender-equity:v1",
    nombre: "Agente de Género e Inclusión",
    especialidad: "Auditoría de Sesgos & Equidad en Ingeniería",
    descripcion: "Fiscaliza que las actividades no reproduzcan estereotipos de género, garantice lenguaje no sexista y promueva liderazgo técnico equitativo en la UDP.",
    ambito: "Dirección de Género UDP",
    modelo: "claude-3-5-sonnet",
    temperatura: 0.2,
    systemPrompt: "Auditor institucional de perspectiva de género e inclusión de la UDP. Certifica paridad de roles técnicos y lenguaje accesible no excluyente.",
    historial: [
      { id: "h9", timestamp: "Hoy, 10:10", curso: "CIT3203", accion: "Certificación de paridad en asignación de roles Scrum", tokens: 890, duracionMs: 510, estado: "completado" },
      { id: "h10", timestamp: "Ayer, 12:00", curso: "CIT2206", accion: "Auditoría de lenguaje en enunciados de evaluación", tokens: 1050, duracionMs: 610, estado: "completado" },
    ],
  },
];

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"course_agents" | "technical_agents" | "course_schedules" | "ayudantias">("course_agents");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedDetailSection, setSelectedDetailSection] = useState<CourseSection | null>(null);
  const [selectedHistoryAgent, setSelectedHistoryAgent] = useState<TechnicalAgentItem | null>(null);
  const [selectedEditAgent, setSelectedEditAgent] = useState<TechnicalAgentItem | null>(null);
  const [technicalAgents, setTechnicalAgents] = useState<TechnicalAgentItem[]>(INITIAL_TECHNICAL_AGENTS);
  const [isEndSemesterModalOpen, setIsEndSemesterModalOpen] = useState(false);

  if (selectedDetailSection) {
    return (
      <AdminCourseDetailView
        section={selectedDetailSection}
        onBack={() => setSelectedDetailSection(null)}
        onSaveSection={(updated) => {
          const all = getSavedSections();
          const updatedAll = all.map((s) => (s.id === updated.id || s.codigo === updated.codigo ? updated : s));
          saveSections(updatedAll);
          setSelectedDetailSection(updated);
        }}
      />
    );
  }

  if (selectedAgentId === "cit3203") {
    return <AgentKnowledgeDetail onBack={() => setSelectedAgentId(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Banner Superior Institucional */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#FFEBEE] text-[#C8102E] text-[10px] font-bold rounded uppercase tracking-wider">
              Facultad de Ingeniería
            </span>
            <span className="text-xs text-[#6B7780]">
              Ingeniería Civil en Informática y Telecomunicaciones
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#2D3B45] mt-1">
            Gobernanza Institucional y Jerarquía UDP
          </h1>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Ecosistema multi-agente, control académico de cursos y catálogo oficial de horarios de la Escuela.
          </p>
        </div>

        {/* Botón Terminar Semestre */}
        <CanvasButton
          variant="primary-udp"
          size="sm"
          icon={<CalendarX size={15} />}
          onClick={() => setIsEndSemesterModalOpen(true)}
          title="Iniciar protocolo de cierre de semestre, limpieza y síntesis de mejora continua"
        >
          Terminar semestre
        </CanvasButton>
      </div>

      {/* Barra de Tabs Estándar Canvas (Abajo del Header) */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card px-2 pt-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-nowrap border-b border-gray-200 pb-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("course_agents")}
            className={`px-3.5 py-2.5 font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "course_agents"
                ? "border-[#008EE2] text-[#008EE2] bg-blue-50/50 rounded-t-[3px]"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-50"
            }`}
          >
            <Bot size={14} />
            <span>Sistemas de agentes</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              activeTab === "course_agents" ? "bg-blue-100 text-[#008EE2]" : "bg-gray-100 text-gray-600"
            }`}>
              3 Cursos
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("technical_agents")}
            className={`px-3.5 py-2.5 font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "technical_agents"
                ? "border-[#008EE2] text-[#008EE2] bg-blue-50/50 rounded-t-[3px]"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-50"
            }`}
          >
            <Cpu size={14} />
            <span>Agentes técnicos</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              activeTab === "technical_agents" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-600"
            }`}>
              4 Servicios
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("course_schedules")}
            className={`px-3.5 py-2.5 font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "course_schedules"
                ? "border-[#008EE2] text-[#008EE2] bg-blue-50/50 rounded-t-[3px]"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-50"
            }`}
          >
            <BookOpen size={14} />
            <span>Cursos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ayudantias")}
            className={`px-3.5 py-2.5 font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "ayudantias"
                ? "border-[#008EE2] text-[#008EE2] bg-blue-50/50 rounded-t-[3px]"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-50"
            }`}
          >
            <GraduationCap size={14} />
            <span>Ayudantías</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              activeTab === "ayudantias" ? "bg-red-100 text-[#C8102E]" : "bg-gray-100 text-gray-600"
            }`}>
              Demo
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: Sistemas de Agentes por Cursos */}
      {activeTab === "course_agents" && (
        <div className="space-y-4">
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
            {[
              {
                courseCode: "CIT3203",
                courseName: "PROYECTO EN TICS II",
                level: "10° Semestre • Escuela de Informática y Telecomunicaciones UDP",
                teorico: {
                  name: "Agente Teórico CIT3203",
                  corpus: "Guía PMBOK 7ma Edición (PMI), Marcos Ágiles (Scrum, Kanban), 6 RAPs Institucionales y 7 Unidades Temáticas",
                  scope: "1 Agente Teórico Centralizado (Compartido idénticamente por las Secciones 1, 2 y 3)",
                },
                sections: [
                  {
                    code: "CIT3203_CA01",
                    name: "Sección 1",
                    profesor: "Jorge Esteban Cruz León",
                    ayudante: "Benjamín Morales Pizarro",
                    horarioAyudantia: "Miércoles 16:00 - 17:20",
                    sala: "SALA X",
                    eximicion: "Promedio ≥ 5.5 + 75% Asistencia",
                    pin: "4821",
                  },
                  {
                    code: "CIT3203_CA02",
                    name: "Sección 2",
                    profesor: "Claudio Meneses Silva",
                    ayudante: "Benjamín Morales Pizarro",
                    horarioAyudantia: "Miércoles 16:00 - 17:20",
                    sala: "SALA X",
                    eximicion: "Promedio ≥ 5.0 + 75% Asistencia",
                    pin: "5914",
                  },
                  {
                    code: "CIT3203_CA03",
                    name: "Sección 3",
                    profesor: "Leandro Lanza",
                    ayudante: "Benjamín Morales Pizarro",
                    horarioAyudantia: "Miércoles 16:00 - 17:20",
                    sala: "SALA X",
                    eximicion: "Régimen taller 100% ponderado (Sin examen)",
                    pin: "7239",
                  },
                ],
              },
              {
                courseCode: "CIT2206",
                courseName: "GESTIÓN ORGANIZACIONAL",
                level: "6° Semestre • Escuela de Informática y Telecomunicaciones UDP",
                teorico: {
                  name: "Agente Teórico CIT2206",
                  corpus: "Teoría de la Organización, Estructuras, Dinámicas de Personas, Liderazgo Estratégico y Casos Harvard",
                  scope: "1 Agente Teórico Centralizado",
                },
                sections: [
                  {
                    code: "CIT2206_CA01",
                    name: "Sección 1",
                    profesor: "María José Quintana",
                    ayudante: "Benjamín Morales Pizarro",
                    horarioAyudantia: "Jueves 14:30 - 16:00",
                    sala: "SALA X",
                    eximicion: "Promedio ≥ 5.0 + 75% Asistencia",
                    pin: "3312",
                  },
                ],
              },
              {
                courseCode: "CIT3100",
                courseName: "ARQUITECTURAS EMERGENTES DE SOFTWARE",
                level: "8° Semestre • Escuela de Informática y Telecomunicaciones UDP",
                teorico: {
                  name: "Agente Teórico CIT3100",
                  corpus: "Patrones Cloud Native, Microservicios, Sistemas Distribuidos, Serverless & Kubernetes",
                  scope: "1 Agente Teórico Centralizado",
                },
                sections: [
                  {
                    code: "CIT3100_CA02",
                    name: "Sección 2",
                    profesor: "Jorge Esteban Cruz León",
                    ayudante: "Benjamín Morales Pizarro",
                    horarioAyudantia: "Jueves 16:00 - 17:20",
                    sala: "SALA X",
                    eximicion: "Promedio ≥ 5.2 + Proyecto desplegado en nube",
                    pin: "8891",
                  },
                ],
              },
            ].map((course) => (
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

                    {/* Ficha Agente Teórico (1 solo por curso) */}
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
                            const matched = getSectionByCourseCode(course.courseCode);
                            setSelectedDetailSection(matched);
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
                                    onClick: () => {
                                      const matched = getSectionByCourseCode(sec.code);
                                      setSelectedDetailSection(matched);
                                    },
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
      )}

      {/* TAB 2: Agentes Técnicos (Workers Especializados) */}
      {activeTab === "technical_agents" && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
                <Cpu size={16} className="text-[#008EE2]" />
                Agentes Técnicos de Infraestructura (Servicios Compartidos)
              </h2>
              <p className="text-xs text-[#6B7780] mt-0.5">
                Servicios transversales para generación de rúbricas, actas de notas, andamiaje pedagógico y equidad de género.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-purple-50 text-purple-800 text-[11px] font-bold rounded border border-purple-200 shrink-0">
              {technicalAgents.length} Agentes Especializados Activos
            </span>
          </div>

          {/* Tabla de Agentes Simplificada y Estandarizada */}
          <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card overflow-hidden">
            <CanvasTable tableClassName="min-w-[650px]">
              <CanvasTableHeader>
                <tr>
                  <th className="p-3">Agente Técnico</th>
                  <th className="p-3">Rol & Especialidad</th>
                  <th className="p-3">Ámbito</th>
                  <th className="p-3 text-right w-16">Acciones</th>
                </tr>
              </CanvasTableHeader>
              <tbody>
                {technicalAgents.map((agent) => (
                  <CanvasTableRow key={agent.id} hoverable={true}>
                    <CanvasTableCell>
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded bg-blue-50 text-[#008EE2] border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                          <Cpu size={16} />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-[#2D3B45] block">
                            {agent.nombre}
                          </span>
                          <span className="font-mono text-[10px] text-gray-500">
                            {agent.codigo}
                          </span>
                        </div>
                      </div>
                    </CanvasTableCell>

                    <CanvasTableCell>
                      <span className="text-xs text-[#2D3B45] font-semibold block">
                        {agent.especialidad}
                      </span>
                      <p className="text-[11px] text-[#6B7780] mt-0.5">
                        {agent.descripcion}
                      </p>
                    </CanvasTableCell>

                    <CanvasTableCell>
                      <span className="text-[11px] font-medium bg-gray-100 text-[#2D3B45] px-2 py-0.5 rounded border border-gray-200 block w-fit">
                        {agent.ambito}
                      </span>
                    </CanvasTableCell>

                    <CanvasTableCell align="right">
                      <CanvasActionMenu
                        ariaLabel={`Acciones para ${agent.nombre}`}
                        items={[
                          {
                            label: "Ver historial de agente",
                            icon: <History size={14} className="text-[#008EE2]" />,
                            onClick: () => setSelectedHistoryAgent(agent),
                          },
                          {
                            label: "Ver o editar agente",
                            icon: <Edit3 size={14} className="text-[#2D3B45]" />,
                            onClick: () => setSelectedEditAgent(agent),
                          },
                        ]}
                      />
                    </CanvasTableCell>
                  </CanvasTableRow>
                ))}
              </tbody>
            </CanvasTable>
          </div>

          {/* Diagrama de Comunicación: Enjambre de Agentes */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-[4px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2D3B45] uppercase tracking-wider block">
                📌 Arquitectura Multi-Agente UDP: Enjambre Federado e Interacción Continua
              </span>
              <span className="text-[10px] font-bold text-[#008EE2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Gobernanza CREA + EIT UDP
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded border border-purple-200">
                <span className="font-bold text-purple-700 block text-[11px]">🎨 Agente Creativo</span>
                <p className="text-[10.5px] text-[#55636E] mt-0.5">Diseña dinámicas lúdicas y formativas.</p>
              </div>
              <div className="bg-white p-2.5 rounded border border-pink-200">
                <span className="font-bold text-pink-700 block text-[11px]">⚖️ Perspectiva de Género</span>
                <p className="text-[10.5px] text-[#55636E] mt-0.5">Audita sesgos, paridad y lenguaje inclusivo.</p>
              </div>
              <div className="bg-white p-2.5 rounded border border-indigo-200">
                <span className="font-bold text-indigo-700 block text-[11px]">🎓 Agente Docente CREA</span>
                <p className="text-[10.5px] text-[#55636E] mt-0.5">Andamiaje pedagógico y psicología universitaria.</p>
              </div>
              <div className="bg-white p-2.5 rounded border border-emerald-200">
                <span className="font-bold text-emerald-700 block text-[11px]">📊 Agente de Excel</span>
                <p className="text-[10.5px] text-[#55636E] mt-0.5">Control de actas, décimas y regla 75% RI.</p>
              </div>
            </div>

            <div className="text-xs text-gray-700 font-mono bg-white p-3 rounded border border-gray-300 leading-relaxed space-y-1">
              <div>[1] <strong>Agente Creativo</strong> diseña propuesta de taller o juego de roles ➔ consulta a <strong>[Agente de Género]</strong> para auditar sesgos.</div>
              <div>[2] <strong>Agente Docente (CREA)</strong> y <strong>[Agente Técnico]</strong> calibran la carga cognitiva y alineación con RAPs oficiales.</div>
              <div>[3] <strong>Agente Corrector</strong> redacta rúbrica objetiva con citas ➔ <strong>[Agente Gestionador]</strong> coordina fecha en Canvas.</div>
              <div>[4] Tras la sesión, <strong>[Agente de Excel]</strong> inyecta las décimas obtenidas en la planilla oficial de notas.</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Cursos & Horarios Oficiales UDP */}
      {activeTab === "course_schedules" && (
        <AdminCourseScheduleManagement />
      )}

      {/* TAB 4: Ayudantías, Pedagogía y Portal Comunitario */}
      {activeTab === "ayudantias" && (
        <AdminAyudantiasView />
      )}

      {/* Modal Historial de Agente */}
      <AgentHistoryModal
        isOpen={Boolean(selectedHistoryAgent)}
        onClose={() => setSelectedHistoryAgent(null)}
        agent={selectedHistoryAgent}
      />

      {/* Modal Ver o Editar Agente */}
      <AgentEditModal
        isOpen={Boolean(selectedEditAgent)}
        onClose={() => setSelectedEditAgent(null)}
        agent={selectedEditAgent}
        onSave={(updated) => {
          setTechnicalAgents((prev) =>
            prev.map((a) => (a.id === updated.id ? updated : a))
          );
        }}
      />

      {/* Modal Mock: Terminar Semestre */}
      <AdminEndSemesterModal
        isOpen={isEndSemesterModalOpen}
        onClose={() => setIsEndSemesterModalOpen(false)}
      />
    </div>
  );
};
