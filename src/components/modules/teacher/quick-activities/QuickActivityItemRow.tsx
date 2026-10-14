"use client";

import React from "react";
import { CanvasItemRow } from "@/components/canvas/CanvasItemGroup";
import { QuickActivity } from "@/types/quickActivities";
import { FileText, Link as LinkIcon, Download, ExternalLink, CheckCircle2, Edit3, Trash2 } from "lucide-react";

interface QuickActivityItemRowProps {
  activity: QuickActivity;
  onSelect: () => void;
  onEdit: () => void;
  onTogglePublish: () => void;
  onDelete: () => void;
}

export const QuickActivityItemRow: React.FC<QuickActivityItemRowProps> = ({
  activity,
  onSelect,
  onEdit,
  onTogglePublish,
  onDelete,
}) => {
  return (
    <CanvasItemRow
      id={activity.id}
      indicatorColor={activity.estado === "publicada" ? "green" : "gray"}
      icon={activity.tipoRecurso === "archivo" ? <FileText size={17} /> : <LinkIcon size={17} />}
      title={activity.titulo}
      subtitle={
        <span className="flex items-center gap-2 flex-wrap">
          <span>{activity.fechaPublicacion}</span>
          <span>•</span>
          <span className="line-clamp-1">{activity.descripcion}</span>
        </span>
      }
      isPublished={activity.estado === "publicada"}
      onClick={onSelect}
      rightBadge={
        <div className="flex items-center gap-2">
          {activity.tipoRecurso === "archivo" && activity.archivo && (
            <span className="text-xs text-[#2D3B45] font-semibold px-2 py-0.5 bg-[#F5F6F8] rounded-[3px] border border-[#C7CDD1] flex items-center gap-1">
              <Download size={12} className="text-[#B71C1C]" />
              {activity.archivo.size}
            </span>
          )}
          {activity.tipoRecurso === "link" && (
            <span className="text-xs text-[#008EE2] font-semibold px-2 py-0.5 bg-blue-50 rounded-[3px] border border-blue-200 flex items-center gap-1">
              <ExternalLink size={12} />
              Enlace
            </span>
          )}
          {activity.fechaLimite && (
            <span className="text-xs text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-[3px] font-medium hidden sm:inline-block">
              {activity.fechaLimite}
            </span>
          )}
        </div>
      }
      actionItems={[
        {
          label: "Ver tarea y archivo",
          icon: <FileText size={14} className="text-[#008EE2]" />,
          onClick: onSelect,
        },
        {
          label: "Editar tarea",
          icon: <Edit3 size={14} className="text-[#2D3B45]" />,
          onClick: onEdit,
        },
        {
          label: activity.estado === "publicada" ? "Despublicar" : "Publicar",
          icon: <CheckCircle2 size={14} />,
          onClick: onTogglePublish,
        },
        {
          label: "Eliminar",
          icon: <Trash2 size={14} className="text-red-600" />,
          variant: "danger",
          onClick: onDelete,
        },
      ]}
    />
  );
};
