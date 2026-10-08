"use client";

import React, { useState } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasCourse } from "@/types";
import { X, Check, Copy, ExternalLink, ShieldCheck } from "lucide-react";

interface ShareGradesPublicModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CanvasCourse;
  publicShareUrl: string;
}

export const ShareGradesPublicModal: React.FC<ShareGradesPublicModalProps> = ({
  isOpen,
  onClose,
  course,
  publicShareUrl,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedAnnouncement, setCopiedAnnouncement] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(publicShareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const announcementText = `Estimados/as estudiantes:
Ya se encuentra disponible la nómina oficial anonimizada de calificaciones del curso ${course.name} (${course.code}).
Pueden revisar sus notas ponderadas, décimas acumuladas y estado de aprobación ingresando con su RUT en el siguiente enlace oficial:
${publicShareUrl}`;

  const handleCopyAnnouncement = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(announcementText);
      setCopiedAnnouncement(true);
      setTimeout(() => setCopiedAnnouncement(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-2xl max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-start border-b border-gray-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#2D3B45]">
                Compartir Planilla Oficial con Estudiantes
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                Solo RUTs
              </span>
            </div>
            <p className="text-xs text-[#6B7780] mt-0.5">
              Enlace público seguro para que los alumnos revisen sus notas y estado de aprobación.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
            Enlace Público del Curso
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={publicShareUrl}
              className="flex-1 px-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded font-mono text-gray-700 focus:outline-none select-all"
            />
            <CanvasButton
              variant="primary-canvas"
              size="sm"
              icon={copiedLink ? <Check size={14} /> : <Copy size={14} />}
              onClick={handleCopyLink}
            >
              {copiedLink ? "¡Copiado!" : "Copiar"}
            </CanvasButton>
            <a
              href={publicShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-100 flex items-center justify-center"
              title="Abrir vista pública en nueva pestaña"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="space-y-1.5 bg-gray-50 p-3 rounded border border-gray-200 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-700 text-[11px] uppercase tracking-wider">
              Plantilla para Anuncio en Canvas
            </span>
            <button
              type="button"
              onClick={handleCopyAnnouncement}
              className="text-[11px] text-[#008EE2] hover:underline flex items-center gap-1 font-semibold"
            >
              {copiedAnnouncement ? (
                <>
                  <Check size={12} className="text-emerald-600" />
                  <span className="text-emerald-700">¡Texto Copiado!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copiar Texto</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-gray-600 font-mono leading-relaxed bg-white p-2 rounded border border-gray-200 whitespace-pre-line select-all">
            {announcementText}
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded p-3 flex items-start gap-2.5 text-xs text-emerald-900">
          <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-emerald-800">
              Garantía de Privacidad UDP (Ley N° 19.628)
            </span>
            <span className="text-[11px] text-emerald-700 block mt-0.5">
              La vista compartida solo muestra RUTs y notas ponderadas. En ningún caso se exponen nombres, apellidos ni correos electrónicos de los estudiantes.
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-gray-100">
          <CanvasButton variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </CanvasButton>
        </div>
      </div>
    </div>
  );
};
