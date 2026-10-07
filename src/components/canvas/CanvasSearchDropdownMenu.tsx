import React from "react";
import { CanvasSearchOption } from "./CanvasSearchableSelect";

interface CanvasSearchDropdownMenuProps {
  options: CanvasSearchOption[];
  highlightedIndex: number;
  noOptionsText: string;
  onSelect: (opt: CanvasSearchOption) => void;
  onHighlight: (idx: number) => void;
}

export const CanvasSearchDropdownMenu: React.FC<CanvasSearchDropdownMenuProps> = ({
  options,
  highlightedIndex,
  noOptionsText,
  onSelect,
  onHighlight,
}) => {
  return (
    <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card divide-y divide-gray-100">
      {options.length > 0 ? (
        options.map((opt, idx) => (
          <button
            key={opt.value}
            type="button"
            onMouseEnter={() => onHighlight(idx)}
            onClick={() => onSelect(opt)}
            className={`w-full text-left p-2.5 flex items-center justify-between gap-2 transition-colors cursor-pointer ${
              highlightedIndex === idx
                ? "bg-blue-50/80 text-[#008EE2]"
                : "hover:bg-gray-50 text-[#2D3B45]"
            }`}
          >
            <div className="min-w-0">
              <span className="font-semibold block truncate text-xs">{opt.label}</span>
              {opt.subLabel && (
                <span className="text-[11px] text-gray-500 font-mono block">
                  {opt.subLabel}
                </span>
              )}
            </div>
            {opt.badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-gray-100 text-gray-600 shrink-0">
                {opt.badge}
              </span>
            )}
          </button>
        ))
      ) : (
        <div className="p-3 text-center text-gray-500 text-xs">{noOptionsText}</div>
      )}
    </div>
  );
};
