"use client";

import React, { useState } from "react";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  ACTIVIDADES_FORMATIVAS,
  CATEGORIAS_ACTIVIDADES_FORMATIVAS,
} from "@/constants/actividadesFormativasCatalog";
import { ActividadPedagogicaDetalleCard } from "./ActividadPedagogicaDetalleCard";
import { Sparkles, Layers, Plus } from "lucide-react";

interface CatalogoActividadesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForCreation?: (actividadId: string) => void;
}

export const CatalogoActividadesModal: React.FC<CatalogoActividadesModalProps> = ({
  isOpen,
  onClose,
  onSelectForCreation,
}) => {
  const [selectedId, setSelectedId] = useState<string>(ACTIVIDADES_FORMATIVAS[0].id);
  const [filtroCategoria, setFiltroCategoria] = useState<string>("Todas");

  const actividadActual =
    ACTIVIDADES_FORMATIVAS.find((a) => a.id === selectedId) || ACTIVIDADES_FORMATIVAS[0];

  const handleCreate = () => {
    onSelectForCreation?.(actividadActual.id);
    onClose();
  };

  return (
    <CanvasModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <span className="flex items-center gap-2 text-base font-bold text-[#2D3B45]">
          <Sparkles size={18} className="text-[#B71C1C]" />
          Catálogo Pedagógico de Actividades Formativas
        </span>
      }
      subtitle="Conoce qué hace y cómo funciona cada una de las 21 metodologías para elegir la adecuada."
      footer={
        <div className="flex items-center justify-between w-full">
          <CanvasButton variant="secondary" size="sm" onClick={onClose}>
            Cerrar
          </CanvasButton>
          {onSelectForCreation && (
            <CanvasButton
              variant="primary-udp"
              size="sm"
              onClick={handleCreate}
              icon={<Plus size={14} />}
            >
              Crear "{actividadActual.nombre}"
            </CanvasButton>
          )}
        </div>
      }
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Selector y Filtros */}
        <div className="bg-gray-50 p-3 rounded-[4px] border border-[#E0E3E6] space-y-2">
          <label
            htmlFor="modal-select-actividad"
            className="text-xs font-bold text-[#2D3B45] flex items-center gap-1.5"
          >
            <Layers size={13} className="text-[#008EE2]" />
            Selecciona una actividad para ver sus detalles:
          </label>
          <select
            id="modal-select-actividad"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full bg-white border border-[#C7CDD1] hover:border-[#008EE2] focus:border-[#B71C1C] rounded p-2 text-xs md:text-sm font-semibold text-[#2D3B45] outline-none"
          >
            {CATEGORIAS_ACTIVIDADES_FORMATIVAS.filter((c) => c !== "Todas").map((cat) => {
              const items = ACTIVIDADES_FORMATIVAS.filter((a) => a.faseClase === cat);
              if (items.length === 0) return null;
              return (
                <optgroup key={cat} label={`─── ${cat.toUpperCase()} ───`}>
                  {items.map((act) => (
                    <option key={act.id} value={act.id}>
                      {act.nombre} ({act.duracionSugerida})
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>

          {/* Chips de filtro rápido */}
          <div className="flex flex-wrap items-center gap-1 pt-1">
            {CATEGORIAS_ACTIVIDADES_FORMATIVAS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFiltroCategoria(cat)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  filtroCategoria === cat
                    ? "bg-[#2D3B45] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ficha Detallada */}
        <ActividadPedagogicaDetalleCard actividad={actividadActual} />
      </div>
    </CanvasModal>
  );
};
