import React from "react";
import { InstruccionItem } from "@/types/actividadesFormativas";
import { Trash2, GripVertical, Award } from "lucide-react";

interface InstructionItemCardProps {
  item: InstruccionItem;
  index: number;
  canDelete: boolean;
  onChange: (updated: InstruccionItem) => void;
  onDelete: () => void;
}

export const InstructionItemCard: React.FC<InstructionItemCardProps> = ({
  item,
  index,
  canDelete,
  onChange,
  onDelete,
}) => {
  return (
    <div className="bg-white border border-[#C7CDD1] rounded-[4px] p-3.5 sm:p-4 shadow-2xs space-y-3 transition-colors hover:border-gray-400">
      {/* Cabecera del Item: Número, Título y Asignación de Puntaje */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1">
          <span className="w-6 h-6 rounded-full bg-[#B71C1C] text-white text-xs font-bold flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <input
            type="text"
            value={item.titulo}
            onChange={(e) => onChange({ ...item, titulo: e.target.value })}
            placeholder={`Pregunta ${index + 1}: Título o consigna del desafío...`}
            className="flex-1 text-sm font-bold text-[#2D3B45] border border-transparent hover:border-[#C7CDD1] focus:border-[#B71C1C] rounded px-2 py-1 bg-transparent focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* Asignación de Puntaje con estilo Canvas */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <div className="flex items-center bg-[#F5F6F8] border border-[#C7CDD1] rounded-[3px] overflow-hidden focus-within:border-[#B71C1C]">
            <input
              type="number"
              min="1"
              max="60"
              step="1"
              value={item.puntaje || 0}
              onChange={(e) =>
                onChange({
                  ...item,
                  puntaje: Math.max(0, parseInt(e.target.value) || 0),
                })
              }
              className="w-14 text-center text-xs sm:text-sm font-bold text-[#2D3B45] py-1 bg-transparent focus:outline-none"
            />
            <span className="text-[11px] font-bold text-[#6B7780] bg-gray-200 px-2 py-1 select-none">
              pts
            </span>
          </div>

          {canDelete && (
            <button
              type="button"
              onClick={onDelete}
              title="Eliminar esta instrucción"
              className="p-1.5 text-gray-400 hover:text-[#B71C1C] hover:bg-red-50 rounded transition-colors cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Descripción y Pauta de Resolución del Alumno */}
      <div>
        <label className="block text-xs font-semibold text-[#6B7780] mb-1">
          Instrucción detallada de lo que debe realizar el estudiante:
        </label>
        <textarea
          rows={2}
          value={item.descripcion}
          onChange={(e) => onChange({ ...item, descripcion: e.target.value })}
          placeholder="Describe claramente los requisitos, entregables esperados o criterios de resolución..."
          className="w-full text-xs sm:text-sm text-[#2D3B45] border border-[#C7CDD1] rounded-[3px] p-2.5 bg-[#FAFAFA] focus:bg-white focus:outline-none focus:border-[#B71C1C] transition-colors leading-relaxed"
        />
      </div>
    </div>
  );
};
