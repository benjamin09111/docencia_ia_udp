"use client";

import React from "react";
import { Clock } from "lucide-react";
import { AttendanceAppeal } from "@/types/attendance";

const STATUS_STYLE: Record<string, string> = {
  resuelta: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  rechazada: "bg-rose-100 text-rose-800 border border-rose-200",
  pendiente: "bg-amber-100 text-amber-800 border border-amber-200",
};

interface AppealHistoryListProps {
  /** Ya filtradas: solo las del alumno seleccionado (privacidad) */
  appeals: AttendanceAppeal[];
  hasStudent: boolean;
}

export const AppealHistoryList: React.FC<AppealHistoryListProps> = ({ appeals, hasStudent }) => {
  if (!hasStudent) {
    return (
      <p className="p-4 text-center text-gray-500 bg-gray-50 rounded-[4px] border border-dashed border-gray-300">
        Selecciona tu nombre para ver tus apelaciones.
      </p>
    );
  }
  if (appeals.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-[4px] border border-dashed border-gray-300">
        <Clock size={18} className="mx-auto mb-1 text-gray-400" />
        <p className="text-[11px]">No tienes apelaciones registradas.</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {appeals.map((app) => (
        <div key={app.id} className="p-2.5 bg-white border border-gray-200 rounded-[4px] flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="font-bold text-[#2D3B45] text-[11px] uppercase">
              {app.motivo === "decimas" ? "Décimas" : "Asistencia"}
              <span className="ml-2 font-mono font-normal text-gray-500 normal-case">{app.date}</span>
            </div>
            {app.motivo === "decimas" && app.comentario && (
              <p className="text-[11px] text-[#55636E] break-words">&ldquo;{app.comentario}&rdquo;</p>
            )}
          </div>
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase shrink-0 ${STATUS_STYLE[app.status]}`}>
            {app.motivo === "decimas" && app.status === "resuelta" ? "atendida" : app.status}
          </span>
        </div>
      ))}
    </div>
  );
};
