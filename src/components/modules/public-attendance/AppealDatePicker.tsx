"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

export interface AppealDateOption {
  value: string; // YYYY-MM-DD
  label: string;
}

interface AppealDatePickerProps {
  options: AppealDateOption[];
  dates: string[];
  onChange: (dates: string[]) => void;
  max?: number;
}

/** Lista de fechas a apelar: una por fila, sin repetir, con botón "+ Apelar otra fecha". */
export const AppealDatePicker: React.FC<AppealDatePickerProps> = ({ options, dates, onChange, max = 10 }) => {
  const remaining = options.filter((o) => !dates.includes(o.value));
  const canAdd = remaining.length > 0 && dates.length < max;

  const setAt = (index: number, value: string) => onChange(dates.map((d, i) => (i === index ? value : d)));
  const removeAt = (index: number) => onChange(dates.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      {dates.map((date, index) => {
        // Cada fila ofrece su fecha actual + las que nadie más eligió
        const rowOptions = options.filter((o) => o.value === date || !dates.includes(o.value));
        return (
          <div key={`${index}-${date}`} className="flex items-center gap-2">
            <select
              value={date}
              onChange={(e) => setAt(index, e.target.value)}
              className="flex-1 min-w-0 h-9 px-2 bg-gray-50 border border-gray-300 rounded-[4px] text-[#2D3B45] font-mono text-xs"
            >
              {rowOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {dates.length > 1 && (
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label="Quitar fecha"
                className="h-9 w-9 shrink-0 flex items-center justify-center text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-[4px] cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        );
      })}

      <button
        type="button"
        disabled={!canAdd}
        onClick={() => canAdd && onChange([...dates, remaining[0].value])}
        className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-bold text-[#008EE2] hover:bg-blue-50 border border-dashed border-[#008EE2] rounded-[4px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus size={13} />
        <span>Apelar otra fecha</span>
      </button>
    </div>
  );
};
