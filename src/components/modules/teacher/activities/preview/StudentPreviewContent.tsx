"use client";

import React from "react";
import { InstruccionItem, ActivityAttachment } from "@/types/actividadesFormativas";
import { MetodologiaDocente } from "@/constants/metodologiasDocentes";
import { RubricMatrixRubro } from "@/components/canvas/CanvasOfficialRubricTable";
import {
  FileText,
  Clock,
  Award,
  Paperclip,
  CheckCircle2,
  Sparkles,
  Bot,
  ExternalLink,
} from "lucide-react";

interface StudentPreviewContentProps {
  metodologia: MetodologiaDocente;
  titulo: string;
  descripcion: string;
  fecha: string;
  pin: string;
  items: InstruccionItem[];
  attachments: ActivityAttachment[];
  matrizRubros: RubricMatrixRubro[];
  modalidad: "decimas" | "nota";
  decimas: string;
  pointsPossible: number;
}

export const StudentPreviewContent: React.FC<StudentPreviewContentProps> = ({
  metodologia,
  titulo,
  descripcion,
  fecha,
  pin,
  items,
  attachments,
  matrizRubros,
  modalidad,
  decimas,
  pointsPossible,
}) => {
  const totalPuntos = items.reduce((acc, it) => acc + (Number(it.puntaje) || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 sm:p-6 bg-[#F5F6F8] max-h-[75vh] overflow-y-auto">
      {/* Contenido Principal de la Tarea (Izquierda) */}
      <div className="lg:col-span-8 space-y-4">
        {/* Cabecera de la Tarea */}
        <div className="bg-white border border-[#C7CDD1] rounded-[4px] p-5 shadow-2xs space-y-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B71C1C] bg-red-50 border border-red-200 px-2 py-0.5 rounded inline-block">
                {metodologia.nombreCorto}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#2D3B45] mt-1.5">
                {titulo || metodologia.tituloDefecto}
              </h1>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#6B7780] block">Puntaje Máximo</span>
              <span className="text-lg font-black text-[#2D3B45] font-mono">
                {totalPuntos || pointsPossible} pts
              </span>
              {modalidad === "decimas" && (
                <span className="text-[11px] text-[#2E7D32] font-bold block">
                  +{decimas} décimas extra
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#6B7780] border-t border-[#E0E3E6] pt-2.5">
            <span className="flex items-center gap-1">
              <Clock size={13} className="text-[#B71C1C]" />
              <strong>Plazo:</strong> {fecha || "Sin fecha fija"}
            </span>
            <span className="flex items-center gap-1">
              <Award size={13} className="text-[#008EE2]" />
              <strong>Escala:</strong> 0 a 60 pts (Nota 4.0 = 36 pts)
            </span>
          </div>

          <div className="pt-2 text-xs sm:text-sm text-[#2D3B45] leading-relaxed whitespace-pre-line border-t border-dashed border-gray-200">
            {descripcion || "Instrucciones generales de la actividad formativa..."}
          </div>
        </div>

        {/* Preguntas e Instrucciones Evaluadas */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D3B45] px-1 flex items-center gap-1.5">
            <FileText size={14} className="text-[#B71C1C]" />
            Desafíos y Preguntas a Resolver ({items.length})
          </h3>

          {items.map((it, idx) => (
            <div
              key={it.id || idx}
              className="bg-white border border-[#C7CDD1] rounded-[4px] p-4 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#2D3B45] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-[#2D3B45]">{it.titulo}</h4>
                </div>
                <span className="text-xs font-bold font-mono text-[#B71C1C] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  {it.puntaje} pts
                </span>
              </div>
              <p className="text-xs text-[#55636E] leading-relaxed whitespace-pre-line pl-7">
                {it.descripcion}
              </p>
            </div>
          ))}
        </div>

        {/* Anexos y Material Complementario */}
        {attachments.length > 0 && (
          <div className="bg-white border border-[#C7CDD1] rounded-[4px] p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D3B45] flex items-center gap-1.5">
              <Paperclip size={14} className="text-[#B71C1C]" />
              Anexos y Material de Apoyo ({attachments.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="bg-[#F5F6F8] border border-[#C7CDD1] rounded-[3px] p-2.5 flex items-center gap-2.5"
                >
                  {att.previewUrl ? (
                    <img
                      src={att.previewUrl}
                      alt={att.name}
                      className="w-10 h-10 object-cover rounded border border-gray-300 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded bg-white border border-gray-300 flex items-center justify-center text-[#B71C1C] shrink-0">
                      <FileText size={16} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#2D3B45] truncate">{att.name}</p>
                    <span className="text-[10px] text-[#6B7780] block font-mono">
                      {att.size} • Anexo de consulta
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Columna Derecha: Copiloto / Tutor IA del Estudiante */}
      <div className="lg:col-span-4 space-y-3">
        <div className="bg-white border border-[#C7CDD1] rounded-[4px] shadow-2xs overflow-hidden flex flex-col h-full min-h-[420px]">
          {/* Header Tutor */}
          <div className="bg-[#2D3B45] text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#B71C1C] flex items-center justify-center text-white">
                <Bot size={15} />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">Tutor IA de Taller</h4>
                <span className="text-[10px] text-gray-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> En línea para consultas
                </span>
              </div>
            </div>
            <Sparkles size={14} className="text-amber-300" />
          </div>

          {/* Chat Simulado */}
          <div className="flex-1 p-3 space-y-3 bg-[#FAFAFA] text-xs overflow-y-auto">
            <div className="bg-white border border-[#E0E3E6] rounded p-2.5 text-[#2D3B45] shadow-2xs space-y-1">
              <p className="font-semibold text-[#B71C1C]">¡Hola estudiante!</p>
              <p className="text-[11.5px] text-[#55636E] leading-relaxed">
                Soy tu asistente pedagógico para este taller de <strong>{metodologia.nombreCorto}</strong>. Puedes hacerme preguntas sobre los {totalPuntos} puntos, dudas conceptuales o cómo estructurar tus respuestas.
              </p>
            </div>

            <div className="p-2.5 rounded bg-blue-50 border border-blue-200 text-[#008EE2] text-[11px] leading-relaxed">
              <strong>Tip del Tutor:</strong> Revisa detalladamente cada pregunta antes de responder. La pauta evalúa rigor conceptual y evidencia práctica.
            </div>
          </div>

          {/* Input simulado */}
          <div className="p-2.5 border-t border-[#E0E3E6] bg-white">
            <div className="flex items-center gap-1.5 bg-[#F5F6F8] border border-[#C7CDD1] rounded px-2 py-1.5 text-xs text-gray-400">
              <span className="truncate">Escribe una duda al tutor IA...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
