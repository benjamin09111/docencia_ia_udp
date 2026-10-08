"use client";

import React, { useState } from "react";
import { StudentLearningProfile } from "@/types/learning";
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  HelpCircle,
  RefreshCw,
  Target,
  Clock,
  Calendar,
} from "lucide-react";

interface StudentLearningDetailCardProps {
  profile: StudentLearningProfile;
}

export const StudentLearningDetailCard: React.FC<StudentLearningDetailCardProps> = ({ profile }) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showAiSuccess, setShowAiSuccess] = useState(false);

  const handleSimulateAiDiagnosis = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      setShowAiSuccess(true);
      setTimeout(() => setShowAiSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card p-4 sm:p-6 space-y-6">
      {/* Header Alumno */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0E3E6]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#B71C1C] text-white flex items-center justify-center font-bold text-base shadow-sm">
            {profile.nombres.charAt(0)}{profile.apellidos.charAt(0)}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#2D3B45]">
              {profile.nombres} {profile.apellidos}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7780] mt-0.5 font-mono">
              <span>{profile.rut}</span>
              <span>•</span>
              <span>{profile.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right">
            <div className="text-xs text-[#6B7780]">Promedio Actual</div>
            <div className="text-base font-bold text-[#2D3B45] font-mono">{profile.promedioActual.toFixed(1)}</div>
          </div>
          <div className="text-right pl-3 border-l border-gray-200">
            <div className="text-xs text-[#6B7780]">Asistencia</div>
            <div className="text-base font-bold text-[#2E7D32] font-mono">{profile.asistenciaPct}%</div>
          </div>
        </div>
      </div>

      {/* Bloque 1: Reflexión del Estudiante */}
      <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1E293B] flex items-center gap-1.5 uppercase tracking-wide">
            <MessageSquare size={14} className="text-[#008EE2]" />
            Reflexión del Estudiante (Módulo Estudiante)
          </span>
          <span className="text-[11px] text-[#6B7780] flex items-center gap-1 font-mono">
            <Calendar size={12} /> {profile.reflexionEstudiante.fecha}
          </span>
        </div>

        <p className="text-xs text-[#2D3B45] leading-relaxed italic bg-white p-3 rounded border border-gray-200">
          &ldquo;{profile.reflexionEstudiante.texto}&rdquo;
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="bg-white p-2.5 rounded border border-gray-200 space-y-1">
            <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
              <AlertTriangle size={12} className="text-amber-500" /> Dificultades reportadas:
            </span>
            <ul className="text-[11px] text-gray-600 list-disc list-inside space-y-0.5">
              {profile.reflexionEstudiante.dificultadesPercibidas.map((dif, idx) => (
                <li key={idx}>{dif}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-2.5 rounded border border-gray-200 space-y-1">
            <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
              <Target size={12} className="text-[#008EE2]" /> Meta declarada para próximo hito:
            </span>
            <p className="text-[11px] text-gray-600">{profile.reflexionEstudiante.metasProximoHito}</p>
          </div>
        </div>
      </div>

      {/* Bloque 2: Fortalezas y Debilidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fortalezas */}
        <div className="border border-emerald-200 bg-emerald-50/20 rounded-[4px] p-3.5 space-y-2">
          <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase">
            <CheckCircle2 size={14} className="text-emerald-600" />
            Fortalezas Identificadas ({profile.fortalezas.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.fortalezas.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-emerald-300 rounded text-[11px] text-emerald-900 font-medium shadow-xs">
                <CheckCircle2 size={11} className="text-emerald-600 shrink-0" />
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Debilidades / Oportunidades */}
        <div className="border border-amber-200 bg-amber-50/20 rounded-[4px] p-3.5 space-y-2">
          <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5 uppercase">
            <AlertTriangle size={14} className="text-amber-600" />
            Oportunidades de Mejora ({profile.debilidades.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.debilidades.map((d, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-amber-300 rounded text-[11px] text-amber-900 font-medium shadow-xs">
                <Clock size={11} className="text-amber-600 shrink-0" />
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bloque 3: Diagnóstico y Recomendaciones IA */}
      <div className="border border-indigo-200 bg-indigo-50/30 rounded-[4px] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 uppercase tracking-wide">
            <Sparkles size={14} className="text-indigo-600" />
            Diagnóstico Pedagógico y Copiloto Docente IA
          </span>
          <button
            type="button"
            onClick={handleSimulateAiDiagnosis}
            disabled={isRegenerating}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-indigo-300 hover:bg-indigo-50 text-indigo-700 rounded text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw size={11} className={isRegenerating ? "animate-spin" : ""} />
            {isRegenerating ? "Analizando..." : "Reanalizar con IA"}
          </button>
        </div>

        {showAiSuccess && (
          <div className="p-2 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[11px] font-medium flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 size={13} className="text-emerald-700" />
            Diagnóstico pedagógico actualizado exitosamente con la última evidencia de entregas.
          </div>
        )}

        <div className="space-y-2 text-xs">
          <p className="text-[#2D3B45] font-medium leading-relaxed">{profile.diagnosticoIA.resumen}</p>

          <div className="p-2.5 bg-white border border-indigo-100 rounded text-indigo-950 space-y-1">
            <span className="font-bold flex items-center gap-1 text-[11px] text-indigo-900">
              <Lightbulb size={12} className="text-indigo-600" /> Cómo apoyar al estudiante (Orientación Docente):
            </span>
            <p className="text-[11px] text-gray-700 leading-normal">{profile.diagnosticoIA.recomendacionDocente}</p>
          </div>

          <div className="p-2.5 bg-white border border-indigo-100 rounded text-indigo-950 space-y-1">
            <span className="font-bold flex items-center gap-1 text-[11px] text-indigo-900">
              <HelpCircle size={12} className="text-indigo-600" /> Pregunta gatilladora sugerida para próxima sesión:
            </span>
            <ul className="text-[11px] text-gray-700 list-disc list-inside space-y-0.5">
              {profile.diagnosticoIA.preguntasGatilladoras.map((preg, idx) => (
                <li key={idx} className="italic">&ldquo;{preg}&rdquo;</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
