"use client";

import React, { useState, useEffect } from "react";
import {
  ANNOUNCEMENT_TEMPLATES,
  AnnouncementTemplate,
  CanvasAnnouncement,
  getStoredAnnouncements,
  saveStoredAnnouncements,
} from "@/services/announcementsService";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { Megaphone, CheckCircle2, Video } from "lucide-react";
import { OnlineClassLinkModal } from "./announcements/OnlineClassLinkModal";
import { CourseAnnouncementModal } from "./announcements/CourseAnnouncementModal";
import { AnnouncementsHistoryList } from "./announcements/AnnouncementsHistoryList";
import { AnnouncementTemplatesGrid } from "./announcements/AnnouncementTemplatesGrid";

interface CourseAnnouncementsViewProps {
  courseCode: string;
  courseName: string;
}

export const CourseAnnouncementsView: React.FC<CourseAnnouncementsViewProps> = ({
  courseCode,
  courseName,
}) => {
  const [announcements, setAnnouncements] = useState<CanvasAnnouncement[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<AnnouncementTemplate | null>(null);
  const [isOnlineModalOpen, setIsOnlineModalOpen] = useState(false);
  const [publishedToast, setPublishedToast] = useState<string | null>(null);

  useEffect(() => {
    setAnnouncements(getStoredAnnouncements(courseCode));
  }, [courseCode]);

  const showToast = (msg: string) => {
    setPublishedToast(msg);
    setTimeout(() => setPublishedToast(null), 4000);
  };

  const handlePublish = (newAnn: CanvasAnnouncement) => {
    const nextList = [newAnn, ...announcements];
    setAnnouncements(nextList);
    saveStoredAnnouncements(courseCode, nextList);
    showToast(`¡Anuncio "${newAnn.titulo}" publicado con éxito en Canvas!`);
  };

  const handlePublishOnlineClass = ({ titulo, mensaje }: { titulo: string; mensaje: string }) => {
    const newAnn: CanvasAnnouncement = {
      id: `ann_online_${Date.now()}`,
      courseCode,
      titulo,
      mensaje,
      categoria: "online",
      fechaPublicacion: new Date().toLocaleDateString("es-CL", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      autor: "Jorge Esteban Cruz León",
      estado: "publicado",
    };
    const nextList = [newAnn, ...announcements];
    setAnnouncements(nextList);
    saveStoredAnnouncements(courseCode, nextList);
    setIsOnlineModalOpen(false);
    showToast("¡Link de clase online enviado con éxito a los estudiantes por Canvas!");
  };

  const handleDeleteAnnouncement = (id: string) => {
    const nextList = announcements.filter((a) => a.id !== id);
    setAnnouncements(nextList);
    saveStoredAnnouncements(courseCode, nextList);
  };

  return (
    <div className="space-y-5">
      {/* Header Informativo */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-base font-bold text-[#2D3B45] flex items-center gap-2">
              <Megaphone size={18} className="text-[#008EE2]" />
              Anuncios Automatizados de Canvas
            </h2>
            <p className="text-xs text-[#6B7780] mt-0.5">
              Plantillas de despacho rápido con un solo clic para comunicar clases online, suspensiones, cambios de sala y avisos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Botón Mandar Link Clase Online Mock */}
            <CanvasButton
              variant="primary-canvas"
              size="sm"
              icon={<Video size={14} />}
              onClick={() => setIsOnlineModalOpen(true)}
            >
              Mandar link clase online
            </CanvasButton>

            <div className="bg-emerald-50 border border-emerald-200 rounded px-3 py-1.5 flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span className="font-medium text-[11px]">Conectado a Canvas API / Anuncios</span>
            </div>
          </div>
        </div>
      </div>

      {publishedToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{publishedToast}</span>
        </div>
      )}

      {/* Catálogo de Plantillas Rápidas */}
      <AnnouncementTemplatesGrid
        templates={ANNOUNCEMENT_TEMPLATES}
        onSelectTemplate={setSelectedTemplate}
      />

      {/* Historial de Anuncios Publicados en Canvas */}
      <AnnouncementsHistoryList
        announcements={announcements}
        onDelete={handleDeleteAnnouncement}
      />

      {/* Modal Redactor y Publicador de Plantillas Estándar */}
      <CourseAnnouncementModal
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        template={selectedTemplate}
        courseCode={courseCode}
        courseName={courseName}
        onPublish={handlePublish}
      />

      {/* Modal Específico: Mandar Link Clase Online */}
      <OnlineClassLinkModal
        isOpen={isOnlineModalOpen}
        onClose={() => setIsOnlineModalOpen(false)}
        courseCode={courseCode}
        courseName={courseName}
        onPublish={handlePublishOnlineClass}
      />
    </div>
  );
};
