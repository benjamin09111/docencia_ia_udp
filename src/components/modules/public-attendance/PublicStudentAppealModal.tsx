"use client";

import React, { useState } from "react";
import { X, Send, Clock, CheckCircle2, AlertCircle, History, FileText, ShieldAlert } from "lucide-react";
import { CourseSection, ClassSession, AttendanceAppeal } from "@/types/attendance";
import { StudentRosterItem, getTodayDateStr } from "@/services/attendanceStore";
import { createAppeal, getSavedAppeals } from "@/services/appealsStore";

interface PublicStudentAppealModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: CourseSection;
  students: StudentRosterItem[];
  sessions: ClassSession[];
}

export const PublicStudentAppealModal: React.FC<PublicStudentAppealModalProps> = ({
  isOpen,
  onClose,
  section,
  students,
  sessions,
}) => {
  const [activeTab, setActiveTab] = useState<"nueva" | "historial">("nueva");
  const [selectedCanvasId, setSelectedCanvasId] = useState<number | "">("");
  const todayStr = getTodayDateStr();
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [comentario, setComentario] = useState<string>("Sí asistí hoy");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [appealsHistory, setAppealsHistory] = useState<AttendanceAppeal[]>(() => getSavedAppeals(section.codigo));

  const refreshHistory = () => setAppealsHistory(getSavedAppeals(section.codigo));
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCanvasId) {
      setStatusMessage({ type: "error", text: "Por favor selecciona tu nombre de la lista oficial." });
      return;
    }
    const student = students.find((s) => s.canvas_id === Number(selectedCanvasId));
    if (!student) return;

    const result = createAppeal({
      sectionId: section.id,
      sectionCode: section.codigo,
      studentCanvasId: student.canvas_id,
      studentName: `${student.nombres} ${student.apellidos}`,
      studentRut: student.rut,
      date: selectedDate,
      motivo: "asistencia",
      comentario: comentario.trim() || "Sí asistí hoy",
    });

    if (result.success) {
      setStatusMessage({ type: "success", text: result.message });
      refreshHistory();
      setTimeout(() => { setStatusMessage(null); setActiveTab("historial"); }, 1400);
    } else {
      setStatusMessage({ type: "error", text: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-4 py-3 bg-[#2D3B45] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#008EE2]" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Apelaciones • {section.nombre}</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer"><X size={15} /></button>
        </div>

        <div className="flex border-b border-gray-200 bg-[#FAFBFB] text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setActiveTab("nueva"); setStatusMessage(null); }}
            className={`flex-1 py-2 px-3 flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === "nueva" ? "border-[#C8102E] text-[#C8102E] bg-white" : "border-transparent text-[#6B7780]"
            }`}
          >
            <Send size={13} /><span>Nueva Apelación</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("historial"); refreshHistory(); }}
            className={`flex-1 py-2 px-3 flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === "historial" ? "border-[#C8102E] text-[#C8102E] bg-white" : "border-transparent text-[#6B7780]"
            }`}
          >
            <History size={13} /><span>Historial ({appealsHistory.length})</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs">
          {statusMessage && (
            <div className={`p-2.5 rounded-[4px] border flex items-start gap-2 ${
              statusMessage.type === "success" ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-rose-50 border-rose-300 text-rose-900"
            }`}>
              {statusMessage.type === "success" ? <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" /> : <AlertCircle size={15} className="text-rose-700 shrink-0 mt-0.5" />}
              <span className="text-[11px] leading-relaxed">{statusMessage.text}</span>
            </div>
          )}

          {activeTab === "nueva" ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#2D3B45] uppercase mb-1">1. Selecciona tu Nombre:</label>
                <select
                  value={selectedCanvasId}
                  onChange={(e) => setSelectedCanvasId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-[4px] text-[#2D3B45] font-medium"
                  required
                >
                  <option value="">-- Elige tu nombre de la sección --</option>
                  {students.map((st) => (
                    <option key={st.canvas_id} value={st.canvas_id}>{st.apellidos}, {st.nombres}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#2D3B45] uppercase mb-1">2. Motivo:</label>
                  <input type="text" value="Asistencia" readOnly className="w-full p-2 bg-gray-100 border border-gray-300 rounded-[4px] text-gray-600 font-semibold cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#2D3B45] uppercase mb-1">3. Fecha:</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-[4px] text-[#2D3B45] font-mono"
                  >
                    <option value={todayStr}>Hoy ({todayStr})</option>
                    {sessions.map((s) => (
                      <option key={s.id} value={s.fecha}>{s.fecha} ({s.diaSemana})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#2D3B45] uppercase mb-1">4. Justificación:</label>
                <input
                  type="text"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  maxLength={150}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-[4px] text-[#2D3B45]"
                />
              </div>

              <div className="p-2 bg-blue-50/70 border border-blue-200 rounded-[4px] flex items-center gap-1.5 text-[10px] text-[#0277BD]">
                <ShieldAlert size={13} className="shrink-0 text-[#008EE2]" />
                <span>Protección anti-spam: Máx. 1 apelación pendiente por fecha (30s cooldown).</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-[4px] font-semibold cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 text-xs bg-[#C8102E] hover:bg-[#A00D24] text-white font-bold rounded-[4px] inline-flex items-center gap-1.5 cursor-pointer">
                  <Send size={13} /><span>Enviar Apelación</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              {appealsHistory.length === 0 ? (
                <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-[4px] border border-dashed border-gray-300">
                  <Clock size={18} className="mx-auto mb-1 text-gray-400" />
                  <p className="text-[11px]">No hay apelaciones registradas en esta sección.</p>
                </div>
              ) : (
                appealsHistory.map((app) => (
                  <div key={app.id} className="p-2.5 bg-white border border-gray-200 rounded-[4px] flex items-center justify-between gap-2 shadow-2xs">
                    <div>
                      <div className="font-bold text-[#2D3B45]">{app.studentName}</div>
                      <div className="text-[10px] text-[#6B7780] flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono">Fecha: {app.date}</span>
                        <span>•</span>
                        <span>"{app.comentario}"</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase shrink-0 ${
                      app.status === "resuelta" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                      app.status === "rechazada" ? "bg-rose-100 text-rose-800 border border-rose-200" :
                      "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
