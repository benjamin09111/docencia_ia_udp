"use client";

import React from "react";
import { Search } from "lucide-react";
import { CanvasButton } from "./CanvasButton";
import { ActionMenuItem, CanvasActionMenu } from "./CanvasActionMenu";

interface CanvasToolbarProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  searchPlaceholder?: string;
  primaryButtonLabel?: string;
  onPrimaryClick?: () => void;
  secondaryButtonLabel?: string;
  onSecondaryClick?: () => void;
  tertiaryButtonLabel?: string;
  onTertiaryClick?: () => void;
  menuItems?: ActionMenuItem[];
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Buscar...",
  primaryButtonLabel = "+ Tarea",
  onPrimaryClick,
  secondaryButtonLabel = "+ Grupo",
  onSecondaryClick,
  tertiaryButtonLabel,
  onTertiaryClick,
  menuItems,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-5 select-none">
      {/* Input de búsqueda estilo Canvas */}
      <div className="relative w-full sm:w-72">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7780] pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#C7CDD1] rounded-[3px] text-sm text-[#2D3B45] placeholder-[#6B7780] focus:outline-none focus:ring-1 focus:ring-[#008EE2] focus:border-[#008EE2] transition-all shadow-2xs"
        />
      </div>

      {/* Botones de acción utilizando CanvasButton canónico */}
      <div className="flex items-center gap-2.5 justify-end">
        {secondaryButtonLabel && onSecondaryClick && (
          <CanvasButton
            variant="secondary"
            size="md"
            onClick={onSecondaryClick}
          >
            {secondaryButtonLabel}
          </CanvasButton>
        )}

        {tertiaryButtonLabel && onTertiaryClick && (
          <CanvasButton variant="secondary" size="md" onClick={onTertiaryClick}>
            {tertiaryButtonLabel}
          </CanvasButton>
        )}

        {primaryButtonLabel && onPrimaryClick && (
          <CanvasButton
            variant="primary-udp"
            size="md"
            onClick={onPrimaryClick}
          >
            {primaryButtonLabel}
          </CanvasButton>
        )}

        {menuItems && menuItems.length > 0 && (
          <div className="border border-[#C7CDD1] rounded-[3px] bg-[#F5F6F8] hover:bg-gray-100 flex items-center justify-center h-[36px] w-[36px] cursor-pointer shadow-2xs">
            <CanvasActionMenu items={menuItems} />
          </div>
        )}
      </div>
    </div>
  );
};
