"use client";

import React from "react";
import { Search } from "lucide-react";
import { ActionMenuItem, CanvasActionMenu } from "./CanvasActionMenu";

interface CanvasToolbarProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  searchPlaceholder?: string;
  primaryButtonLabel?: string;
  onPrimaryClick?: () => void;
  secondaryButtonLabel?: string;
  onSecondaryClick?: () => void;
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

      {/* Botones de acción a la derecha */}
      <div className="flex items-center gap-2.5 justify-end">
        {secondaryButtonLabel && onSecondaryClick && (
          <button
            type="button"
            onClick={onSecondaryClick}
            className="px-4 py-2 bg-[#F5F6F8] hover:bg-gray-100 text-[#2D3B45] border border-[#C7CDD1] rounded-[3px] text-sm font-medium transition-colors cursor-pointer shadow-2xs"
          >
            {secondaryButtonLabel}
          </button>
        )}

        {primaryButtonLabel && onPrimaryClick && (
          <button
            type="button"
            onClick={onPrimaryClick}
            className="px-4 py-2 bg-[#B71C1C] hover:bg-[#A60D24] text-white border border-[#A60D24] rounded-[3px] text-sm font-bold transition-colors cursor-pointer shadow-2xs"
          >
            {primaryButtonLabel}
          </button>
        )}

        {menuItems && menuItems.length > 0 && (
          <div className="border border-[#C7CDD1] rounded-[3px] bg-[#F5F6F8] hover:bg-gray-100 flex items-center justify-center h-[38px] w-[38px] cursor-pointer shadow-2xs">
            <CanvasActionMenu items={menuItems} />
          </div>
        )}
      </div>
    </div>
  );
};
