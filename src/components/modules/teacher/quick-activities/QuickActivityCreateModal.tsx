"use client";

import React, { useState, useRef } from "react";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { QuickActivity, QuickActivityFile, QuickActivityResourceType } from "@/types/quickActivities";
import { FileUp, Link as LinkIcon, Paperclip, FileText, Trash2, CheckCircle2 } from "lucide-react";

interface QuickActivityCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseCode: string;
  courseId?: number;
  onCreated: (item: QuickActivity) => void;
}

export const QuickActivityCreateModal: React.FC<QuickActivityCreateModalProps> = ({
  isOpen,
  onClose,
  courseCode,
  courseId,
  onCreated,
}) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoRecurso, setTipoRecurso] = useState<QuickActivityResourceType>("archivo");
  const [archivo, setArchivo] = useState<QuickActivityFile | null>(null);
  const [enlaceUrl, setEnlaceUrl] = useState("");
  const [enlaceTexto, setEnlaceTexto] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setTitulo(""); setDescripcion(""); setTipoRecurso("archivo");
    setArchivo(null); setEnlaceUrl(""); setEnlaceTexto(""); setFechaLimite(""); setIsPublished(true);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
    const isDoc = file.name.endsWith(".doc") || file.name.endsWith(".docx");
    const sizeKb = Math.round(file.size / 1024);
    const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
    setArchivo({
      name: file.name,
      size: sizeStr,
      type: isPdf ? "pdf" : isDoc ? "doc" : "other",
      url: URL.createObjectURL(file),
    });
  };

  const handleUseSamplePdf = () => {
    setArchivo({
      name: "Guia_Actividad_Practica_Oficial.pdf",
      size: "1.2 MB",
      type: "pdf",
      url: "#",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    const newItem: QuickActivity = {
      id: `qa_${Date.now()}`,
      courseCode,
      courseId,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      tipoRecurso,
      archivo: tipoRecurso === "archivo" && archivo ? archivo : undefined,
      enlaceUrl: tipoRecurso === "link" && enlaceUrl ? enlaceUrl : undefined,
      enlaceTexto: tipoRecurso === "link" ? (enlaceTexto.trim() || enlaceUrl) : undefined,
      fechaPublicacion: "Recién publicado",
      fechaLimite: fechaLimite || undefined,
      estado: isPublished ? "publicada" : "borrador",
      autor: "Profesor del curso",
      visitasCount: 0,
    };

    onCreated(newItem);
    resetForm();
    onClose();
  };

  return (
    <CanvasModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <FileUp size={18} className="text-[#B71C1C]" />
          <span>+ Publicar Tarea Rápida</span>
        </div>
      }
      subtitle="Publica una tarea o guía con PDF o enlace para que los estudiantes la vean de inmediato."
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <CanvasButton type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </CanvasButton>
          <CanvasButton type="submit" form="create-quick-act-form" variant="primary-udp" size="sm">
            Publicar Tarea en Canvas
          </CanvasButton>
        </div>
      }
    >
      <form id="create-quick-act-form" onSubmit={handleSubmit} className="space-y-4 text-xs text-[#2D3B45]">
        <div>
          <label className="block font-bold mb-1 text-[#2D3B45]">
            Título de la tarea o guía <span className="text-[#B71C1C]">*</span>
          </label>
          <input
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Guía N°3: Diagramas de Secuencia y Casos de Uso"
            className="w-full bg-white border border-[#C7CDD1] rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-bold mb-1 text-[#2D3B45]">
            Descripción / Instrucciones de la tarea
          </label>
          <textarea
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Estimados alumnos, descarguen el PDF adjunto y resuelvan las 3 actividades antes del viernes..."
            className="w-full bg-white border border-[#C7CDD1] rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-none leading-relaxed"
          />
        </div>

        {/* Selector de Recurso: Archivo o Enlace */}
        <div>
          <label className="block font-bold mb-1.5 text-[#2D3B45]">Material de la tarea</label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              type="button"
              onClick={() => setTipoRecurso("archivo")}
              className={`p-2.5 rounded-[3px] border flex items-center justify-center gap-2 cursor-pointer font-semibold transition-all ${
                tipoRecurso === "archivo"
                  ? "border-[#B71C1C] bg-red-50 text-[#B71C1C]"
                  : "border-[#C7CDD1] bg-white text-[#6B7780] hover:bg-gray-50"
              }`}
            >
              <Paperclip size={15} />
              <span>Subir Archivo (PDF / Doc)</span>
            </button>
            <button
              type="button"
              onClick={() => setTipoRecurso("link")}
              className={`p-2.5 rounded-[3px] border flex items-center justify-center gap-2 cursor-pointer font-semibold transition-all ${
                tipoRecurso === "link"
                  ? "border-[#B71C1C] bg-red-50 text-[#B71C1C]"
                  : "border-[#C7CDD1] bg-white text-[#6B7780] hover:bg-gray-50"
              }`}
            >
              <LinkIcon size={15} />
              <span>Enlace Web (Drive / Web)</span>
            </button>
          </div>

          {tipoRecurso === "archivo" ? (
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.zip,.png,.jpg"
                onChange={handleFileSelected}
                className="hidden"
              />
              {archivo ? (
                <div className="bg-[#F5F6F8] border border-[#C7CDD1] rounded-[3px] p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText size={20} className="text-[#B71C1C] shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-xs truncate">{archivo.name}</p>
                      <span className="text-[11px] text-[#6B7780]">{archivo.size} • PDF / Documento</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setArchivo(null)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 border-2 border-dashed border-[#C7CDD1] hover:border-[#B71C1C] rounded-[4px] p-4 text-center cursor-pointer transition-colors bg-[#FAFAFA]"
                  >
                    <Paperclip size={20} className="mx-auto text-gray-400 mb-1" />
                    <span className="block font-semibold text-xs text-[#2D3B45]">
                      Seleccionar archivo PDF o Guía
                    </span>
                    <span className="text-[11px] text-[#6B7780]">Haz clic para examinar archivos locales</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleUseSamplePdf}
                    className="px-3 py-2 border border-[#C7CDD1] bg-white hover:bg-gray-50 text-[#2D3B45] rounded-[4px] text-xs font-semibold text-left flex sm:flex-col justify-center items-start gap-1 cursor-pointer"
                  >
                    <span className="text-[#B71C1C] font-bold">📄 Usar PDF de ejemplo</span>
                    <span className="text-[10px] text-[#6B7780]">Carga un PDF simulado para probar</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="url"
                required={tipoRecurso === "link"}
                value={enlaceUrl}
                onChange={(e) => setEnlaceUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full bg-white border border-[#C7CDD1] rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-none"
              />
              <input
                type="text"
                value={enlaceTexto}
                onChange={(e) => setEnlaceTexto(e.target.value)}
                placeholder="Texto descriptivo del enlace (opcional)"
                className="w-full bg-white border border-[#C7CDD1] rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-none"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block font-bold mb-1 text-[#2D3B45]">Fecha de Entrega (Opcional)</label>
            <input
              type="date"
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              className="w-full bg-white border border-[#C7CDD1] rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 p-2 bg-[#F5F6F8] border border-[#C7CDD1] rounded-[3px] w-full cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded text-[#B71C1C] focus:ring-[#B71C1C]"
              />
              <div className="text-xs">
                <span className="font-bold block text-[#2D3B45]">Publicar inmediatamente</span>
                <span className="text-[10px] text-[#6B7780]">Visible para los estudiantes ahora</span>
              </div>
            </label>
          </div>
        </div>
      </form>
    </CanvasModal>
  );
};
