"use client";

import React, { useState } from "react";
import { QuizQuestion } from "@/types";
import { CheckCircle2, XCircle, AlertCircle, HelpCircle, ArrowRight } from "lucide-react";

interface QuizViewerProps {
  questions: QuizQuestion[];
  onCompleteQuiz: (correctCount: number, totalQuestions: number) => void;
  isCompleted?: boolean;
}

export const QuizViewer: React.FC<QuizViewerProps> = ({
  questions,
  onCompleteQuiz,
  isCompleted = false,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(isCompleted);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.respuestaCorrecta) {
        correct++;
      }
    });
    onCompleteQuiz(correct, questions.length);
  };

  const allAnswered = questions.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <div className="space-y-4">
      {questions.map((q, qIndex) => {
        const selected = selectedAnswers[q.id];
        const isAnswered = selected !== undefined;
        const isCorrect = selected === q.respuestaCorrecta;

        return (
          <div
            key={q.id}
            className="p-4 rounded-[4px] border border-gray-200 bg-white shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-bold text-[#2D3B45] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#008EE2] flex items-center justify-center text-[11px] font-bold">
                  {qIndex + 1}
                </span>
                {q.pregunta}
              </span>
              {submitted && (
                <div>
                  {isCorrect ? (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 size={12} /> Correcto
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <XCircle size={12} /> Incorrecto
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Opciones */}
            <div className="space-y-1.5 pl-7">
              {q.opciones.map((opt, optIndex) => {
                const isThisSelected = selected === optIndex;
                let optionStyle = "border-gray-200 bg-[#F9FAFB] hover:bg-gray-100 text-[#2D3B45]";

                if (submitted) {
                  if (optIndex === q.respuestaCorrecta) {
                    optionStyle = "border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold";
                  } else if (isThisSelected && !isCorrect) {
                    optionStyle = "border-rose-300 bg-rose-50 text-rose-900";
                  } else {
                    optionStyle = "border-gray-200 bg-white opacity-60 text-gray-500";
                  }
                } else if (isThisSelected) {
                  optionStyle = "border-[#008EE2] bg-blue-50/70 text-[#008EE2] font-semibold";
                }

                return (
                  <button
                    key={optIndex}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleSelectOption(q.id, optIndex)}
                    className={`w-full text-left p-2.5 rounded-[4px] border text-xs transition-all flex items-start gap-2.5 ${optionStyle}`}
                  >
                    <span className="font-mono font-bold text-[11px] shrink-0 mt-0.5">
                      {String.fromCharCode(65 + optIndex)})
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explicación tras validar */}
            {submitted && (
              <div className="mt-2 ml-7 p-3 rounded-[4px] bg-blue-50/70 border border-blue-200 text-xs text-[#0277BD] space-y-1">
                <span className="font-bold flex items-center gap-1 text-[11px]">
                  <HelpCircle size={13} /> Justificación Teórica:
                </span>
                <p className="text-[11px] leading-relaxed text-[#01579B]">{q.explicacion}</p>
              </div>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleSubmit}
            className="px-5 py-2 bg-[#2D3B45] hover:bg-[#1E272E] text-white rounded-[4px] text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <span>Validar Mis Respuestas</span>
            <ArrowRight size={13} />
          </button>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[4px] text-center text-xs text-emerald-800 font-semibold">
          🎉 ¡Quiz completado! Has practicado {questions.length} preguntas clave. Tus métricas han sido actualizadas.
        </div>
      )}
    </div>
  );
};
