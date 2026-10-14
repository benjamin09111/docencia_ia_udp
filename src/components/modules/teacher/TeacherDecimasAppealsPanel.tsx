"use client";

import React, { useState, useMemo } from "react";
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { AttendanceAppeal } from "@/types/attendance";
import { resolveDecimasAppeals, rejectAppeals } from "@/services/appealsStore";

interface TeacherDecimasAppealsPanelProps {
  /** Apelaciones de décimas de la sección */
  appeals: AttendanceAppeal[];
  refresh: () => Promise<unknown>;
}

const STATUS_STYLE: Record<string, string> = {
  resuelta: "bg-emerald-100 text-emerald-800 border-emerald-300",
  rechazada: "bg-rose-100 text-rose-800 border-rose-300",
};

export const TeacherDecimasAppealsPanel: React.FC<TeacherDecimasAppealsPanelProps> = ({ appeals, refresh }) => {
  const [showResolved, setShowResolved] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pending = useMemo(() => appeals.filter((a) => a.status === "pendiente"), [appeals]);
  const done = useMemo(() => appeals.filter((a) => a.status !== "pendiente"), [appeals]);
  const list = showResolved ? done : pending;

  const act = async (app: AttendanceAppeal, action: "resolve" | "reject") => {
    if (busyId) return;
    setBusyId(app.id);
    setError(null);
    const ok = action === "resolve" ? await resolveDecimasAppeals([app]) : await rejectAppeals([app]);
    setBusyId(null);
    if (!ok) return setError("No se pudo actualizar la apelación. Revisa tu conexión.");
    await refresh();
  };

  const tabClass = (active: boolean) =>
    `px-3 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 cursor-pointer ${
      active ? "border-[#C8102E] text-[#C8102E]" : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
    }`;

  return (
    <div className="space-y-3">
      <div className="bg-amber-50 border border-amber-200 rounded-[4px] p-2.5 text-[11px] text-amber-900">
        Al marcar una apelación como <b>atendida</b> solo cambia su estado: las décimas del alumno las ajustas tú
        en la planilla.
      </div>

      {error && (
        <div className="p-2.5 rounded-[4px] text-xs font-semibold bg-rose-50 border border-rose-300 text-rose-900 flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex border-b border-gray-200 bg-white px-2 pt-1 rounded-t-[4px]">
        <button type="button" onClick={() => setShowResolved(false)} className={tabClass(!showResolved)}>
          <Clock size={13} />
          <span>Pendientes</span>
          <span className="px-1.5 bg-gray-200 text-gray-700 rounded-full text-[10px]">{pending.length}</span>
        </button>
        <button type="button" onClick={() => setShowResolved(true)} className={tabClass(showResolved)}>
          <CheckCircle2 size={13} />
          <span>Atendidas / rechazadas</span>
          <span className="px-1.5 bg-gray-200 text-gray-700 rounded-full text-[10px]">{done.length}</span>
        </button>
      </div>

      <div className="bg-white border border-[#E0E3E6] rounded-b-[4px] overflow-hidden shadow-xs">
        {list.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs">
            <Clock size={20} className="mx-auto mb-1.5 text-gray-300" />
            <p>No hay apelaciones de décimas en esta pestaña.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {list.map((app) => (
              <div key={app.id} className="p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1 min-w-0">
                  <span className="font-bold text-[#2D3B45] text-[13px]">{app.studentName}</span>
                  <p className="text-[#55636E] break-words">&ldquo;{app.comentario}&rdquo;</p>
                  <span className="text-[10px] text-gray-400 block font-mono">
                    Enviada: {new Date(app.createdAt).toLocaleString("es-CL")}
                  </span>
                </div>
                {app.status === "pendiente" ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() => act(app, "resolve")}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-[3px] flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 size={12} />
                      <span>Marcar atendida</span>
                    </button>
                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() => act(app, "reject")}
                      className="px-2 py-1.5 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-[3px] font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <XCircle size={12} />
                      <span>Rechazar</span>
                    </button>
                  </div>
                ) : (
                  <span className={`px-2 py-1 text-[11px] font-bold rounded uppercase border shrink-0 ${STATUS_STYLE[app.status]}`}>
                    {app.status === "resuelta" ? "atendida" : app.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
