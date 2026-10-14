"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { X, Send, CheckCircle2, AlertCircle, History, FileText } from "lucide-react";
import { CourseSection, ClassSession, AttendanceAppeal } from "@/types/attendance";
import { StudentRosterItem } from "@/services/attendanceStore";
import { createAppeals, getMyAppeals } from "@/services/appealsStore";
import { CanvasSearchableSelect, CanvasSearchOption } from "@/components/canvas/CanvasSearchableSelect";
import { AppealDatePicker, AppealDateOption } from "./AppealDatePicker";
import { DecimasAppealForm } from "./DecimasAppealForm";
import { AppealHistoryList } from "./AppealHistoryList";

interface PublicStudentAppealModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: CourseSection;
  students: StudentRosterItem[];
  sessions: ClassSession[];
}

export const PublicStudentAppealModal: React.FC<PublicStudentAppealModalProps> = ({
  isOpen, onClose, section, students, sessions,
}) => {
  const [activeTab, setActiveTab] = useState<"nueva" | "historial">("nueva");
  const [kind, setKind] = useState<"asistencia" | "decimas">("asistencia");
  const [selectedCanvasId, setSelectedCanvasId] = useState<number | "">("");
  const [dates, setDates] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [appeals, setAppeals] = useState<AttendanceAppeal[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Solo clases de ayudantía ya realizadas y no suspendidas (más reciente primero)
  const dateOptions = useMemo<AppealDateOption[]>(
    () =>
      [...sessions]
        .sort((a, b) => b.fecha.localeCompare(a.fecha))
        .map((s) => ({ value: s.fecha, label: `${s.fecha} (${s.diaSemana})` })),
    [sessions]
  );

  useEffect(() => {
    if (dates.length === 0 && dateOptions.length > 0) setDates([dateOptions[0].value]);
  }, [dateOptions, dates.length]);

  const studentOptions = useMemo<CanvasSearchOption[]>(
    () =>
      students.map((st) => ({
        value: st.canvas_id,
        label: `${st.apellidos}, ${st.nombres}`,
        subLabel: st.rut ? `RUT: ${st.rut}` : "Estudiante UDP",
        badge: "Estudiante",
        keywords: [st.nombres, st.apellidos, st.rut || "", st.email || ""],
      })),
    [students]
  );

  // Cada alumno consulta solo SUS apelaciones (el servidor filtra por alumno y no devuelve el RUT)
  const refreshHistory = useCallback(
    () => (selectedCanvasId ? getMyAppeals(section.codigo, Number(selectedCanvasId)).then(setAppeals) : Promise.resolve(setAppeals([]))),
    [section.codigo, selectedCanvasId]
  );
  useEffect(() => { if (isOpen) refreshHistory(); }, [isOpen, refreshHistory]);

  // Privacidad: cada alumno ve únicamente SUS apelaciones de asistencia
  const myAppeals = useMemo(
    () => appeals.filter((a) => a.studentCanvasId === Number(selectedCanvasId)),
    [appeals, selectedCanvasId]
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;
    const student = students.find((s) => s.canvas_id === Number(selectedCanvasId));
    if (!student) {
      setStatusMessage({ type: "error", text: "Por favor busca y selecciona tu nombre de la lista." });
      return;
    }
    setIsSending(true);
    const result = await createAppeals({
      sectionCode: section.codigo,
      studentCanvasId: student.canvas_id,
      dates: dates.filter(Boolean),
    });
    setIsSending(false);
    handleResult(result);
  };

  const handleResult = (result: { success: boolean; message: string }) => {
    setStatusMessage({ type: result.success ? "success" : "error", text: result.message });
    if (result.success) {
      refreshHistory();
      setTimeout(() => { setStatusMessage(null); setActiveTab("historial"); }, 1800);
    }
  };

  const tabClass = (tab: string) =>
    `flex-1 py-2 px-3 flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${activeTab === tab ? "border-[#C8102E] text-[#C8102E] bg-white" : "border-transparent text-[#6B7780]"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-4 py-3 bg-[#2D3B45] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#008EE2]" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Apelaciones • {section.nombre}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="p-1 hover:bg-white/20 rounded cursor-pointer"><X size={15} /></button>
        </div>

        <div className="flex border-b border-gray-200 bg-[#FAFBFB] text-xs font-semibold">
          <button type="button" onClick={() => { setActiveTab("nueva"); setStatusMessage(null); }} className={tabClass("nueva")}>
            <Send size={13} /><span>Nueva apelación</span>
          </button>
          <button type="button" onClick={() => { setActiveTab("historial"); refreshHistory(); }} className={tabClass("historial")}>
            <History size={13} /><span>Mis apelaciones</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs">
          {statusMessage && (
            <div className={`p-2.5 rounded-[4px] border flex items-start gap-2 ${statusMessage.type === "success" ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-rose-50 border-rose-300 text-rose-900"}`}>
              {statusMessage.type === "success" ? <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" /> : <AlertCircle size={15} className="text-rose-700 shrink-0 mt-0.5" />}
              <span className="text-[11px] leading-relaxed">{statusMessage.text}</span>
            </div>
          )}

          <CanvasSearchableSelect
            label="1. Selecciona tu nombre oficial:"
            placeholder="Escribe tu nombre o RUT para buscar..."
            options={studentOptions}
            value={selectedCanvasId || null}
            onChange={(val) => setSelectedCanvasId(val ? Number(val) : "")}
            required
            selectedCardLabel="Estudiante que apela"
          />

          {activeTab === "nueva" ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                {(["asistencia", "decimas"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => { setKind(k); setStatusMessage(null); }}
                    className={`h-9 text-xs font-bold rounded-[4px] border cursor-pointer ${kind === k ? "bg-[#2D3B45] text-white border-[#2D3B45]" : "bg-white text-[#2D3B45] border-[#C7CDD1] hover:bg-[#F5F6F8]"}`}
                  >
                    {k === "asistencia" ? "Asistencia" : "Décimas"}
                  </button>
                ))}
              </div>

              {kind === "decimas" ? (
                <DecimasAppealForm
                  section={section}
                  student={students.find((s) => s.canvas_id === Number(selectedCanvasId))}
                  onResult={handleResult}
                  onCancel={onClose}
                />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#2D3B45] uppercase mb-1">2. ¿Qué clase(s) asististe?</label>
                    {dateOptions.length === 0 ? (
                      <p className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded-[4px] text-gray-500">Aún no hay clases realizadas para apelar.</p>
                    ) : (
                      <AppealDatePicker options={dateOptions} dates={dates} onChange={setDates} />
                    )}
                  </div>
                  <div className="pt-1 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-[4px] font-semibold cursor-pointer">Cancelar</button>
                    <button type="submit" disabled={isSending || dates.length === 0} className="px-4 py-1.5 text-xs bg-[#C8102E] hover:bg-[#A00D24] text-white font-bold rounded-[4px] inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                      <Send size={13} /><span>{isSending ? "Enviando..." : `Enviar apelación (${dates.length})`}</span>
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <AppealHistoryList appeals={myAppeals} hasStudent={Boolean(selectedCanvasId)} />
          )}
        </div>
      </div>
    </div>
  );
};
