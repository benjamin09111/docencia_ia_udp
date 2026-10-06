"use client";

import React from "react";
import { CheckCircle2, ThumbsUp, ChevronLeft, Zap } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  CanvasOfficialRubricTable,
  RubricMatrixRubro,
} from "@/components/canvas/CanvasOfficialRubricTable";
import { MetodologiaDocente } from "@/constants/metodologiasDocentes";

interface StepResumenProps {
  metodologia: MetodologiaDocente;
  titulo: string;
  modalidad: "decimas" | "nota";
  decimas: string;
  targetEvaluacion: string;
  fecha: string;
  contenidoSeleccionado: string;
  contenidoManual: string;
  matrizRubros: RubricMatrixRubro[];
  onPrev: () => void;
  onPublish: () => void;
}

export const StepResumen: React.FC<StepResumenProps> = ({
  metodologia,
  titulo,
  modalidad,
  decimas,
  targetEvaluacion,
  fecha,
  contenidoSeleccionado,
  contenidoManual,
  matrizRubros,
  onPrev,
  onPublish,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-700" />
          Paso 5: Resumen Consolidado y Validación Final
        </h2>
        <p className="text-xs text-[#6B7780] mt-0.5">
          Verifica todos los datos y la pauta oficial antes de publicar la actividad en el curso.
        </p>
      </div>

      {/* Panel de Validación Pedagógica y Equidad */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-[4px] p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
            <ThumbsUp size={14} className="text-emerald-700" />
            Validación Pedagógica y Equidad de Participación
          </span>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
            Validada
          </span>
        </div>
        <p className="text-[11px] text-[#2E7D32] leading-relaxed">
          La actividad cuenta con roles colaborativos equilibrados, instrucciones claras con tiempos delimitados y matriz oficial estructurada sin sesgos de evaluación.
        </p>
      </div>

      {/* Ficha Resumen de la Actividad */}
      <div className="bg-gray-50 border border-gray-200 rounded-[4px] p-4 space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-2 pb-2 border-b border-gray-200">
          <div>
            <span className="text-gray-500 block text-[10.5px]">Tipo de Actividad:</span>
            <strong className="text-[#2D3B45]">{metodologia.nombreCorto}</strong>
          </div>
          <div>
            <span className="text-gray-500 block text-[10.5px]">Evaluación Extra:</span>
            <strong className="text-[#008EE2]">
              {modalidad === "decimas" ? `+${decimas} décimas (${targetEvaluacion})` : "Nota Formativa (1.0 - 7.0)"}
            </strong>
          </div>
          <div>
            <span className="text-gray-500 block text-[10.5px]">Fecha Límite:</span>
            <strong className="text-[#2D3B45]">{fecha}</strong>
          </div>
          <div>
            <span className="text-gray-500 block text-[10.5px]">Contenido Evaluado:</span>
            <strong className="text-[#2D3B45] truncate block">
              {contenidoSeleccionado.startsWith("Personalizado") ? contenidoManual || "Personalizado" : contenidoSeleccionado}
            </strong>
          </div>
        </div>

        <div>
          <span className="text-gray-500 block text-[10.5px]">Título Oficial:</span>
          <strong className="text-[#2D3B45]">{metodologia.nombreCorto}: {titulo}</strong>
        </div>
      </div>

      {/* Matriz Oficial Consolidada en el Resumen */}
      <div className="pt-2">
        <CanvasOfficialRubricTable
          rubros={matrizRubros}
          isEditable={false}
          tituloPauta={`PAUTA OFICIAL CONSOLIDADA: ${metodologia.nombreCorto.toUpperCase()}`}
          subtituloPauta="Matriz institucional que se publicará y sincronizará con el curso"
        />
      </div>

      <div className="pt-3 border-t flex justify-between">
        <CanvasButton variant="outline" size="sm" onClick={onPrev} icon={<ChevronLeft size={14} />}>
          Volver a Rúbrica
        </CanvasButton>
        <CanvasButton
          variant="primary-udp"
          size="sm"
          onClick={onPublish}
          icon={<Zap size={14} />}
        >
          Confirmar y Publicar actividad
        </CanvasButton>
      </div>
    </div>
  );
};
