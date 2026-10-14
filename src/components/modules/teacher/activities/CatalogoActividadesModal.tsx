"use client";

import React, { useState, useMemo } from "react";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { ACTIVIDADES_FORMATIVAS } from "@/constants/actividadesFormativasCatalog";
import { CatalogActivityList } from "./catalog/CatalogActivityList";
import { CatalogActivityDetail } from "./catalog/CatalogActivityDetail";
import { BookOpen, Search, Check } from "lucide-react";

interface CatalogoActividadesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForCreation?: (actividadId: string) => void;
}

const FASES_CATALOGO = [
  { id: "Todas", label: "Todas (21)" },
  { id: "Inicio de clase", label: "Inicio (6)" },
  { id: "Desarrollo / Durante la clase", label: "Desarrollo (10)" },
  { id: "Cierre de clase", label: "Cierre (5)" },
];

export const CatalogoActividadesModal: React.FC<CatalogoActividadesModalProps> = ({
  isOpen,
  onClose,
  onSelectForCreation,
}) => {
  const [selectedId, setSelectedId] = useState<string>(ACTIVIDADES_FORMATIVAS[0].id);
  const [filtroFase, setFiltroFase] = useState<string>("Todas");
  const [searchQuery, setSearchQuery] = useState("");

  const actividadesFiltradas = useMemo(() => {
    return ACTIVIDADES_FORMATIVAS.filter((act) => {
      const matchFase = filtroFase === "Todas" || act.faseClase === filtroFase;
      const matchQuery =
        !searchQuery.trim() ||
        act.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.queHace.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFase && matchQuery;
    });
  }, [filtroFase, searchQuery]);

  const actividadActual = useMemo(() => {
    return (
      actividadesFiltradas.find((a) => a.id === selectedId) ||
      ACTIVIDADES_FORMATIVAS.find((a) => a.id === selectedId) ||
      actividadesFiltradas[0] ||
      ACTIVIDADES_FORMATIVAS[0]
    );
  }, [actividadesFiltradas, selectedId]);

  const handleSelect = (id: string) => {
    onSelectForCreation?.(id);
    onClose();
  };

  return (
    <CanvasModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="5xl"
      title={
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-[#B71C1C]" />
          <span>Catálogo Pedagógico Institucional (21 Dinámicas)</span>
        </div>
      }
      subtitle="Explora dinámicas activas con roles, tiempos y guiones paso a paso en formato Canvas."
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-[#6B7780]">
            Mostrando {actividadesFiltradas.length} de {ACTIVIDADES_FORMATIVAS.length} dinámicas
          </span>
          <div className="flex items-center gap-2">
            <CanvasButton variant="secondary" size="sm" onClick={onClose}>
              Cerrar
            </CanvasButton>
            {onSelectForCreation && (
              <CanvasButton
                variant="primary-udp"
                size="sm"
                onClick={() => handleSelect(actividadActual.id)}
                icon={<Check size={14} />}
              >
                Elegir &quot;{actividadActual.nombre}&quot;
              </CanvasButton>
            )}
          </div>
        </div>
      }
    >
      <div className="flex flex-col h-[520px] -mx-4 -my-3 sm:-mx-6 sm:-my-4">
        {/* Barra Superior de Búsqueda y Píldoras de Filtro */}
        <div className="p-3 bg-[#F5F6F8] border-b border-[#C7CDD1] flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7780]" />
            <input
              type="text"
              placeholder="Buscar por nombre o concepto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-white border border-[#C7CDD1] rounded-[3px] text-xs text-[#2D3B45] focus:outline-none focus:border-[#B71C1C]"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            {FASES_CATALOGO.map((fase) => (
              <button
                key={fase.id}
                type="button"
                onClick={() => setFiltroFase(fase.id)}
                className={`text-xs px-2.5 py-1 rounded transition-colors cursor-pointer font-medium ${
                  filtroFase === fase.id
                    ? "bg-[#B71C1C] text-white font-bold"
                    : "bg-white text-[#2D3B45] hover:bg-gray-100 border border-[#C7CDD1]"
                }`}
              >
                {fase.label}
              </button>
            ))}
          </div>
        </div>

        {/* Panel Doble: Lista a la Izquierda + Detalle con Acordeones a la Derecha */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* Panel Izquierdo: Lista de Dinámicas */}
          <div className="w-64 sm:w-72 shrink-0 border-r border-[#C7CDD1] bg-[#F5F6F8] overflow-y-auto">
            <CatalogActivityList
              actividades={actividadesFiltradas}
              selectedId={actividadActual.id}
              onSelect={setSelectedId}
            />
          </div>

          {/* Panel Derecho: Detalle Estructurado en Acordeones */}
          <div className="flex-1 min-w-0 p-4 sm:p-5 overflow-y-auto bg-white">
            <CatalogActivityDetail
              actividad={actividadActual}
              onSelectForCreation={handleSelect}
            />
          </div>
        </div>
      </div>
    </CanvasModal>
  );
};
