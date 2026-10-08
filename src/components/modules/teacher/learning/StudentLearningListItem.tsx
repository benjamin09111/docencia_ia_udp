"use client";

import React from "react";
import { StudentLearningProfile, LearningPerformanceLevel } from "@/types/learning";
import { ChevronRight, AlertCircle, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

interface StudentLearningListItemProps {
  profile: StudentLearningProfile;
  isSelected: boolean;
  onSelect: () => void;
}

const LEVEL_CONFIG: Record<LearningPerformanceLevel, { label: string; badgeClass: string; icon: React.ReactNode }> = {
  destacado: {
    label: "Destacado",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 size={12} className="text-emerald-600" />,
  },
  favorable: {
    label: "Favorable",
    badgeClass: "bg-blue-50 text-[#008EE2] border-blue-200",
    icon: <Sparkles size={12} className="text-[#008EE2]" />,
  },
  atencion: {
    label: "Atención",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <AlertTriangle size={12} className="text-amber-600" />,
  },
  en_riesgo: {
    label: "En Riesgo",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    icon: <AlertCircle size={12} className="text-rose-600" />,
  },
};

export const StudentLearningListItem: React.FC<StudentLearningListItemProps> = ({
  profile,
  isSelected,
  onSelect,
}) => {
  const conf = LEVEL_CONFIG[profile.nivelRendimiento];
  const initials = `${profile.nombres.charAt(0)}${profile.apellidos.charAt(0)}`;

  return (
    <div
      onClick={onSelect}
      className={`p-3 border rounded-[4px] cursor-pointer transition-all flex items-center justify-between gap-3 select-none ${
        isSelected
          ? "bg-blue-50/60 border-[#008EE2] shadow-sm ring-1 ring-[#008EE2]/30"
          : "bg-white border-[#E0E3E6] hover:bg-gray-50/80 hover:border-gray-300"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
            isSelected
              ? "bg-[#008EE2] text-white"
              : "bg-[#F5F6F8] border border-[#C7CDD1] text-[#2D3B45]"
          }`}
        >
          {initials}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#2D3B45] truncate">
              {profile.nombres} {profile.apellidos}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#6B7780] mt-0.5">
            <span className="font-mono">Nota: {profile.promedioActual.toFixed(1)}</span>
            <span>•</span>
            <span>Asist: {profile.asistenciaPct}%</span>
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${conf.badgeClass}`}>
              {conf.icon}
              {conf.label}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="w-12 hidden sm:flex flex-col items-end gap-1">
          <span className="text-[10px] font-mono font-bold text-[#6B7780]">
            {profile.progresoGeneral}%
          </span>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                profile.progresoGeneral >= 80
                  ? "bg-emerald-500"
                  : profile.progresoGeneral >= 60
                  ? "bg-[#008EE2]"
                  : "bg-rose-500"
              }`}
              style={{ width: `${profile.progresoGeneral}%` }}
            />
          </div>
        </div>
        <ChevronRight size={16} className={isSelected ? "text-[#008EE2]" : "text-gray-400"} />
      </div>
    </div>
  );
};
