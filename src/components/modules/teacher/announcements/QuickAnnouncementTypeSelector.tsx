"use client";

import React from "react";
import { AlertOctagon, MapPin, Clock, FileSpreadsheet } from "lucide-react";
import { AnnouncementType } from "@/constants/announcementTemplates";

interface QuickAnnouncementTypeSelectorProps {
  selectedType: AnnouncementType;
  onSelect: (type: AnnouncementType) => void;
}

export const QuickAnnouncementTypeSelector: React.FC<QuickAnnouncementTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  const options: { id: AnnouncementType; label: string; icon: React.ReactNode; activeColor: string }[] = [
    {
      id: "suspension",
      label: "Suspensión de Clase",
      icon: <AlertOctagon size={18} className="mb-1 text-[#B71C1C]" />,
      activeColor: "bg-red-50 border-[#B71C1C] text-[#B71C1C] font-bold",
    },
    {
      id: "sala",
      label: "Cambio de Sala",
      icon: <MapPin size={18} className="mb-1 text-[#008EE2]" />,
      activeColor: "bg-blue-50 border-[#008EE2] text-[#008EE2] font-bold",
    },
    {
      id: "entrega",
      label: "Recordatorio Entrega",
      icon: <Clock size={18} className="mb-1 text-amber-600" />,
      activeColor: "bg-amber-50 border-amber-600 text-amber-700 font-bold",
    },
    {
      id: "notas",
      label: "Publicación de Notas",
      icon: <FileSpreadsheet size={18} className="mb-1 text-emerald-600" />,
      activeColor: "bg-emerald-50 border-emerald-600 text-emerald-800 font-bold",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onSelect(opt.id)}
          className={`p-3 rounded border text-left flex flex-col justify-between transition-colors ${
            selectedType === opt.id
              ? opt.activeColor
              : "bg-white border-[#E0E3E6] text-[#2D3B45] hover:bg-gray-50"
          }`}
        >
          {opt.icon}
          <span className="text-xs">{opt.label}</span>
        </button>
      ))}
    </div>
  );
};
