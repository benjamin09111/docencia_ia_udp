"use client";

import React from "react";
import { StudentStudyMetrics } from "@/types";
import { Brain, CheckCircle2, Flame, HelpCircle, Trophy } from "lucide-react";

interface PracticeMetricsBarProps {
  metrics: StudentStudyMetrics;
}

export const PracticeMetricsBar: React.FC<PracticeMetricsBarProps> = ({ metrics }) => {
  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-canvas-card">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[4px] bg-[#2D3B45] text-white flex items-center justify-center font-bold">
          <Brain size={20} className="text-[#008EE2]" />
        </div>
        <div>
          <span className="text-xs font-bold text-[#6B7780] uppercase tracking-wider block">
            Métricas de Preparación Formativa
          </span>
          <h3 className="text-sm font-bold text-[#2D3B45]">
            Tu Registro de Práctica para la Solemne
          </h3>
        </div>
      </div>

      {/* Contadores Ligeros */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto text-xs">
        <div className="bg-[#F9FAFB] border border-[#E0E3E6] px-3 py-1.5 rounded-[4px] text-center">
          <span className="text-xs text-[#6B7780] block font-medium">Preguntas Practicadas</span>
          <span className="text-base font-extrabold text-[#008EE2] flex items-center justify-center gap-1">
            <HelpCircle size={14} /> {metrics.preguntasRealizadas}
          </span>
        </div>

        <div className="bg-[#F9FAFB] border border-[#E0E3E6] px-3 py-1.5 rounded-[4px] text-center">
          <span className="text-xs text-[#6B7780] block font-medium">Actividades Creadas</span>
          <span className="text-base font-extrabold text-[#2D3B45] flex items-center justify-center gap-1">
            <Brain size={14} className="text-[#008EE2]" /> {metrics.actividadesCompletadas}
          </span>
        </div>

        <div className="bg-[#F9FAFB] border border-[#E0E3E6] px-3 py-1.5 rounded-[4px] text-center">
          <span className="text-xs text-[#6B7780] block font-medium">Quizzes Resueltos</span>
          <span className="text-base font-extrabold text-[#2E7D32] flex items-center justify-center gap-1">
            <CheckCircle2 size={14} /> {metrics.quizzesRespondidos}
          </span>
        </div>

        <div className="bg-[#F9FAFB] border border-[#E0E3E6] px-3 py-1.5 rounded-[4px] text-center">
          <span className="text-xs text-[#6B7780] block font-medium">Benchmark Curso</span>
          <span className="text-xs font-bold text-[#2E7D32] bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded inline-block mt-0.5">
            Top 15% Activo
          </span>
        </div>
      </div>
    </div>
  );
};
