"use client";

import React, { useState } from "react";
import { BaseOfficialCourse, OfficialMaterial } from "@/types/officialMaterials";
import { CanvasItemGroup } from "@/components/canvas/CanvasItemGroup";
import { OfficialMaterialRow } from "./OfficialMaterialRow";
import { Plus, Users, BookOpen, Layers } from "lucide-react";
import { ActionMenuItem } from "@/components/canvas/CanvasActionMenu";

interface OfficialMaterialGroupProps {
  course: BaseOfficialCourse;
  materials: OfficialMaterial[];
  isAdmin: boolean;
  onTogglePublish: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (material: OfficialMaterial) => void;
  onAddMaterialClick?: (courseCode: string) => void;
}

export const OfficialMaterialGroup: React.FC<OfficialMaterialGroupProps> = ({
  course,
  materials,
  isAdmin,
  onTogglePublish,
  onDelete,
  onViewDetails,
  onAddMaterialClick,
}) => {
  const publishedCount = materials.filter((m) => m.isCanvasPublished).length;

  const headerActions: ActionMenuItem[] = [
    ...(isAdmin
      ? [
          {
            label: `+ Agregar material oficial a ${course.code}`,
            icon: <Plus size={14} />,
            onClick: () => onAddMaterialClick?.(course.code),
          },
        ]
      : []),
  ];

  const countBadge = (
    <div className="flex items-center gap-1.5 text-xs text-[#2D3B45]">
      <span className="font-semibold bg-gray-200/80 px-2 py-0.5 rounded text-[11px]">
        {materials.length} {materials.length === 1 ? "archivo" : "archivos"}
      </span>
      {materials.length > 0 && (
        <span className="text-[11px] text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-1.5 py-0.5 rounded font-medium">
          {publishedCount}/{materials.length} publicados
        </span>
      )}
    </div>
  );

  const weightBadge = `Estándar para ${course.totalSections} secciones: [${course.sectionsList.join(", ")}]`;

  return (
    <CanvasItemGroup
      title={`${course.code}: ${course.name}`}
      countBadge={countBadge}
      weightBadge={weightBadge}
      defaultExpanded={true}
      onAddClick={isAdmin ? () => onAddMaterialClick?.(course.code) : undefined}
      headerActions={headerActions.length > 0 ? headerActions : undefined}
    >
      {materials.length === 0 ? (
        <div className="p-6 text-center text-xs text-[#6B7780] bg-gray-50/50">
          <BookOpen size={24} className="mx-auto mb-2 text-gray-300" />
          <p className="font-medium text-[#2D3B45]">Aún no hay archivos oficiales cargados para {course.code}.</p>
          <p className="mt-1 text-[11px]">
            {isAdmin
              ? "Como Administrador de Escuela, puedes presionar '+ Agregar ítem' para estandarizar el material oficial de esta asignatura."
              : "La Escuela aún no ha publicado el material oficial estandarizado para esta asignatura."}
          </p>
        </div>
      ) : (
        materials.map((mat) => (
          <OfficialMaterialRow
            key={mat.id}
            material={mat}
            isAdmin={isAdmin}
            onTogglePublish={onTogglePublish}
            onDelete={onDelete}
            onViewDetails={onViewDetails}
          />
        ))
      )}
    </CanvasItemGroup>
  );
};
