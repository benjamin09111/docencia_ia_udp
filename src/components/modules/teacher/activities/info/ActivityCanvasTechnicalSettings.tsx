"use client";

import React from "react";
import {
  Calculator,
  UploadCloud,
  Users,
  Calendar,
  Clock,
  FileCheck,
  AlertCircle,
} from "lucide-react";

interface ActivityCanvasTechnicalSettingsProps {
  pointsPossible?: number;
  setPointsPossible?: (v: number) => void;
  gradingType?: "points" | "percentage" | "letter_grade" | "pass_fail";
  setGradingType?: (v: "points" | "percentage" | "letter_grade" | "pass_fail") => void;
  assignmentGroup?: string;
  setAssignmentGroup?: (v: string) => void;
  omitFromFinalGrade?: boolean;
  setOmitFromFinalGrade?: (v: boolean) => void;
  submissionType?: "online_upload" | "online_text_entry" | "online_url" | "on_paper" | "none";
  setSubmissionType?: (v: "online_upload" | "online_text_entry" | "online_url" | "on_paper" | "none") => void;
  allowedExtensions?: string;
  setAllowedExtensions?: (v: string) => void;
  allowedAttempts?: number;
  setAllowedAttempts?: (v: number) => void;
  isGroupAssignment?: boolean;
  setIsGroupAssignment?: (v: boolean) => void;
  fecha: string;
  setFecha: (v: string) => void;
  unlockAt?: string;
  setUnlockAt?: (v: string) => void;
  lockAt?: string;
  setLockAt?: (v: string) => void;
  syncToCanvas?: boolean;
  setSyncToCanvas?: (v: boolean) => void;
}

export const ActivityCanvasTechnicalSettings: React.FC<ActivityCanvasTechnicalSettingsProps> = ({
  pointsPossible = 60.0,
  setPointsPossible,
  gradingType = "points",
  setGradingType,
  assignmentGroup = "Talleres y Actividades Formativas",
  setAssignmentGroup,
  omitFromFinalGrade = false,
  setOmitFromFinalGrade,
  submissionType = "online_upload",
  setSubmissionType,
  allowedExtensions = "pdf, docx, zip",
  setAllowedExtensions,
  allowedAttempts = -1,
  setAllowedAttempts,
  isGroupAssignment = false,
  setIsGroupAssignment,
  fecha,
  setFecha,
  unlockAt = "",
  setUnlockAt,
  lockAt = "",
  setLockAt,
  syncToCanvas = true,
  setSyncToCanvas,
}) => {
  return (
    <div className="space-y-4">
      {/* SECCIÓN 2: Calificación y Puntos Técnicos Canvas */}
      <div className="bg-white border border-[#C7CDD1] rounded-[4px] p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="border-b border-[#E0E3E6] pb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#2D3B45] uppercase tracking-wider flex items-center gap-2">
            <Calculator size={15} className="text-[#B71C1C]" />
            2. Configuración de Calificación (Canvas LMS)
          </h3>
          <span className="text-xs text-[#6B7780]">Puntaje Oficial: 60 pts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#2D3B45] mb-1">
              Puntos Posibles (Canvas) <span className="text-[#C8102E]">*</span>
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={pointsPossible}
              onChange={(e) => setPointsPossible && setPointsPossible(parseFloat(e.target.value) || 0)}
              className="w-full text-sm text-[#2D3B45] border border-[#C7CDD1] rounded-[3px] px-3 py-2 bg-white focus:outline-none focus:border-[#B71C1C]"
            />
            <p className="text-xs text-[#6B7780] mt-1">Escala estándar UDP (Puntaje Máximo: 60 pts).</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2D3B45] mb-1">
              Mostrar Calificación Como
            </label>
            <select
              value={gradingType}
              onChange={(e) => setGradingType && setGradingType(e.target.value as any)}
              className="w-full text-sm text-[#2D3B45] border border-[#C7CDD1] rounded-[3px] px-3 py-2 bg-white focus:outline-none focus:border-[#B71C1C]"
            >
              <option value="points">Puntos (Predeterminado Canvas)</option>
              <option value="percentage">Porcentaje (%)</option>
              <option value="letter_grade">Escala de Letras</option>
              <option value="pass_fail">Completo / Incompleto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2D3B45] mb-1">
              Grupo de Tareas Canvas
            </label>
            <select
              value={assignmentGroup}
              onChange={(e) => setAssignmentGroup && setAssignmentGroup(e.target.value)}
              className="w-full text-sm text-[#2D3B45] border border-[#C7CDD1] rounded-[3px] px-3 py-2 bg-white focus:outline-none focus:border-[#B71C1C]"
            >
              <option value="Talleres y Actividades Formativas">Talleres y Actividades Formativas</option>
              <option value="Tareas y Ejercicios">Tareas y Ejercicios</option>
              <option value="Evaluaciones y Solemnes">Evaluaciones y Solemnes</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer pt-1 select-none">
          <input
            type="checkbox"
            checked={omitFromFinalGrade}
            onChange={(e) => setOmitFromFinalGrade && setOmitFromFinalGrade(e.target.checked)}
            className="w-4 h-4 rounded text-[#B71C1C] border-[#C7CDD1] focus:ring-[#B71C1C]"
          />
          <span className="text-sm text-[#2D3B45]">
            No contar esta tarea para el cálculo de la calificación final del curso (Formativa pura).
          </span>
        </label>
      </div>

      {/* SECCIÓN 3: Entregas y Plazos */}
      <div className="bg-white border border-[#C7CDD1] rounded-[4px] p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="border-b border-[#E0E3E6] pb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#2D3B45] uppercase tracking-wider flex items-center gap-2">
            <UploadCloud size={15} className="text-[#B71C1C]" />
            3. Tipo de Entrega y Plazos Canvas
          </h3>
          <span className="text-xs text-[#6B7780]">Subida de Archivos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#2D3B45] mb-1">
              Tipo de Presentación
            </label>
            <select
              value={submissionType}
              onChange={(e) => setSubmissionType && setSubmissionType(e.target.value as any)}
              className="w-full text-sm text-[#2D3B45] border border-[#C7CDD1] rounded-[3px] px-3 py-2 bg-white focus:outline-none focus:border-[#B71C1C]"
            >
              <option value="online_upload">En Línea — Carga de Archivos (Recomendado)</option>
              <option value="online_text_entry">En Línea — Entrada de Texto Directa</option>
              <option value="online_url">En Línea — Dirección URL del Sitio Web / Repo</option>
              <option value="on_paper">En Papel / Presencial en Clases</option>
            </select>
          </div>

          {submissionType === "online_upload" && (
            <div>
              <label className="block text-sm font-semibold text-[#2D3B45] mb-1">
                Extensiones de Archivo Permitidas
              </label>
              <input
                type="text"
                value={allowedExtensions}
                onChange={(e) => setAllowedExtensions && setAllowedExtensions(e.target.value)}
                placeholder="pdf, docx, zip"
                className="w-full text-sm text-[#2D3B45] border border-[#C7CDD1] rounded-[3px] px-3 py-2 bg-white focus:outline-none focus:border-[#B71C1C]"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="block text-sm font-semibold text-[#2D3B45] mb-1 flex items-center gap-1.5">
              <Clock size={14} className="text-[#B71C1C]" />
              Fecha Límite <span className="text-[#C8102E]">*</span>
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full text-sm text-[#2D3B45] border border-[#C7CDD1] rounded-[3px] px-3 py-2 bg-white focus:outline-none focus:border-[#B71C1C]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2D3B45] mb-1">Disponible Desde</label>
            <input
              type="date"
              value={unlockAt}
              onChange={(e) => setUnlockAt && setUnlockAt(e.target.value)}
              className="w-full text-sm text-[#2D3B45] border border-[#C7CDD1] rounded-[3px] px-3 py-2 bg-white focus:outline-none focus:border-[#B71C1C]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2D3B45] mb-1">Disponible Hasta</label>
            <input
              type="date"
              value={lockAt}
              onChange={(e) => setLockAt && setLockAt(e.target.value)}
              className="w-full text-sm text-[#2D3B45] border border-[#C7CDD1] rounded-[3px] px-3 py-2 bg-white focus:outline-none focus:border-[#B71C1C]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
