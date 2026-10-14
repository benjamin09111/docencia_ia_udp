"use client";

import React, { useState } from "react";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { QuickActivity } from "@/types/quickActivities";
import { Edit3 } from "lucide-react";

interface QuickActivityEditModalProps {
  activity: QuickActivity;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: QuickActivity) => void;
}

export const QuickActivityEditModal: React.FC<QuickActivityEditModalProps> = ({
  activity,
  isOpen,
  onClose,
  onSave,
}) => {
  const [titulo, setTitulo] = useState(activity.titulo);
  const [descripcion, setDescripcion] = useState(activity.descripcion);
  const [enlaceUrl, setEnlaceUrl] = useState(activity.enlaceUrl || "");
  const [enlaceTexto, setEnlaceTexto] = useState(activity.enlaceTexto || "");
  const [fechaLimite, setFechaLimite] = useState(activity.fechaLimite || "");
  const [estado, setEstado] = useState(activity.estado);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...activity,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      enlaceUrl: activity.tipoRecurso === "link" ? enlaceUrl.trim() : undefined,
      enlaceTexto: activity.tipoRecurso === "link" ? enlaceTexto.trim() : undefined,
      fechaLimite: fechaLimite || undefined,
      estado,
    });
    onClose();
  };

  return (
    <CanvasModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2">
          <Edit3 size={16} className="text-[#008EE2]" />
          <span>Editar Tarea Rápida</span>
        </div>
      }
      subtitle="Modifica los datos de la tarea publicada."
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <CanvasButton type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </CanvasButton>
          <CanvasButton type="submit" form="edit-quick-form" variant="primary-udp" size="sm">
            Guardar Cambios
          </CanvasButton>
        </div>
      }
    >
      <form id="edit-quick-form" onSubmit={handleSubmit} className="space-y-3.5 text-xs text-[#2D3B45]">
        <div>
          <label className="block font-bold mb-1">Título de la tarea</label>
          <input
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full bg-white border border-[#C7CDD1] rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-bold mb-1">Descripción / Indicaciones</label>
          <textarea
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full bg-white border border-[#C7CDD1] rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-none leading-relaxed"
          />
        </div>

        {activity.tipoRecurso === "link" && (
          <div className="space-y-2">
            <div>
              <label className="block font-bold mb-1">URL del Enlace</label>
              <input
                type="url"
                required
                value={enlaceUrl}
                onChange={(e) => setEnlaceUrl(e.target.value)}
                className="w-full bg-white border border-[#C7CDD1] rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Texto del Enlace</label>
              <input
                type="text"
                value={enlaceTexto}
                onChange={(e) => setEnlaceTexto(e.target.value)}
                className="w-full bg-white border border-[#C7CDD1] rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-none"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold mb-1">Fecha de Entrega</label>
            <input
              type="date"
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              className="w-full bg-white border border-[#C7CDD1] rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as "publicada" | "borrador")}
              className="w-full bg-white border border-[#C7CDD1] rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-none"
            >
              <option value="publicada">Publicada</option>
              <option value="borrador">Borrador</option>
            </select>
          </div>
        </div>
      </form>
    </CanvasModal>
  );
};
