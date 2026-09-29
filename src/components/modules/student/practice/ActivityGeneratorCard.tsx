"use client";

import React, { useState } from "react";
import { StudyActivityType } from "@/types";
import { UNIDADES_CURSO } from "@/services/studyGeneratorService";
import { Sparkles, Layers, ListChecks, Lightbulb, PenTool, ArrowRight } from "lucide-react";

interface ActivityGeneratorCardProps {
  onGenerate: (params: { unidadId: string; tipo: StudyActivityType; customPrompt?: string }) => void;
  isGenerating: boolean;
}

export const ActivityGeneratorCard: React.FC<ActivityGeneratorCardProps> = ({
  onGenerate,
  isGenerating,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<string>(UNIDADES_CURSO[0].id);
  const [selectedType, setSelectedType] = useState<StudyActivityType>("quiz");
  const [customPrompt, setCustomPrompt] = useState<string>("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      unidadId: selectedUnit,
      tipo: selectedType,
      customPrompt: customPrompt.trim() ? customPrompt.trim() : undefined,
    });
  };

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Generador de Evaluaciones Formativas
          </span>
          <h3 className="text-sm font-bold text-[#2D3B45] flex items-center gap-1.5 mt-0.5">
            <Sparkles size={16} className="text-[#C8102E]" />
            Configurar Actividad de Estudio para la Solemne
          </h3>
        </div>
        <span className="text-[11px] text-[#6B7780] bg-gray-100 px-2 py-0.5 rounded">
          Alimentado por Agente IA Cátedra UDP
        </span>
      </div>

      <form onSubmit={handleCreate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Selector de Unidad */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#2D3B45] flex items-center gap-1.5">
              <Layers size={13} className="text-[#008EE2]" />
              1. Selecciona la Unidad a Estudiar:
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-[4px] p-2 bg-white text-[#2D3B45] focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
            >
              {UNIDADES_CURSO.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Formato / Modalidad */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#2D3B45] flex items-center gap-1.5">
              <ListChecks size={13} className="text-[#008EE2]" />
              2. Formato de la Actividad:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedType("quiz")}
                className={`p-2 rounded-[4px] border text-center transition-all text-xs flex flex-col items-center gap-1 ${
                  selectedType === "quiz"
                    ? "border-[#008EE2] bg-blue-50/70 text-[#008EE2] font-bold"
                    : "border-gray-200 bg-white text-[#6B7780] hover:border-gray-300"
                }`}
              >
                <ListChecks size={15} />
                <span>Quiz</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType("caso_reflexion")}
                className={`p-2 rounded-[4px] border text-center transition-all text-xs flex flex-col items-center gap-1 ${
                  selectedType === "caso_reflexion"
                    ? "border-[#008EE2] bg-blue-50/70 text-[#008EE2] font-bold"
                    : "border-gray-200 bg-white text-[#6B7780] hover:border-gray-300"
                }`}
              >
                <Lightbulb size={15} />
                <span>Caso Reflexión</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType("desarrollo")}
                className={`p-2 rounded-[4px] border text-center transition-all text-xs flex flex-col items-center gap-1 ${
                  selectedType === "desarrollo"
                    ? "border-[#008EE2] bg-blue-50/70 text-[#008EE2] font-bold"
                    : "border-gray-200 bg-white text-[#6B7780] hover:border-gray-300"
                }`}
              >
                <PenTool size={15} />
                <span>Ensayo Solemne</span>
              </button>
            </div>
          </div>
        </div>

        {/* Input Libre Personalizado */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#2D3B45] flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles size={13} className="text-purple-600" />
              3. ¿Deseas enfocarlo en algo específico? (Opcional):
            </span>
            <span className="text-[10px] text-[#6B7780]">Ej: "Generar preguntas sobre cálculo de RTO y RPO con failover"</span>
          </label>
          <input
            type="text"
            placeholder="Escribe aquí un tema puntual del curso para que la IA arme la actividad a tu medida..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full text-xs border border-gray-300 rounded-[4px] px-3 py-2 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
          />
        </div>

        {/* Botón de Generación */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isGenerating}
            className="px-5 py-2.5 bg-[#C8102E] hover:bg-[#A00D24] text-white rounded-[4px] text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50 shadow-xs"
          >
            {isGenerating ? (
              <>
                <Sparkles size={14} className="animate-spin" />
                <span>Elaborando actividad con base de cátedra...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Generar Actividad con IA</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
