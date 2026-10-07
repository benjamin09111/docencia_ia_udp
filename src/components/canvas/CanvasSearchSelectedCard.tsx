import React from "react";
import { UserCheck } from "lucide-react";
import { CanvasSearchOption } from "./CanvasSearchableSelect";

interface CanvasSearchSelectedCardProps {
  cardLabel: string;
  selectedOption: CanvasSearchOption;
  onClear: () => void;
}

export const CanvasSearchSelectedCard: React.FC<CanvasSearchSelectedCardProps> = ({
  cardLabel,
  selectedOption,
  onClear,
}) => {
  return (
    <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-[4px] flex items-center justify-between gap-3 shadow-2xs animate-fadeIn">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
          <UserCheck size={16} />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
            {cardLabel}
          </span>
          <strong className="text-xs text-[#2D3B45] block truncate font-bold">
            {selectedOption.label}
          </strong>
          {selectedOption.subLabel && (
            <span className="text-[11px] text-[#6B7780] font-mono block">
              {selectedOption.subLabel}
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="text-[11px] px-2.5 py-1 bg-white hover:bg-red-50 text-red-600 hover:text-red-800 border border-red-200 rounded-[4px] font-medium transition-colors shrink-0 cursor-pointer"
      >
        Cambiar
      </button>
    </div>
  );
};
