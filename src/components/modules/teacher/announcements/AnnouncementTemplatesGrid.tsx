"use client";

import React from "react";
import { AnnouncementTemplate } from "@/services/announcementsService";
import {
  AlertOctagon,
  MapPin,
  FileSpreadsheet,
  Clock,
  HelpCircle,
  BookOpen,
  Video,
} from "lucide-react";

interface AnnouncementTemplatesGridProps {
  templates: AnnouncementTemplate[];
  onSelectTemplate: (tpl: AnnouncementTemplate) => void;
}

export const AnnouncementTemplatesGrid: React.FC<AnnouncementTemplatesGridProps> = ({
  templates,
  onSelectTemplate,
}) => {
  const renderIcon = (cat: string) => {
    switch (cat) {
      case "online":
        return <Video size={16} className="text-[#008EE2]" />;
      case "cancelacion":
        return <AlertOctagon size={16} className="text-[#C8102E]" />;
      case "sala":
        return <MapPin size={16} className="text-[#008EE2]" />;
      case "notas":
        return <FileSpreadsheet size={16} className="text-emerald-700" />;
      case "entrega":
        return <Clock size={16} className="text-amber-700" />;
      case "ayudantia":
        return <HelpCircle size={16} className="text-purple-700" />;
      default:
        return <BookOpen size={16} className="text-gray-700" />;
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
        Seleccionar Plantilla de Anuncio Rápido:
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onSelectTemplate(tpl)}
            className="bg-white border border-[#E0E3E6] hover:border-[#008EE2] hover:shadow-md rounded-[4px] p-4 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center border border-gray-200 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                  {renderIcon(tpl.categoria)}
                </div>
                <span className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-[#008EE2]">
                  1 Clic
                </span>
              </div>

              <h4 className="text-xs font-bold text-[#2D3B45] group-hover:text-[#008EE2] transition-colors">
                {tpl.tituloSugerido}
              </h4>
              <p className="text-[11px] text-[#6B7780] mt-1 line-clamp-2">
                {tpl.descripcionCorta}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#008EE2] font-semibold">
              <span>Preparar anuncio</span>
              <span>→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
