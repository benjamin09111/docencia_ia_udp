"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { AppealStudentGroup } from "@/utils/appealGrouping";

interface AppealStudentRowProps {
  group: AppealStudentGroup;
  pending: boolean;
  busy: boolean;
  onAccept: (group: AppealStudentGroup) => void;
  onReject: (group: AppealStudentGroup) => void;
}

const CHIP: Record<string, string> = {
  pendiente: "bg-blue-50 text-[#008EE2] border-blue-200",
  resuelta: "bg-emerald-50 text-emerald-800 border-emerald-200",
  rechazada: "bg-rose-50 text-rose-800 border-rose-200",
};

export const AppealStudentRow: React.FC<AppealStudentRowProps> = ({ group, pending, busy, onAccept, onReject }) => {
  const n = group.appeals.length;
  return (
    <div className="p-3 hover:bg-gray-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
      <div className="space-y-1.5 min-w-0">
        <span className="font-bold text-[#2D3B45] text-[13px]">{group.studentName}</span>
        <div className="flex flex-wrap gap-1.5">
          {group.appeals.map((a) => (
            <span
              key={a.id}
              title={a.resolvedAt ? `Resuelto: ${new Date(a.resolvedAt).toLocaleString("es-CL")}` : undefined}
              className={`font-mono text-[11px] px-1.5 py-0.5 border rounded font-semibold ${CHIP[a.status]}`}
            >
              {a.date}
            </span>
          ))}
        </div>
        <span className="text-[10px] text-gray-400 block font-mono">
          Enviada: {new Date(group.latestAt).toLocaleString("es-CL")}
        </span>
      </div>

      {pending && (
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={busy}
            onClick={() => onAccept(group)}
            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-[3px] shadow-2xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
            title="Marca presente en TODAS las fechas apeladas"
          >
            <CheckCircle2 size={12} />
            <span>Aceptar {n > 1 ? `las ${n} fechas` : "(Presente)"}</span>
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onReject(group)}
            className="px-2 py-1.5 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-[3px] font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <XCircle size={12} />
            <span>Rechazar</span>
          </button>
        </div>
      )}
    </div>
  );
};
