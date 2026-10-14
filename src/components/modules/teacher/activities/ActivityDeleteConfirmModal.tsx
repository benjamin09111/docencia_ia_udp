"use client";

import React from "react";
import { CourseDeliverable } from "@/types";
import { CanvasModal } from "@/components/canvas/CanvasModal";
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
  if (!activity) return null;

  return (
    <CanvasModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      title={
        <div className="flex items-center gap-2 text-[#C8102E]">
          <AlertTriangle size={18} />
          <span>¿Eliminar Actividad?</span>
        </div>
      }
      subtitle="Esta acción no se puede deshacer."
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <CanvasButton type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </CanvasButton>
          <CanvasButton
            type="button"
            variant="primary-udp"
            size="sm"
            onClick={onConfirm}
            className="bg-[#C8102E] hover:bg-[#A00C24] text-white"
          >
            Eliminar
          </CanvasButton>
        </div>
      }
    >
      <div className="space-y-2 text-xs text-[#2D3B45]">
        <p>Estás a punto de eliminar la actividad formativa:</p>
        <div className="p-2.5 bg-[#F9FAFB] border border-[#E0E3E6] rounded-[3px] font-bold">
          {activity.titulo}
        </div>
        <p className="text-[11px] text-[#6B7780]">
          Se desvincularán las entregas, la rúbrica y las décimas asociadas en este curso.
        </p>
      </div>
    </CanvasModal>
  );
};
