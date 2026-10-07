"use client";

import React from "react";
import { ClassSession, AttendanceValue } from "@/types/attendance";
import { Building2, Award } from "lucide-react";

export interface StudentVisualRow {
  canvas_id: number;
  rut: string;
  asistidas: number;
  validas: number;
  pct: number;
  ok: boolean;
  decimas: number;
  trabajosRealizados: number;
}

interface PublicAttendanceRosterMatrixProps {
  sessions: ClassSession[];
  studentSummaries: StudentVisualRow[];
  attendanceMap: Record<string, AttendanceValue>;
  totalTrabajos: number;
  highlightedStudentId?: number;
}

export const PublicAttendanceRosterMatrix: React.FC<PublicAttendanceRosterMatrixProps> = ({
  sessions,
  studentSummaries,
  attendanceMap,
  totalTrabajos,
  highlightedStudentId,
}) => {
  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-xs overflow-hidden">
      <div className="p-3 bg-[#FAFBFB] border-b border-[#E0E3E6] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
        <span className="font-bold text-[#2D3B45] flex items-center gap-1.5">
          <Building2 size={14} className="text-[#008EE2]" />
          <span>Planilla Oficial de Ayudantías ({sessions.length} clases evaluadas a la fecha)</span>
        </span>
        <span className="text-[11px] text-[#6B7780]">
          1 = Presente • 0 = Ausente • — = Sin clase • Exigencia UDP: 75% Asistencia
        </span>
      </div>

      <div className="overflow-y-auto overflow-x-auto max-h-[640px] xl:max-h-[720px] rounded-[4px]">
        <table className="w-full text-left border-collapse text-xs min-w-[650px]">
          <thead className="sticky top-0 z-20 bg-[#2D3B45] text-white shadow-xs">
            <tr>
              <th className="p-2.5 border-r border-[#1E272E] sticky left-0 z-30 bg-[#2D3B45] w-12 min-w-[48px] text-center text-[10px] font-bold">
                #
              </th>
              <th className="p-2.5 border-r border-[#1E272E] sticky left-12 z-30 bg-[#2D3B45] w-[160px] min-w-[140px] text-xs font-bold">
                RUT Estudiante
              </th>
              <th className="p-2 text-center border-r border-[#1E272E] w-[95px] min-w-[85px] text-[11px] font-bold bg-[#1E272E] text-amber-300">
                <span className="flex items-center justify-center gap-1">
                  <Award size={12} /> Trabajos
                </span>
              </th>
              <th className="p-2 text-center border-r border-[#1E272E] w-[85px] min-w-[75px] text-[11px] font-bold bg-[#1E272E] text-emerald-300">
                Décimas
              </th>

              {sessions.map((sess) => {
                const parts = sess.fecha.split("-");
                const diaMes = parts.length === 3 ? `${parts[2]}/${parts[1]}` : sess.fecha;
                return (
                  <th
                    key={sess.id}
                    className="p-2 text-center border-r border-white/10 w-[55px] min-w-[48px] text-[11px] font-mono font-bold"
                    title={`Ayudantía del ${sess.fecha} (${sess.diaSemana})`}
                  >
                    <div className="flex flex-col items-center justify-center leading-none">
                      <span>{diaMes}</span>
                      <span className="text-[9px] text-gray-300 font-sans mt-0.5">Ayu</span>
                    </div>
                  </th>
                );
              })}

              <th className="p-2 text-center border-r border-[#1E272E] w-[58px] min-w-[52px] text-[11px] font-bold uppercase">
                Asist.
              </th>
              <th className="p-2 text-center border-r border-[#1E272E] w-[55px] min-w-[50px] text-[11px] font-bold uppercase">
                %
              </th>
              <th className="p-2 text-center w-[68px] min-w-[62px] text-[11px] font-bold uppercase">
                Estado
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {studentSummaries.map((st, idx) => {
              const isHighlighted = highlightedStudentId === st.canvas_id;
              return (
                <tr
                  key={st.canvas_id}
                  className={`group transition-colors ${
                    isHighlighted ? "bg-blue-100/80 font-semibold" : "hover:bg-blue-50/40"
                  }`}
                >
                  <td
                    className={`p-2 text-center sticky left-0 z-10 border-r border-gray-200 text-gray-400 font-mono text-xs ${
                      isHighlighted ? "bg-blue-100" : "bg-white group-hover:bg-blue-50"
                    }`}
                  >
                    {idx + 1}
                  </td>

                  {/* RUT (Sticky) - Sin Nombres para Privacidad */}
                  <td
                    className={`p-2 sticky left-12 z-10 border-r border-gray-200 font-mono text-xs font-bold text-[#2D3B45] ${
                      isHighlighted ? "bg-blue-100" : "bg-white group-hover:bg-blue-50"
                    }`}
                  >
                    {st.rut}
                  </td>

                  {/* Trabajos Realizados */}
                  <td className="p-1.5 text-center border-r border-gray-200 bg-amber-50/20 font-mono text-xs font-bold text-indigo-900">
                    <span className="bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                      {st.trabajosRealizados} / {totalTrabajos}
                    </span>
                  </td>

                  {/* Décimas Calculadas */}
                  <td className="p-1.5 text-center border-r border-gray-200 bg-emerald-50/25 font-mono text-xs font-bold">
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        st.decimas > 0
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "text-gray-400 bg-gray-50 border border-gray-200"
                      }`}
                    >
                      {st.decimas > 0 ? `+${st.decimas.toFixed(1)}d` : "0.0d"}
                    </span>
                  </td>

                  {/* Asistencia por Fecha */}
                  {sessions.map((sess) => {
                    const isCancelled = sess.estado === "cancelada";
                    if (isCancelled) {
                      return (
                        <td
                          key={sess.id}
                          className="p-1 text-center border-r border-gray-100 text-gray-300 font-mono text-xs bg-gray-50/70"
                          title="Sin clase"
                        >
                          —
                        </td>
                      );
                    }
                    const val = attendanceMap[`${sess.id}_${st.canvas_id}`] ?? 0;
                    return (
                      <td
                        key={sess.id}
                        className={`p-1 text-center border-r border-gray-100 font-mono text-xs font-bold ${
                          val === 1 ? "text-emerald-700 bg-emerald-50/40" : "text-rose-600 bg-rose-50/30"
                        }`}
                      >
                        {val}
                      </td>
                    );
                  })}

                  {/* Resúmenes */}
                  <td className="p-1 text-center border-r border-gray-200 font-mono text-xs text-[#2D3B45] bg-gray-50/60">
                    {st.asistidas}/{st.validas}
                  </td>
                  <td className="p-1 text-center border-r border-gray-200 font-mono text-xs font-bold bg-gray-50/60">
                    <span className={st.ok ? "text-emerald-700" : "text-[#C8102E]"}>
                      {st.pct}%
                    </span>
                  </td>
                  <td className="p-1 text-center font-bold text-xs bg-gray-50/60">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        st.ok
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-red-100 text-red-800 border border-red-300"
                      }`}
                    >
                      {st.ok ? "OK" : "RI"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
