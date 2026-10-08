"use client";

import React, { useState } from "react";
import { StudentSubmission } from "@/types";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CheckCircle2 } from "lucide-react";

interface StudentActivityAppealModalProps {
  submission: StudentSubmission;
  onSendAppeal: (submissionId: string, appealText: string) => void;
  onClose: () => void;
}

export const StudentActivityAppealModal: React.FC<StudentActivityAppealModalProps> = ({
  submission,
  onSendAppeal,
  onClose,
}) => {
  const [appealInput, setAppealInput] = useState("");
  const [appealSuccess, setAppealSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealInput.trim()) return;

    onSendAppeal(submission.id, appealInput);
    setAppealSuccess(true);
    setTimeout(() => {
      setAppealSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-[4px] max-w-lg w-full p-4 sm:p-6 shadow-xl border border-[#E0E3E6] space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start border-b border-[#E0E3E6] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#2D3B45]">Solicitud de Apelación Docente</h3>
            <p className="text-xs text-[#6B7780] mt-0.5">
              Si consideras que un criterio fue calificado con exceso de rigor, presenta tu fundamentación.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#6B7780] hover:text-[#2D3B45] font-bold text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#2D3B45]">Fundamentación de tu Apelación</label>
            <textarea
              rows={4}
              required
              placeholder="Explica qué criterio deseas que el docente revise y por qué tu solución cumple con el estándar..."
              value={appealInput}
              onChange={(e) => setAppealInput(e.target.value)}
              className="w-full text-xs border border-[#C7CDD1] rounded-[3px] p-2.5 focus:ring-1 focus:ring-[#008EE2]"
            />
          </div>

          {appealSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-[3px] text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#2E7D32]" />
              ¡Apelación enviada! El profesor la revisará en su panel de calificaciones.
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E0E3E6]">
            <CanvasButton variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </CanvasButton>
            <CanvasButton variant="primary-udp" size="sm" type="submit" disabled={appealSuccess}>
              Enviar Apelación al Docente
            </CanvasButton>
          </div>
        </form>
      </div>
    </div>
  );
};
