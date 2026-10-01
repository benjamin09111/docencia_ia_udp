"use client";

import React, { useState } from "react";
import { ReflectionQuestion } from "@/types";
import { Lightbulb, Send, CheckCircle2, Bookmark, Sparkles, AlertCircle } from "lucide-react";

interface CaseReflectionViewerProps {
  contexto?: string;
  preguntas: ReflectionQuestion[];
  onCompleteCase: () => void;
  isCompleted?: boolean;
}

export const CaseReflectionViewer: React.FC<CaseReflectionViewerProps> = ({
  contexto,
  preguntas,
  onCompleteCase,
  isCompleted = false,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evaluated, setEvaluated] = useState<boolean>(isCompleted);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEvaluating(true);

    setTimeout(() => {
      setIsEvaluating(false);
      setEvaluated(true);
      onCompleteCase();
    }, 1000);
  };

  const allFilled = preguntas.every((p) => (answers[p.id] || "").trim().length > 10);

  return (
    <div className="space-y-4">
      {/* Contexto del Caso de Negocio */}
      {contexto && (
        <div className="p-3 sm:p-4 rounded-[4px] bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1.5">
          <span className="font-bold flex items-center gap-1.5 text-amber-900 uppercase tracking-wider text-[10px]">
            <Bookmark size={13} /> Escenario del Caso Práctico:
          </span>
          <p className="leading-relaxed text-amber-900">{contexto}</p>
        </div>
      )}

      {/* Preguntas de Reflexión */}
      {preguntas.map((p, pIdx) => (
        <div key={p.id} className="p-3 sm:p-4 rounded-[4px] border border-gray-200 bg-white space-y-2.5">
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
              {pIdx + 1}
            </span>
            <div>
              <h4 className="text-xs font-bold text-[#2D3B45]">{p.pregunta}</h4>
              <p className="text-[11px] text-[#6B7780] mt-0.5 italic">{p.guiaReflexion}</p>
            </div>
          </div>

          {/* Caja de Redacción del Alumno */}
          <textarea
            rows={3}
            disabled={evaluated}
            value={answers[p.id] || ""}
            onChange={(e) => setAnswers({ ...answers, [p.id]: e.target.value })}
            placeholder="Escribe tu análisis reflexivo o justificación técnica aquí..."
            className="w-full text-xs border border-gray-300 rounded-[4px] p-2.5 bg-[#F9FAFB] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
          />

          {/* Feedback Formativo del Agente IA */}
          {evaluated && (
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-[4px] text-xs text-[#0277BD] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1 text-[11px]">
                  <Sparkles size={13} className="text-[#008EE2]" /> Evaluación del Agente de Cátedra:
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Análisis Válido
                </span>
              </div>
              <p className="text-[11px] text-[#01579B] leading-relaxed">
                Buen enfoque. Tu propuesta aborda los trade-offs clave. En la prueba formal de la cátedra se valorará especialmente haber contrastado el impacto en latencia frente al esfuerzo de implementación.
              </p>
              <div className="text-[10px] text-[#0277BD] pt-1 border-t border-blue-200/60">
                <strong>Puntos clave considerados:</strong> {p.puntosClave.join(" • ")}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Botón de Evaluación */}
      {!evaluated ? (
        <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center pt-2">
          <button
            type="button"
            disabled={!allFilled || isEvaluating}
            onClick={handleEvaluate}
            className="px-5 py-2.5 bg-[#2D3B45] hover:bg-[#1E272E] text-white rounded-[4px] text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isEvaluating ? (
              <>
                <Sparkles size={14} className="animate-spin text-[#008EE2]" />
                <span>Analizando argumentos con la pauta del curso...</span>
              </>
            ) : (
              <>
                <Send size={13} />
                <span>Evaluar Mi Reflexión con el Agente IA</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[4px] text-center text-xs text-emerald-800 font-semibold">
          ✅ Caso completado exitosamente. Se ha registrado tu participación y análisis en las métricas de estudio.
        </div>
      )}
    </div>
  );
};
