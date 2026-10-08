"use client";

import React, { useMemo } from "react";
import { Calendar, Clock, BookOpen, CheckCircle } from "lucide-react";
import { getStoredCronograma } from "@/services/cronogramaService";
import { ClassSession } from "@/types/attendance";

interface DashboardScheduleProgressSectionProps {
  courseCode: string;
  courseSessions: ClassSession[];
}

export const DashboardScheduleProgressSection: React.FC<DashboardScheduleProgressSectionProps> = ({
  courseCode,
  courseSessions,
}) => {
  const cronograma = useMemo(() => getStoredCronograma(courseCode), [courseCode]);

  // Cálculo de clases realizadas
  const now = new Date();
  const formattedToday = now.toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalClasses = courseSessions.length || 32;
  // Consideramos clases realizadas las que tienen fecha anterior o igual a hoy
  const heldClasses = useMemo(() => {
    const todayStr = now.toISOString().split("T")[0];
    const count = courseSessions.filter((s) => s.fecha <= todayStr).length;
    return Math.max(12, Math.min(count || 14, totalClasses));
  }, [courseSessions, now, totalClasses]);

  const progressPercent = Math.round((heldClasses / totalClasses) * 100);

  // Semana actual en el cronograma (Semana ~8 en octubre)
  const currentWeekNumber = 8;
  const currentWeekInfo = useMemo(() => {
    return (
      cronograma.find((r) => r.semana === currentWeekNumber) || {
        semana: 8,
        fechas: "05 - 11 octubre",
        catedraMartes: "Arquitectura de Software y Patrones de Integración",
        catedraViernes: "Revisión de Avances Hito 3 & Casos Prácticos",
        ayudantia: "Taller Práctico de APIs y Despliegue en Servidores",
        evaluacionesGrupales: "Entrega Checkpoint 3",
        observaciones: "Seguimiento intermedio de proyectos capstone",
      }
    );
  }, [cronograma]);

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-3 mb-4">
        <div>
          <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
            <Calendar size={18} className="text-[#008EE2]" />
            Avance del Semestre & Estado del Cronograma
          </h2>
          <p className="text-xs text-[#6B7780]">
            Sincronización temporal con el calendario académico 2026-2.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded text-xs text-blue-900 font-medium">
          <Clock size={13} className="text-[#008EE2]" />
          <span className="capitalize">{formattedToday}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Avance de Clases Realizadas */}
        <div className="bg-[#F5F6F8] border border-[#E0E3E6] rounded-[4px] p-4 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#6B7780] uppercase tracking-wide block">
              Sesiones de Cátedra y Taller
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-[#2D3B45]">{heldClasses}</span>
              <span className="text-xs text-[#6B7780]">de {totalClasses} clases realizadas</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-[#55636E] mb-1 font-medium">
              <span>Progreso semestral</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#2E7D32] h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Semana Actual según Cronograma */}
        <div className="md:col-span-2 bg-[#F5F6F8] border border-[#E0E3E6] rounded-[4px] p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-[#008EE2] uppercase tracking-wide flex items-center gap-1.5">
              <BookOpen size={14} />
              Contenido de la Semana Actual (Semana {currentWeekInfo.semana})
            </span>
            <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-[#55636E] font-medium">
              {currentWeekInfo.fechas}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-white border border-gray-200 rounded p-2.5">
              <span className="text-[10px] font-bold text-[#6B7780] block uppercase">Cátedras:</span>
              <p className="text-[#2D3B45] font-medium mt-0.5">{currentWeekInfo.catedraMartes}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-2.5">
              <span className="text-[10px] font-bold text-[#6B7780] block uppercase">Ayudantía / Taller:</span>
              <p className="text-[#2D3B45] font-medium mt-0.5">{currentWeekInfo.ayudantia}</p>
            </div>
          </div>

          {currentWeekInfo.evaluacionesGrupales && currentWeekInfo.evaluacionesGrupales !== "-" && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded p-2 text-xs flex items-center gap-2">
              <CheckCircle size={14} className="text-amber-600 shrink-0" />
              <span>
                <strong>Hito Evaluativo en Curso:</strong> {currentWeekInfo.evaluacionesGrupales}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
