"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Plus, GripVertical, CheckCircle2 } from "lucide-react";
import { CanvasActionMenu, ActionMenuItem } from "./CanvasActionMenu";

export interface CanvasItemRowProps {
  id: string | number;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  indicatorColor?: "green" | "blue" | "gray" | "red";
  isPublished?: boolean;
  actionItems?: ActionMenuItem[];
  onClick?: () => void;
  rightBadge?: React.ReactNode;
}

export const CanvasItemRow: React.FC<CanvasItemRowProps> = ({
  title,
  subtitle,
  icon,
  indicatorColor = "green",
  isPublished = true,
  actionItems,
  onClick,
  rightBadge,
}) => {
  const indicatorColors = {
    green: "bg-[#2E7D32]",
    blue: "bg-[#008EE2]",
    gray: "bg-gray-300",
    red: "bg-[#C8102E]",
  };

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-center justify-between px-4 py-3.5 bg-white border-b border-[#E0E3E6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {/* Indicador de barra vertical estilo Canvas (3px) */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-[3.5px] ${indicatorColors[indicatorColor]}`}
      />

      <div className="flex items-center gap-3.5 min-w-0 flex-1 pl-1.5">
        {/* Drag Handle de Canvas */}
        <span className="text-gray-300 group-hover:text-gray-500 cursor-grab shrink-0 select-none">
          <GripVertical size={16} />
        </span>

        {/* Ícono del ítem */}
        {icon && <div className="shrink-0 text-emerald-700">{icon}</div>}

        {/* Textos */}
        <div className="min-w-0 flex-1" suppressHydrationWarning>
          <div
            className="font-semibold text-sm sm:text-[14.5px] text-[#2D3B45] hover:text-[#008EE2] transition-colors truncate"
            suppressHydrationWarning
          >
            {title}
          </div>
          {subtitle && (
            <div
              className="text-xs sm:text-[12.5px] text-[#6B7780] truncate mt-1 leading-normal"
              suppressHydrationWarning
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Acciones del lado derecho */}
      <div className="flex items-center gap-3 shrink-0 ml-3">
        {rightBadge}

        {isPublished && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#2E7D32] hover:bg-emerald-50 transition-colors"
            title="Publicado"
          >
            <CheckCircle2 size={18} />
          </div>
        )}

        {actionItems && actionItems.length > 0 && (
          <div onClick={(e) => e.stopPropagation()}>
            <CanvasActionMenu items={actionItems} />
          </div>
        )}
      </div>
    </div>
  );
};

export interface CanvasItemGroupProps {
  title: string;
  countBadge?: React.ReactNode;
  weightBadge?: string;
  defaultExpanded?: boolean;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  onAddClick?: () => void;
  headerActions?: ActionMenuItem[];
  children?: React.ReactNode;
  className?: string;
}

export const CanvasItemGroup: React.FC<CanvasItemGroupProps> = ({
  title,
  countBadge,
  weightBadge,
  defaultExpanded = true,
  isExpanded: controlledExpanded,
  onToggleExpanded,
  onAddClick,
  headerActions,
  children,
  className = "",
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    if (onToggleExpanded) {
      onToggleExpanded();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  return (
    <div className={`border border-[#C7CDD1] rounded-[3px] bg-white overflow-hidden shadow-2xs mb-6 ${className}`}>
      {/* Cabecera del Grupo (Group Header Oficial Canvas) */}
      <div className="h-11 px-4 bg-[#F5F6F8] border-b border-[#C7CDD1] flex items-center justify-between select-none">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-gray-400 hover:text-gray-600 cursor-grab">
            <GripVertical size={16} />
          </span>

          <button
            type="button"
            onClick={handleToggle}
            className="flex items-center gap-2 text-left text-sm sm:text-[15px] font-bold text-[#2D3B45] hover:text-[#008EE2] transition-colors cursor-pointer"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <span className="truncate">{title}</span>
          </button>

          {countBadge && <span className="ml-1 shrink-0">{countBadge}</span>}
          {weightBadge && (
            <span className="text-xs font-normal text-[#6B7780] ml-2 shrink-0">
              {weightBadge}
            </span>
          )}
        </div>

        {/* Acciones de la Cabecera (+ y ⋮) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onAddClick && (
            <button
              type="button"
              onClick={onAddClick}
              className="p-1.5 text-gray-600 hover:text-[#2D3B45] hover:bg-gray-200/60 rounded transition-colors"
              title="Agregar ítem"
            >
              <Plus size={16} />
            </button>
          )}

          {headerActions && headerActions.length > 0 && (
            <CanvasActionMenu items={headerActions} />
          )}
        </div>
      </div>

      {/* Lista de Filas */}
      {isExpanded && <div className="divide-y divide-[#E0E3E6]">{children}</div>}
    </div>
  );
};
