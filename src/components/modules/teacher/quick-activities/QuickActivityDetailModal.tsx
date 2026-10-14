"use client";

import React, { useState } from "react";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { QuickActivity } from "@/types/quickActivities";
import { FileText, Download, ExternalLink, Copy, Check, Eye, Calendar, User } from "lucide-react";

interface QuickActivityDetailModalProps {
  activity: QuickActivity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickActivityDetailModal: React.FC<QuickActivityDetailModalProps> = ({
  activity,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!activity) return null;

  const handleCopyLink = () => {
    const url = activity.tipoRecurso === "link" && activity.enlaceUrl
      ? activity.enlaceUrl
      : `${window.location.origin}/courses/${activity.courseCode}/quick-activities/${activity.id}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <CanvasModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-[#B71C1C]" />
          <span className="truncate">{activity.titulo}</span>
        </div>
      }
      subtitle={
        <div className="flex items-center gap-3 text-xs text-[#6B7780] mt-0.5">
          <span className="flex items-center gap-1">
            <Calendar size={13} />
            Publicado: {activity.fechaPublicacion}
          </span>
          {activity.fechaLimite && (
            <span className="font-semibold text-red-700">
              Entrega: {activity.fechaLimite}
            </span>
          )}
          <span className="flex items-center gap-1">
            <User size={13} />
            {activity.autor || "Profesor"}
          </span>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="text-xs text-[#6B7780] hover:text-[#008EE2] flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F5F6F8] rounded border border-[#C7CDD1] transition-colors"
            >
              {copied ? <Check size={14} className="text-[#2E7D32]" /> : <Copy size={14} />}
              <span>{copied ? "¡Enlace copiado!" : "Copiar enlace"}</span>
            </button>
          </div>
          <CanvasButton variant="secondary" size="sm" onClick={onClose}>
            Cerrar
          </CanvasButton>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Descripción de la tarea */}
        <div className="bg-[#FAFAFA] border border-[#E0E3E6] rounded-[3px] p-4 text-xs text-[#2D3B45] leading-relaxed whitespace-pre-wrap">
          <p className="font-bold text-[#6B7780] uppercase tracking-wider text-[11px] mb-1.5">
            Instrucciones para los estudiantes:
          </p>
          <p>{activity.descripcion || "Sin instrucciones adicionales."}</p>
        </div>

        {/* Recurso de la tarea: Archivo o Enlace */}
        {activity.tipoRecurso === "archivo" && activity.archivo ? (
          <div className="border border-[#C7CDD1] rounded-[4px] overflow-hidden bg-white shadow-2xs">
            <div className="p-4 bg-[#F5F6F8] border-b border-[#C7CDD1] flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded bg-red-100 text-[#B71C1C] flex items-center justify-center shrink-0">
                  <FileText size={22} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#2D3B45] truncate">
                    {activity.archivo.name}
                  </h4>
                  <p className="text-xs text-[#6B7780]">
                    {activity.archivo.size} • Documento de la tarea
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activity.archivo.url || "#"}
                  download={activity.archivo.name}
                  onClick={(e) => {
                    if (activity.archivo?.url === "#") {
                      e.preventDefault();
                      alert(`Descargando "${activity.archivo.name}" (Simulación en modo sandbox Canvas).`);
                    }
                  }}
                  className="px-3 py-1.5 bg-[#B71C1C] hover:bg-[#8B1010] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download size={14} />
                  <span>Descargar</span>
                </a>
              </div>
            </div>

            {/* Vista previa mock / SpeedGrader Preview */}
            <div className="p-6 bg-[#2D3B45]/5 text-center flex flex-col items-center justify-center gap-2 border-dashed border-2 border-gray-200 m-3 rounded">
              <FileText size={36} className="text-[#B71C1C] opacity-80" />
              <p className="text-xs font-bold text-[#2D3B45]">
                {activity.archivo.name}
              </p>
              <p className="text-[11px] text-[#6B7780] max-w-sm">
                Documento verificado por Canvas. Los estudiantes pueden descargarlo o abrirlo directamente en sus dispositivos.
              </p>
            </div>
          </div>
        ) : activity.tipoRecurso === "link" && activity.enlaceUrl ? (
          <div className="border border-[#C7CDD1] rounded-[4px] p-4 bg-white flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded bg-blue-50 text-[#008EE2] flex items-center justify-center shrink-0">
                <ExternalLink size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-[#2D3B45] truncate">
                  {activity.enlaceTexto || "Enlace de la tarea"}
                </h4>
                <a
                  href={activity.enlaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#008EE2] hover:underline truncate block"
                >
                  {activity.enlaceUrl}
                </a>
              </div>
            </div>

            <a
              href={activity.enlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#F5F6F8] hover:bg-gray-100 text-[#2D3B45] border border-[#C7CDD1] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <ExternalLink size={14} />
              <span>Abrir enlace</span>
            </a>
          </div>
        ) : null}
      </div>
    </CanvasModal>
  );
};
