"use client";

import React, { useState, useMemo } from "react";
import { CheckCheck, CheckCircle2, Clock, AlertCircle, RotateCcw } from "lucide-react";
import { AttendanceAppeal } from "@/types/attendance";
import { resolveAppeals, rejectAppeals } from "@/services/appealsStore";
import { groupAppealsByStudent, AppealStudentGroup } from "@/utils/appealGrouping";
import { AppealStudentRow } from "./AppealStudentRow";

interface TeacherAttendanceAppealsPanelProps {
  /** Apelaciones de asistencia de la sección */
  appeals: AttendanceAppeal[];
  refresh: () => Promise<unknown>;
  /** Se invoca SOLO con las apelaciones que la base confirmó como resueltas (ya quedaron presentes en la nube) */
  onAppealsResolved: (resolved: AttendanceAppeal[]) => void;
}

type Tab = "pendientes" | "resueltas";

export const TeacherAttendanceAppealsPanel: React.FC<TeacherAttendanceAppealsPanelProps> = ({
  appeals,
  refresh,
  onAppealsResolved,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("pendientes");
  const [notification, setNotification] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const pendingList = useMemo(() => appeals.filter((a) => a.status === "pendiente"), [appeals]);
  const resolvedList = useMemo(() => appeals.filter((a) => a.status !== "pendiente"), [appeals]);
  const groups = useMemo(
    () => groupAppealsByStudent(activeTab === "pendientes" ? pendingList : resolvedList),
    [activeTab, pendingList, resolvedList]
  );

  const notify = (text: string, ok = true) => {
    setNotification({ ok, text });
    setTimeout(() => setNotification(null), 7000);
  };

  // Resuelve TODAS las fechas indicadas en una única operación atómica de la base
  const resolve = async (list: AttendanceAppeal[], label: string) => {
    if (list.length === 0 || busy) return;
    setBusy(true);
    const result = await resolveAppeals(list);
    setBusy(false);
    if (!result) {
      notify("No se pudieron resolver las apelaciones. Revisa tu conexión: no se modificó nada.", false);
      return;
    }
    await refresh();
    if (result.resolved.length > 0) onAppealsResolved(result.resolved);
    if (result.failed.length > 0) {
      const detail = result.failed.map((a) => `${a.studentName} (${a.date})`).join(", ");
      notify(
        `${result.resolved.length} fecha(s) de ${label} resueltas. Quedaron PENDIENTES por no haber clase válida ese día: ${detail}.`,
        false
      );
    } else {
      notify(`✓ ${result.resolved.length} fecha(s) de ${label} resueltas: quedaron PRESENTES en la planilla.`);
    }
  };

  const reject = async (group: AppealStudentGroup) => {
    if (busy) return;
    setBusy(true);
    const ok = await rejectAppeals(group.appeals);
    setBusy(false);
    if (!ok) return notify("No se pudo rechazar. Revisa tu conexión.", false);
    await refresh();
    notify(`Apelación de ${group.studentName} rechazada (${group.appeals.length} fecha(s)).`);
  };

  const tabButton = (id: Tab, label: string, count: number, color: string, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`px-3 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
        activeTab === id ? `${color} border-current` : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
      }`}
    >
      {icon}
      <span>{label}</span>
      <span className="px-1.5 bg-gray-200 text-gray-700 rounded-full text-[10px]">{count}</span>
    </button>
  );

  return (
    <div className="space-y-3">
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 flex items-center justify-between gap-3 shadow-xs">
        <p className="text-[11px] text-[#6B7780]">
          {pendingList.length} fechas pendientes • {resolvedList.length} resueltas
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refresh()}
            title="Recargar"
            className="h-8 w-8 flex items-center justify-center text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-[4px] cursor-pointer"
          >
            <RotateCcw size={13} />
          </button>
          <button
            type="button"
            onClick={() => resolve(pendingList, "todos los alumnos")}
            disabled={pendingList.length === 0 || busy}
            className="px-3.5 h-8 text-xs font-bold rounded-[4px] shadow-xs flex items-center gap-1.5 cursor-pointer bg-emerald-700 hover:bg-emerald-800 text-white disabled:bg-gray-100 disabled:text-gray-400 disabled:border disabled:border-gray-200 disabled:cursor-not-allowed"
            title="Marca presente TODAS las fechas apeladas por TODOS los alumnos"
          >
            <CheckCheck size={15} />
            <span>{busy ? "Resolviendo..." : `Resolver todas (${pendingList.length} fechas)`}</span>
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-2.5 rounded-[4px] text-xs font-semibold border flex items-start gap-2 ${
            notification.ok ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-amber-50 border-amber-300 text-amber-900"
          }`}
        >
          {notification.ok ? (
            <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
          ) : (
            <AlertCircle size={15} className="text-amber-700 shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      <div className="flex border-b border-gray-200 bg-white px-2 pt-1 rounded-t-[4px]">
        {tabButton("pendientes", "Pendientes", pendingList.length, "text-[#C8102E]", <Clock size={13} />)}
        {tabButton("resueltas", "Resueltas / rechazadas", resolvedList.length, "text-[#008EE2]", <CheckCircle2 size={13} />)}
      </div>

      <div className="bg-white border border-[#E0E3E6] rounded-b-[4px] overflow-hidden shadow-xs">
        {groups.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs">
            <Clock size={20} className="mx-auto mb-1.5 text-gray-300" />
            <p>No hay apelaciones en esta pestaña.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {groups.map((g) => (
              <AppealStudentRow
                key={g.studentCanvasId}
                group={g}
                pending={activeTab === "pendientes"}
                busy={busy}
                onAccept={(grp) => resolve(grp.appeals, grp.studentName)}
                onReject={reject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
