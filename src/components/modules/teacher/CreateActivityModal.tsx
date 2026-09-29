"use client";

import React, { useState } from "react";
import { CourseDeliverable } from "@/types";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  Sparkles,
  Users,
  Trophy,
  Brain,
  CheckCircle2,
  Layers,
  Scale,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

export interface DinamicaTemplate {
  id: string;
  tipo: "Juego de Roles" | "Gamificación Ágil" | "Estudio de Caso y Reflexión";
  titulo: string;
  subtitulo: string;
  icono: any;
  color: string;
  duracion: string;
  descripcion: string;
  agenteCreativo: string;
  agenteGenero: string;
  agenteDocenteCREA: string;
  agenteTecnico: string;
  agenteGestionador: string;
  agenteCorrector: string;
  agenteExcel: string;
  rubricaSugerida: {
    criterio: string;
    puntos: number;
    detalle: string;
  }[];
}

export const templatesDinamicas: DinamicaTemplate[] = [
  {
    id: "din_roleplay",
    tipo: "Juego de Roles",
    titulo: "Simulación de Crisis con el Mandante Real",
    subtitulo: "Negociación ágil ante recorte presupuestario y cambio drástico de alcance",
    icono: Users,
    color: "#6A1B9A",
    duracion: "40 min en Ayudantía",
    descripcion:
      "El mandante del proyecto recorta el presupuesto en un 30% y exige adelantar la entrega 2 semanas. El equipo asume roles (Scrum Master, Product Owner, Tech Lead), renegocia el alcance esencial y defiende técnicamente la Matriz de Riesgos PMBOK sin sacrificar la arquitectura.",
    agenteCreativo: "Diseña la dinámica inmersiva: Asigna roles conflictivos y tarjetas de eventos sorpresa durante la simulación.",
    agenteGenero: "Auditoría de Sesgos superada: Asignación paritaria rotativa. Los roles de liderazgo técnico (Tech Lead) y facilitación (Scrum Master) rotan equitativamente, evitando asignar tareas administrativas o secundarias a estudiantes mujeres.",
    agenteDocenteCREA: "Marco CREA UDP: Aprendizaje experiencial de alto compromiso con clima seguro de aula. Fomenta el andamiaje afectivo para tolerar la incertidumbre en situaciones críticas simuladas.",
    agenteTecnico: "Alinea con RAP 3 (Planificación, Costos y Riesgos) y RAP 5 (Trabajo Colaborativo), aplicando la Guía PMBOK 7.",
    agenteGestionador: "Programa la actividad para la Semana 4 y fija la bonificación vinculada al Reporte de Avance 1.",
    agenteCorrector: "Genera rúbrica de 2 criterios objetivos (Trade-offs técnicos y Mitigación de Riesgos) con citas textuales obligatorias.",
    agenteExcel: "Abre la columna '+0.3 Décimas Ayudantía' en la matriz de calificaciones para sumarse directamente al Avance 1.",
    rubricaSugerida: [
      { criterio: "Defensa Técnica de Trade-offs y Repriorización de Backlog", puntos: 50, detalle: "Justificación arquitectónica del alcance esencial vs prescindible." },
      { criterio: "Aplicación de Matriz de Riesgos y Plan de Mitigación PMBOK", puntos: 50, detalle: "Identificación de riesgos críticos y plan de contingencia viable." },
    ],
  },
  {
    id: "din_poker",
    tipo: "Gamificación Ágil",
    titulo: "Torneo de Estimación de Esfuerzo (Planning Poker)",
    subtitulo: "Competencia de calibración técnica de Story Points y supuestos de desarrollo",
    icono: Trophy,
    color: "#E65100",
    duracion: "35 min en Ayudantía",
    descripcion:
      "Competencia grupal donde los equipos reciben 5 historias de usuario complejas extraídas de proyectos TICs reales de la UDP. Deben estimar story points mediante la serie Fibonacci, justificar supuestos de base de datos e integraciones de API, y calibrar la velocidad de equipo.",
    agenteCreativo: "Gamifica la sesión con rondas de votación ciega por turnos, premiando al equipo con mayor consenso argumentado.",
    agenteGenero: "Auditoría de Sesgos superada: Votación ciega inicial y turnos de palabra regulados. Garantiza que voces no dominantes o de estudiantes mujeres tengan el mismo peso argumentativo en decisiones de arquitectura.",
    agenteDocenteCREA: "Marco CREA UDP: Calibración metacognitiva del error y co-evaluación formativa sin penalizaciones intimidatorias.",
    agenteTecnico: "Cubre la Unidad 2 del programa (Técnicas de Estimación de Esfuerzo, Restricciones de Tiempo y Recursos).",
    agenteGestionador: "Establece fecha límite de subida y verifica que los grupos cumplan con la composición oficial de equipos.",
    agenteCorrector: "Evalúa la solidez de los supuestos técnicos (arquitectura de datos y testing) y coherencia del Definition of Done (DoD).",
    agenteExcel: "Registra participación activa y suma +0.3 décimas para el entregable 'Presentación e Informe Inicial'.",
    rubricaSugerida: [
      { criterio: "Fundamentación de Complejidad e Incertidumbre Técnica", puntos: 50, detalle: "Argumentación basada en APIs, modelos de base de datos e integraciones." },
      { criterio: "Coherencia en la Definición de 'Hecho' (DoD) y Testing", puntos: 50, detalle: "Inclusión explícita de pruebas unitarias, CI/CD y criterios de aceptación." },
    ],
  },
  {
    id: "din_postmortem",
    tipo: "Estudio de Caso y Reflexión",
    titulo: "Análisis Post-Mortem de un Proyecto TIC Fallido",
    subtitulo: "Auditoría forense de contratos, SLAs y aseguramiento de calidad de software",
    icono: Brain,
    color: "#00838F",
    duracion: "45 min en Ayudantía",
    descripcion:
      "Los estudiantes analizan el caso real de una plataforma gubernamental chilena que colapsó en su primer día de producción. Elaboran un dictamen forense identificando qué cláusula del contrato y qué pruebas de aseguramiento de calidad (QA) fueron omitidas.",
    agenteCreativo: "Estructura la reflexión guiada: plantea preguntas provocadoras para fomentar el pensamiento crítico ético y profesional.",
    agenteGenero: "Auditoría de Sesgos superada: El caso incluye equipos directivos de composición diversa y analiza sesgos de atribución que pudieron afectar la comunicación inter-equipos.",
    agenteDocenteCREA: "Marco CREA UDP: Pedagogía del error constructivo; conecta la responsabilidad profesional de ingeniería con el impacto ético en la sociedad.",
    agenteTecnico: "Aplica Unidad 5 (Gestión de Riesgos) y Unidad 6 (Gestión de Contratos y Modelos de Adquisición TIC).",
    agenteGestionador: "Registra la actividad como preparación previa obligatoria para el Hito Solemne Oficial.",
    agenteCorrector: "Audita que las respuestas citen textualmente los SLAs infringidos y los estándares de pruebas de carga requeridos.",
    agenteExcel: "Calcula el bono de +0.3 décimas y audita la asistencia mínima del 75% reglamentaria.",
    rubricaSugerida: [
      { criterio: "Identificación de Causa Raíz en Modelos de Contrato y SLAs", puntos: 50, detalle: "Diagnóstico preciso de la cláusula de penalización y entregables contractuales." },
      { criterio: "Plan Forense de Aseguramiento de Calidad y Pruebas Preventivas", puntos: 50, detalle: "Propuesta de pruebas de carga, estrés y seguridad no ejecutadas." },
    ],
  },
];

interface CreateActivityModalProps {
  isOpen: boolean;
  courseId: number;
  onClose: () => void;
  onConfirm: (activity: CourseDeliverable) => void;
}

export const CreateActivityModal: React.FC<CreateActivityModalProps> = ({
  isOpen,
  courseId,
  onClose,
  onConfirm,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<DinamicaTemplate>(templatesDinamicas[0]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const created: CourseDeliverable = {
      id: `act_${Date.now()}`,
      curso_id: courseId,
      tipo: "actividad_ayudantia",
      titulo: `${selectedTemplate.tipo}: ${selectedTemplate.titulo}`,
      descripcion: selectedTemplate.descripcion,
      fecha_limite: "2026-10-18",
      ponderacion_o_decimas: "+0.3 décimas",
      target_evaluacion: "Reporte de Avance 1",
      estado: "publicada",
      rubrica: selectedTemplate.rubricaSugerida.map((r, i) => ({
        id: `crit_${Date.now()}_${i}`,
        descripcion: r.criterio,
        puntaje_max: r.puntos,
        indicadores: [
          { nivel: "Excelente", detalle: r.detalle, puntos: r.puntos },
          { nivel: "Aceptable", detalle: "Cumple parcialmente con el estándar.", puntos: Math.round(r.puntos * 0.6) },
          { nivel: "Insuficiente", detalle: "No presenta fundamentación técnica adecuada.", puntos: Math.round(r.puntos * 0.2) },
        ],
      })),
    };

    onConfirm(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[6px] max-w-4xl w-full p-6 shadow-xl border border-gray-200 space-y-4 animate-scaleUp max-h-[92vh] overflow-y-auto">
        {/* Cabecera Modal */}
        <div className="flex justify-between items-start border-b pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#C8102E]" />
              <h3 className="text-base font-bold text-[#2D3B45]">
                Crear Actividad Recreativa con el Enjambre de Agentes
              </h3>
            </div>
            <p className="text-xs text-[#6B7780] mt-0.5">
              El <strong>Agente Creativo</strong> ha formulado 3 propuestas, validadas con el <strong>Agente de Género</strong> y el <strong>Agente Docente CREA</strong>:
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-lg">
            ✕
          </button>
        </div>

        {/* Las 3 Cards de Dinámicas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {templatesDinamicas.map((tpl) => {
            const Icon = tpl.icono;
            const isSelected = selectedTemplate.id === tpl.id;

            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`p-3.5 rounded-[4px] border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? "border-[#008EE2] bg-[#F0F8FF] shadow-sm"
                    : "border-[#E0E3E6] hover:border-gray-300 bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div
                      className="w-7 h-7 rounded flex items-center justify-center text-white"
                      style={{ backgroundColor: tpl.color }}
                    >
                      <Icon size={15} />
                    </div>
                    <span className="text-[10px] font-bold text-[#55636E] bg-gray-100 px-1.5 py-0.5 rounded">
                      {tpl.duracion}
                    </span>
                  </div>

                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#6B7780] block">
                    {tpl.tipo}
                  </span>
                  <h4 className="text-xs font-bold text-[#2D3B45] mt-0.5 leading-snug">
                    {tpl.titulo}
                  </h4>
                  <p className="text-[11px] text-[#6B7780] mt-1 line-clamp-2 leading-relaxed">
                    {tpl.subtitulo}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-purple-800 font-bold bg-purple-100 px-1.5 py-0.5 rounded text-[10px]">
                    +0.3 décimas
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-[#008EE2] flex items-center gap-1">
                      <CheckCircle2 size={12} /> Seleccionada
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Auditoría Ética y Pedagógica: Género + CREA */}
        <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-[4px] p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-purple-700" />
              Auditoría Ética & Pedagógica previa (Agente de Género + Docente CREA UDP)
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle2 size={11} /> 100% Sin Sesgos & Alineado CREA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded border border-purple-200 space-y-1">
              <span className="font-bold text-pink-700 flex items-center gap-1 text-[11px]">
                <Scale size={13} /> Agente de Perspectiva de Género (Consultado por Agente Creativo)
              </span>
              <p className="text-[10.5px] text-[#55636E] leading-relaxed">
                {selectedTemplate.agenteGenero}
              </p>
            </div>

            <div className="bg-white p-2.5 rounded border border-indigo-200 space-y-1">
              <span className="font-bold text-indigo-700 flex items-center gap-1 text-[11px]">
                <GraduationCap size={13} /> Agente Docente y Pedagógico (Estudios CREA UDP)
              </span>
              <p className="text-[10.5px] text-[#55636E] leading-relaxed">
                {selectedTemplate.agenteDocenteCREA}
              </p>
            </div>
          </div>
        </div>

        {/* Panel de Coordinación: Los 5 Agentes del Curso */}
        <div className="bg-[#F8F9FA] border border-[#E0E3E6] rounded-[4px] p-3.5 space-y-2.5">
          <span className="text-xs font-bold text-[#2D3B45] flex items-center gap-1.5">
            <Layers size={14} className="text-[#008EE2]" />
            Coordinación Operativa del Curso: &quot;{selectedTemplate.titulo}&quot;
          </span>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
            <div className="bg-white p-2 rounded border border-gray-200 space-y-0.5">
              <span className="font-bold text-purple-700 block text-[10.5px]">🎨 Agente Creativo</span>
              <p className="text-[10px] text-[#55636E] leading-relaxed">{selectedTemplate.agenteCreativo}</p>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200 space-y-0.5">
              <span className="font-bold text-blue-700 block text-[10.5px]">📘 Agente Técnico</span>
              <p className="text-[10px] text-[#55636E] leading-relaxed">{selectedTemplate.agenteTecnico}</p>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200 space-y-0.5">
              <span className="font-bold text-amber-700 block text-[10.5px]">📅 Gestionador</span>
              <p className="text-[10px] text-[#55636E] leading-relaxed">{selectedTemplate.agenteGestionador}</p>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200 space-y-0.5">
              <span className="font-bold text-teal-700 block text-[10.5px]">📝 Corrector</span>
              <p className="text-[10px] text-[#55636E] leading-relaxed">{selectedTemplate.agenteCorrector}</p>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200 space-y-0.5">
              <span className="font-bold text-emerald-700 block text-[10.5px]">📊 Agente Excel</span>
              <p className="text-[10px] text-[#55636E] leading-relaxed">{selectedTemplate.agenteExcel}</p>
            </div>
          </div>

          {/* Rúbrica desglosada */}
          <div className="pt-2 border-t border-gray-200">
            <span className="text-[11px] font-bold text-[#2D3B45] block mb-1">
              Rúbrica Generada por el Agente Corrector (Criterios con Indicadores):
            </span>
            <div className="space-y-1">
              {selectedTemplate.rubricaSugerida.map((r, i) => (
                <div key={i} className="text-xs bg-white p-2 rounded border border-gray-200 flex justify-between items-center">
                  <div>
                    <strong className="text-[#2D3B45] text-xs">Criterio {i + 1}: {r.criterio}</strong>
                    <p className="text-[10.5px] text-[#6B7780]">{r.detalle}</p>
                  </div>
                  <span className="font-bold text-[#008EE2] text-xs shrink-0 ml-3 bg-blue-50 px-2 py-0.5 rounded">
                    {r.puntos} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-xs text-[#6B7780]">
            Al confirmar, la actividad queda disponible para los estudiantes y se habilita la columna de bonificación.
          </span>

          <div className="flex gap-2">
            <CanvasButton variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </CanvasButton>
            <CanvasButton variant="primary-udp" size="sm" onClick={handleConfirm}>
              Confirmar y Publicar en Ayudantía
            </CanvasButton>
          </div>
        </div>
      </div>
    </div>
  );
};
