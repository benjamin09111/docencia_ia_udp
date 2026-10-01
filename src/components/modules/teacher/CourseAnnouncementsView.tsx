"use client";

import React, { useState, useEffect } from "react";
import {
  ANNOUNCEMENT_TEMPLATES,
  AnnouncementTemplate,
  CanvasAnnouncement,
  getStoredAnnouncements,
  saveStoredAnnouncements,
} from "@/services/announcementsService";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  Megaphone,
  Send,
  Copy,
  Check,
  AlertOctagon,
  MapPin,
  FileSpreadsheet,
  Clock,
  HelpCircle,
  BookOpen,
  Sparkles,
  CheckCircle2,
  X,
  History,
  Trash2,
} from "lucide-react";

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

  // Campos del modal de redacción
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [paramFecha, setParamFecha] = useState("");
  const [paramSala, setParamSala] = useState("");
  const [paramMotivo, setParamMotivo] = useState("");

  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [publishedToast, setPublishedToast] = useState<string | null>(null);

  useEffect(() => {
    setAnnouncements(getStoredAnnouncements(courseCode));
  }, [courseCode]);

  const handleSelectTemplate = (tpl: AnnouncementTemplate) => {
    setSelectedTemplate(tpl);

    let defaultFecha = "este viernes";
    let defaultSala = "Laboratorio L-204 (Pabellón Informática)";
    let defaultMotivo = "motivos de fuerza mayor e imprevistos de salud";

    if (tpl.categoria === "cancelacion") {
      defaultFecha = "este viernes 2 de octubre";
      defaultMotivo = "asistencia a congreso académico y fuerza mayor";
    } else if (tpl.categoria === "sala") {
      defaultFecha = "la sesión de hoy";
      defaultSala = "Laboratorio L-204 (Edificio Ejército 441)";
    } else if (tpl.categoria === "entrega") {
      defaultFecha = "este domingo a las 23:59 hrs";
    } else if (tpl.categoria === "ayudantia") {
      defaultFecha = "miércoles a las 18:00 hrs";
      defaultSala = "Sala B-102 / Enlace Zoom Canvas";
    }

    setParamFecha(defaultFecha);
    setParamSala(defaultSala);
    setParamMotivo(defaultMotivo);

    const generated = tpl.generarMensaje({
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
  };

  const handleRecomputeMessage = () => {
    if (!selectedTemplate) return;
    const generated = selectedTemplate.generarMensaje({
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

  const handlePublish = () => {
    if (!draftTitle.trim() || !draftBody.trim()) return;

    const newAnn: CanvasAnnouncement = {
      id: `ann_${Date.now()}`,
      courseCode,
      titulo: draftTitle,
      mensaje: draftBody,
      categoria: selectedTemplate?.categoria || "general",
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

    setPublishedToast(`¡Anuncio "${draftTitle}" publicado con éxito en Canvas!`);
    setSelectedTemplate(null);
    setTimeout(() => setPublishedToast(null), 4000);
  };

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${draftTitle}\n\n${draftBody}`);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2000);
    }
  };

  const handleDeleteAnnouncement = (id: string) => {
    const nextList = announcements.filter((a) => a.id !== id);
    setAnnouncements(nextList);
    saveStoredAnnouncements(courseCode, nextList);
  };

  const renderIcon = (cat: string) => {
    switch (cat) {
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
              Plantillas de despacho rápido con un solo clic para comunicar suspensiones, cambios de sala, notas y avisos a los alumnos.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded px-3 py-1.5 flex items-center gap-2 text-xs text-emerald-800">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span className="font-medium text-[11px]">Conectado a Canvas API / Anuncios</span>
          </div>
        </div>
      </div>

      {publishedToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{publishedToast}</span>
        </div>
      )}

      {/* Catálogo de Plantillas Rápidas */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Seleccionar Plantilla de Anuncio Rápido:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {ANNOUNCEMENT_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleSelectTemplate(tpl)}
              className="bg-white border border-[#E0E3E6] hover:border-[#008EE2] hover:shadow-md rounded-[4px] p-4 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center border border-gray-200 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                    {renderIcon(tpl.categoria)}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-[#008EE2]">
                    1 Clic
                  </span>
                </div>

                <h4 className="text-xs font-bold text-[#2D3B45] group-hover:text-[#008EE2] transition-colors">
                  {tpl.tituloSugerido}
                </h4>
                <p className="text-[11px] text-[#6B7780] mt-1 line-clamp-2">
                  {tpl.descripcionCorta}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#008EE2] font-semibold">
                <span>Preparar anuncio</span>
                <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Historial de Anuncios Publicados en Canvas */}
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
                      onClick={() => handleDeleteAnnouncement(ann.id)}
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

      {/* Modal Redactor y Publicador de Anuncio */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-2xl max-w-xl w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-gray-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  {renderIcon(selectedTemplate.categoria)}
                  <h3 className="text-sm font-bold text-[#2D3B45]">
                    Publicar Anuncio: {selectedTemplate.tituloSugerido}
                  </h3>
                </div>
                <p className="text-xs text-[#6B7780] mt-0.5">
                  Personaliza los parámetros y presiona publicar para despachar a Canvas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
              >
                <X size={18} />
              </button>
            </div>

            {/* Parámetros dinámicos según categoría */}
            <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-2.5 text-xs">
              <span className="font-bold text-[11px] text-gray-700 uppercase tracking-wider block">
                Parámetros Rápidos de la Plantilla:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-gray-700 block mb-0.5">
                    Fecha / Momento:
                  </label>
                  <input
                    type="text"
                    value={paramFecha}
                    onChange={(e) => setParamFecha(e.target.value)}
                    placeholder="Ej: este viernes 2 de octubre"
                    className="w-full px-2.5 py-1 border border-gray-300 rounded text-xs bg-white"
                  />
                </div>

                {selectedTemplate.categoria === "sala" || selectedTemplate.categoria === "ayudantia" ? (
                  <div>
                    <label className="text-[11px] font-medium text-gray-700 block mb-0.5">
                      Nueva Sala o Enlace:
                    </label>
                    <input
                      type="text"
                      value={paramSala}
                      onChange={(e) => setParamSala(e.target.value)}
                      placeholder="Ej: Laboratorio L-204"
                      className="w-full px-2.5 py-1 border border-gray-300 rounded text-xs bg-white"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-medium text-gray-700 block mb-0.5">
                      Motivo / Detalle:
                    </label>
                    <input
                      type="text"
                      value={paramMotivo}
                      onChange={(e) => setParamMotivo(e.target.value)}
                      placeholder="Ej: fuerza mayor / congreso"
                      className="w-full px-2.5 py-1 border border-gray-300 rounded text-xs bg-white"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleRecomputeMessage}
                  className="text-[11px] text-[#008EE2] hover:underline font-semibold"
                >
                  ↻ Regenerar texto con estos parámetros
                </button>
              </div>
            </div>

            {/* Asunto / Título del Anuncio */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Título del Anuncio en Canvas:
              </label>
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#008EE2] focus:outline-none font-medium"
              />
            </div>

            {/* Cuerpo del Mensaje */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Cuerpo del Anuncio (Editable):
              </label>
              <textarea
                rows={7}
                value={draftBody}
                onChange={(e) => setDraftBody(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#008EE2] focus:outline-none font-mono text-[11px] leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
              >
                {copiedSuccess ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">¡Texto copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copiar texto</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <CanvasButton
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Cancelar
                </CanvasButton>

                <CanvasButton
                  variant="primary-canvas"
                  size="sm"
                  icon={<Send size={14} />}
                  onClick={handlePublish}
                >
                  Publicar en Canvas
                </CanvasButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
