"use client";

import React, { useState, useEffect } from "react";
import { AnnouncementTemplate, CanvasAnnouncement } from "@/services/announcementsService";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { Send, Copy, Check } from "lucide-react";

interface CourseAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: AnnouncementTemplate | null;
  courseCode: string;
  courseName: string;
  onPublish: (announcement: CanvasAnnouncement) => void;
}

export const CourseAnnouncementModal: React.FC<CourseAnnouncementModalProps> = ({
  isOpen,
  onClose,
  template,
  courseCode,
  courseName,
  onPublish,
}) => {
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [paramFecha, setParamFecha] = useState("");
  const [paramSala, setParamSala] = useState("");
  const [paramMotivo, setParamMotivo] = useState("");
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  useEffect(() => {
    if (!template) return;
    let defaultFecha = "este viernes";
    let defaultSala = "Laboratorio L-204 (Pabellón Informática)";
    let defaultMotivo = "motivos de fuerza mayor e imprevistos de salud";

    if (template.categoria === "online") {
      defaultFecha = "la sesión de hoy";
      defaultSala = "https://udp-cl.zoom.us/j/98452109823";
      defaultMotivo = "sesión remota programada";
    } else if (template.categoria === "cancelacion") {
      defaultFecha = "este viernes 2 de octubre";
      defaultMotivo = "asistencia a congreso académico y fuerza mayor";
    } else if (template.categoria === "sala") {
      defaultFecha = "la sesión de hoy";
      defaultSala = "Laboratorio L-204 (Edificio Ejército 441)";
    } else if (template.categoria === "entrega") {
      defaultFecha = "este domingo a las 23:59 hrs";
    } else if (template.categoria === "ayudantia") {
      defaultFecha = "miércoles a las 18:00 hrs";
      defaultSala = "Sala B-102 / Enlace Zoom Canvas";
    }

    setParamFecha(defaultFecha);
    setParamSala(defaultSala);
    setParamMotivo(defaultMotivo);

    const generated = template.generarMensaje({
      cursoNombre: courseName,
      cursoCodigo: courseCode,
      profesor: "Jorge Esteban Cruz León",
      fecha: defaultFecha,
      sala: defaultSala,
      motivo: defaultMotivo,
      linkPlanilla: `${typeof window !== "undefined" ? window.location.origin : ""}/calificaciones/${courseCode}`,
    });

    setDraftTitle(generated.titulo);
    setDraftBody(generated.mensaje);
  }, [template, courseCode, courseName]);

  if (!template) return null;

  const handleRecompute = () => {
    const generated = template.generarMensaje({
      cursoNombre: courseName,
      cursoCodigo: courseCode,
      profesor: "Jorge Esteban Cruz León",
      fecha: paramFecha,
      sala: paramSala,
      motivo: paramMotivo,
      linkPlanilla: `${typeof window !== "undefined" ? window.location.origin : ""}/calificaciones/${courseCode}`,
    });
    setDraftTitle(generated.titulo);
    setDraftBody(generated.mensaje);
  };

  const handlePublishClick = () => {
    if (!draftTitle.trim() || !draftBody.trim()) return;
    const newAnn: CanvasAnnouncement = {
      id: `ann_${Date.now()}`,
      courseCode,
      titulo: draftTitle,
      mensaje: draftBody,
      categoria: template.categoria,
      fechaPublicacion: new Date().toLocaleDateString("es-CL", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      autor: "Jorge Esteban Cruz León",
      estado: "publicado",
    };
    onPublish(newAnn);
    onClose();
  };

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${draftTitle}\n\n${draftBody}`);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2000);
    }
  };

  return (
    <CanvasModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Publicar Anuncio: ${template.tituloSugerido}`}
      subtitle="Personaliza los parámetros y presiona publicar para despachar a Canvas."
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
          >
            {copiedSuccess ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copiedSuccess ? "¡Texto copiado!" : "Copiar texto"}</span>
          </button>
          <div className="flex gap-2">
            <CanvasButton variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </CanvasButton>
            <CanvasButton variant="primary-canvas" size="sm" icon={<Send size={14} />} onClick={handlePublishClick}>
              Publicar en Canvas
            </CanvasButton>
          </div>
        </div>
      }
    >
      <div className="space-y-3.5">
        <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-2 text-xs">
          <span className="font-bold text-[11px] text-gray-700 uppercase tracking-wider block">
            Parámetros Rápidos de la Plantilla:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-gray-700 block mb-0.5">Fecha / Momento:</label>
              <input
                type="text"
                value={paramFecha}
                onChange={(e) => setParamFecha(e.target.value)}
                className="w-full px-2.5 py-1 border border-gray-300 rounded text-xs bg-white"
              />
            </div>
            {template.categoria === "sala" || template.categoria === "ayudantia" || template.categoria === "online" ? (
              <div>
                <label className="text-[11px] font-medium text-gray-700 block mb-0.5">
                  {template.categoria === "online" ? "Enlace de Conexión:" : "Nueva Sala o Enlace:"}
                </label>
                <input
                  type="text"
                  value={paramSala}
                  onChange={(e) => setParamSala(e.target.value)}
                  className="w-full px-2.5 py-1 border border-gray-300 rounded text-xs bg-white"
                />
              </div>
            ) : (
              <div>
                <label className="text-[11px] font-medium text-gray-700 block mb-0.5">Motivo / Detalle:</label>
                <input
                  type="text"
                  value={paramMotivo}
                  onChange={(e) => setParamMotivo(e.target.value)}
                  className="w-full px-2.5 py-1 border border-gray-300 rounded text-xs bg-white"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleRecompute}
              className="text-[11px] text-[#008EE2] hover:underline font-semibold"
            >
              ↻ Regenerar texto con estos parámetros
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Título del Anuncio en Canvas:</label>
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#008EE2] focus:outline-none font-medium"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Cuerpo del Anuncio (Editable):</label>
          <textarea
            rows={6}
            value={draftBody}
            onChange={(e) => setDraftBody(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#008EE2] focus:outline-none font-mono text-[11px] leading-relaxed"
          />
        </div>
      </div>
    </CanvasModal>
  );
};
