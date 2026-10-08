"use client";

import React from "react";
import { StudentLearningProfile } from "@/types/learning";
import { Users, AlertTriangle, Award, Sparkles, TrendingUp } from "lucide-react";

interface LearningMetricsSummaryBarProps {
  profiles: StudentLearningProfile[];
}

export const LearningMetricsSummaryBar: React.FC<LearningMetricsSummaryBarProps> = ({ profiles }) => {
  const total = profiles.length;
  const enRiesgo = profiles.filter((p) => p.nivelRendimiento === "en_riesgo").length;
  const atencion = profiles.filter((p) => p.nivelRendimiento === "atencion").length;
  const destacados = profiles.filter((p) => p.nivelRendimiento === "destacado").length;
  const promedioNotas = total > 0 ? (profiles.reduce((acc, p) => acc + p.promedioActual, 0) / total).toFixed(1) : "0.0";
  const promedioAsistencia = total > 0 ? Math.round(profiles.reduce((acc, p) => acc + p.asistenciaPct, 0) / total) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-canvas-card">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7780]">
          <Users size={14} className="text-[#008EE2]" />
          <span>Alumnos Trazados</span>
        </div>
        <div className="text-xl font-bold text-[#2D3B45] mt-1">{total}</div>
        <div className="text-[11px] text-[#6B7780] mt-0.5">100% con perfil cognitivo</div>
      </div>

      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-canvas-card">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7780]">
          <TrendingUp size={14} className="text-[#2E7D32]" />
          <span>Promedio Curso</span>
        </div>
        <div className="text-xl font-bold text-[#2D3B45] mt-1">{promedioNotas}</div>
        <div className="text-[11px] text-[#2E7D32] mt-0.5">{promedioAsistencia}% asist. promedio</div>
      </div>

      <div className="bg-white border border-rose-200 bg-rose-50/40 rounded-[4px] p-3 shadow-canvas-card">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-800">
          <AlertTriangle size={14} className="text-rose-600" />
          <span>En Riesgo Pedagógico</span>
        </div>
        <div className="text-xl font-bold text-rose-700 mt-1">{enRiesgo}</div>
        <div className="text-[11px] text-rose-600 mt-0.5">Requieren tutoría urgente</div>
      </div>

      <div className="bg-white border border-amber-200 bg-amber-50/40 rounded-[4px] p-3 shadow-canvas-card">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
          <Sparkles size={14} className="text-amber-600" />
          <span>En Observación</span>
        </div>
        <div className="text-xl font-bold text-amber-700 mt-1">{atencion}</div>
        <div className="text-[11px] text-amber-700 mt-0.5">Seguimiento formativo</div>
      </div>

      <div className="bg-white border border-emerald-200 bg-emerald-50/40 rounded-[4px] p-3 shadow-canvas-card col-span-2 sm:col-span-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
          <Award size={14} className="text-emerald-600" />
          <span>Rendimiento Alto</span>
        </div>
        <div className="text-xl font-bold text-emerald-700 mt-1">{destacados}</div>
        <div className="text-[11px] text-emerald-700 mt-0.5">Autonomía y excelencia</div>
      </div>
    </div>
  );
};
