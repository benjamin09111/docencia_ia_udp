"use client";

import React, { useState } from "react";
import { CanvasCourse } from "@/types";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  Megaphone,
  Send,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  AlertOctagon,
  FileSpreadsheet,
} from "lucide-react";

interface TeacherQuickAnnouncementsViewProps {
  courses: CanvasCourse[];
}

export const TeacherQuickAnnouncementsView: React.FC<TeacherQuickAnnouncementsViewProps> = ({
  courses,
}) => {
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>(courses.map((c) => c.id));
  const [selectedType, setSelectedType] = useState<"suspension" | "sala" | "entrega" | "notas">("suspension");
  const [paramFecha, setParamFecha] = useState("la sesión de hoy");
  const [paramDetalle, setParamDetalle] = useState("motivos de fuerza mayor e imprevistos de salud");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const toggleCourse = (id: number) => {
    setSelectedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedCourseIds(courses.map((c) => c.id));
  const deselectAll = () => setSelectedCourseIds([]);

  const templates = {
    suspension: {
      title: "🛑 URGENTE: Suspensión de Sesión Docente",
      body: `Estimados y estimadas estudiantes:\n\nPor medio del presente comunicado oficial se informa que la clase programada para ${paramFecha} queda excepcionalmente SUSPENDIDA debido a ${paramDetalle}.\n\nLas actividades y material de trabajo asincrónico quedarán disponibles en Canvas. Agradecemos su comprensión.\n\nAtentamente,\nEquipo Docente UDP`,
    },
    sala: {
      title: "📍 AVISO: Cambio de Sala / Laboratorio",
      body: `Estimadas y estimados estudiantes:\n\nSe les notifica que la clase programada para ${paramFecha} se realizará excepcionalmente en: ${paramDetalle}.\n\nRogamos acudir puntualmente a dicha ubicación.\n\nSaludos cordiales,\nEquipo Docente UDP`,
    },
    entrega: {
      title: "⏰ RECORDATORIO: Próximo Hito de Entrega Oficial",
      body: `Estimadas y estimados estudiantes:\n\nLes recordamos que el plazo oficial para ${paramDetalle} vence impostergablemente ${paramFecha}.\n\nPor favor verificar que los entregables y enlaces cumplan con los lineamientos de la pauta Canvas.\n\nÉxito en el desarrollo,\nEquipo Docente UDP`,
    },
    notas: {
      title: "📊 PUBLICACIÓN: Planilla de Calificaciones Oficiales",
      body: `Estimadas y estimados estudiantes:\n\nYa se encuentran publicadas en Canvas las notas oficiales correspondientes a ${paramDetalle}.\n\nPueden revisar su detalle y observaciones. El período de consultas finaliza ${paramFecha}.\n\nSaludos cordiales,\nEquipo Docente UDP`,
    },
  };

  const currentAnnouncement = templates[selectedType];

  const handlePublish = () => {
    if (selectedCourseIds.length === 0) return;
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishSuccess(
        `¡Anuncio publicado con éxito en ${selectedCourseIds.length} cursos seleccionados vía Canvas API!`
      );
      setTimeout(() => setPublishSuccess(null), 5000);
    }, 1200);
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
      {/* Header Canvas */}
      <div className="bg-[#F5F6F8] border border-[#C7CDD1] rounded-[4px] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[4px] bg-red-100 border border-red-200 flex items-center justify-center shrink-0 text-[#B71C1C]">
            <Megaphone size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#2D3B45]">
              Anuncios Rápidos Automatizados
            </h2>
            <p className="text-xs text-[#6B7780]">
              Emisión simultánea de comunicados prioritarios a todos tus cursos en 1 clic.
            </p>
          </div>
        </div>
      </div>

      {publishSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{publishSuccess}</span>
        </div>
      )}

      {/* Cursos Destinatarios */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card space-y-3">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-xs font-bold text-[#2D3B45] uppercase tracking-wide flex items-center gap-1.5">
            <Layers size={14} className="text-[#008EE2]" /> Cursos Destino ({selectedCourseIds.length} de {courses.length})
          </span>
          <div className="flex gap-2 text-xs">
            <button type="button" onClick={selectAll} className="text-[#008EE2] hover:underline font-semibold">
              Seleccionar todos
            </button>
            <span className="text-gray-300">•</span>
            <button type="button" onClick={deselectAll} className="text-[#6B7780] hover:underline font-medium">
              Desmarcar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {courses.map((course) => {
            const isChecked = selectedCourseIds.includes(course.id);
            return (
              <label
                key={course.id}
                className={`flex items-center gap-2.5 p-2 rounded border text-xs cursor-pointer transition-colors ${
                  isChecked ? "bg-red-50/50 border-red-200 text-[#2D3B45]" : "bg-gray-50 border-gray-200 text-[#6B7780]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCourse(course.id)}
                  className="rounded text-[#B71C1C] focus:ring-[#B71C1C]"
                />
                <div className="min-w-0">
                  <span className="font-semibold block truncate">{course.code}</span>
                  <span className="text-[11px] text-gray-500 block truncate">{course.name}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Selector de Plantilla Rápida */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => {
            setSelectedType("suspension");
            setParamFecha("la sesión de hoy");
            setParamDetalle("motivos de fuerza mayor e imprevistos de salud");
          }}
          className={`p-3 rounded border text-left flex flex-col justify-between transition-colors ${
            selectedType === "suspension"
              ? "bg-red-50 border-[#B71C1C] text-[#B71C1C] font-bold"
              : "bg-white border-[#E0E3E6] text-[#2D3B45] hover:bg-gray-50"
          }`}
        >
          <AlertOctagon size={18} className="mb-1 text-[#B71C1C]" />
          <span className="text-xs">Suspensión de Clase</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedType("sala");
            setParamFecha("la sesión de hoy");
            setParamDetalle("Laboratorio L-204 (Edificio Ejército 441)");
          }}
          className={`p-3 rounded border text-left flex flex-col justify-between transition-colors ${
            selectedType === "sala"
              ? "bg-blue-50 border-[#008EE2] text-[#008EE2] font-bold"
              : "bg-white border-[#E0E3E6] text-[#2D3B45] hover:bg-gray-50"
          }`}
        >
          <MapPin size={18} className="mb-1 text-[#008EE2]" />
          <span className="text-xs">Cambio de Sala</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedType("entrega");
            setParamFecha("este domingo 23:59 hrs");
            setParamDetalle("el Informe de Hito 2");
          }}
          className={`p-3 rounded border text-left flex flex-col justify-between transition-colors ${
            selectedType === "entrega"
              ? "bg-amber-50 border-amber-600 text-amber-700 font-bold"
              : "bg-white border-[#E0E3E6] text-[#2D3B45] hover:bg-gray-50"
          }`}
        >
          <Clock size={18} className="mb-1 text-amber-600" />
          <span className="text-xs">Recordatorio Entrega</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedType("notas");
            setParamFecha("el viernes 18:00 hrs");
            setParamDetalle("la Solemne 1");
          }}
          className={`p-3 rounded border text-left flex flex-col justify-between transition-colors ${
            selectedType === "notas"
              ? "bg-emerald-50 border-emerald-600 text-emerald-800 font-bold"
              : "bg-white border-[#E0E3E6] text-[#2D3B45] hover:bg-gray-50"
          }`}
        >
          <FileSpreadsheet size={18} className="mb-1 text-emerald-600" />
          <span className="text-xs">Publicación de Notas</span>
        </button>
      </div>

      {/* Editor y Vista Previa */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-[#2D3B45] block mb-1">Fecha / Plazo</label>
            <input
              type="text"
              value={paramFecha}
              onChange={(e) => setParamFecha(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#008EE2]"
            />
          </div>
          <div>
            <label className="font-bold text-[#2D3B45] block mb-1">Detalle / Motivo / Ubicación</label>
            <input
              type="text"
              value={paramDetalle}
              onChange={(e) => setParamDetalle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#008EE2]"
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded p-4 bg-gray-50/70 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7780] block">
            Vista Previa del Anuncio Canvas
          </span>
          <h4 className="text-sm font-bold text-[#2D3B45]">{currentAnnouncement.title}</h4>
          <p className="text-xs text-[#55636E] whitespace-pre-line leading-relaxed font-sans bg-white p-3 rounded border border-gray-200">
            {currentAnnouncement.body}
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-gray-100">
          <CanvasButton
            variant="outline"
            size="sm"
            onClick={handleCopy}
            icon={copiedText ? <Check size={14} /> : <Copy size={14} />}
          >
            {copiedText ? "¡Copiado!" : "Copiar Texto"}
          </CanvasButton>
          <CanvasButton
            variant="primary-udp"
            size="sm"
            disabled={isPublishing || selectedCourseIds.length === 0}
            onClick={handlePublish}
            icon={<Send size={14} />}
          >
            {isPublishing
              ? "Publicando en Canvas..."
              : `Publicar en ${selectedCourseIds.length} Cursos (1 Clic)`}
          </CanvasButton>
        </div>
      </div>
    </div>
  );
};
