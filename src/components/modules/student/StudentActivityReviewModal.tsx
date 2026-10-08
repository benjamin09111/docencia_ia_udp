"use client";

import React from "react";
import { StudentSubmission } from "@/types";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { Quote } from "lucide-react";

interface StudentActivityReviewModalProps {
  submission: StudentSubmission;
  onClose: () => void;
}

export const StudentActivityReviewModal: React.FC<StudentActivityReviewModalProps> = ({
  submission,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-[4px] max-w-2xl w-full p-4 sm:p-6 shadow-xl border border-[#E0E3E6] space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start border-b border-[#E0E3E6] pb-3">
          <div>
            <span className="text-[10px] font-bold text-[#2E7D32] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase">
              Revisado según rúbrica Canvas
            </span>
            <h3 className="text-base font-bold text-[#2D3B45] mt-1">
              Dictamen de Evaluación: {submission.archivo_nombre}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#6B7780] hover:text-[#2D3B45] font-bold text-lg"
          >
            ✕
          </button>
        </div>

        <div className="p-3 bg-[#F9FAFB] rounded-[3px] border border-[#E0E3E6] text-xs text-[#2D3B45] leading-relaxed">
          <strong className="text-[#2D3B45]">Resumen del Agente Evaluador:</strong>{" "}
          <span className="text-[#6B7780]">{submission.feedback_ia.resumen}</span>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold text-[#2D3B45] block">
            Desglose por Criterios de la Rúbrica:
          </span>
          {submission.feedback_ia.criterios_evaluados.map((c, i) => (
            <div key={i} className="p-3 border border-[#E0E3E6] rounded-[3px] text-xs space-y-2 bg-white">
              <div className="flex justify-between items-center font-bold text-[#2D3B45]">
                <span>• {c.criterio}</span>
                <span className="text-[#008EE2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {c.puntaje_obtenido} / {c.puntaje_max} pts
                </span>
              </div>
              <div className="bg-blue-50/50 p-2.5 rounded border border-blue-200 text-[11.5px] text-[#0277BD] space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <Quote size={12} /> Cita Textual de la Solución:
                </span>
                <p className="italic font-serif text-[#01579B]">&quot;{c.cita_textual}&quot;</p>
              </div>
              <p className="text-[11px] text-[#6B7780]">
                <strong className="text-[#2D3B45]">Comentario Técnico:</strong> {c.comentario}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-[#E0E3E6]">
          <span className="text-xs font-bold text-[#2E7D32]">
            Incentivo Obtenido: +{submission.decimas_sugeridas || 0.3} décimas
          </span>
          <CanvasButton variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </CanvasButton>
        </div>
      </div>
    </div>
  );
};
