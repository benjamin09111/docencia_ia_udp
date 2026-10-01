"use client";

import React from "react";
import { CourseDeliverable } from "@/types";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { AlertTriangle } from "lucide-react";

interface ActivityDeleteConfirmModalProps {
  activity: CourseDeliverable | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ActivityDeleteConfirmModal: React.FC<ActivityDeleteConfirmModalProps> = ({
  activity,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-[6px] max-w-md w-full p-5 sm:p-6 shadow-xl border border-gray-200 space-y-4 animate-scaleUp">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2D3B45]">
              ¿Eliminar Actividad?
            </h3>
            <p className="text-xs text-[#6B7780] mt-0.5">
              Confirmación de eliminación de taller
            </p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs text-[#55636E] space-y-1">
          <p>
            Estás a punto de eliminar la actividad:
          </p>
          <strong className="block text-[#2D3B45] font-semibold">
            "{activity.titulo}"
          </strong>
          <p className="text-[11px] text-[#6B7780] pt-1">
            Esta acción desvinculará las rúbricas y entregas asociadas en este curso.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <CanvasButton
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancelar
          </CanvasButton>
          <CanvasButton
            type="button"
            variant="primary-udp"
            size="sm"
            onClick={onConfirm}
            className="bg-[#C8102E] hover:bg-[#A00C24] text-white"
          >
            Eliminar Actividad
          </CanvasButton>
        </div>
      </div>
    </div>
  );
};
