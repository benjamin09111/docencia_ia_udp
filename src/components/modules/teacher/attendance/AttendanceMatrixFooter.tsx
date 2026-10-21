"use client";

import React from "react";
import { ClassSession, AttendanceValue, StudentAttendanceSummary, StudentWorkRecord } from "@/types/attendance";
import { getAttendanceValue } from "@/services/attendanceStore";

export interface MonthGroupItem {
  key: string;
  monthNum: string;
  name: string;
  shortName: string;
  sessions: ClassSession[];
}

interface AttendanceMatrixFooterProps {
  monthGroups: MonthGroupItem[];
  collapsedMonths: Record<string, boolean>;
  summaries: StudentAttendanceSummary[];
  attendanceMap: Record<string, AttendanceValue>;
  scheduleMap: Record<string, "H1" | "H2">;
  isAyud: boolean;
  studentWorkRecords: Record<number, StudentWorkRecord>;
  decimasPorTrabajo: number;
}

export const AttendanceMatrixFooter: React.FC<AttendanceMatrixFooterProps> = ({
  monthGroups,
  collapsedMonths,
  summaries,
  attendanceMap,
  scheduleMap,
  isAyud,
  studentWorkRecords,
  decimasPorTrabajo,
}) => {
  const getCounts = (sess: ClassSession) => {
    let h1 = 0;
    let h2 = 0;
    summaries.forEach((sum) => {
      const val = getAttendanceValue(attendanceMap, sess.id, sum.canvas_id);
      if (val === 1) {
        const sched =
          scheduleMap[`${sess.id}_${sum.canvas_id}`] ||
          scheduleMap[`${sess.seccionId}_${sum.canvas_id}_${sess.fecha}`] ||
          "H1";
        if (sched === "H2") h2++;
        else h1++;
      }
    });
    return { h1, h2, total: h1 + h2 };
  };

  const getMonthAvg = (grp: MonthGroupItem, type: "h1" | "h2" | "total") => {
    if (grp.sessions.length === 0) return 0;
    const sumVal = grp.sessions.reduce((acc, sess) => acc + getCounts(sess)[type], 0);
    return Math.round(sumVal / grp.sessions.length);
  };

  return (
    <tfoot>
      {/* 1. Fila Horario 1 (Principal) */}
      <tr className="bg-emerald-50/80 font-bold text-emerald-950 border-t border-emerald-300">
        <td className="p-1.5 px-2 sticky left-0 z-10 bg-emerald-50 border-r border-emerald-300 uppercase text-[10px] text-emerald-900 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block shrink-0"></span>
          <span>Presentes Horario 1</span>
        </td>

        {monthGroups.map((grp) => {
          if (collapsedMonths[grp.key]) {
            const avg1 = getMonthAvg(grp, "h1");
            return (
              <td key={`h1_col_${grp.key}`} className="p-1 text-center font-mono text-[10px] border-l border-emerald-200 bg-emerald-100/50" title={`Promedio H1 en ${grp.name}: ${avg1}`}>
                <span className="px-1 py-0.5 bg-white border border-emerald-300 rounded text-emerald-800 font-bold">~{avg1}</span>
              </td>
            );
          }

          return grp.sessions.map((s) => {
            const counts = getCounts(s);
            return (
              <td key={`h1_${s.id}`} className="p-1 text-center font-mono text-[11px] border-l border-emerald-200">
                <span className="px-1.5 py-0.5 bg-white border border-emerald-300 rounded text-emerald-800 font-bold shadow-2xs">
                  {counts.h1}
                </span>
              </td>
            );
          });
        })}

        {isAyud && (
          <td colSpan={2} className="p-1 text-center text-[10px] text-emerald-800 font-semibold border-l border-emerald-300 bg-emerald-50">
            Horario 1
          </td>
        )}
        <td colSpan={3} className="p-1 text-center text-[10px] text-emerald-800 font-medium border-l border-emerald-300">
          Principal
        </td>
      </tr>

      {/* 2. Fila Horario 2 (Secundario / Alternativo) */}
      <tr className="bg-blue-50/80 font-bold text-blue-950 border-t border-blue-300">
        <td className="p-1.5 px-2 sticky left-0 z-10 bg-blue-50 border-r border-blue-300 uppercase text-[10px] text-blue-900 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#008EE2] inline-block shrink-0"></span>
          <span>Presentes Horario 2</span>
        </td>

        {monthGroups.map((grp) => {
          if (collapsedMonths[grp.key]) {
            const avg2 = getMonthAvg(grp, "h2");
            return (
              <td key={`h2_col_${grp.key}`} className="p-1 text-center font-mono text-[10px] border-l border-blue-200 bg-blue-100/50" title={`Promedio H2 en ${grp.name}: ${avg2}`}>
                <span className="px-1 py-0.5 bg-white border border-blue-300 rounded text-blue-800 font-bold">~{avg2}</span>
              </td>
            );
          }

          return grp.sessions.map((s) => {
            const counts = getCounts(s);
            return (
              <td key={`h2_${s.id}`} className="p-1 text-center font-mono text-[11px] border-l border-blue-200">
                <span className="px-1.5 py-0.5 bg-white border border-blue-300 rounded text-[#008EE2] font-bold shadow-2xs">
                  {counts.h2}
                </span>
              </td>
            );
          });
        })}

        {isAyud && (
          <td colSpan={2} className="p-1 text-center text-[10px] text-blue-800 font-semibold border-l border-blue-300 bg-blue-50">
            Horario 2
          </td>
        )}
        <td colSpan={3} className="p-1 text-center text-[10px] text-blue-800 font-medium border-l border-blue-300">
          Secundario
        </td>
      </tr>

      {/* 3. Fila Totalizadora: Total Presentes del Día */}
      <tr className="bg-gray-100 font-black text-[#2D3B45] border-t-2 border-gray-400">
        <td className="p-1.5 px-2 sticky left-0 z-10 bg-gray-100 border-r border-gray-400 uppercase text-[10px] text-gray-700 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#2D3B45] inline-block shrink-0"></span>
          <span>Total Presentes del Día</span>
        </td>

        {monthGroups.map((grp) => {
          if (collapsedMonths[grp.key]) {
            const avgTot = getMonthAvg(grp, "total");
            return (
              <td key={`tot_col_${grp.key}`} className="p-1 text-center font-mono text-[10px] border-l border-gray-300 bg-gray-200/50" title={`Promedio Total en ${grp.name}: ${avgTot}`}>
                <span className="px-1 py-0.5 bg-white border border-gray-400 rounded text-[#2D3B45] font-black">~{avgTot}</span>
              </td>
            );
          }

          return grp.sessions.map((s) => {
            const counts = getCounts(s);
            return (
              <td key={`tot_${s.id}`} className="p-1 text-center font-mono text-[11px] border-l border-gray-300">
                <span className="px-1.5 py-0.5 bg-white border border-gray-400 rounded text-[#2D3B45] font-black shadow-2xs">
                  {counts.total}
                </span>
              </td>
            );
          });
        })}

        {isAyud && (
          <>
            <td className="p-1 text-center font-mono text-[10px] border-l border-gray-300 bg-amber-50 text-amber-950 font-bold">
              {summaries.reduce((acc, s) => acc + (studentWorkRecords[s.canvas_id]?.trabajosRealizados || 0), 0)} trab.
            </td>
            <td className="p-1 text-center font-mono text-[10px] border-l border-gray-300 bg-emerald-50 text-emerald-950 font-bold">
              +{summaries.reduce((acc, s) => acc + ((studentWorkRecords[s.canvas_id]?.trabajosRealizados || 0) * decimasPorTrabajo), 0).toFixed(1)}d
            </td>
          </>
        )}

        <td colSpan={3} className="p-1 text-center text-[10px] text-[#6B7780] font-medium border-l border-gray-300">
          75% Mín. UDP
        </td>
      </tr>
    </tfoot>
  );
};
