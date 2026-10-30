"use client";

import React, { useState, useEffect, useRef } from "react";
import { CanvasCourse } from "@/types";
import { CourseSection } from "@/types/attendance";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { Megaphone, Send, Bold, Lock, CheckCircle2, Eye, Edit3, Link as LinkIcon } from "lucide-react";
import { QuickAnnouncementRecipientSelector } from "./announcements/QuickAnnouncementRecipientSelector";
import { publishAnnouncement } from "@/services/announcementsService";

interface TeacherQuickAnnouncementsViewProps {
  courses: CanvasCourse[];
  sections?: CourseSection[];
  initialSelectedCourseIds?: number[] | null;
}

export const TeacherQuickAnnouncementsView: React.FC<TeacherQuickAnnouncementsViewProps> = ({
  courses,
  sections,
  initialSelectedCourseIds,
}) => {
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>(() => {
    return initialSelectedCourseIds?.length ? initialSelectedCourseIds : courses.map((c) => c.id);
  });
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialSelectedCourseIds?.length) setSelectedCourseIds(initialSelectedCourseIds);
  }, [initialSelectedCourseIds]);

  const handleApplyBold = () => {
    const area = textareaRef.current;
    if (!area) return;
    const start = area.selectionStart;
    const end = area.selectionEnd;
    const selected = body.substring(start, end);
    const rep = selected ? `**${selected}**` : `**texto en negrita**`;
    setBody(body.substring(0, start) + rep + body.substring(end));
    setTimeout(() => {
      area.focus();
      area.setSelectionRange(start + 2, start + 2 + (selected.length || 15));
    }, 10);
  };

  const handlePublish = () => {
    if (!selectedCourseIds.length || !title.trim() || !body.trim()) return;
    setIsPublishing(true);
    const fullMsg = link.trim() ? `${body.trim()}\n\n🔗 Enlace: ${link.trim()}` : body.trim();
    selectedCourseIds.forEach((cId) => {
      const match = courses.find((c) => c.id === cId);
      publishAnnouncement(match?.code || `curso_${cId}`, { titulo: title.trim(), mensaje: fullMsg, categoria: "general" });
    });
    setTimeout(() => {
      setIsPublishing(false);
      setPublishSuccess(`¡Anuncio publicado con éxito en ${selectedCourseIds.length} secciones en Canvas LMS!`);
      setTitle("");
      setBody("");
      setLink("");
      setShowPreview(false);
      setTimeout(() => setPublishSuccess(null), 5000);
    }, 800);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="bg-[#F5F6F8] border border-[#C7CDD1] rounded-[4px] p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-red-100 border border-red-200 flex items-center justify-center shrink-0 text-[#B71C1C]">
          <Megaphone size={16} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-[#2D3B45]">Anuncios Rápidos Canvas</h2>
          <p className="text-xs text-[#6B7780]">Redacta tu comunicado y selecciona abajo los cursos y secciones de destino.</p>
        </div>
      </div>

      {publishSuccess && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
          <span>{publishSuccess}</span>
        </div>
      )}

      {/* 1. Formulario de Anuncio */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card space-y-3">
        <div>
          <label className="block text-xs font-bold text-[#2D3B45] uppercase tracking-wide mb-1">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del anuncio..."
            className="w-full text-xs font-medium p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#B71C1C]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-[#2D3B45] uppercase tracking-wide">Descripción</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleApplyBold}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2D3B45] bg-gray-100 hover:bg-gray-200 border border-gray-300 px-2 py-0.5 rounded cursor-pointer"
              >
                <Bold size={11} /> <span>Negrita</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center gap-1 text-[11px] text-[#008EE2] hover:underline cursor-pointer"
              >
                {showPreview ? <><Edit3 size={11} /> Editar</> : <><Eye size={11} /> Vista previa</>}
              </button>
            </div>
          </div>

          {showPreview ? (
            <div className="min-h-[80px] p-2.5 text-xs text-[#2D3B45] bg-gray-50 border border-gray-300 rounded whitespace-pre-line">
              {body.trim() ? (
                body.split(/(\*\*.*?\*\*)/g).map((part, i) =>
                  part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>
                )
              ) : (
                <span className="text-gray-400 italic">Sin contenido aún...</span>
              )}
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Escribe el mensaje... Selecciona cualquier texto y presiona 'Negrita' para resaltarlo."
              className="w-full text-xs p-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#B71C1C]"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div>
            <label className="font-semibold text-[#2D3B45] flex items-center gap-1 mb-1">
              <LinkIcon size={12} className="text-[#008EE2]" /> <span>Enlace (opcional)</span>
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#B71C1C]"
            />
          </div>
          <div>
            <label className="font-semibold text-[#6B7780] flex items-center gap-1 mb-1">
              <Lock size={12} className="text-gray-400" /> <span>Subir archivo adjunto</span>
            </label>
            <div className="p-2 bg-gray-100 border border-dashed border-gray-300 rounded text-gray-400 text-[11px] cursor-not-allowed select-none">
              Bloqueado temporalmente (Canvas Archivos)
            </div>
          </div>
        </div>
      </div>

      {/* 2. Destinatarios al FINAL (Mismos cursos y acordeones con checkbox) */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#2D3B45] uppercase tracking-wide block">
          Destinatarios (Secciones de Mis Cursos)
        </label>
        <QuickAnnouncementRecipientSelector
          courses={courses}
          sections={sections}
          selectedCourseIds={selectedCourseIds}
          onChange={setSelectedCourseIds}
        />
      </div>

      {/* 3. Botón de Publicación Canvas */}
      <div className="flex justify-end pt-1 pb-3">
        <CanvasButton
          variant="primary-udp"
          size="sm"
          disabled={isPublishing || !selectedCourseIds.length || !title.trim() || !body.trim()}
          onClick={handlePublish}
          icon={<Send size={13} />}
        >
          {isPublishing ? "Publicando..." : `Publicar Anuncio en Canvas (${selectedCourseIds.length} ${selectedCourseIds.length === 1 ? "sección" : "secciones"})`}
        </CanvasButton>
      </div>
    </div>
  );
};
