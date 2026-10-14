"use client";

import React from "react";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { QuickActivity } from "@/types/quickActivities";
import { Trash2 } from "lucide-react";

interface QuickActivityDeleteModalProps {
  activity: QuickActivity | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const QuickActivityDeleteModal: React.FC<QuickActivityDeleteModalProps> = ({
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
        <div className="flex items-center gap-2 text-red-600">
          <Trash2 size={18} />
          <span>Eliminar Tarea Rápida</span>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <CanvasButton variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </CanvasButton>
          <CanvasButton variant="danger" size="sm" onClick={onConfirm}>
            Sí, Eliminar
          </CanvasButton>
        </div>
      }
    >
      <div className="space-y-2 text-xs text-[#2D3B45]">
        <p>
          ¿Estás seguro de que deseas eliminar permanentemente la tarea rápida{" "}
          <strong className="text-red-700">"{activity.titulo}"</strong>?
        </p>
        <p className="text-[11px] text-[#6B7780]">
          Esta acción removerá el archivo/enlace de la vista del curso.
        </p>
      </div>
    </CanvasModal>
  );
};
