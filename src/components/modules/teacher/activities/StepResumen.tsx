"use client";

import React from "react";
import { CheckCircle2, ChevronLeft, Zap } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  CanvasOfficialRubricTable,
  RubricMatrixRubro,
} from "@/components/canvas/CanvasOfficialRubricTable";
import { MetodologiaDocente } from "@/constants/metodologiasDocentes";

interface StepResumenProps {
  metodologia: MetodologiaDocente;
  titulo: string;
  modalidad: "decimas" | "nota";
  decimas: string;
  targetEvaluacion: string;
  fecha: string;
  contenidoSeleccionado: string;
  contenidoManual: string;
  matrizRubros: RubricMatrixRubro[];
  pointsPossible?: number;
  gradingType?: string;
  assignmentGroup?: string;
  submissionType?: string;
  allowedExtensions?: string;
  syncToCanvas?: boolean;
  pin?: string;
  attachmentsCount?: number;
  onPrev: () => void;
  onPublish: () => void;
}

export const StepResumen: React.FC<StepResumenProps> = ({
  metodologia,
  titulo,
  modalidad,
  decimas,
  targetEvaluacion,
  fecha,
  contenidoSeleccionado,
  contenidoManual,
  matrizRubros,
  pointsPossible = 60.0,
  gradingType = "points",
  assignmentGroup = "Talleres y Actividades Formativas",
  submissionType = "online_upload",
  allowedExtensions = "pdf, docx, zip",
  syncToCanvas = true,
  pin = "------",
  attachmentsCount = 0,
  onPrev,
  onPublish,
}) => {
  return (
    <div className="space-y-5">
      <div className="border-b border-[#E0E3E6] pb-3">
        <h2 className="text-xl font-bold text-[#2D3B45] flex items-center gap-2">
          <CheckCircle2 size={20} className="text-[#B71C1C]" />
          Paso 5: Resumen Consolidado y Confirmación de Tarea Canvas
        </h2>
        <p className="text-sm text-[#6B7780] mt-0.5">
          Verifica todos los parámetros pedagógicos y técnicos antes de crear la tarea en Canvas LMS.
        </p>
      </div>

      {/* Ficha Resumen Canvas con Tipografía Oficial */}
      <div className="bg-white border border-[#C7CDD1] rounded-[4px] p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E0E3E6] pb-2.5">
          <div>
            <span className="text-xs font-semibold text-[#6B7780] uppercase tracking-wider block">
              Título Oficial de la Tarea en Canvas:
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#2D3B45] mt-0.5">
              {metodologia.nombreCorto}: {titulo}
            </h3>
          </div>
          {syncToCanvas && (
            <span className="px-2.5 py-1 bg-blue-50 text-[#008EE2] border border-blue-200 rounded text-xs font-bold">
              Canvas API Sincronizada
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-[#F5F6F8] p-3 rounded border border-[#E0E3E6]">
            <span className="text-[#6B7780] block text-xs font-medium">Metodología:</span>
            <strong className="text-[#2D3B45] block font-semibold mt-0.5">{metodologia.nombreCorto}</strong>
          </div>
          <div className="bg-[#F5F6F8] p-3 rounded border border-[#E0E3E6]">
            <span className="text-[#6B7780] block text-xs font-medium">Calificación Canvas:</span>
            <strong className="text-[#B71C1C] block font-semibold mt-0.5">
              {pointsPossible} pts ({gradingType})
            </strong>
          </div>
          <div className="bg-[#F5F6F8] p-3 rounded border border-[#E0E3E6]">
            <span className="text-[#6B7780] block text-xs font-medium">Fecha Límite:</span>
            <strong className="text-[#2D3B45] block font-semibold mt-0.5">{fecha || "Sin fecha fija"}</strong>
          </div>
          <div className="bg-[#F5F6F8] p-3 rounded border border-[#E0E3E6]">
            <span className="text-[#6B7780] block text-xs font-medium">Tipo de Entrega:</span>
            <strong className="text-[#2D3B45] block font-semibold mt-0.5 truncate">
              {submissionType === "online_upload" ? `Archivos (${allowedExtensions})` : submissionType}
            </strong>
          </div>
        </div>

        <div className="pt-1 text-sm text-[#2D3B45]">
          <span className="text-xs font-medium text-[#6B7780] block">Eje Temático Evaluado:</span>
          <p className="font-medium mt-0.5">
            {contenidoSeleccionado.startsWith("Personalizado") ? contenidoManual || "Personalizado" : contenidoSeleccionado}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#2D3B45]">PIN de Acceso Estudiantil:</span>
            <span className="font-mono font-bold bg-[#F5F6F8] border border-[#C7CDD1] px-2.5 py-0.5 rounded text-[#2D3B45] tracking-widest">
              {pin}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#2D3B45]">Anexos y Material de Apoyo:</span>
            <span className="text-[#6B7780] font-medium">
              {attachmentsCount > 0 ? `${attachmentsCount} archivo(s) adjunto(s)` : "Sin anexos adicionales"}
            </span>
          </div>
        </div>
      </div>

      {/* Matriz Oficial Consolidada */}
      <div className="pt-1">
        <CanvasOfficialRubricTable
          rubros={matrizRubros}
          isEditable={false}
          tituloPauta={`PAUTA OFICIAL CANVAS: ${metodologia.nombreCorto.toUpperCase()}`}
          subtituloPauta="Matriz de criterios objetivos que se integrará con el SpeedGrader de Canvas UDP"
        />
      </div>

      <div className="pt-4 border-t border-[#E0E3E6] flex items-center justify-between">
        <CanvasButton variant="secondary" size="sm" onClick={onPrev} icon={<ChevronLeft size={16} />}>
          Volver a Rúbrica (Paso 4)
        </CanvasButton>
        <CanvasButton
          variant="primary-udp"
          size="sm"
          onClick={onPublish}
          icon={<Zap size={16} />}
        >
          Guardar y Publicar en Canvas
        </CanvasButton>
      </div>
    </div>
  );
};
