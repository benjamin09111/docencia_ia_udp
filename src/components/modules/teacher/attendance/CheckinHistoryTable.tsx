"use client";

import React from "react";
import { KeyRound, MapPin, Copy, Check, AlertTriangle, Loader2 } from "lucide-react";
import { CloudCheckinLog } from "@/services/attendanceCloudService";

interface CheckinHistoryTableProps {
  logs: CloudCheckinLog[];
  copiedLogId: string | null;
  onCopy: (log: CloudCheckinLog) => void;
  isStudentPresentInSheet?: (sessionCode: string, studentCanvasId: number) => boolean;
  onMarkPresent?: (log: CloudCheckinLog) => void;
  markingLogIds?: Set<string>;
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export const CheckinHistoryTable: React.FC<CheckinHistoryTableProps> = ({
  logs,
  copiedLogId,
  onCopy,
  isStudentPresentInSheet,
  onMarkPresent,
  markingLogIds,
}) => (
  <div className="overflow-x-auto max-w-full">
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr className="bg-[#2D3B45] text-white text-[11px] uppercase tracking-wider font-bold">
          <th className="p-2 text-left w-[100px]">Clase</th>
          <th className="p-2 text-left w-[85px]">Hora</th>
          <th className="p-2 text-left">Estudiante</th>
          <th className="p-2 text-center w-[120px]">Método</th>
          <th className="p-2 text-center w-[185px]">En Planilla</th>
          <th className="p-2 text-center w-[60px]">Copiar</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#E0E3E6]">
        {logs.map((log) => {
          const isPresent = isStudentPresentInSheet ? isStudentPresentInSheet(log.sessionCode, log.studentCanvasId) : true;
          const isMarking = markingLogIds?.has(log.id);

          return (
            <tr key={log.id} className="hover:bg-[#F5F6F8] transition-colors">
              <td className="p-2 font-mono font-bold text-[#2D3B45]">{log.date}</td>
              <td className="p-2 font-mono text-[#2D3B45]">{formatTime(log.createdAt)}</td>
              <td className="p-2">
                <div className="font-semibold text-[#2D3B45]">{log.studentName}</div>
                <div className="text-[10px] text-[#6B7780] truncate max-w-[220px]">{log.studentEmail || "Estudiante UDP"}</div>
              </td>
              <td className="p-2 text-center">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {log.method.includes("GPS") ? <MapPin size={10} /> : <KeyRound size={10} />}
                  {log.method}
                </span>
              </td>
              <td className="p-2 text-center">
                {isPresent ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Check size={11} className="text-emerald-600" /> Presente (1)
                  </span>
                ) : (
                  <div className="inline-flex items-center gap-1.5 justify-center">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200" title="En la planilla de asistencia figura con 0">
                      <AlertTriangle size={10} className="text-amber-600" /> Ausente (0)
                    </span>
                    {onMarkPresent && (
                      <button
                        type="button"
                        disabled={isMarking}
                        onClick={() => onMarkPresent(log)}
                        className="px-2 py-0.5 bg-[#B71C1C] hover:bg-[#8B0000] text-white text-[10px] font-bold rounded shadow-xs flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
                        title="Poner 1 (Presente) en la planilla oficial"
                      >
                        {isMarking ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                        <span>Poner 1</span>
                      </button>
                    )}
                  </div>
                )}
              </td>
              <td className="p-2 text-center">
                <button
                  type="button"
                  onClick={() => onCopy(log)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-[#008EE2] cursor-pointer"
                  title="Copiar comprobante"
                >
                  {copiedLogId === log.id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
