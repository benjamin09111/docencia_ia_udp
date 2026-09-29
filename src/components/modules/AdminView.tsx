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
} from "lucide-react";

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"course_agents" | "technical_agents" | "course_schedules">("course_agents");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  if (selectedAgentId === "cit3203") {
    return <AgentKnowledgeDetail onBack={() => setSelectedAgentId(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Banner Superior Institucional con las 3 Tabs */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#FFEBEE] text-[#C8102E] text-[11px] font-bold rounded uppercase tracking-wider">
              Facultad de Ingeniería y Ciencias
            </span>
            <span className="text-xs text-[#6B7780]">Centro CREA UDP</span>
          </div>
          <h1 className="text-xl font-bold text-[#2D3B45] mt-1">
            Gobernanza Institucional y Jerarquía UDP
          </h1>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Ecosistema multi-agente, control académico de cursos y catálogo oficial de horarios de la Escuela.
          </p>
        </div>

        {/* Las 3 Tabs de Admin */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("course_agents")}
            className={`px-3.5 py-2 text-xs font-semibold rounded-[4px] border transition-all flex items-center gap-2 ${
              activeTab === "course_agents"
                ? "bg-[#2D3B45] text-white border-[#1E272E] shadow-sm"
                : "bg-white text-[#2D3B45] border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Bot size={15} />
            <span>Sistemas de agentes</span>
            <span className="px-1.5 py-0.2 bg-[#008EE2] text-white rounded-full text-[10px] font-bold">
              3 Cursos
            </span>
          </button>

          <button
            onClick={() => setActiveTab("technical_agents")}
            className={`px-3.5 py-2 text-xs font-semibold rounded-[4px] border transition-all flex items-center gap-2 ${
              activeTab === "technical_agents"
                ? "bg-[#008EE2] text-white border-[#0077BE] shadow-sm"
                : "bg-white text-[#2D3B45] border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Cpu size={15} />
            <span>Agentes técnicos</span>
            <span className="px-1.5 py-0.2 bg-white text-[#008EE2] rounded-full text-[10px] font-bold">
              4 Servicios
            </span>
          </button>

          <button
            onClick={() => setActiveTab("course_schedules")}
            className={`px-3.5 py-2 text-xs font-semibold rounded-[4px] border transition-all flex items-center gap-2 ${
              activeTab === "course_schedules"
                ? "bg-[#C8102E] text-white border-[#A00D24] shadow-sm"
                : "bg-white text-[#2D3B45] border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Calendar size={15} />
            <span>Cursos & Horarios</span>
            <span className="px-1.5 py-0.2 bg-white text-[#C8102E] font-bold rounded-full text-[10px]">
              5 Secciones
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
                    profesor: "Jorge Esteban Cruz León",
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

                  <CanvasButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedAgentId("cit3203")}
                    icon={<ArrowRight size={13} />}
                  >
                    Ver Corpus & RAPs
                  </CanvasButton>
                </div>

                {/* Sub-tabla: Agentes Técnicos Contextuales por Sección */}
                <div className="p-3 bg-white">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-[11px] font-bold text-[#6B7780] uppercase tracking-wider flex items-center gap-1.5">
                      <Bot size={13} className="text-[#C8102E]" />
                      Agentes Técnicos de Sección ({course.sections.length} {course.sections.length === 1 ? "sección" : "secciones"} con parámetros particulares de profesor)
                    </span>
                    <span className="text-[11px] text-[#6B7780]">
                      El agente técnico adapta horarios, nombre del docente y reglas de eximición
                    </span>
                  </div>

                  <div className="border border-gray-200 rounded-[3px] overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F5F6F8] text-[#55636E] uppercase font-bold text-[10px] border-b border-gray-200">
                        <tr>
                          <th className="p-2.5">Sección & Código</th>
                          <th className="p-2.5">Profesor Titular</th>
                          <th className="p-2.5">Horario Ayudantía & Sala</th>
                          <th className="p-2.5">Condición de Eximición</th>
                          <th className="p-2.5 text-center">PIN Asistencia</th>
                          <th className="p-2.5 text-center">Agente Técnico</th>
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
                              <span className="font-mono text-[11px] font-bold bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-[#2D3B45]">
                                {sec.pin}
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-[#C8102E] border border-red-200 rounded text-[11px] font-semibold">
                                <BookOpen size={11} />
                                <span>Técnico {sec.name}</span>
                              </span>
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
          <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card">
            <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
              <Network size={18} className="text-[#008EE2]" />
              Agentes Técnicos de Infraestructura (Servicios Compartidos)
            </h2>
            <p className="text-xs text-[#6B7780] mt-1 leading-relaxed">
              Los Agentes de Curso no resuelven todo por su cuenta; se comunican entre sí mediante contratos de datos estandarizados. Cuando un profesor o ayudante solicita una actividad o registra notas, el agente del curso delega la tarea a estos agentes expertos en su dominio.
            </p>
          </div>

          <CanvasTable>
            <CanvasTableHeader>
              <tr>
                <th className="p-3">Agente Técnico</th>
                <th className="p-3">Rol y Especialidad</th>
                <th className="p-3">Protocolo de Interacción</th>
                <th className="p-3 text-center">Invocado Por</th>
                <th className="p-3 text-center">Estado Servicio</th>
              </tr>
            </CanvasTableHeader>
            <tbody>
              {/* Agente Técnico 1: Rúbricas y Actividades */}
              <CanvasTableRow hoverable={false}>
                <CanvasTableCell>
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#2D3B45] block">
                        Agente de Rúbricas y Pautas
                      </span>
                      <span className="font-mono text-[10px] text-gray-500">
                        worker-rubric-engine:v1
                      </span>
                    </div>
                  </div>
                </CanvasTableCell>

                <CanvasTableCell>
                  <span className="text-xs text-[#2D3B45] font-medium block">
                    Taxonomía de Bloom & Criterios Objetivos
                  </span>
                  <p className="text-[11px] text-[#6B7780] mt-0.5">
                    Genera rúbricas con indicadores medibles (Excelente, Aceptable, Insuficiente), desglosa puntajes y exige citas textuales obligatorias para evitar sesgos humanos.
                  </p>
                </CanvasTableCell>

                <CanvasTableCell>
                  <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono block w-fit">
                    POST /api/v1/rubrics/generate
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Recibe Syllabus + Tema ➔ Devuelve JSON Rúbrica
                  </span>
                </CanvasTableCell>

                <CanvasTableCell align="center">
                  <span className="text-xs text-[#55636E] font-medium">
                    Todos los Cursos UDP
                  </span>
                </CanvasTableCell>

                <CanvasTableCell align="center">
                  <CanvasBadge variant="success">Operativo 24/7</CanvasBadge>
                </CanvasTableCell>
              </CanvasTableRow>

              {/* Agente Técnico 2: Motor de Excel Final y Actas */}
              <CanvasTableRow hoverable={false}>
                <CanvasTableCell>
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <FileSpreadsheet size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#2D3B45] block">
                        Agente de Excel y Actas Oficiales
                      </span>
                      <span className="font-mono text-[10px] text-gray-500">
                        worker-excel-sync:v1
                      </span>
                    </div>
                  </div>
                </CanvasTableCell>

                <CanvasTableCell>
                  <span className="text-xs text-[#2D3B45] font-medium block">
                    Cálculo Matricial & Fórmulas Institucionales
                  </span>
                  <p className="text-[11px] text-[#6B7780] mt-0.5">
                    Mantiene la plantilla oficial de la Escuela de Informática. Aplica automáticamente las décimas acumuladas en ayudantías y fiscaliza el 75% de asistencia mínima (alerta RI).
                  </p>
                </CanvasTableCell>

                <CanvasTableCell>
                  <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono block w-fit">
                    SYNC /api/v1/grades/recalculate
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Recibe Notas + Décimas ➔ Recalcula Actas
                  </span>
                </CanvasTableCell>

                <CanvasTableCell align="center">
                  <span className="text-xs text-[#55636E] font-medium">
                    Todos los Cursos UDP
                  </span>
                </CanvasTableCell>

                <CanvasTableCell align="center">
                  <CanvasBadge variant="success">Operativo 24/7</CanvasBadge>
                </CanvasTableCell>
              </CanvasTableRow>

              {/* Agente Técnico 3: Docente y Pedagógico CREA UDP */}
              <CanvasTableRow hoverable={false}>
                <CanvasTableCell>
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 mt-0.5">
                      <GraduationCap size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#2D3B45] block">
                        Agente Docente y Pedagógico (CREA)
                      </span>
                      <span className="font-mono text-[10px] text-gray-500">
                        worker-crea-pedagogy:v1
                      </span>
                    </div>
                  </div>
                </CanvasTableCell>

                <CanvasTableCell>
                  <span className="text-xs text-[#2D3B45] font-medium block">
                    Metodologías Activas & Psicología del Aprendizaje
                  </span>
                  <p className="text-[11px] text-[#6B7780] mt-0.5">
                    Modelado con las investigaciones y pautas del Centro CREA UDP. Asegura andamiaje cognitivo progresivo, clima de aula seguro, trato empático y constructivo, y retroalimentación que potencia la autoeficacia.
                  </p>
                </CanvasTableCell>

                <CanvasTableCell>
                  <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono block w-fit">
                    POST /api/v1/pedagogy/scaffold
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Evalúa Carga Cognitiva ➔ Sugiere Dinámica Activa
                  </span>
                </CanvasTableCell>

                <CanvasTableCell align="center">
                  <span className="text-xs text-[#55636E] font-medium">
                    Todos los Cursos UDP
                  </span>
                </CanvasTableCell>

                <CanvasTableCell align="center">
                  <CanvasBadge variant="success">Operativo 24/7</CanvasBadge>
                </CanvasTableCell>
              </CanvasTableRow>

              {/* Agente Técnico 4: Perspectiva de Género e Inclusión */}
              <CanvasTableRow hoverable={false}>
                <CanvasTableCell>
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded bg-pink-100 text-pink-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Scale size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#2D3B45] block">
                        Agente de Género e Inclusión
                      </span>
                      <span className="font-mono text-[10px] text-gray-500">
                        worker-gender-equity:v1
                      </span>
                    </div>
                  </div>
                </CanvasTableCell>

                <CanvasTableCell>
                  <span className="text-xs text-[#2D3B45] font-medium block">
                    Auditoría de Sesgos & Equidad en Ingeniería
                  </span>
                  <p className="text-[11px] text-[#6B7780] mt-0.5">
                    Fiscaliza que el Agente Creativo no reproduzca estereotipos de género en dinámicas o roles (Scrum Master vs tareas secundarias), garantice lenguaje no sexista y promueva liderazgo técnico equitativo en la UDP.
                  </p>
                </CanvasTableCell>

                <CanvasTableCell>
                  <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono block w-fit">
                    AUDIT /api/v1/equity/bias-check
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Analiza Actividad ➔ Certifica Paridad y Lenguaje
                  </span>
                </CanvasTableCell>

                <CanvasTableCell align="center">
                  <span className="text-xs text-[#55636E] font-medium">
                    Todos los Cursos UDP
                  </span>
                </CanvasTableCell>

                <CanvasTableCell align="center">
                  <CanvasBadge variant="success">Operativo 24/7</CanvasBadge>
                </CanvasTableCell>
              </CanvasTableRow>
            </tbody>
          </CanvasTable>

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
    </div>
  );
};
