"use client";

import React, { useState, useEffect } from "react";
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
import { AdminCourseAgentsTab } from "@/components/modules/admin/AdminCourseAgentsTab";
import { CanvasActionMenu } from "@/components/canvas/CanvasActionMenu";
import {
  AgentHistoryModal,
  TechnicalAgentItem,
} from "@/components/modules/admin/AgentHistoryModal";
import { AgentEditModal } from "@/components/modules/admin/AgentEditModal";
import { getSavedSections, getSectionByCourseCode, saveSections } from "@/services/attendanceStore";
import {
  updateSectionScheduleInSupabase,
  fetchSectionsFromSupabase,
  isSupabaseConfigured,
} from "@/services/attendanceDbService";
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
import { AdminGradeScaleTab } from "@/components/modules/admin/AdminGradeScaleTab";

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
  const [activeTab, setActiveTab] = useState<
    "course_agents" | "technical_agents" | "course_schedules" | "ayudantias" | "grade_scale"
  >("course_agents");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedDetailSection, setSelectedDetailSection] = useState<CourseSection | null>(null);
  const [selectedHistoryAgent, setSelectedHistoryAgent] = useState<TechnicalAgentItem | null>(null);
  const [selectedEditAgent, setSelectedEditAgent] = useState<TechnicalAgentItem | null>(null);
  const [technicalAgents, setTechnicalAgents] = useState<TechnicalAgentItem[]>(INITIAL_TECHNICAL_AGENTS);
  const [isEndSemesterModalOpen, setIsEndSemesterModalOpen] = useState(false);
  const [sections, setSections] = useState<CourseSection[]>([]);

  // Sincronizar reactivamente cuando se actualice cualquier horario
  useEffect(() => {
    setSections(getSavedSections());
    const handleSync = () => {
      setSections(getSavedSections());
    };
    window.addEventListener("udp_sections_updated", handleSync);
    return () => window.removeEventListener("udp_sections_updated", handleSync);
  }, []);

  // Cargar datos oficiales de Supabase al montar
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

  if (selectedDetailSection) {
    return (
      <AdminCourseDetailView
        section={selectedDetailSection}
        onBack={() => setSelectedDetailSection(null)}
        onSaveSection={async (updated) => {
          const all = getSavedSections();
          const updatedAll = all.map((s) => (s.id === updated.id || s.codigo === updated.codigo ? updated : s));
          saveSections(updatedAll);
          setSections(updatedAll);
          setSelectedDetailSection(updated);
          await updateSectionScheduleInSupabase(updated);
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

          <button
            type="button"
            onClick={() => setActiveTab("grade_scale")}
            className={`px-3.5 py-2.5 font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "grade_scale"
                ? "border-[#008EE2] text-[#008EE2] bg-blue-50/50 rounded-t-[3px]"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-50"
            }`}
          >
            <Scale size={14} />
            <span>Punto base y escala</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              activeTab === "grade_scale" ? "bg-blue-100 text-[#008EE2]" : "bg-gray-100 text-gray-600"
            }`}>
              UDP 1.0
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: Sistemas de Agentes por Cursos */}
      {activeTab === "course_agents" && (
        <AdminCourseAgentsTab
          sections={sections}
          onSelectSection={(sec) => setSelectedDetailSection(sec)}
        />
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

      {/* TAB 5: Parámetros de Escala y Punto Base Oficial */}
      {activeTab === "grade_scale" && (
        <AdminGradeScaleTab />
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
