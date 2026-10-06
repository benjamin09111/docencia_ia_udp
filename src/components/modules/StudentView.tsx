"use client";

import React, { useState } from "react";
import { CourseDeliverable, StudentExcelRow, StudentStudyMetrics, StudentSubmission } from "@/types";
import { StudentLearnChatTab } from "./student/StudentLearnChatTab";
import { StudentPracticeLabTab } from "./student/StudentPracticeLabTab";
import { StudentAttendanceGradesTab } from "./student/StudentAttendanceGradesTab";
import { StudentActivitiesTab } from "./student/StudentActivitiesTab";
import { CanvasTabs, CanvasTabItem } from "@/components/canvas/CanvasTabs";
import {
  GraduationCap,
  Brain,
  ListChecks,
  CalendarCheck,
  Sparkles,
  Award,
} from "lucide-react";

interface StudentViewProps {
  entregables?: CourseDeliverable[];
  entregasAlumnos?: StudentSubmission[];
  estudiantesExcel?: StudentExcelRow[];
  onSubmitActivity?: (deliverableId: string, solutionText: string) => void;
  onSendAppeal?: (submissionId: string, appealText: string) => void;
}

export const StudentView: React.FC<StudentViewProps> = ({
  entregables = [],
  entregasAlumnos = [],
  estudiantesExcel = [],
  onSubmitActivity = () => {},
  onSendAppeal = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<string>("actividades");

  // Métricas de estudio registradas
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

  const actividadesAyudantia = entregables.filter((e) => e.tipo === "actividad_ayudantia");

  const studentTabs: CanvasTabItem[] = [
    {
      id: "actividades",
      label: "Actividades & Entregas (+Décimas)",
      icon: <Award size={14} />,
      badge: (
        <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono">
          {actividadesAyudantia.length} activas
        </span>
      ),
    },
    {
      id: "aprendizaje",
      label: "Aprendizaje (Chat Tutor IA)",
      icon: <Brain size={14} />,
    },
    {
      id: "evaluaciones",
      label: "Evaluaciones para Aprender",
      icon: <ListChecks size={14} />,
    },
    {
      id: "asistencia",
      label: "Mi Asistencia y Notas",
      icon: <CalendarCheck size={14} />,
    },
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
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
      </div>

      {/* Tabs Reutilizables Canvas */}
      <CanvasTabs
        tabs={studentTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Contenido de las Tabs */}
      {activeTab === "actividades" && (
        <StudentActivitiesTab
          entregables={entregables}
          entregasAlumnos={entregasAlumnos}
          onSubmitActivity={onSubmitActivity}
          onSendAppeal={onSendAppeal}
        />
      )}

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
