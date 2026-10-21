"use client";

import React, { useState } from "react";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { Video, Send, Check, Link as LinkIcon, ExternalLink } from "lucide-react";
import { publishAnnouncement, formatAnnouncementTitle } from "@/services/announcementsService";

interface TargetSectionItem {
  code: string;
  name: string;
}

interface PublishClassLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: TargetSectionItem[];
  courseDisplayName?: string;
  onPublished?: (publishedCount: number) => void;
}

export const PublishClassLinkModal: React.FC<PublishClassLinkModalProps> = ({
  isOpen,
  onClose,
  sections,
  courseDisplayName = "Curso",
  onPublished,
}) => {
  const [meetingUrl, setMeetingUrl] = useState("https://udp-cl.zoom.us/j/98452109823");
  const [isPublishing, setIsPublishing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [urlError, setUrlError] = useState("");

  const isMulti = sections.length > 1;
  const previewTitle = formatAnnouncementTitle("Link clase de hoy");

  const handlePasteClipboard = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator?.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim().startsWith("http")) {
          setMeetingUrl(text.trim());
          setUrlError("");
        }
      }
    } catch {}
  };

  const handlePublish = () => {
    const trimmed = meetingUrl.trim();
    if (!trimmed || !trimmed.startsWith("http")) {
      setUrlError("Por favor ingresa un link válido que comience con http:// o https://");
      return;
    }
    setUrlError("");
    setIsPublishing(true);

    try {
      sections.forEach((sec) => {
        publishAnnouncement(sec.code, {
          titulo: "Link clase de hoy",
          mensaje: trimmed,
          categoria: "online",
        });
      });

      setSuccess(true);
      setTimeout(() => {
        setIsPublishing(false);
        setSuccess(false);
        onPublished?.(sections.length);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error al publicar anuncio de link:", err);
      setIsPublishing(false);
    }
  };

  return (
    <CanvasModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2 text-[#2D3B45]">
          <Video size={18} className="text-[#008EE2]" />
          <span>Publicar Anuncio con Link de la Clase de Hoy</span>
        </span>
      }
      subtitle={
        isMulti
          ? `Se publicará automáticamente el comunicado en las ${sections.length} secciones de ${courseDisplayName}.`
          : `Se publicará automáticamente el comunicado en ${sections[0]?.name || courseDisplayName}.`
      }
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={handlePasteClipboard}
            className="text-xs text-[#008EE2] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon size={12} />
            <span>Pegar enlace copiado</span>
          </button>
          <div className="flex gap-2">
            <CanvasButton variant="outline" size="sm" onClick={onClose} disabled={isPublishing}>
              Cancelar
            </CanvasButton>
            <CanvasButton
              variant="primary-udp"
              size="sm"
              icon={success ? <Check size={14} /> : <Send size={14} />}
              onClick={handlePublish}
              disabled={isPublishing || success}
            >
              {success ? "¡Publicado!" : isMulti ? `Publicar en ${sections.length} secciones (1 Clic)` : "Publicar Anuncio (1 Clic)"}
            </CanvasButton>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs text-[#2D3B45]">
        <div>
          <label className="font-bold text-[#2D3B45] block mb-1">
            Enlace de la Clase Online (Zoom, Google Meet, Teams, etc.):
          </label>
          <div className="relative">
            <input
              type="url"
              value={meetingUrl}
              onChange={(e) => {
                setMeetingUrl(e.target.value);
                setUrlError("");
              }}
              placeholder="https://udp-cl.zoom.us/j/..."
              className={`w-full px-3 py-2 border rounded font-mono text-xs bg-white text-[#2D3B45] ${
                urlError ? "border-rose-500 ring-1 ring-rose-500" : "border-gray-300 focus:border-[#008EE2]"
              }`}
            />
          </div>
          {urlError && <p className="text-[11px] text-rose-600 font-semibold mt-1">{urlError}</p>}
        </div>

        {/* Vista Previa del Anuncio que verán los alumnos */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
            Vista Previa del Anuncio Oficial Canvas
          </span>
          <div className="bg-white border border-[#E0E3E6] rounded p-3 space-y-1.5 shadow-2xs">
            <div className="font-bold text-sm text-[#2D3B45] flex items-center gap-1.5">
              <span>{previewTitle}</span>
            </div>
            <div className="pt-1 text-[#008EE2] font-mono text-[11.5px] break-all flex items-center gap-1">
              <ExternalLink size={12} className="shrink-0" />
              <span className="underline">{meetingUrl || "https://..."}</span>
            </div>
          </div>
          <p className="text-[11px] text-[#6B7780]">
            El enlace quedará como un link directo y apretable para que los estudiantes ingresen en 1 clic.
          </p>
        </div>

        {success && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded flex items-center gap-2 animate-fadeIn font-semibold text-xs">
            <Check size={16} className="text-emerald-600 shrink-0" />
            <span>¡Anuncio publicado con éxito en {sections.length} {sections.length === 1 ? "sección" : "secciones"}!</span>
          </div>
        )}
      </div>
    </CanvasModal>
  );
};
