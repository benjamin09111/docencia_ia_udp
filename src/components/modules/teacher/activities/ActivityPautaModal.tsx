"use client";

import React from "react";
import { CourseDeliverable } from "@/types";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasOfficialRubricTable } from "@/components/canvas/CanvasOfficialRubricTable";
import { convertRubricCriteriaToMatrix } from "@/services/officialRubricsService";
import { Award } from "lucide-react";

interface ActivityPautaModalProps {
  activity: CourseDeliverable;
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityPautaModal: React.FC<ActivityPautaModalProps> = ({
  activity,
  isOpen,
  onClose,
}) => {
  return (
    <CanvasModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={
        <div className="flex items-center gap-2">
          <Award size={18} className="text-[#B71C1C]" />
          <span>Pauta Oficial: {activity.titulo}</span>
        </div>
      }
      subtitle={`Incentivo: ${activity.ponderacion_o_decimas} • Criterios evaluados por el Agente SpeedGrader`}
      footer={
        <CanvasButton variant="secondary" size="sm" onClick={onClose}>
          Cerrar
        </CanvasButton>
      }
    >
      <div className="space-y-4">
        <div className="p-3.5 bg-[#F9FAFB] border border-[#E0E3E6] rounded-[3px] text-xs text-[#2D3B45] leading-relaxed">
          <strong className="block mb-1 text-[#2D3B45]">Descripción del taller:</strong>
          <p>{activity.descripcion}</p>
        </div>

        <CanvasOfficialRubricTable
          rubros={convertRubricCriteriaToMatrix(activity.rubrica)}
          isEditable={false}
          tituloPauta={`PAUTA OFICIAL: ${activity.titulo.toUpperCase()}`}
          subtituloPauta="Matriz institucional de rubros, criterios y descriptores de desempeño (100 pts)"
        />
      </div>
    </CanvasModal>
  );
};
