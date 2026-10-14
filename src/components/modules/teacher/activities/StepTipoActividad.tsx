"use client";

import React, { useState } from "react";
import { GraduationCap, Layers } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { MetodologiaDocente } from "@/constants/metodologiasDocentes";
import {
  actividadFormativaToMetodologiaDocente,
  ACTIVIDADES_FORMATIVAS,
} from "@/constants/actividadesFormativasCatalog";
import { PedagogicalCardDeckView } from "./deck/PedagogicalCardDeckView";
import { CatalogoActividadesModal } from "./CatalogoActividadesModal";
import { ActividadFormativa } from "@/types/actividadesFormativas";

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
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  const handleSelectActividad = (act: ActividadFormativa) => {
    onSelectMetodologia(actividadFormativaToMetodologiaDocente(act));
    onNext();
  };

  const handleSelectFromCatalog = (actividadId: string) => {
    const found = ACTIVIDADES_FORMATIVAS.find((a) => a.id === actividadId);
    if (found) {
      handleSelectActividad(found);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden gap-2">
      {/* Header institucional Canvas */}
      <div className="flex items-center justify-between shrink-0 px-1">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#2D3B45] flex items-center gap-2">
            <GraduationCap size={18} className="text-[#B71C1C]" />
            Paso 1: Selección de Metodología y Dinámica Pedagógica
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7780] mt-0.5">
            Explora las dinámicas formativas. Haz clic en &quot;Elegir esta Dinámica&quot; para confirmar y desbloquear la configuración de la tarea Canvas.
          </p>
        </div>

        <CanvasButton
          variant="secondary"
          size="sm"
          onClick={() => setIsCatalogModalOpen(true)}
          icon={<Layers size={14} className="text-[#B71C1C]" />}
        >
          Catálogo completo (21)
        </CanvasButton>
      </div>

      {/* Escenario 3D de la Baraja Flotante ajustado al alto exacto */}
      <div className="flex-1 min-h-0 flex flex-col">
        <PedagogicalCardDeckView
          initialActivityId={selectedMetodologia.id}
          onSelectActividad={handleSelectActividad}
        />
      </div>

      {/* Modal Canónico de Consulta del Catálogo Completo */}
      <CatalogoActividadesModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        onSelectForCreation={(id) => {
          handleSelectFromCatalog(id);
          setIsCatalogModalOpen(false);
        }}
      />
    </div>
  );
};
