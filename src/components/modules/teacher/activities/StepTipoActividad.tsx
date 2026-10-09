"use client";

import React, { useState, useMemo } from "react";
import { GraduationCap, ChevronRight, Layers, HelpCircle } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { MetodologiaDocente } from "@/constants/metodologiasDocentes";
import {
  ACTIVIDADES_FORMATIVAS,
  actividadFormativaToMetodologiaDocente,
  CATEGORIAS_ACTIVIDADES_FORMATIVAS,
  getActividadFormativaById,
} from "@/constants/actividadesFormativasCatalog";
import { ActividadPedagogicaDetalleCard } from "./ActividadPedagogicaDetalleCard";

interface StepTipoActividadProps {
  selectedMetodologia: MetodologiaDocente;
  onSelectMetodologia: (m: MetodologiaDocente) => void;
  onNext: () => void;
}

export const StepTipoActividad: React.FC<StepTipoActividadProps> = ({
  selectedMetodologia,
  onSelectMetodologia,
  onNext,
}) => {
  const [filtroCategoria, setFiltroCategoria] = useState<string>("Todas");

  // Actividad formativa actual seleccionada en el catálogo
  const actividadActual = useMemo(() => {
    return (
      getActividadFormativaById(selectedMetodologia.id) ||
      ACTIVIDADES_FORMATIVAS.find((a) => a.nombre === selectedMetodologia.nombreCorto) ||
      ACTIVIDADES_FORMATIVAS[0]
    );
  }, [selectedMetodologia]);

  // Lista filtrada para el select
  const actividadesFiltradas = useMemo(() => {
    if (filtroCategoria === "Todas") return ACTIVIDADES_FORMATIVAS;
    return ACTIVIDADES_FORMATIVAS.filter((a) => a.faseClase === filtroCategoria);
  }, [filtroCategoria]);

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = ACTIVIDADES_FORMATIVAS.find((a) => a.id === e.target.value);
    if (found) {
      const met = actividadFormativaToMetodologiaDocente(found);
      onSelectMetodologia(met);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Canvas con contexto pedagógico */}
      <div>
        <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
          <GraduationCap size={16} className="text-[#B71C1C]" />
          Paso 1: Catálogo de Actividades Formativas
        </h2>
        <p className="text-xs text-[#6B7780] mt-0.5">
          Selecciona una de las 21 actividades formativas pedagógicas. Conoce en detalle qué hace y cómo funciona antes de aplicarla.
        </p>
      </div>

      {/* Barra de Filtro Rápido por Fase de Clase */}
      <div className="bg-white p-3 rounded-[4px] border border-[#E0E3E6] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label htmlFor="select-actividad-formativa" className="text-xs font-bold text-[#2D3B45] flex items-center gap-1.5">
            <Layers size={14} className="text-[#008EE2]" />
            Selecciona la actividad formativa:
          </label>
          <span className="text-[11px] text-[#6B7780]">
            21 dinámicas pedagógicas oficiales
          </span>
        </div>

        {/* SELECT PRINCIPAL CON LAS 21 ACTIVIDADES */}
        <div className="relative">
          <select
            id="select-actividad-formativa"
            value={actividadActual.id}
            onChange={handleChangeSelect}
            className="w-full bg-white border-2 border-[#C7CDD1] hover:border-[#008EE2] focus:border-[#B71C1C] rounded-[4px] py-2.5 px-3 text-xs md:text-sm font-semibold text-[#2D3B45] transition-all cursor-pointer shadow-xs outline-none"
          >
            {CATEGORIAS_ACTIVIDADES_FORMATIVAS.filter((c) => c !== "Todas").map((cat) => {
              const items = ACTIVIDADES_FORMATIVAS.filter((a) => a.faseClase === cat);
              if (items.length === 0) return null;
              return (
                <optgroup key={cat} label={`─── ${cat.toUpperCase()} ───`}>
                  {items.map((act) => (
                    <option key={act.id} value={act.id}>
                      {act.nombre} — ({act.duracionSugerida} | {act.agrupacion})
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </div>

        {/* Filtros rápidos por chip */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-[#6B7780] font-medium mr-1">Filtrar por momento:</span>
          {CATEGORIAS_ACTIVIDADES_FORMATIVAS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFiltroCategoria(cat)}
              className={`px-2 py-0.5 rounded text-[10.5px] font-semibold transition-all ${
                filtroCategoria === cat
                  ? "bg-[#2D3B45] text-white shadow-xs"
                  : "bg-gray-100 text-[#55636E] hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FICHA DETALLADA: ¿Qué hace? y ¿Cómo funciona? */}
      <ActividadPedagogicaDetalleCard actividad={actividadActual} />

      {/* Botón de acción Canvas */}
      <div className="pt-3 border-t border-[#E0E3E6] flex items-center justify-between">
        <div className="text-[11px] text-[#6B7780] flex items-center gap-1">
          <HelpCircle size={13} className="text-[#008EE2]" />
          <span>Actividad seleccionada: <strong className="text-[#2D3B45]">{actividadActual.nombre}</strong></span>
        </div>
        <CanvasButton
          variant="primary-udp"
          size="sm"
          onClick={onNext}
          icon={<ChevronRight size={14} />}
        >
          Continuar a Información
        </CanvasButton>
      </div>
    </div>
  );
};
