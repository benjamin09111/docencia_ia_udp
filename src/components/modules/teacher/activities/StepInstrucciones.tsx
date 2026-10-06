"use client";

import React from "react";
import { ListOrdered, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";

interface StepInstruccionesProps {
  instrucciones: string;
  setInstrucciones: (v: string) => void;
  onGenerarIA: () => void;
  isGenerating: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export const StepInstrucciones: React.FC<StepInstruccionesProps> = ({
  instrucciones,
  setInstrucciones,
  onGenerarIA,
  isGenerating,
  onPrev,
  onNext,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start gap-2">
        <div>
          <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
            <ListOrdered size={16} className="text-[#008EE2]" />
            Paso 3: Instrucciones para Estudiantes
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Detalla los pasos que deben seguir los estudiantes para completar el taller.
          </p>
        </div>

        <button
          type="button"
          onClick={onGenerarIA}
          disabled={isGenerating}
          className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-[4px] text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs cursor-pointer disabled:opacity-50"
        >
          <Sparkles size={13} className="text-purple-700" />
          {isGenerating ? "Generando..." : "Generar con Agente Creativo"}
        </button>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-[#2D3B45]">
          Pauta e Instrucciones Paso a Paso (Editable)
        </label>
        <textarea
          rows={9}
          value={instrucciones}
          onChange={(e) => setInstrucciones(e.target.value)}
          className="w-full text-xs font-mono border border-gray-300 rounded-[4px] p-3 focus:ring-1 focus:ring-[#008EE2] leading-relaxed bg-[#FAFAFA]"
        />
      </div>

      <div className="pt-3 border-t flex justify-between">
        <CanvasButton variant="outline" size="sm" onClick={onPrev} icon={<ChevronLeft size={14} />}>
          Volver a Información
        </CanvasButton>
        <CanvasButton variant="primary-udp" size="sm" onClick={onNext} icon={<ChevronRight size={14} />}>
          Continuar a Rúbrica
        </CanvasButton>
      </div>
    </div>
  );
};
