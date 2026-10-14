"use client";

import React from "react";
import {
  GraduationCap,
  FileText,
  ListOrdered,
  Award,
  CheckCircle2,
  ChevronRight,
  Check,
} from "lucide-react";

interface ActivityWizardStepperProps {
  pasoActual: number;
  onSelectPaso: (paso: number) => void;
}

const PASOS = [
  { num: 1, label: "Metodología", icon: GraduationCap },
  { num: 2, label: "Información", icon: FileText },
  { num: 3, label: "Instrucciones", icon: ListOrdered },
  { num: 4, label: "Rúbrica", icon: Award },
  { num: 5, label: "Resumen", icon: CheckCircle2 },
];

export const ActivityWizardStepper: React.FC<ActivityWizardStepperProps> = ({
  pasoActual,
  onSelectPaso,
}) => {
  return (
    <div className="w-full py-1 select-none">
      {/* Flujo minimalista con iconos, sin bordes de caja */}
      <div className="flex items-center justify-between flex-wrap gap-y-2 gap-x-1 sm:gap-x-2">
        {PASOS.map((p, idx) => {
          const isActive = pasoActual === p.num;
          const isCompleted = pasoActual > p.num;
          const Icon = p.icon;

          return (
            <React.Fragment key={p.num}>
              <button
                type="button"
                onClick={() => onSelectPaso(p.num)}
                className={`flex items-center gap-2 py-1 px-1.5 transition-colors cursor-pointer text-xs sm:text-[13px] ${
                  isActive
                    ? "text-[#B71C1C] font-bold"
                    : isCompleted
                    ? "text-[#2D3B45] hover:text-[#B71C1C] font-medium"
                    : "text-gray-400 hover:text-gray-600 font-normal"
                }`}
              >
                {/* Ícono temático sutil */}
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? "bg-red-50 text-[#B71C1C]"
                      : isCompleted
                      ? "bg-gray-100 text-[#2D3B45]"
                      : "text-gray-400"
                  }`}
                >
                  {isCompleted ? <Check size={13} className="stroke-[2.5]" /> : <Icon size={14} />}
                </span>

                <span>{p.label}</span>
              </button>

              {idx < PASOS.length - 1 && (
                <ChevronRight size={13} className="text-gray-300 shrink-0 hidden sm:inline" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Línea de progreso delgada de 2px (sin recuadro) */}
      <div className="w-full bg-gray-100 h-[2px] rounded-full mt-2 overflow-hidden">
        <div
          className="bg-[#B71C1C] h-full transition-all duration-300"
          style={{ width: `${(pasoActual / PASOS.length) * 100}%` }}
        />
      </div>
    </div>
  );
};
