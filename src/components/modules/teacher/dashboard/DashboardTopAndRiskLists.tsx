"use client";

import React from "react";
import { StudentExcelRow } from "@/types";
import { Award, AlertTriangle, ArrowRight, UserX } from "lucide-react";

interface DashboardTopAndRiskListsProps {
  topStudents: StudentExcelRow[];
  atRiskStudents: StudentExcelRow[];
  dropoutStudents: StudentExcelRow[];
  onNavigateTab: (tabId: string) => void;
}

export const DashboardTopAndRiskLists: React.FC<DashboardTopAndRiskListsProps> = ({
  topStudents,
  atRiskStudents,
  dropoutStudents,
  onNavigateTab,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Top 3 Rendimiento */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card space-y-3">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <h3 className="text-xs font-bold text-[#2D3B45] flex items-center gap-1.5 uppercase tracking-wide">
            <Award size={15} className="text-amber-500" />
            Estudiantes con Mejor Rendimiento (Top 3)
          </h3>
          <button
            type="button"
            onClick={() => onNavigateTab("excel")}
            className="text-[11px] text-[#008EE2] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            Ver nómina <ArrowRight size={11} />
          </button>
        </div>

        <div className="space-y-2">
          {topStudents.map((st, i) => (
            <div key={st.canvas_id || i} className="flex justify-between items-center p-2.5 bg-[#F5F6F8] rounded text-xs border border-gray-100">
              <div className="min-w-0">
                <p className="font-semibold text-[#2D3B45] truncate">
                  {st.nombres} {st.apellidos}
                </p>
                <span className="text-[11px] text-[#6B7780] font-mono">{st.rut}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-[#2E7D32] text-sm">{st.nota_final.toFixed(1)}</span>
                <span className="text-[10px] text-[#6B7780] block">{st.asistencia_pct || 90}% Asist.</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerta Temprana, Riesgo y Abandono de Carrera */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card space-y-3">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <h3 className="text-xs font-bold text-[#2D3B45] flex items-center gap-1.5 uppercase tracking-wide">
            <AlertTriangle size={15} className="text-[#C8102E]" />
            Alerta Temprana & Retención ({atRiskStudents.length + dropoutStudents.length})
          </h3>
          <button
            type="button"
            onClick={() => onNavigateTab("asistencia")}
            className="text-[11px] text-[#B71C1C] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            Revisar asistencia <ArrowRight size={11} />
          </button>
        </div>

        <div className="space-y-2">
          {/* Estudiantes que han abandonado la carrera */}
          {dropoutStudents.map((st, i) => (
            <div key={`drop-${st.canvas_id || i}`} className="flex justify-between items-center p-2.5 bg-red-100/70 rounded text-xs border border-red-200">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <UserX size={13} className="text-[#B71C1C] shrink-0" />
                  <p className="font-bold text-[#B71C1C] truncate">
                    {st.nombres} {st.apellidos}
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-red-700 block mt-0.5">
                  Abandono de carrera formalizado en SIS UDP (Sin asistencia)
                </span>
              </div>
              <div className="text-right shrink-0 ml-2">
                <span className="text-[10px] bg-red-200 text-red-900 font-bold px-1.5 py-0.5 rounded">
                  Retirado
                </span>
              </div>
            </div>
          ))}

          {/* Estudiantes con bajo rendimiento o baja asistencia */}
          {atRiskStudents.map((st, i) => (
            <div key={st.canvas_id || i} className="flex justify-between items-center p-2.5 bg-red-50/60 rounded text-xs border border-red-100">
              <div className="min-w-0">
                <p className="font-semibold text-[#2D3B45] truncate">
                  {st.nombres} {st.apellidos}
                </p>
                <span className="text-[11px] text-[#C8102E] font-medium">
                  {st.nota_final < 4.0 ? "Promedio bajo (< 4.0)" : "Asistencia bajo 75%"}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-[#C8102E] text-sm">{st.nota_final.toFixed(1)}</span>
                <span className="text-[10px] text-[#6B7780] block">{st.asistencia_pct || 65}% Asist.</span>
              </div>
            </div>
          ))}

          {atRiskStudents.length === 0 && dropoutStudents.length === 0 && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded text-center">
              🎉 No hay estudiantes en situación de riesgo ni abandono en esta sección.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
