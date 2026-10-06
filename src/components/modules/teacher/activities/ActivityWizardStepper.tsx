"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { PASOS_WIZARD } from "@/constants/metodologiasDocentes";

interface ActivityWizardStepperProps {
  pasoActual: number;
  onSelectPaso: (paso: number) => void;
}

export const ActivityWizardStepper: React.FC<ActivityWizardStepperProps> = ({
  pasoActual,
  onSelectPaso,
}) => {
  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-canvas-card">
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {PASOS_WIZARD.map((p) => {
          const isActive = pasoActual === p.num;
          const isCompleted = pasoActual > p.num;

          return (
            <button
              key={p.num}
              type="button"
              onClick={() => onSelectPaso(p.num)}
              className={`py-2 px-1 sm:px-2 rounded-[4px] text-left transition-all border flex flex-col sm:flex-row items-center sm:items-center gap-1.5 cursor-pointer ${
                isActive
                  ? "border-[#008EE2] bg-[#F0F8FF] text-[#008EE2] font-bold"
                  : isCompleted
                  ? "border-emerald-200 bg-emerald-50/60 text-emerald-800"
                  : "border-transparent bg-gray-50/70 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                  isActive
                    ? "bg-[#008EE2] text-white"
                    : isCompleted
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {isCompleted ? <CheckCircle2 size={12} /> : p.num}
              </div>
              <span className="text-[10px] sm:text-xs truncate text-center sm:text-left">
                {p.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
