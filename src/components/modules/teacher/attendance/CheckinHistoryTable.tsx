"use client";

import React from "react";
import { KeyRound, MapPin, Copy, Check } from "lucide-react";
import { CloudCheckinLog } from "@/services/attendanceCloudService";

interface CheckinHistoryTableProps {
  logs: CloudCheckinLog[];
  copiedLogId: string | null;
  onCopy: (log: CloudCheckinLog) => void;
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export const CheckinHistoryTable: React.FC<CheckinHistoryTableProps> = ({ logs, copiedLogId, onCopy }) => (
  <div className="overflow-x-auto max-w-full">
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr className="bg-[#2D3B45] text-white text-[11px] uppercase tracking-wider font-bold">
          <th className="p-2 text-left w-[110px]">Clase</th>
          <th className="p-2 text-left w-[90px]">Hora</th>
          <th className="p-2 text-left">Estudiante</th>
          <th className="p-2 text-center w-[130px]">Método</th>
          <th className="p-2 text-center w-[70px]">Copiar</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#E0E3E6]">
        {logs.map((log) => (
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
        ))}
      </tbody>
    </table>
  </div>
);
