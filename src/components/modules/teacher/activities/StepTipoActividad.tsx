"use client";

import React from "react";
import { GraduationCap, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  MetodologiaDocente,
  catalogoMetodologiasDocentes,
} from "@/constants/metodologiasDocentes";

interface StepTipoActividadProps {
  selectedMetodologia: MetodologiaDocente;
  onSelectMetodologia: (m: MetodologiaDocente) => void;
  onNext: () => void;
}

export const StepTipoActividad: React.FC<StepTipoActividadProps> = ({
  selectedMetodologia,
  onSelectMetodologia,
  onNext,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
          <GraduationCap size={16} className="text-[#008EE2]" />
          Paso 1: Catálogo de Tipos de Actividad
        </h2>
        <p className="text-xs text-[#6B7780] mt-0.5">
          Selecciona la metodología pedagógica que deseas implementar. Cada opción incluye sus ventajas y formato recomendado.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {catalogoMetodologiasDocentes.map((m) => {
          const isSelected = m.id === selectedMetodologia.id;

          return (
            <div
              key={m.id}
              onClick={() => onSelectMetodologia(m)}
              className={`p-3.5 rounded-[4px] border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2.5 ${
                isSelected
                  ? "border-[#008EE2] bg-[#F0F8FF] ring-2 ring-[#008EE2] shadow-xs"
                  : "border-[#E0E3E6] bg-white hover:border-gray-400 hover:bg-gray-50/60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isSelected ? "text-[#008EE2]" : "text-[#2D3B45]"}`}>
                    {m.nombreCorto}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Clock size={10} /> {m.duracionSugerida}
                  </span>
                </div>
                <p className="text-[11px] text-[#55636E] line-clamp-2 leading-relaxed">
                  {m.descripcionDefecto}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <div className="text-[10.5px] text-[#2D3B45] bg-white p-1.5 rounded border border-gray-200">
                  <strong className="text-[#008EE2]">Ventaja:</strong> {m.ventajas}
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-500 truncate max-w-[170px]">
                    {m.contenidoSugerido.split(":")[0]}
                  </span>
                  {isSelected && (
                    <span className="text-[#008EE2] font-bold flex items-center gap-0.5">
                      <CheckCircle2 size={11} /> Seleccionada
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t flex justify-end">
        <CanvasButton
          variant="primary-udp"
          size="sm"
          onClick={onNext}
          icon={<ChevronRight size={14} />}
        >
          Continuar a Información
        </CanvasButton>
      </div>
    </div>
  );
};
