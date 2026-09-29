"use client";

import React, { useState } from "react";
import { CourseDeliverable, StudentExcelRow, StudentStudyMetrics, StudentSubmission } from "@/types";
import { StudentLearnChatTab } from "./student/StudentLearnChatTab";
import { StudentPracticeLabTab } from "./student/StudentPracticeLabTab";
import { StudentAttendanceGradesTab } from "./student/StudentAttendanceGradesTab";
import {
  GraduationCap,
  Brain,
  ListChecks,
  CalendarCheck,
  Sparkles,
} from "lucide-react";

interface StudentViewProps {
  entregables?: CourseDeliverable[];
  entregasAlumnos?: StudentSubmission[];
  estudiantesExcel?: StudentExcelRow[];
  onSubmitActivity?: (deliverableId: string, solutionText: string) => void;
  onSendAppeal?: (submissionId: string, appealText: string) => void;
}

export const StudentView: React.FC<StudentViewProps> = ({
  estudiantesExcel = [],
}) => {
  // Las 3 tabs solicitadas: Aprendizaje (Chat), Evaluaciones para aprender, Mi Asistencia (y notas)
  const [activeTab, setActiveTab] = useState<"aprendizaje" | "evaluaciones" | "asistencia">("aprendizaje");

  // Métricas ligeras de estudio registradas (contador de preguntas realizadas)
  const [studyMetrics, setStudyMetrics] = useState<StudentStudyMetrics>({
    preguntasRealizadas: 14,
    actividadesCompletadas: 3,
    quizzesRespondidos: 2,
    casosResueltos: 1,
    puntosEstudio: 85,
  });

  const handleQuestionInChat = () => {
    setStudyMetrics((prev) => ({
      ...prev,
      preguntasRealizadas: prev.preguntasRealizadas + 1,
      puntosEstudio: prev.puntosEstudio + 5,
    }));
  };

  const handleUpdateMetrics = (patch: Partial<StudentStudyMetrics>) => {
    setStudyMetrics((prev) => ({
      ...prev,
      ...patch,
    }));
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Banner Principal del Estudiante UDP */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                Portal del Estudiante UDP
              </span>
              <span className="text-xs text-[#6B7780]">
                Asignatura Oficial • CIT3000 / CIT3203 • Semestre 2026-2
              </span>
            </div>
            <h1 className="text-lg font-bold text-[#2D3B45] mt-1 flex items-center gap-2">
              <GraduationCap size={20} className="text-[#C8102E]" />
              ARQUITECTURA DE SOFTWARE & GESTIÓN TIC
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-[4px] text-xs flex items-center gap-2">
              <Sparkles size={14} className="text-[#008EE2]" />
              <span className="text-[#008EE2] font-medium">Estudio Registrado:</span>
              <span className="text-[#2D3B45] font-extrabold">{studyMetrics.preguntasRealizadas} preguntas</span>
            </div>
          </div>
        </div>

        {/* Las 3 Tabs Requeridas */}
        <div className="flex gap-4 border-b border-gray-200 mt-5 pt-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab("aprendizaje")}
            className={`pb-2.5 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "aprendizaje"
                ? "border-[#008EE2] text-[#008EE2] font-bold"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
            }`}
          >
            <Brain size={14} />
            <span>Aprendizaje (Chat Tutor IA)</span>
          </button>

          <button
            onClick={() => setActiveTab("evaluaciones")}
            className={`pb-2.5 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "evaluaciones"
                ? "border-[#008EE2] text-[#008EE2] font-bold"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
            }`}
          >
            <ListChecks size={14} />
            <span>Evaluaciones para Aprender</span>
          </button>

          <button
            onClick={() => setActiveTab("asistencia")}
            className={`pb-2.5 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "asistencia"
                ? "border-[#008EE2] text-[#008EE2] font-bold"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
            }`}
          >
            <CalendarCheck size={14} />
            <span>Mi Asistencia y Notas</span>
          </button>
        </div>
      </div>

      {/* Contenido de las 3 Tabs */}
      {activeTab === "aprendizaje" && (
        <StudentLearnChatTab
          onQuestionAsked={handleQuestionInChat}
          preguntasContador={studyMetrics.preguntasRealizadas}
        />
      )}

      {activeTab === "evaluaciones" && (
        <StudentPracticeLabTab
          metrics={studyMetrics}
          onUpdateMetrics={handleUpdateMetrics}
        />
      )}

      {activeTab === "asistencia" && (
        <StudentAttendanceGradesTab estudiantesExcel={estudiantesExcel} />
      )}
    </div>
  );
};
