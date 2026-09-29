"use client";

import React, { useState } from "react";
import { ClassSession } from "@/types/attendance";
import { AlertCircle, X, Check, CalendarX } from "lucide-react";

interface AttendanceCancelClassModalProps {
  session: ClassSession;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (sessionId: string, motivo: string) => void;
  onReactivateSession: (sessionId: string) => void;
}

export const AttendanceCancelClassModal: React.FC<AttendanceCancelClassModalProps> = ({
  session,
  isOpen,
  onClose,
  onConfirmCancel,
  onReactivateSession,
}) => {
  const [motivo, setMotivo] = useState(
    session.motivoCancelacion || "No se realizó ayudantía en esta fecha."
  );

  React.useEffect(() => {
    setMotivo(session.motivoCancelacion || "No se realizó ayudantía en esta fecha.");
  }, [session]);

  if (!isOpen) return null;

  const isAlreadyCancelled = session.estado === "cancelada";

  const quickReasons = [
    "No se realizó ayudantía",
    "Feriado / Receso institucional",
    "Suspensión de actividades UDP",
    "Acuerdo de Escuela / Evaluación solemne",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-[4px] border border-[#E0E3E6] shadow-canvas-modal max-w-md w-full p-5 space-y-4">
        <div className="flex justify-between items-start border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2 text-[#2D3B45]">
            <CalendarX size={18} className="text-[#C8102E]" />
            <h3 className="text-sm font-bold">
              {isAlreadyCancelled ? "Sesión Cancelada (Sin Clase)" : "Marcar que no hubo Ayudantía / Clase"}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3 text-xs text-[#2D3B45]">
          <div className="bg-gray-50 p-2.5 rounded-[4px] border border-gray-200 space-y-1">
            <p>
              <strong>Fecha:</strong> {session.fecha} ({session.diaSemana})
            </p>
            <p>
              <strong>Tipo:</strong>{" "}
              <span className="capitalize font-semibold text-[#008EE2]">{session.tipo}</span> ({session.horaInicio} - {session.horaFin})
            </p>
          </div>

          {!isAlreadyCancelled ? (
            <div className="space-y-2">
              <label className="font-semibold block text-[#2D3B45]">
                Motivo de suspensión (opcional):
              </label>

              <div className="flex flex-wrap gap-1 mb-1">
                {quickReasons.map((qr) => (
                  <button
                    key={qr}
                    type="button"
                    onClick={() => setMotivo(qr)}
                    className="text-[10px] px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 transition-colors"
                  >
                    {qr}
                  </button>
                ))}
              </div>

              <textarea
                rows={2}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Indica el motivo..."
                className="w-full text-xs p-2.5 border border-gray-300 rounded-[4px] bg-[#F9FAFB] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
              />
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-[4px] text-[11px] text-amber-900 leading-snug">
                ⚠️ Al marcar como cancelada, <strong>esta sesión no se contabilizará en el total de clases</strong> ni afectará negativamente el porcentaje de asistencia de los estudiantes.
              </div>
            </div>
          ) : (
            <div className="p-3 bg-red-50 border border-red-200 rounded-[4px] space-y-1">
              <span className="font-bold text-red-900 block flex items-center gap-1">
                <AlertCircle size={14} className="text-red-700" />
                Esta sesión está marcada como NO REALIZADA
              </span>
              <p className="text-xs text-red-800">
                <strong>Motivo registrado:</strong> {session.motivoCancelacion || "Sin motivo especificado"}
              </p>
              <p className="text-[11px] text-gray-600 mt-1">
                No contabiliza para el cálculo de asistencias ni para la exigencia reglamentaria del 75%.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 border border-gray-300 rounded-[4px] text-xs font-semibold text-gray-600 hover:bg-gray-50"
          >
            Cerrar
          </button>

          {isAlreadyCancelled ? (
            <button
              onClick={() => onReactivateSession(session.id)}
              className="px-3.5 py-1.5 bg-[#008EE2] hover:bg-[#0077BE] text-white rounded-[4px] text-xs font-bold transition-colors"
            >
              Reactivar Sesión
            </button>
          ) : (
            <button
              onClick={() => onConfirmCancel(session.id, motivo)}
              className="px-4 py-1.5 bg-[#C8102E] hover:bg-[#A00D24] text-white rounded-[4px] text-xs font-bold transition-colors"
            >
              Confirmar Cancelación
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
