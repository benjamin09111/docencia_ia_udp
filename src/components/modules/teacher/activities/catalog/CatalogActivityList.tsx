import React from "react";
import { ActividadFormativa } from "@/types/actividadesFormativas";
import { Clock, Users, ChevronRight } from "lucide-react";

interface CatalogActivityListProps {
  actividades: ActividadFormativa[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const CatalogActivityList: React.FC<CatalogActivityListProps> = ({
  actividades,
  selectedId,
  onSelect,
}) => {
  if (actividades.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-[#6B7780]">
        No se encontraron dinámicas que coincidan con la búsqueda.
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#E0E3E6] overflow-y-auto">
      {actividades.map((act) => {
        const isSelected = act.id === selectedId;

        return (
          <button
            key={act.id}
            type="button"
            onClick={() => onSelect(act.id)}
            className={`w-full text-left p-3 transition-colors flex items-start justify-between gap-2 cursor-pointer ${
              isSelected
                ? "bg-red-50/60 border-l-3 border-[#B71C1C]"
                : "hover:bg-[#F5F6F8] border-l-3 border-transparent"
            }`}
          >
            <div className="min-w-0 flex-1">
              <h4
                className={`text-xs font-bold leading-snug line-clamp-1 ${
                  isSelected ? "text-[#B71C1C]" : "text-[#2D3B45]"
                }`}
              >
                {act.nombre}
              </h4>

              <div className="flex items-center gap-2 mt-1 flex-wrap text-[11px] text-[#6B7780]">
                <span className="flex items-center gap-1 font-medium">
                  <Clock size={11} />
                  {act.duracionSugerida}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 truncate max-w-[120px]">
                  <Users size={11} />
                  {act.agrupacion || "Grupal"}
                </span>
              </div>
            </div>

            <ChevronRight
              size={14}
              className={`shrink-0 mt-1 transition-transform ${
                isSelected ? "text-[#B71C1C] translate-x-0.5" : "text-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
