"use client";

import React from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { Send, Edit3, Check, Download, Share2 } from "lucide-react";

interface CourseExcelToolbarProps {
  isEditingExcel: boolean;
  onSendToSchool: () => void;
  onToggleEdit: () => void;
  onSaveEdits: () => void;
  onCancelEdit: () => void;
  onDownloadExcel: () => void;
  onShareModal: () => void;
}

export const CourseExcelToolbar: React.FC<CourseExcelToolbarProps> = ({
  isEditingExcel,
  onSendToSchool,
  onToggleEdit,
  onSaveEdits,
  onCancelEdit,
  onDownloadExcel,
  onShareModal,
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <CanvasButton
        variant="primary-udp"
        size="sm"
        onClick={onSendToSchool}
        icon={<Send size={14} />}
        title="Enviar la planilla oficial consolidada a la Dirección de Escuela"
      >
        Enviar Excel a la Escuela
      </CanvasButton>

      {!isEditingExcel ? (
        <CanvasButton
          variant="outline"
          size="sm"
          onClick={onToggleEdit}
          icon={<Edit3 size={14} />}
          title="Habilitar edición de calificaciones oficiales"
        >
          Modo Edición
        </CanvasButton>
      ) : (
        <>
          <CanvasButton
            variant="primary-canvas"
            size="sm"
            onClick={onSaveEdits}
            icon={<Check size={14} />}
            title="Guardar cambios en la planilla oficial"
          >
            Guardar
          </CanvasButton>
          <CanvasButton
            variant="outline"
            size="sm"
            onClick={onCancelEdit}
          >
            Cancelar
          </CanvasButton>
        </>
      )}

      <CanvasButton
        variant="outline"
        size="sm"
        onClick={onDownloadExcel}
        icon={<Download size={14} />}
        title="Descargar la nómina oficial en formato .xlsx con fórmulas"
      >
        Descargar Excel UDP
      </CanvasButton>

      <CanvasButton
        variant="outline"
        size="sm"
        onClick={onShareModal}
        icon={<Share2 size={14} />}
        title="Generar enlace público anónimo para compartir con los estudiantes"
      >
        Compartir con Estudiantes
      </CanvasButton>
    </div>
  );
};
