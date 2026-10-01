"use client";

import React, { useState } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import {
  Sparkles,
  Layers,
  FileText,
  Calendar,
  Clock,
  X,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  UploadCloud,
  Check,
} from "lucide-react";

export type EvaluationCategory =
  | "Control"
  | "Laboratorio"
  | "Solemne"
  | "Tarea / Investigación"
  | "Proyecto"
  | "Avances";

interface EvaluationCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseCode: string;
  courseName: string;
  onSave: (evaluacion: any) => void;
}

export const EvaluationCreateModal: React.FC<EvaluationCreateModalProps> = ({
  isOpen,
  onClose,
  courseCode,
  courseName,
  onSave,
}) => {
  const [tipo, setTipo] = useState<EvaluationCategory>("Solemne");
  const [titulo, setTitulo] = useState("Solemne Oficial 1 - Fundamentos y Arquitectura");
  const [ponderacion, setPonderacion] = useState("20%");
  const [tiempoMinutos, setTiempoMinutos] = useState("90 min");
  const [fechaAplicacion, setFechaAplicacion] = useState("2026-05-15");
  const [syncToCanvas, setSyncToCanvas] = useState(true);
  const [useAiCreativity, setUseAiCreativity] = useState(true);
  const [variarPruebaAnterior, setVariarPruebaAnterior] = useState(true);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    "Pregunta de Caso Fintech: Migración a Microservicios y Matriz de Riesgos (Nivel Intermedio)",
    "Pregunta Teórica: Diferencias entre WBS y Backlog Ágil según PMBOK 7ma Edición",
    "Pregunta de Aplicación: Estimación de Esfuerzo con Planning Poker ante cliente UDP",
  ]);

  if (!isOpen) return null;

  const handleTriggerAiCreativity = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setIsGeneratingAi(false);
      setAiSuggestions([
        "Nuevo Caso de Logística Portuaria: Rediseño de flujo de inventarios con arquitectura hexagonal (Variación prueba 2025)",
        "Pregunta de Análisis: Evaluación de deuda técnica y cálculo de burndown rate bajo presión de entrega",
        "Pregunta Práctica: Rúbrica de aceptación para entrega de MVP con 3 indicadores observables",
      ]);
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEval = {
      id: `eval_${Date.now()}`,
      titulo,
      tipo,
      codigo: courseCode,
      curso: courseName,
      ponderacion,
      tiempo: tiempoMinutos,
      fecha: fechaAplicacion,
      canvasSync: syncToCanvas,
      canvasId: syncToCanvas ? Math.floor(40000 + Math.random() * 9000) : undefined,
      preguntasCount: aiSuggestions.length,
      puntajeTotal: 70,
    };
    onSave(newEval);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-[#E0E3E6] rounded-[6px] shadow-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-start border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-[#008EE2] rounded border border-blue-200">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2D3B45]">
                Crear Evaluación Estándar UDP
              </h3>
              <p className="text-xs text-[#6B7780]">
                {courseCode} — Plataforma unificada de pruebas colegiadas y electivos
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Selector de Categorías Oficiales */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
              1. Categoría de Evaluación Oficial
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(["Control", "Laboratorio", "Solemne", "Tarea / Investigación", "Proyecto", "Avances"] as EvaluationCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setTipo(cat)}
                  className={`p-2 rounded border text-left flex items-center justify-between transition-all ${
                    tipo === cat
                      ? "border-[#008EE2] bg-blue-50/80 text-[#008EE2] font-bold shadow-xs"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{cat}</span>
                  {tipo === cat && <Check size={13} className="text-[#008EE2]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Datos Generales */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                Título de la Prueba
              </label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#008EE2] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                Ponderación Oficial
              </label>
              <input
                type="text"
                value={ponderacion}
                onChange={(e) => setPonderacion(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs font-bold text-[#008EE2] text-center"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                Fecha de Aplicación
              </label>
              <input
                type="date"
                value={fechaAplicacion}
                onChange={(e) => setFechaAplicacion(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                Tiempo Estimado
              </label>
              <input
                type="text"
                value={tiempoMinutos}
                onChange={(e) => setTiempoMinutos(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
              />
            </div>
          </div>

          {/* Asistente Creativo de Preguntas IA */}
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-[4px] space-y-2.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 font-bold text-purple-950">
                <Sparkles size={14} className="text-purple-600" />
                <span>Asistente de Creatividad y Variación de Preguntas IA</span>
              </div>
              <button
                type="button"
                onClick={handleTriggerAiCreativity}
                disabled={isGeneratingAi}
                className="px-2 py-1 text-[11px] font-semibold bg-white border border-purple-300 text-purple-800 rounded hover:bg-purple-100 flex items-center gap-1 shadow-2xs"
              >
                <Sparkles size={11} />
                <span>{isGeneratingAi ? "Generando..." : "Variar Preguntas de Otros Años"}</span>
              </button>
            </div>

            <p className="text-[11px] text-purple-900 leading-relaxed">
              <strong>Solución para Colegiadas y Electivos:</strong> Los profesores que comparten cátedra o electivos suelen repetir pruebas por falta de tiempo. El agente genera preguntas alternativas que <em>evalúan la misma competencia y RAPs sin matar a los alumnos</em>, variando la data, el caso de estudio y el contexto.
            </p>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 block">
                Preguntas Sugeridas por el Agente Creativo:
              </span>
              {aiSuggestions.map((sug, i) => (
                <div key={i} className="p-2 bg-white rounded border border-purple-200/80 text-[11px] text-gray-800 flex items-start gap-2">
                  <span className="font-bold text-purple-700">P{i + 1}:</span>
                  <span>{sug}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conexión con Módulo de Tareas en Canvas */}
          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-[4px] space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-blue-950">
              <input
                type="checkbox"
                checked={syncToCanvas}
                onChange={(e) => setSyncToCanvas(e.target.checked)}
                className="rounded text-[#008EE2] focus:ring-[#008EE2]"
              />
              <span className="flex items-center gap-1.5">
                <UploadCloud size={14} className="text-[#008EE2]" />
                Conectar y sincronizar automáticamente con Tareas de Canvas LMS
              </span>
            </label>
            <p className="text-[11px] text-blue-800 pl-6 leading-relaxed">
              Crea el hito con fecha límite, ponderación y rúbrica directamente en el módulo oficial de <em>Assignments / Tareas</em> de Canvas UDP.
            </p>
          </div>

          {/* Footer de Acciones */}
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <CanvasButton variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </CanvasButton>
            <CanvasButton variant="primary-canvas" size="sm" icon={<Check size={14} />}>
              Guardar y Publicar Evaluación
            </CanvasButton>
          </div>
        </form>
      </div>
    </div>
  );
};
