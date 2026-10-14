"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Wand2, Scale } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";

interface ScoreBalanceBannerProps {
  sumaActual: number;
  esValido60: boolean;
  onAutoAjustar: () => void;
}

export const ScoreBalanceBanner: React.FC<ScoreBalanceBannerProps> = ({
  sumaActual,
  esValido60,
  onAutoAjustar,
}) => {
  return (
    <div className="space-y-2.5">
      {/* Selector / Indicador de Tipo de Escala */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#F5F6F8] border border-[#C7CDD1] rounded-[4px] px-3.5 py-2">
        <div className="flex items-center gap-2">
          <Scale size={16} className="text-[#2D3B45]" />
          <span className="text-xs font-bold text-[#2D3B45]">
            Opción de Evaluación Oficial:
          </span>
          <span className="text-xs font-semibold text-[#008EE2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
            Puntaje Máximo 60 pts (0 a 60 pts — Escala UDP con base 1.0)
          </span>
        </div>
        <span className="text-[11px] text-[#6B7780]">
          Exigencia estándar: 36 pts = Nota 4.0
        </span>
      </div>

      {/* Banner reactivo de suma en tiempo real */}
      <div
        className={`p-3.5 rounded-[4px] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
          esValido60
            ? "bg-[#E8F5E9] border-[#C8E6C9] text-[#2E7D32]"
            : sumaActual < 60
            ? "bg-amber-50 border-amber-200 text-amber-900"
            : "bg-red-50 border-red-200 text-red-900"
        }`}
      >
        <div className="flex items-center gap-2.5">
          {esValido60 ? (
            <CheckCircle2 size={18} className="text-[#2E7D32] shrink-0" />
          ) : sumaActual < 60 ? (
            <AlertTriangle size={18} className="text-amber-600 shrink-0" />
          ) : (
            <XCircle size={18} className="text-[#B71C1C] shrink-0" />
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                Balance de Puntaje en Tiempo Real:
              </span>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-white/90 border border-current">
                {sumaActual} / 60 pts
              </span>
            </div>
            <p className="text-xs mt-0.5">
              {esValido60
                ? "¡Puntaje cuadrado exacto! La pauta y rúbrica del Paso 4 se generan automáticamente con estos 60 puntos."
                : sumaActual < 60
                ? `Faltan ${60 - sumaActual} puntos por asignar para completar los 60 puntos requeridos.`
                : `El puntaje supera el límite institucional por ${sumaActual - 60} puntos.`}
            </p>
          </div>
        </div>

        {!esValido60 && (
          <CanvasButton
            variant="outline"
            size="sm"
            onClick={onAutoAjustar}
            icon={<Wand2 size={13} />}
            className="!text-xs self-end sm:self-auto shrink-0 bg-white shadow-2xs hover:border-[#B71C1C]"
          >
            Ajustar a 60 pts
          </CanvasButton>
        )}
      </div>
    </div>
  );
};
