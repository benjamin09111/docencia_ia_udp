"use client";

import React, { useState } from "react";
import { CourseDeliverable } from "@/types";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { Edit3, CheckCircle2 } from "lucide-react";

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
    // Extraer solo el número de ponderacion_o_decimas si contiene texto
    const match = activity.ponderacion_o_decimas.match(/[\d.]+/);
    return match ? match[0] : "0.3";
  });
  const [targetEvaluacion, setTargetEvaluacion] = useState(activity.target_evaluacion || "Solemne 1");
  const [fechaLimite, setFechaLimite] = useState(activity.fecha_limite || "2026-04-20");
  const [estado, setEstado] = useState(activity.estado);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CourseDeliverable = {
      ...activity,
      titulo,
      descripcion,
      ponderacion_o_decimas: `+${decimas} décimas`,
      target_evaluacion: targetEvaluacion,
      fecha_limite: fechaLimite,
      estado,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-[6px] max-w-lg w-full p-5 sm:p-6 shadow-xl border border-gray-200 space-y-4 animate-scaleUp">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center gap-2">
            <Edit3 size={16} className="text-[#008EE2]" />
            <h3 className="text-base font-bold text-[#2D3B45]">
              Ver y Editar Actividad
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-[#2D3B45] mb-1">
              Nombre de la Actividad / Taller
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border border-gray-300 rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-[#2D3B45] mb-1">
              Descripción o Enunciado del Desafío
            </label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-gray-300 rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-hidden leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2D3B45] mb-1">
                Décimas de Bonificación
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-gray-500 font-bold">+</span>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="1.0"
                  value={decimas}
                  onChange={(e) => setDecimas(e.target.value)}
                  className="w-full border border-gray-300 rounded-[3px] p-2 pl-6 text-xs focus:border-[#008EE2] focus:outline-hidden font-bold text-[#2D3B45]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#2D3B45] mb-1">
                Evaluación Destino
              </label>
              <select
                value={targetEvaluacion}
                onChange={(e) => setTargetEvaluacion(e.target.value)}
                className="w-full border border-gray-300 rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-hidden bg-white"
              >
                <option value="Solemne 1">Solemne 1</option>
                <option value="Solemne 2">Solemne 2</option>
                <option value="Reporte de Avance 1">Reporte de Avance 1</option>
                <option value="Reporte de Avance 2">Reporte de Avance 2</option>
                <option value="Nota de Presentación">Nota de Presentación</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2D3B45] mb-1">
                Fecha Límite de Entrega
              </label>
              <input
                type="date"
                value={fechaLimite}
                onChange={(e) => setFechaLimite(e.target.value)}
                className="w-full border border-gray-300 rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2D3B45] mb-1">
                Estado de Publicación
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as any)}
                className="w-full border border-gray-300 rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-hidden bg-white"
              >
                <option value="publicada">Publicada (Visible para alumnos)</option>
                <option value="borrador">Borrador (Oculta)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <CanvasButton
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Cancelar
            </CanvasButton>
            <CanvasButton
              type="submit"
              variant="primary-udp"
              size="sm"
            >
              Guardar Cambios
            </CanvasButton>
          </div>
        </form>
      </div>
    </div>
  );
};
