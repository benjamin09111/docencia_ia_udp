"use client";

import React, { useState } from "react";
import { CourseDeliverable } from "@/types";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { Edit3 } from "lucide-react";

interface ActivityEditModalProps {
  activity: CourseDeliverable;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: CourseDeliverable) => void;
}

export const ActivityEditModal: React.FC<ActivityEditModalProps> = ({
  activity,
  isOpen,
  onClose,
  onSave,
}) => {
  const [titulo, setTitulo] = useState(activity.titulo);
  const [descripcion, setDescripcion] = useState(activity.descripcion);
  const [decimas, setDecimas] = useState(() => {
    const match = activity.ponderacion_o_decimas.match(/[\d.]+/);
    return match ? match[0] : "0.3";
  });
  const [targetEvaluacion, setTargetEvaluacion] = useState(activity.target_evaluacion || "Solemne 1");
  const [fechaLimite, setFechaLimite] = useState(activity.fecha_limite || "2026-04-20");
  const [estado, setEstado] = useState(activity.estado);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...activity,
      titulo,
      descripcion,
      ponderacion_o_decimas: `+${decimas} décimas`,
      target_evaluacion: targetEvaluacion,
      fecha_limite: fechaLimite,
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
          <span>Editar Actividad Formativa</span>
        </div>
      }
      subtitle="Modifica los parámetros de entrega y bonificación de la actividad."
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <CanvasButton type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </CanvasButton>
          <CanvasButton type="submit" form="edit-activity-form" variant="primary-udp" size="sm">
            Guardar Cambios
          </CanvasButton>
        </div>
      }
    >
      <form id="edit-activity-form" onSubmit={handleSubmit} className="space-y-3.5 text-xs text-[#2D3B45]">
        <div>
          <label className="block font-bold mb-1">Título de la Actividad</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full bg-white border border-[#C7CDD1] rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-bold mb-1">Descripción / Desafío</label>
          <textarea
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full bg-white border border-[#C7CDD1] rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-none leading-relaxed"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold mb-1">Décimas Sugeridas</label>
            <div className="relative">
              <span className="absolute left-2.5 top-2 text-[#6B7780] font-bold">+</span>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="1.0"
                value={decimas}
                onChange={(e) => setDecimas(e.target.value)}
                className="w-full bg-white border border-[#C7CDD1] rounded-[3px] p-2 pl-6 text-xs focus:border-[#008EE2] focus:outline-none font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">Evaluación Destino</label>
            <select
              value={targetEvaluacion}
              onChange={(e) => setTargetEvaluacion(e.target.value)}
              className="w-full bg-white border border-[#C7CDD1] rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-none"
            >
              <option value="Solemne 1">Solemne 1</option>
              <option value="Solemne 2">Solemne 2</option>
              <option value="Reporte de Avance 1">Reporte de Avance 1</option>
              <option value="Reporte de Avance 2">Reporte de Avance 2</option>
              <option value="Presentación Final">Presentación Final</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold mb-1">Fecha Límite</label>
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
              onChange={(e) => setEstado(e.target.value as any)}
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
