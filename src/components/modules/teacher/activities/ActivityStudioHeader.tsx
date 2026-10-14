"use client";

import React from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  GraduationCap,
  FileText,
  ListOrdered,
  Award,
  CheckCircle2,
  Lock,
  Eye,
} from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";

interface ActivityStudioHeaderProps {
  pasoActual: number;
  onSelectPaso: (paso: number) => void;
  onBack: () => void;
  onPublish: () => void;
  isActividadConfirmada: boolean;
  onOpenPreview?: () => void;
}

const PASOS = [
  { num: 1, label: "Metodología", icon: GraduationCap },
  { num: 2, label: "Información", icon: FileText },
  { num: 3, label: "Instrucciones", icon: ListOrdered },
  { num: 4, label: "Rúbrica", icon: Award },
  { num: 5, label: "Resumen", icon: CheckCircle2 },
];

export const ActivityStudioHeader: React.FC<ActivityStudioHeaderProps> = ({
  pasoActual,
  onSelectPaso,
  onBack,
  onPublish,
  isActividadConfirmada,
  onOpenPreview,
}) => {
  return (
    <header className="h-12 border-b border-[#C7CDD1] bg-white px-3 sm:px-4 flex items-center justify-between shrink-0 gap-2 sm:gap-4 select-none">
      {/* Botón Volver + Título de Estudio */}
      <div className="flex items-center gap-2 shrink-0">
        <CanvasButton
          variant="outline"
          size="sm"
          icon={<ArrowLeft size={14} />}
          onClick={onBack}
        >
          Volver
        </CanvasButton>
        <span className="text-xs font-bold text-[#2D3B45] hidden md:inline">
          Diseño Pedagógico
        </span>
      </div>

      {/* Pipeline Stepper Compacto con Bloqueo hasta confirmar Actividad */}
      <nav aria-label="Pasos de creación" className="flex items-center gap-1 sm:gap-2">
        {PASOS.map((p, idx) => {
          const isActive = pasoActual === p.num;
          const isCompleted = pasoActual > p.num;
          const isBloqueado = p.num > 1 && !isActividadConfirmada;
          const Icon = p.icon;

          return (
            <React.Fragment key={p.num}>
              <button
                type="button"
                disabled={isBloqueado}
                onClick={() => !isBloqueado && onSelectPaso(p.num)}
                title={
                  isBloqueado
                    ? "Debes seleccionar y confirmar una dinámica primero"
                    : `Ir a paso ${p.num}: ${p.label}`
                }
                className={`flex items-center gap-1.5 py-1 px-2 rounded transition-colors text-xs sm:text-sm ${
                  isBloqueado
                    ? "opacity-40 cursor-not-allowed text-gray-400"
                    : isActive
                    ? "text-[#B71C1C] font-bold bg-red-50/70 cursor-pointer"
                    : isCompleted
                    ? "text-[#2D3B45] hover:text-[#B71C1C] font-semibold cursor-pointer"
                    : "text-gray-500 hover:text-gray-700 font-medium cursor-pointer"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                    isBloqueado
                      ? "bg-gray-100 text-gray-400"
                      : isActive
                      ? "bg-[#B71C1C] text-white"
                      : isCompleted
                      ? "bg-gray-200 text-[#2D3B45]"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isBloqueado ? (
                    <Lock size={10} />
                  ) : isCompleted ? (
                    <Check size={11} className="stroke-[2.5]" />
                  ) : (
                    <Icon size={11} />
                  )}
                </span>
                <span className="hidden sm:inline">{p.label}</span>
              </button>

              {idx < PASOS.length - 1 && (
                <ChevronRight size={12} className="text-gray-300 shrink-0 hidden sm:inline" />
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Acciones Finales: Vista Previa, Cancelar y Guardar */}
      <div className="flex items-center gap-1.5 shrink-0">
        {pasoActual >= 2 && onOpenPreview && (
          <CanvasButton
            variant="outline"
            size="sm"
            onClick={onOpenPreview}
            icon={<Eye size={14} className="text-[#008EE2]" />}
            title="Ver vista previa de la tarea tal como la verá el estudiante"
            className="!text-xs border-[#C7CDD1] text-[#2D3B45] hover:border-[#008EE2]"
          >
            <span className="hidden sm:inline">Ver vista previa</span>
          </CanvasButton>
        )}

        <CanvasButton variant="secondary" size="sm" onClick={onBack}>
          Cancelar
        </CanvasButton>
        <CanvasButton
          variant="primary-udp"
          size="sm"
          onClick={onPublish}
          disabled={!isActividadConfirmada}
          title={
            !isActividadConfirmada
              ? "Debes confirmar una dinámica antes de guardar"
              : "Guardar y publicar en Canvas"
          }
        >
          Guardar y Publicar
        </CanvasButton>
      </div>
    </header>
  );
};
