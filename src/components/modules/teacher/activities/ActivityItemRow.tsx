"use client";

import React from "react";
import { CourseDeliverable, StudentSubmission } from "@/types";
import { CanvasItemRow } from "@/components/canvas/CanvasItemGroup";
import { FileText, Award, Edit3, EyeOff, Globe, Trash2 } from "lucide-react";

interface ActivityItemRowProps {
  act: CourseDeliverable;
  entregasAlumnos: StudentSubmission[];
  onViewSubmissions: (act: CourseDeliverable) => void;
  onViewPauta: (act: CourseDeliverable) => void;
  onEdit: (act: CourseDeliverable) => void;
  onTogglePublish: (act: CourseDeliverable) => void;
  onDelete: (act: CourseDeliverable) => void;
}

export const ActivityItemRow: React.FC<ActivityItemRowProps> = ({
  act,
  entregasAlumnos,
  onViewSubmissions,
  onViewPauta,
  onEdit,
  onTogglePublish,
  onDelete,
}) => {
  const subs = entregasAlumnos.filter((s) => s.deliverable_id === act.id);
  const appeals = subs.filter((s) => s.apelacion?.estado === "pendiente").length;

  return (
    <CanvasItemRow
      id={act.id}
      indicatorColor={act.estado === "publicada" ? "green" : "gray"}
      icon={<FileText size={17} />}
      title={act.titulo}
      subtitle={
        <span>
          Fecha límite: <strong>{act.fecha_limite}</strong> • {act.target_evaluacion || "Solemne 1"} •{" "}
          {act.rubrica.length} criterios •{" "}
          <strong className="text-[#2E7D32]">{act.ponderacion_o_decimas}</strong>
        </span>
      }
      isPublished={act.estado === "publicada"}
      rightBadge={
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#2D3B45] font-semibold px-2 py-0.5 bg-[#F5F6F8] rounded-[3px] border border-[#C7CDD1]">
            {subs.length} {subs.length === 1 ? "entrega" : "entregas"}
          </span>
          {appeals > 0 && (
            <span className="text-xs text-amber-900 font-bold px-2 py-0.5 bg-amber-50 rounded-[3px] border border-amber-300">
              ⚠️ {appeals} apelación
            </span>
          )}
        </div>
      }
      actionItems={[
        { label: "Ver entregas y SpeedGrader", icon: <FileText size={14} className="text-[#008EE2]" />, onClick: () => onViewSubmissions(act) },
        { label: "Ver pauta oficial y rúbrica", icon: <Award size={14} className="text-[#B71C1C]" />, onClick: () => onViewPauta(act) },
        { label: "Editar actividad", icon: <Edit3 size={14} className="text-[#2D3B45]" />, onClick: () => onEdit(act) },
        { label: act.estado === "publicada" ? "Despublicar" : "Publicar", icon: act.estado === "publicada" ? <EyeOff size={14} /> : <Globe size={14} />, onClick: () => onTogglePublish(act) },
        { label: "Eliminar", icon: <Trash2 size={14} className="text-red-600" />, variant: "danger", onClick: () => onDelete(act) },
      ]}
    />
  );
};
