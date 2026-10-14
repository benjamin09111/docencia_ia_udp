"use client";

import React from "react";
import { FileText, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { ActivityBasicInfoForm } from "./info/ActivityBasicInfoForm";
import { ActivitySecurityPinCard } from "./info/ActivitySecurityPinCard";
import { ActivityCanvasTechnicalSettings } from "./info/ActivityCanvasTechnicalSettings";

export interface StepInformacionProps {
  titulo: string;
  setTitulo: (v: string) => void;
  descripcion: string;
  setDescripcion: (v: string) => void;
  contenidoSeleccionado: string;
  setContenidoSeleccionado: (v: string) => void;
  contenidoManual: string;
  setContenidoManual: (v: string) => void;
  fecha: string;
  setFecha: (v: string) => void;
  pin: string;
  setPin: (v: string) => void;

  // Parámetros técnicos Canvas LMS
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
  unlockAt?: string;
  setUnlockAt?: (v: string) => void;
  lockAt?: string;
  setLockAt?: (v: string) => void;
  syncToCanvas?: boolean;
  setSyncToCanvas?: (v: boolean) => void;

  onPrev: () => void;
  onNext: () => void;
}

export const StepInformacion: React.FC<StepInformacionProps> = ({
  titulo,
  setTitulo,
  descripcion,
  setDescripcion,
  contenidoSeleccionado,
  setContenidoSeleccionado,
  contenidoManual,
  setContenidoManual,
  fecha,
  setFecha,
  pin,
  setPin,

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
  unlockAt = "",
  setUnlockAt,
  lockAt = "",
  setLockAt,
  syncToCanvas = true,
  setSyncToCanvas,

  onPrev,
  onNext,
}) => {
  return (
    <div className="space-y-5">
      {/* Header oficial del Paso 2 */}
      <div className="border-b border-[#E0E3E6] pb-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-red-50 text-[#B71C1C] flex items-center justify-center shrink-0 border border-red-100">
            <FileText size={18} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#2D3B45] tracking-tight">
              Paso 2: Información General, PIN de Acceso y Parámetros
            </h2>
            <p className="text-sm text-[#6B7780] mt-0.5">
              Configura el enunciado, el PIN de seguridad para los estudiantes y los parámetros oficiales para Canvas LMS.
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] rounded text-xs font-bold flex items-center gap-1.5">
          <CheckCircle2 size={13} />
          API Canvas Conectada
        </span>
      </div>

      {/* 1. Datos Generales de la Tarea */}
      <ActivityBasicInfoForm
        titulo={titulo}
        setTitulo={setTitulo}
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        contenidoSeleccionado={contenidoSeleccionado}
        setContenidoSeleccionado={setContenidoSeleccionado}
        contenidoManual={contenidoManual}
        setContenidoManual={setContenidoManual}
      />

      {/* 2. PIN Único de Acceso Estudiantil */}
      <ActivitySecurityPinCard pin={pin} setPin={setPin} />

      {/* 3. Parámetros Técnicos Canvas */}
      <ActivityCanvasTechnicalSettings
        pointsPossible={pointsPossible}
        setPointsPossible={setPointsPossible}
        gradingType={gradingType}
        setGradingType={setGradingType}
        assignmentGroup={assignmentGroup}
        setAssignmentGroup={setAssignmentGroup}
        omitFromFinalGrade={omitFromFinalGrade}
        setOmitFromFinalGrade={setOmitFromFinalGrade}
        submissionType={submissionType}
        setSubmissionType={setSubmissionType}
        allowedExtensions={allowedExtensions}
        setAllowedExtensions={setAllowedExtensions}
        allowedAttempts={allowedAttempts}
        setAllowedAttempts={setAllowedAttempts}
        isGroupAssignment={isGroupAssignment}
        setIsGroupAssignment={setIsGroupAssignment}
        fecha={fecha}
        setFecha={setFecha}
        unlockAt={unlockAt}
        setUnlockAt={setUnlockAt}
        lockAt={lockAt}
        setLockAt={setLockAt}
        syncToCanvas={syncToCanvas}
        setSyncToCanvas={setSyncToCanvas}
      />

      {/* Botonera de Navegación del Wizard */}
      <div className="pt-4 border-t border-[#E0E3E6] flex items-center justify-between">
        <CanvasButton variant="secondary" size="sm" onClick={onPrev} icon={<ChevronLeft size={16} />}>
          Volver a Metodología
        </CanvasButton>
        <CanvasButton variant="primary-udp" size="sm" onClick={onNext} icon={<ChevronRight size={16} />}>
          Continuar a Instrucciones (Paso 3)
        </CanvasButton>
      </div>
    </div>
  );
};
