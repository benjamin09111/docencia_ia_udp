"use client";

import React, { useState, useEffect } from "react";
import { CheckCheck, CheckCircle2, Clock, XCircle, AlertCircle, FileText, Filter, RotateCcw } from "lucide-react";
import { CourseSection, AttendanceAppeal } from "@/types/attendance";
import { getSavedAppeals, resolveAllPendingAppeals, resolveSingleAppeal, rejectSingleAppeal } from "@/services/appealsStore";

interface TeacherAppealsWorkspaceProps {
  section: CourseSection;
  onResolveAllAttendance: (appeals: AttendanceAppeal[]) => void;
  onResolveSingleAttendance?: (appeal: AttendanceAppeal) => void;
}

export const TeacherAppealsWorkspace: React.FC<TeacherAppealsWorkspaceProps> = ({
  section,
  onResolveAllAttendance,
  onResolveSingleAttendance,
}) => {
  const [appeals, setAppeals] = useState<AttendanceAppeal[]>([]);
  const [activeTab, setActiveTab] = useState<"pendientes" | "resueltas">("pendientes");
  const [notification, setNotification] = useState<string | null>(null);

  const refreshAppeals = () => setAppeals(getSavedAppeals(section.codigo));

  useEffect(() => {
    refreshAppeals();
    const handleUpdate = () => refreshAppeals();
    window.addEventListener("udp_appeals_updated", handleUpdate);
    return () => window.removeEventListener("udp_appeals_updated", handleUpdate);
  }, [section.codigo]);

  const pendingList = appeals.filter((a) => a.status === "pendiente");
  const resolvedList = appeals.filter((a) => a.status === "resuelta" || a.status === "rechazada");
  const displayList = activeTab === "pendientes" ? pendingList : resolvedList;

  const handleResolveAll = () => {
    if (pendingList.length === 0) return;
    const { resolvedAppeals } = resolveAllPendingAppeals(section.codigo);
    refreshAppeals();
    onResolveAllAttendance(resolvedAppeals);
    setNotification(`✓ Se resolvieron ${resolvedAppeals.length} apelaciones y se marcaron PRESENTES en la planilla.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleResolveSingle = (app: AttendanceAppeal) => {
    const updated = resolveSingleAppeal(app.id);
    if (updated) {
      refreshAppeals();
      onResolveSingleAttendance?.(updated);
      setNotification(`✓ Apelación de ${app.studentName} resuelta como PRESENTE.`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleRejectSingle = (app: AttendanceAppeal) => {
    rejectSingleAppeal(app.id);
    refreshAppeals();
    setNotification(`Apelación de ${app.studentName} rechazada.`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-3 animate-fadeIn">
      {/* Barra de Acciones y Estadísticas */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-[#C8102E] text-white flex items-center justify-center font-bold">
            <FileText size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#2D3B45]">Módulo de Apelaciones • {section.nombre}</h2>
            <p className="text-[11px] text-[#6B7780]">
              {pendingList.length} pendientes • {resolvedList.length} resueltas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshAppeals}
            className="p-1.5 text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-[4px] cursor-pointer"
            title="Recargar apelaciones"
          >
            <RotateCcw size={13} />
          </button>
          <button
            type="button"
            onClick={handleResolveAll}
            disabled={pendingList.length === 0}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-[4px] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              pendingList.length > 0
                ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
            }`}
            title="Marca a todos los apelantes pendientes como Presentes y mueve las apelaciones a Resueltas"
          >
            <CheckCheck size={15} />
            <span>Resolver todas las asistencias ({pendingList.length})</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-2.5 rounded-[4px] text-xs font-semibold bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-2 shadow-2xs">
          <CheckCircle2 size={15} className="text-emerald-700" />
          <span>{notification}</span>
        </div>
      )}

      {/* Selector de Pestañas */}
      <div className="flex border-b border-gray-200 bg-white px-2 pt-1 rounded-t-[4px]">
        <button
          type="button"
          onClick={() => setActiveTab("pendientes")}
          className={`px-3 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === "pendientes" ? "border-[#C8102E] text-[#C8102E]" : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
          }`}
        >
          <Clock size={13} />
          <span>Pendientes (Asistencia)</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "pendientes" ? "bg-[#C8102E] text-white" : "bg-gray-200 text-gray-700"}`}>
            {pendingList.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("resueltas")}
          className={`px-3 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === "resueltas" ? "border-[#008EE2] text-[#008EE2]" : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
          }`}
        >
          <CheckCircle2 size={13} />
          <span>Resueltas</span>
          <span className="px-1.5 py-0.2 bg-gray-200 text-gray-700 rounded-full text-[10px]">{resolvedList.length}</span>
        </button>
      </div>

      {/* Lista de Filas */}
      <div className="bg-white border border-[#E0E3E6] rounded-b-[4px] overflow-hidden shadow-xs">
        {displayList.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs">
            <Clock size={20} className="mx-auto mb-1.5 text-gray-300" />
            <p>No hay apelaciones en esta pestaña.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {displayList.map((app) => (
              <div key={app.id} className="p-3 hover:bg-gray-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2D3B45] text-[13px]">{app.studentName}</span>
                    <span className="font-mono text-[11px] px-1.5 py-0.5 bg-blue-50 text-[#008EE2] border border-blue-200 rounded font-semibold">
                      Día: {app.date}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                      Motivo: {app.motivo}
                    </span>
                  </div>
                  <p className="text-[#55636E] italic">"{app.comentario}"</p>
                  <span className="text-[10px] text-gray-400 block font-mono">
                    Registrado: {new Date(app.createdAt).toLocaleString("es-CL")}
                    {app.resolvedAt && ` • Resuelto: ${new Date(app.resolvedAt).toLocaleString("es-CL")}`}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {app.status === "pendiente" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleResolveSingle(app)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-[3px] shadow-2xs flex items-center gap-1 cursor-pointer"
                        title="Marcar como Presente en la planilla"
                      >
                        <CheckCircle2 size={12} /><span>Aceptar (Presente)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectSingle(app)}
                        className="px-2 py-1 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-[3px] font-semibold cursor-pointer"
                      >
                        <XCircle size={12} /><span>Rechazar</span>
                      </button>
                    </>
                  ) : (
                    <span className={`px-2 py-1 text-[11px] font-bold rounded uppercase flex items-center gap-1 ${
                      app.status === "resuelta" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-rose-100 text-rose-800 border border-rose-300"
                    }`}>
                      {app.status === "resuelta" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      <span>{app.status}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
