"use client";

import React, { useState } from "react";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  FileText,
  ArrowLeft,
  Database,
  CheckCircle,
  Upload,
  BookOpen,
  Bot,
  Brain,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface CourseAgentInfo {
  id: "teorico" | "tecnico";
  nombre: string;
  subtitulo: string;
  badge: string;
  icono: any;
  colorIcono: string;
  bgIcono: string;
  mision: string;
  conocimientoClave: string[];
  archivosAsociados: string[];
}

const agentesDelCurso: CourseAgentInfo[] = [
  {
    id: "teorico",
    nombre: "Agente Teórico (1 por Curso)",
    subtitulo: "Materia Oficial, Bibliografía & Marcos Metodológicos (Compartido por Secciones 1, 2 y 3)",
    badge: "Especialista Conceptual Unificado",
    icono: Brain,
    colorIcono: "text-blue-700",
    bgIcono: "bg-blue-100",
    mision:
      "Custodia el corpus teórico y bibliografía obligatoria del curso para todas sus secciones: Guía PMBOK 7ma Edición (PMI), Joseph Phillips 'IT Project Management', marcos ágiles (Scrum, Kanban, XP), estimaciones de esfuerzo y arquitectura de proyectos.",
    conocimientoClave: [
      "1 Agente Teórico Único para Proyecto en TICs II (CIT3203): no se replica por sección.",
      "Guía PMBOK 7ma Edición (12 principios y 8 dominios de desempeño).",
      "IT Project Management: On Track from Start to Finish (J. Phillips).",
      "Estimación de esfuerzo ágil (Story Points, Serie Fibonacci, Velocity).",
      "Gestión de riesgos técnicos, matrices de impacto y planes de contingencia.",
    ],
    archivosAsociados: ["02_guia_pmbok_agil_udp.md", "03_criterios_evaluacion_avances.md"],
  },
  {
    id: "tecnico",
    nombre: "Agentes Técnicos de Sección",
    subtitulo: "Contexto Específico: Profesor, Horario, Sala y Condición de Eximición por Sección",
    badge: "Especialista Contextual por Docente",
    icono: BookOpen,
    colorIcono: "text-[#C8102E]",
    bgIcono: "bg-red-100",
    mision:
      "Custodia los parámetros particulares de cada sección y profesor titular: Sección 1 (Prof. Jorge Cruz León / Mié 14:30 / Eximición ≥ 5.5), Sección 2 (Prof. Claudio Meneses / Mié 10:00 / Eximición ≥ 5.0), y Sección 3 (Prof. Leandro Lanza / Mié 17:00 / Régimen 100% taller).",
    conocimientoClave: [
      "Sección 1 (CIT3203_CA01): Prof. Jorge Esteban Cruz León • Eximición ≥ 5.5 + 75% asist.",
      "Sección 2 (CIT3203_CA02): Prof. Claudio Meneses Silva • Eximición ≥ 5.0 + 75% asist.",
      "Sección 3 (CIT3203_CA03): Prof. Leandro Lanza • Régimen 100% taller (sin examen).",
      "Descriptor Oficial CIT3621 / CIT3203 (Vigencia Marzo 2026, 6 RAPs y 7 Unidades).",
      "Reglamento de evaluación y causal de Reprobación por Inasistencia (RI < 75%).",
    ],
    archivosAsociados: ["01_programa_oficial.md"],
  },
];

interface KnowledgeFile {
  id: string;
  nombre: string;
  agenteAsociado: "teorico" | "tecnico";
  tipo: "Descriptor Oficial UDP" | "Marco Metodológico" | "Pauta de Evaluación";
  tamano: string;
  actualizado: string;
  resumen: string;
  contenidoPreview: string;
}

const mockKnowledgeFiles: KnowledgeFile[] = [
  {
    id: "f1",
    nombre: "01_programa_oficial.md",
    agenteAsociado: "tecnico",
    tipo: "Descriptor Oficial UDP",
    tamano: "7.6 KB",
    actualizado: "Vigencia Marzo 2026",
    resumen: "Descriptor oficial Escuela de Informática UDP (CIT3621 / CIT3203). RAPs, 7 unidades temáticas y 5 evaluaciones de 20%.",
    contenidoPreview: `## Escuela de Informática y Telecomunicaciones — Facultad de Ingeniería y Ciencias UDP
## DESCRIPTOR DE ASIGNATURA: Proyecto en TICs II (CIT3621 / CIT3203)

- Créditos: 6 SCT | Semestre: 10 | Régimen: Semestral
- Sesiones semanales: 2 cátedras + 1 ayudantía
- Asistencia mínima: 75% obligatoria (Riesgo de RI: Reprobado por Inasistencia)
- Esfuerzo estimado: 150 horas de trabajo semestral

### 6 Resultados de Aprendizaje (RAPs):
1. Evalúa una problemática TIC real en una organización.
2. Diseña una solución TIC alineada con el mandante.
3. Planifica actividades, esfuerzo en tiempo, costos, riesgos y aseguramiento de calidad.
4. Identifica tipos de contrato y modelos de adquisición TIC.
5. Trabaja colaborativamente para la gestión y término exitoso del proyecto.
6. Comunica efectivamente de manera oral y escrita.

### 7 Unidades Temáticas del Agente Técnico:
• Unidad 1: Fundamentos de Gestión de Proyectos (Ciclo de vida, programas y rol director)
• Unidad 2: Planificación y Estimación de Esfuerzo (Técnicas, alcance y restricciones)
• Unidad 3: Gestión de Recursos y Costos (Costos, RRHH y tiempo)
• Unidad 4: Gestión de Calidad y Comunicaciones (Aseguramiento, reportes de avance)
• Unidad 5: Gestión de Riesgos en Proyectos Informáticos (Respuestas y monitoreo)
• Unidad 6: Gestión de Contratos y Proveedores (Modelos de adquisición y cierre)
• Unidad 7: Talleres Aplicados a Proyectos en Ejecución (Resolución de casos reales)

### Esquema Oficial de Ponderaciones (5 x 20% = 100%):
1. Presentación e informe inicial: 20%
2. Solemne Oficial: 20%
3. Reporte de avance 1: 20%
4. Reporte de avance 2: 20%
5. Presentación Final (Feria de Proyectos): 20%

Revisión oficial: Miguel Carrasco (Director) | Elaborado por: Cristian Osorio, Leandro Llanza`,
  },
  {
    id: "f2",
    nombre: "02_guia_pmbok_agil_udp.md",
    agenteAsociado: "teorico",
    tipo: "Marco Metodológico",
    tamano: "18.6 KB",
    actualizado: "2026-09-25",
    resumen: "Directrices de PMBOK Guide + Phillips IT Project Management (Bibliografía obligatoria UDP) adaptadas al agente teórico.",
    contenidoPreview: `# Bibliografía Oficial Obligatoria — Proyecto en TICs II UDP
1. Joseph Phillips, "IT Project Management: On Track from Start to Finish", McGraw-Hill.
2. Project Management Institute (PMI), "A Guide to the Project Management Body of Knowledge (PMBOK Guide)".

### Reglas de Auditoría Semántica del Agente Teórico:
- Auditoría de WBS / EDT y estimación de esfuerzo en horas por sprint.
- Control de matriz de riesgos (probabilidad e impacto con plan de contingencia).
- Validación de criterios de aceptación de entregables contra el mandante real.
- Modelado de arquitectura de software y coherencia del Definition of Done (DoD).`,
  },
  {
    id: "f3",
    nombre: "03_criterios_evaluacion_avances.md",
    agenteAsociado: "teorico",
    tipo: "Pauta de Evaluación",
    tamano: "8.1 KB",
    actualizado: "2026-09-25",
    resumen: "Pauta de corrección con citas mandatorias para Reportes de Avance 1 y 2, y presentación ante comisión.",
    contenidoPreview: `# Criterios Oficiales de Evaluación para Reportes de Avance 1 y 2
- Dimensión Técnica (40%): Solución desplegada, integración de APIs y aseguramiento de calidad.
- Dimensión Gestión (40%): Avance contra la planificación inicial, control de costos y mitigación de riesgos.
- Dimensión Comunicación (20%): Calidad del informe técnico y resolución de observaciones previas.

Nota del Agente: Todo reporte genera observaciones fundadas citando textualmente el informe del grupo.`,
  },
];

interface AgentKnowledgeDetailProps {
  onBack: () => void;
}

export const AgentKnowledgeDetail: React.FC<AgentKnowledgeDetailProps> = ({ onBack }) => {
  const [activeAgentTab, setActiveAgentTab] = useState<"todos" | "teorico" | "tecnico">("todos");
  const [selectedFile, setSelectedFile] = useState<KnowledgeFile>(mockKnowledgeFiles[0]);

  const archivosFiltrados =
    activeAgentTab === "todos"
      ? mockKnowledgeFiles
      : mockKnowledgeFiles.filter((f) => f.agenteAsociado === activeAgentTab);

  return (
    <div className="space-y-5">
      {/* Header y Navegación hacia atrás */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            title="Volver a Sistemas de Agentes"
            aria-label="Volver a Sistemas de Agentes"
            className="w-8 h-8 rounded-[4px] border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-100 text-[#2D3B45] hover:text-[#008EE2] transition-colors flex items-center justify-center shrink-0 shadow-2xs"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#2D3B45] bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                CIT3621 / CIT3203
              </span>
              <CanvasBadge variant="udp">Semestre 10 • 6 Créditos</CanvasBadge>
              <CanvasBadge variant="success">Clúster de 2 Agentes Activo</CanvasBadge>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-[#2D3B45] mt-1">
              Sistema de Agentes: PROYECTO EN TICS II
            </h1>
          </div>
        </div>

        <div className="text-left md:text-right text-xs text-[#6B7780]">
          <span>Directorio oficial: </span>
          <code className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-mono text-[#2D3B45] break-all">
            knowledge/CIT3203_PROYECTO_EN_TICS_II/
          </code>
        </div>
      </div>

      {/* Los 2 Agentes Asociados al Curso */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-1">
          <h2 className="text-xs font-bold text-[#2D3B45] uppercase tracking-wider flex items-center gap-2">
            <Bot size={15} className="text-[#008EE2]" />
            Agentes Especializados Asociados al Curso
          </h2>
          <span className="text-[11px] sm:text-xs text-[#6B7780]">
            Ambos agentes cooperan sincrónicamente compartiendo el contexto del curso
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agentesDelCurso.map((agente) => {
            const Icon = agente.icono;
            const isTabActive = activeAgentTab === agente.id;

            return (
              <div
                key={agente.id}
                onClick={() => {
                  setActiveAgentTab(agente.id);
                  const firstFile = mockKnowledgeFiles.find((f) => f.agenteAsociado === agente.id);
                  if (firstFile) setSelectedFile(firstFile);
                }}
                className={`bg-white border rounded-[4px] p-4 sm:p-5 shadow-canvas-card cursor-pointer transition-all flex flex-col justify-between space-y-3.5 ${
                  isTabActive
                    ? "border-[#008EE2] ring-2 ring-[#008EE2]/20 shadow-md"
                    : "border-[#E0E3E6] hover:border-gray-300"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-9 h-9 shrink-0 rounded flex items-center justify-center ${agente.bgIcono} ${agente.colorIcono}`}>
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-[#2D3B45] leading-tight truncate">
                          {agente.nombre}
                        </h3>
                        <span className="text-[11px] text-[#6B7780] block truncate">
                          {agente.subtitulo}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-[#55636E] shrink-0">
                      {agente.badge}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed bg-[#F9FAFB] p-3 rounded border border-gray-200">
                    {agente.mision}
                  </p>

                  <div className="space-y-1 pt-1">
                    <span className="text-[10.5px] font-bold text-[#2D3B45] uppercase tracking-wider block">
                      Conocimiento Indexado Principal:
                    </span>
                    <ul className="text-xs text-[#55636E] space-y-0.5 list-disc list-inside">
                      {agente.conocimientoClave.map((item, idx) => (
                        <li key={idx} className="line-clamp-1">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[#6B7780]">
                    Archivos: <strong>{agente.archivosAsociados.length} documentos</strong>
                  </span>
                  <span className={`font-semibold flex items-center gap-1 ${isTabActive ? "text-[#008EE2]" : "text-gray-500"}`}>
                    <span>Ver Conocimiento</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner de Cooperación Inter-Agentes del Curso */}
        <div className="bg-[#F0F8FF] border border-[#B3E5FC] rounded-[4px] p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#0277BD]">
          <div className="flex items-start sm:items-center gap-2">
            <Sparkles size={16} className="shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong>Cooperación Continua:</strong> El <strong>Agente Técnico</strong> fija los RAPs y condiciones formales de aprobación, mientras que el <strong>Agente Teórico</strong> provee los fundamentos del PMBOK y las metodologías para cada taller y evaluación.
            </span>
          </div>
          <button
            onClick={() => setActiveAgentTab("todos")}
            className="text-[11px] underline font-bold shrink-0 hover:text-[#01579B] self-end sm:self-auto"
          >
            Ver todos los archivos
          </button>
        </div>
      </div>


      {/* Visor de Conocimiento Indexado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-1">
        {/* Lista de Archivos */}
        <div className="space-y-3">
          <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card">
            <h3 className="text-xs font-bold text-[#2D3B45] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Documentos Indexados ({archivosFiltrados.length})</span>
              <Database size={14} className="text-[#008EE2]" />
            </h3>

            <div className="space-y-2 mt-3">
              {archivosFiltrados.map((file) => {
                const isSelected = selectedFile.id === file.id;
                return (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`p-3 rounded-[4px] border transition-all cursor-pointer ${
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
                    <p className="text-[11px] text-[#6B7780] line-clamp-2">{file.resumen}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <CanvasBadge variant={file.agenteAsociado === "teorico" ? "info" : "udp"}>
                        {file.agenteAsociado === "teorico" ? "Agente Teórico" : "Agente Técnico"}
                      </CanvasBadge>
                      <span className="text-[10px] text-gray-400">{file.actualizado}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subir más archivos */}
          <div className="border border-dashed border-[#C7CDD1] rounded-[4px] p-4 bg-white text-center space-y-2">
            <Upload size={22} className="mx-auto text-gray-400" />
            <span className="text-xs font-bold text-[#2D3B45] block">
              Subir más Documentos (.md o .pdf)
            </span>
            <p className="text-[11px] text-[#6B7780] leading-relaxed">
              Archivos en <br />
              <strong className="font-mono text-[10px] text-[#C8102E]">
                knowledge/CIT3203_PROYECTO_EN_TICS_II/
              </strong>
            </p>
          </div>
        </div>

        {/* Visor de Contenido del Archivo Seleccionado */}
        <div className="lg:col-span-2 bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-6 shadow-canvas-card space-y-4 flex flex-col">
          <div className="border-b border-[#E0E3E6] pb-3 flex flex-col sm:flex-row justify-between items-start gap-2">
            <div>
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-[#C8102E] shrink-0" />
                <h2 className="text-sm font-bold text-[#2D3B45]">{selectedFile.nombre}</h2>
              </div>
              <p className="text-xs text-[#6B7780] mt-0.5">{selectedFile.resumen}</p>
            </div>
            <CanvasBadge variant={selectedFile.agenteAsociado === "teorico" ? "info" : "udp"}>
              Asignado a: {selectedFile.agenteAsociado === "teorico" ? "Agente Teórico" : "Agente Técnico"}
            </CanvasBadge>
          </div>

          <div className="bg-[#F9FAFB] border border-[#E0E3E6] rounded-[4px] p-3 sm:p-4 font-mono text-xs text-[#2D3B45] whitespace-pre-wrap leading-relaxed flex-1 overflow-y-auto max-h-[380px] xl:max-h-[480px]">
            {selectedFile.contenidoPreview}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 text-xs text-[#6B7780] border-t border-gray-100">
            <span>RAG Vectorial: Indexado con 6 RAPs, 7 unidades temáticas y Guía PMBOK.</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle size={14} /> Activo y Sincronizado
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
