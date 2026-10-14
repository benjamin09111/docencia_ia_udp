"use client";

import React, { useRef } from "react";
import { Paperclip, Image as ImageIcon, FileText, Trash2, Upload, File } from "lucide-react";
import { ActivityAttachment } from "@/types/actividadesFormativas";
import { CanvasButton } from "@/components/canvas/CanvasButton";

interface ActivityAttachmentsSectionProps {
  attachments: ActivityAttachment[];
  onChangeAttachments: (attachments: ActivityAttachment[]) => void;
}

export const ActivityAttachmentsSection: React.FC<ActivityAttachmentsSectionProps> = ({
  attachments,
  onChangeAttachments,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: ActivityAttachment[] = Array.from(files).map((file, idx) => {
      const isImg = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
      const isDoc = file.name.endsWith(".doc") || file.name.endsWith(".docx");

      const sizeKb = Math.round(file.size / 1024);
      const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

      return {
        id: `att_${Date.now()}_${idx}`,
        name: file.name,
        size: sizeStr,
        type: isImg ? "image" : isPdf ? "pdf" : isDoc ? "doc" : "other",
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
      };
    });

    onChangeAttachments([...attachments, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (id: string) => {
    onChangeAttachments(attachments.filter((a) => a.id !== id));
  };

  return (
    <div className="bg-white border border-[#C7CDD1] rounded-[4px] p-4 sm:p-5 shadow-2xs space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E0E3E6] pb-2.5">
        <div>
          <h3 className="text-sm font-bold text-[#2D3B45] uppercase tracking-wider flex items-center gap-2">
            <Paperclip size={16} className="text-[#B71C1C]" />
            Anexos y Material Complementario para el Alumno
          </h3>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Adjunta esquemas, imágenes de apoyo o PDFs que saldrán al final de la actividad para consulta del estudiante.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.zip,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <CanvasButton
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            icon={<Upload size={14} className="text-[#B71C1C]" />}
          >
            + Adjuntar archivos o imágenes
          </CanvasButton>
        </div>
      </div>

      {attachments.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#C7CDD1] hover:border-[#B71C1C] rounded-[4px] p-5 text-center cursor-pointer transition-colors bg-[#FAFAFA]"
        >
          <Paperclip size={24} className="mx-auto text-gray-400 mb-1" />
          <p className="text-xs font-semibold text-[#2D3B45]">
            No hay anexos adjuntados todavía.
          </p>
          <p className="text-[11px] text-[#6B7780] mt-0.5">
            Haz clic aquí o en el botón para subir imágenes (PNG, JPG) o documentos (PDF, DOCX).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="bg-[#F5F6F8] border border-[#C7CDD1] rounded-[4px] p-2.5 flex items-center justify-between gap-2 transition-all hover:bg-white hover:border-gray-400"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {att.previewUrl ? (
                  <img
                    src={att.previewUrl}
                    alt={att.name}
                    className="w-10 h-10 object-cover rounded border border-gray-300 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-white border border-[#C7CDD1] flex items-center justify-center shrink-0 text-[#B71C1C]">
                    {att.type === "pdf" ? (
                      <FileText size={18} />
                    ) : att.type === "doc" ? (
                      <File size={18} />
                    ) : (
                      <Paperclip size={18} />
                    )}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#2D3B45] truncate" title={att.name}>
                    {att.name}
                  </p>
                  <span className="text-[11px] text-[#6B7780] block font-mono">
                    {att.size} • {att.type.toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemove(att.id)}
                className="p-1 text-gray-400 hover:text-[#B71C1C] hover:bg-red-50 rounded transition-colors cursor-pointer shrink-0"
                title="Eliminar anexo"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
