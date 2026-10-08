"use client";

import React from "react";
import { Calculator, Award, CheckCircle2, AlertTriangle } from "lucide-react";

interface DashboardGradingRulesSectionProps {
  courseCode: string;
}

export const DashboardGradingRulesSection: React.FC<DashboardGradingRulesSectionProps> = ({
  courseCode,
}) => {
  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card">
      <div className="border-b border-gray-100 pb-3 mb-4">
        <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
          <Calculator size={18} className="text-[#B71C1C]" />
          Cálculos de Nota Final, Ponderaciones & Reglamento (Programa Oficial)
        </h2>
        <p className="text-xs text-[#6B7780]">
          Reglas de evaluación y aprobación institucional extraídas del programa académico de {courseCode}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fórmula de Presentación */}
        <div className="bg-[#F5F6F8] border border-[#E0E3E6] rounded-[4px] p-4 space-y-2">
          <span className="text-[11px] font-bold text-[#2D3B45] flex items-center gap-1.5 uppercase tracking-wide">
            <Award size={14} className="text-[#008EE2]" />
            Fórmula de Presentación Oficial (NP)
          </span>

          <div className="bg-white border border-gray-200 rounded p-2.5 font-mono text-xs text-[#2D3B45] font-bold text-center">
            NP = (S1 · 0.30 + S2 · 0.30 + NT · 0.10) / 0.70
          </div>

          <p className="text-xs text-[#55636E] leading-relaxed">
            La Nota de Presentación (NP) pondera las evaluaciones teóricas (60%) y talleres prácticos (10%) normalizados al 70%. En modalidad capstone de taller, los 5 hitos entregables ponderan 20% cada uno.
          </p>
        </div>

        {/* Criterios de Aprobación y Eximición */}
        <div className="bg-[#F5F6F8] border border-[#E0E3E6] rounded-[4px] p-4 space-y-2.5 text-xs">
          <span className="text-[11px] font-bold text-[#2D3B45] flex items-center gap-1.5 uppercase tracking-wide">
            <CheckCircle2 size={14} className="text-[#2E7D32]" />
            Requisitos Institucionales de Aprobación
          </span>

          <ul className="space-y-1.5 text-[#55636E]">
            <li className="flex items-start gap-2">
              <span className="text-[#2E7D32] font-bold">✔</span>
              <span>
                <strong>Asistencia Obligatoria:</strong> Mínimo <strong>75%</strong> de presencialidad en cátedras y laboratorios.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2E7D32] font-bold">✔</span>
              <span>
                <strong>Condición de Eximición:</strong> Promedio de presentación <strong>NP ≥ 5.0</strong> (o 5.5 según mención) sin notas rojas en hitos críticos.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C8102E] font-bold">⚠</span>
              <span>
                <strong>Examen Final (30%):</strong> Rendido obligatoriamente por alumnos que no alcancen eximición o registren NP entre 3.5 y 4.9.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
