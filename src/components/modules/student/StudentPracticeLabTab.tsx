"use client";

import React, { useState } from "react";
import { GeneratedStudyActivity, StudentStudyMetrics, StudyActivityType } from "@/types";
import { INITIAL_STUDY_ACTIVITIES, generateActivityWithAI } from "@/services/studyGeneratorService";
import { PracticeMetricsBar } from "./practice/PracticeMetricsBar";
import { ActivityGeneratorCard } from "./practice/ActivityGeneratorCard";
import { QuizViewer } from "./practice/QuizViewer";
import { CaseReflectionViewer } from "./practice/CaseReflectionViewer";
import { ListChecks, Lightbulb, PenTool, Clock, CheckCircle2, BookOpen } from "lucide-react";

interface StudentPracticeLabTabProps {
  metrics: StudentStudyMetrics;
  onUpdateMetrics: (newMetrics: Partial<StudentStudyMetrics>) => void;
}

export const StudentPracticeLabTab: React.FC<StudentPracticeLabTabProps> = ({
  metrics,
  onUpdateMetrics,
}) => {
  const [activities, setActivities] = useState<GeneratedStudyActivity[]>(INITIAL_STUDY_ACTIVITIES);
  const [selectedActivityId, setSelectedActivityId] = useState<string>(INITIAL_STUDY_ACTIVITIES[0].id);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedActivity = activities.find((a) => a.id === selectedActivityId) || activities[0];

  const handleGenerate = (params: { unidadId: string; tipo: StudyActivityType; customPrompt?: string }) => {
    setIsGenerating(true);
    setTimeout(() => {
      const newAct = generateActivityWithAI(params);
      setActivities((prev) => [newAct, ...prev]);
      setSelectedActivityId(newAct.id);
      setIsGenerating(false);
      onUpdateMetrics({
        actividadesCompletadas: metrics.actividadesCompletadas + 1,
        puntosEstudio: metrics.puntosEstudio + 10,
      });
    }, 1100);
  };

  const handleCompleteQuiz = (correctCount: number, totalQuestions: number) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === selectedActivity.id ? { ...a, completada: true } : a))
    );
    onUpdateMetrics({
      preguntasRealizadas: metrics.preguntasRealizadas + totalQuestions,
      quizzesRespondidos: metrics.quizzesRespondidos + 1,
      puntosEstudio: metrics.puntosEstudio + correctCount * 5,
    });
  };

  const handleCompleteCase = () => {
    const questionsCount = selectedActivity.preguntasReflexion?.length || 2;
    setActivities((prev) =>
      prev.map((a) => (a.id === selectedActivity.id ? { ...a, completada: true } : a))
    );
    onUpdateMetrics({
      preguntasRealizadas: metrics.preguntasRealizadas + questionsCount,
      casosResueltos: metrics.casosResueltos + 1,
      puntosEstudio: metrics.puntosEstudio + 25,
    });
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <PracticeMetricsBar metrics={metrics} />
      <ActivityGeneratorCard onGenerate={handleGenerate} isGenerating={isGenerating} />

      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#E0E3E6] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
              <BookOpen size={16} className="text-[#008EE2]" />
              Actividad Formativa Activa
            </h3>
            <p className="text-xs text-[#6B7780] mt-0.5">
              Ejercicios adaptativos para preparar tus evaluaciones con retroalimentación instantánea.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            {activities.map((act) => {
              const isSelected = act.id === selectedActivity.id;
              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => setSelectedActivityId(act.id)}
                  className={`px-3 py-1.5 rounded-[3px] border text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "border-[#008EE2] bg-blue-50 text-[#008EE2] font-bold"
                      : "border-[#C7CDD1] bg-white text-[#6B7780] hover:text-[#2D3B45]"
                  }`}
                >
                  {act.tipo === "quiz" && <ListChecks size={13} />}
                  {act.tipo === "caso_reflexion" && <Lightbulb size={13} />}
                  {act.tipo === "desarrollo" && <PenTool size={13} />}
                  <span>{act.titulo.slice(0, 24)}...</span>
                  {act.completada && <CheckCircle2 size={12} className="text-[#2E7D32]" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3.5 bg-[#F9FAFB] border border-[#E0E3E6] rounded-[3px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <span className="text-[10px] font-bold text-[#008EE2] uppercase tracking-wider block">
              {selectedActivity.unidad}
            </span>
            <h4 className="text-sm font-bold text-[#2D3B45] mt-0.5">{selectedActivity.titulo}</h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6B7780] flex items-center gap-1">
              <Clock size={12} /> {selectedActivity.fechaCreacion}
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-[3px] ${
                selectedActivity.completada
                  ? "text-[#2E7D32] bg-emerald-50 border border-emerald-200"
                  : "text-[#008EE2] bg-blue-50 border border-blue-200"
              }`}
            >
              {selectedActivity.completada ? "Completada" : "En Curso"}
            </span>
          </div>
        </div>

        {selectedActivity.tipo === "quiz" && selectedActivity.preguntasQuiz && (
          <QuizViewer
            questions={selectedActivity.preguntasQuiz}
            onCompleteQuiz={handleCompleteQuiz}
            isCompleted={selectedActivity.completada}
          />
        )}

        {selectedActivity.tipo === "caso_reflexion" && selectedActivity.preguntasReflexion && (
          <CaseReflectionViewer
            contexto={selectedActivity.contexto}
            preguntas={selectedActivity.preguntasReflexion}
            onCompleteCase={handleCompleteCase}
            isCompleted={selectedActivity.completada}
          />
        )}
      </div>
    </div>
  );
};
