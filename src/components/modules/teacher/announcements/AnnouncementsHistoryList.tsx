"use client";

import React from "react";
import { CanvasAnnouncement } from "@/services/announcementsService";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import {
  History,
  Trash2,
  AlertOctagon,
  MapPin,
  FileSpreadsheet,
  Clock,
  HelpCircle,
  BookOpen,
  Video,
} from "lucide-react";

interface AnnouncementsHistoryListProps {
  announcements: CanvasAnnouncement[];
  onDelete: (id: string) => void;
}

export const AnnouncementsHistoryList: React.FC<AnnouncementsHistoryListProps> = ({
  announcements,
  onDelete,
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
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <h3 className="text-xs font-bold text-[#2D3B45] uppercase tracking-wider flex items-center gap-2">
          <History size={16} className="text-gray-500" />
          Historial de Anuncios Emitidos en Canvas ({announcements.length})
        </h3>
        <span className="text-[11px] text-[#6B7780]">Sincronizado con Canvas LMS</span>
      </div>

      {announcements.length === 0 ? (
        <div className="py-8 text-center text-xs text-gray-500">
          No se han emitido anuncios automatizados todavía. Selecciona una plantilla superior para publicar el primero.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {announcements.map((ann) => (
            <div key={ann.id} className="py-3.5 space-y-1.5 first:pt-0 last:pb-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  {renderIcon(ann.categoria)}
                  <span className="text-xs font-bold text-[#2D3B45]">{ann.titulo}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[11px] text-gray-400 font-medium">{ann.fechaPublicacion}</span>
                  <CanvasBadge variant="success">Publicado en Canvas</CanvasBadge>
                  <button
                    type="button"
                    onClick={() => onDelete(ann.id)}
                    title="Eliminar registro"
                    className="text-gray-400 hover:text-rose-600 p-1 rounded"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-gray-600 whitespace-pre-line bg-gray-50 p-2.5 rounded border border-gray-200 max-h-28 overflow-y-auto leading-relaxed">
                {ann.mensaje}
              </p>

              <div className="text-[10px] text-gray-400 flex items-center gap-2">
                <span>Autor: {ann.autor}</span>
                <span>•</span>
                <span>Canal: Notificaciones automáticas por correo & App Canvas</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
