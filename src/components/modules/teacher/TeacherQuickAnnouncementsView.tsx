"use client";

import React, { useState, useEffect } from "react";
import { CanvasCourse } from "@/types";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { Megaphone, Send, Copy, Check, CheckCircle2 } from "lucide-react";
import { QuickAnnouncementRecipientSelector } from "./announcements/QuickAnnouncementRecipientSelector";
import { QuickAnnouncementTypeSelector } from "./announcements/QuickAnnouncementTypeSelector";
import { publishAnnouncement } from "@/services/announcementsService";
import { AnnouncementType, getAnnouncementTemplate } from "@/constants/announcementTemplates";

interface TeacherQuickAnnouncementsViewProps {
  courses: CanvasCourse[];
  initialSelectedCourseIds?: number[] | null;
}

export const TeacherQuickAnnouncementsView: React.FC<TeacherQuickAnnouncementsViewProps> = ({
  courses,
  initialSelectedCourseIds,
}) => {
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>(() => {
    if (initialSelectedCourseIds && initialSelectedCourseIds.length > 0) return initialSelectedCourseIds;
    return courses.map((c) => c.id);
  });

  const [selectedType, setSelectedType] = useState<AnnouncementType>("suspension");
  const [paramFecha, setParamFecha] = useState("la sesión de hoy");
  const [paramDetalle, setParamDetalle] = useState("motivos de fuerza mayor e imprevistos de salud");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    if (initialSelectedCourseIds && initialSelectedCourseIds.length > 0) {
      setSelectedCourseIds(initialSelectedCourseIds);
    }
  }, [initialSelectedCourseIds]);

  const currentAnnouncement = getAnnouncementTemplate(selectedType, paramFecha, paramDetalle);

  const handleSelectType = (type: AnnouncementType) => {
    setSelectedType(type);
    if (type === "suspension") {
      setParamFecha("la sesión de hoy");
      setParamDetalle("motivos de fuerza mayor e imprevistos de salud");
    } else if (type === "sala") {
      setParamFecha("la sesión de hoy");
      setParamDetalle("Laboratorio L-204 (Edificio Ejército 441)");
    } else if (type === "entrega") {
      setParamFecha("este domingo 23:59 hrs");
      setParamDetalle("el Informe de Hito 2");
    } else if (type === "notas") {
      setParamFecha("el viernes 18:00 hrs");
      setParamDetalle("la Solemne 1");
    }
  };

  const handlePublish = () => {
    if (selectedCourseIds.length === 0) return;
    setIsPublishing(true);

    selectedCourseIds.forEach((cId) => {
      const match = courses.find((c) => c.id === cId);
      const code = match?.code || `curso_${cId}`;
      publishAnnouncement(code, {
        titulo: currentAnnouncement.title,
        mensaje: currentAnnouncement.body,
        categoria: selectedType === "suspension" ? "cancelacion" : selectedType === "sala" ? "sala" : selectedType === "entrega" ? "entrega" : "notas",
      });
    });

    setTimeout(() => {
      setIsPublishing(false);
      setPublishSuccess(`¡Anuncio publicado con éxito en ${selectedCourseIds.length} secciones vía Canvas API!`);
      setTimeout(() => setPublishSuccess(null), 5000);
    }, 1000);
  };

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${currentAnnouncement.title}\n\n${currentAnnouncement.body}`);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <div className="bg-[#F5F6F8] border border-[#C7CDD1] rounded-[4px] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[4px] bg-red-100 border border-red-200 flex items-center justify-center shrink-0 text-[#B71C1C]">
            <Megaphone size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#2D3B45]">Anuncios Rápidos Automatizados</h2>
            <p className="text-xs text-[#6B7780]">Emisión simultánea de comunicados prioritarios a una o múltiples secciones en 1 clic.</p>
          </div>
        </div>
      </div>

      {publishSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{publishSuccess}</span>
        </div>
      )}

      <QuickAnnouncementRecipientSelector courses={courses} selectedCourseIds={selectedCourseIds} onChange={setSelectedCourseIds} />

      <QuickAnnouncementTypeSelector selectedType={selectedType} onSelect={handleSelectType} />

      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-[#2D3B45] block mb-1">Fecha / Plazo</label>
            <input type="text" value={paramFecha} onChange={(e) => setParamFecha(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#008EE2]" />
          </div>
          <div>
            <label className="font-bold text-[#2D3B45] block mb-1">Detalle / Motivo / Ubicación</label>
            <input type="text" value={paramDetalle} onChange={(e) => setParamDetalle(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#008EE2]" />
          </div>
        </div>

        <div className="border border-gray-200 rounded p-4 bg-gray-50/70 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7780] block">Vista Previa del Comunicado</span>
          <h4 className="text-sm font-bold text-[#2D3B45]">{currentAnnouncement.title}</h4>
          <p className="text-xs text-[#55636E] whitespace-pre-line leading-relaxed font-sans bg-white p-3 rounded border border-gray-200">{currentAnnouncement.body}</p>
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-gray-100">
          <CanvasButton variant="outline" size="sm" onClick={handleCopy} icon={copiedText ? <Check size={14} /> : <Copy size={14} />}>
            {copiedText ? "¡Copiado!" : "Copiar Texto"}
          </CanvasButton>
          <CanvasButton variant="primary-udp" size="sm" disabled={isPublishing || selectedCourseIds.length === 0} onClick={handlePublish} icon={<Send size={14} />}>
            {isPublishing ? "Publicando en Canvas..." : `Publicar en ${selectedCourseIds.length} ${selectedCourseIds.length === 1 ? "Sección" : "Secciones"} (1 Clic)`}
          </CanvasButton>
        </div>
      </div>
    </div>
  );
};
