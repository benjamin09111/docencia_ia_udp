"use client";

import React from "react";
import { OfficialMaterial } from "@/types/officialMaterials";
import {
  FileText,
  BookOpen,
  FileCheck2,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  Eye,
  Trash2,
  ToggleLeft,
  FileCode,
} from "lucide-react";
import { OfficialMaterialCanvasBadge } from "./OfficialMaterialCanvasBadge";
import { CanvasItemRow } from "@/components/canvas/CanvasItemGroup";
import { ActionMenuItem } from "@/components/canvas/CanvasActionMenu";

interface OfficialMaterialRowProps {
  material: OfficialMaterial;
  isAdmin: boolean;
  onTogglePublish: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (material: OfficialMaterial) => void;
}

export const OfficialMaterialRow: React.FC<OfficialMaterialRowProps> = ({
  material,
  isAdmin,
  onTogglePublish,
  onDelete,
  onViewDetails,
}) => {
  const getCategoryIcon = () => {
    switch (material.category) {
      case "syllabus":
        return <BookOpen size={18} className="text-[#B71C1C]" />;
      case "rubrica":
        return <FileCheck2 size={18} className="text-[#008EE2]" />;
      case "politicas":
        return <ShieldCheck size={18} className="text-emerald-700" />;
      case "plantilla":
        return <FileSpreadsheet size={18} className="text-amber-700" />;
      default:
        return <FileText size={18} className="text-gray-700" />;
    }
  };

  const getCategoryBadge = () => {
    const badges: Record<string, { label: string; color: string }> = {
      syllabus: { label: "Syllabus Oficial", color: "bg-red-50 text-[#B71C1C] border-red-200" },
      guia_proyecto: { label: "Guía Hito / Proyecto", color: "bg-blue-50 text-[#008EE2] border-blue-200" },
      rubrica: { label: "Rúbrica Institucional", color: "bg-purple-50 text-purple-700 border-purple-200" },
      plantilla: { label: "Plantilla Oficial", color: "bg-amber-50 text-amber-800 border-amber-200" },
      politicas: { label: "Políticas & Ética IA", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
      material_oficial: { label: "Material Oficial", color: "bg-gray-100 text-gray-700 border-gray-200" },
    };
    const current = badges[material.category] || badges.material_oficial;
    return (
      <span className={`inline-block px-1.5 py-0.5 rounded text-[10.5px] font-semibold border ${current.color}`}>
        {current.label}
      </span>
    );
  };

  const actionItems: ActionMenuItem[] = [
    {
      label: "Descargar archivo",
      icon: <Download size={14} />,
      onClick: () => {
        alert(`Iniciando descarga segura de: ${material.fileName} (${material.fileSize})`);
      },
    },
    {
      label: "Ver detalles pedagógicos",
      icon: <Eye size={14} />,
      onClick: () => onViewDetails?.(material),
    },
    ...(isAdmin
      ? [
          {
            label: material.isCanvasPublished ? "Despublicar de Canvas" : "Publicar en todas las secciones de Canvas",
            icon: <ToggleLeft size={14} />,
            onClick: () => onTogglePublish(material.id),
          },
          {
            label: "Eliminar material oficial",
            icon: <Trash2 size={14} className="text-red-600" />,
            variant: "danger" as const,
            onClick: () => {
              if (window.confirm(`¿Estás seguro de eliminar "${material.title}" del repositorio oficial?`)) {
                onDelete?.(material.id);
              }
            },
          },
        ]
      : []),
  ];

  const subtitle = (
    <div className="flex flex-wrap items-center gap-2 mt-1">
      {getCategoryBadge()}
      <span className="text-[11.5px] text-[#6B7780] font-mono">
        {material.fileName} ({material.fileSize})
      </span>
      <span className="text-gray-300">•</span>
      <span className="text-[11.5px] text-[#6B7780]">
        Ver. {material.version}
      </span>
      <span className="text-gray-300">•</span>
      <span className="text-[11.5px] text-[#6B7780]">
        Actualizado: {material.updatedAt}
      </span>
      <span className="text-gray-300 hidden sm:inline">•</span>
      <span className="text-[11px] text-[#6B7780] bg-gray-50 px-1.5 py-0.2 rounded border border-gray-200 hidden sm:inline">
        Por: {material.uploadedBy}
      </span>
    </div>
  );

  return (
    <CanvasItemRow
      id={material.id}
      title={
        <div className="flex items-center gap-2">
          <span>{material.title}</span>
        </div>
      }
      subtitle={subtitle}
      icon={getCategoryIcon()}
      indicatorColor={material.isCanvasPublished ? "green" : "gray"}
      isPublished={false} // Custom badge used instead
      rightBadge={
        <OfficialMaterialCanvasBadge
          isPublished={material.isCanvasPublished}
          totalSections={material.totalSections}
          syncedSections={material.syncedSections}
          isAdmin={isAdmin}
          onTogglePublish={() => onTogglePublish(material.id)}
        />
      }
      actionItems={actionItems}
      onClick={() => onViewDetails?.(material)}
    />
  );
};
