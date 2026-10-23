"use client";

import React from "react";
import { CourseFrontPageData } from "@/services/courseFrontPageService";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  UploadCloud,
  Sparkles,
  ExternalLink,
  Eye,
  Edit3,
  Code,
  CheckCircle2,
  Copy,
  AlertCircle,
} from "lucide-react";

interface CourseHomePageHeaderProps {
  courseId: number;
  courseName: string;
  data: CourseFrontPageData;
  isGeneratingAi: boolean;
  isSyncing: boolean;
  aiMessage: string | null;
  syncSuccess: string | null;
  syncError: string | null;
  activeMode: "preview" | "editor" | "html";
  copiedHtml: boolean;
  onGenerateWithAi: () => void;
  onSyncToCanvas: () => void;
  onSelectMode: (mode: "preview" | "editor" | "html") => void;
  onCopyHtml: () => void;
}

export const CourseHomePageHeader: React.FC<CourseHomePageHeaderProps> = ({
  courseId,
  courseName,
  data,
  isGeneratingAi,
  isSyncing,
  aiMessage,
  syncSuccess,
  syncError,
  activeMode,
  copiedHtml,
  onGenerateWithAi,
  onSyncToCanvas,
  onSelectMode,
  onCopyHtml,
}) => {
  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 bg-[#E3F2FD] text-[#0277BD] text-xs font-bold rounded uppercase">
              Página de Inicio del Curso (Canvas Front Page)
            </span>
            {data.lastSyncedAt ? (
              <CanvasBadge variant="success">✓ Sincronizado en Canvas</CanvasBadge>
            ) : (
              <CanvasBadge variant="warning">Pendiente de Sincronizar</CanvasBadge>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#2D3B45] mt-1">
            Portal de Inicio de {courseName}
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Configura y publica directamente en Canvas la portada que verán los estudiantes al abrir el curso, con reglas de asistencia, fórmula de notas, docentes y cronograma.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <CanvasButton
            variant="secondary"
            size="sm"
            onClick={onGenerateWithAi}
            disabled={isGeneratingAi}
            title="Generar contenido con IA según PDF de programa"
            className="flex items-center gap-1.5"
          >
            <Sparkles size={14} className="text-[#008EE2]" />
            <span>{isGeneratingAi ? "Generando..." : "Generar IA"}</span>
          </CanvasButton>

          <CanvasButton
            variant="primary-udp"
            size="sm"
            onClick={onSyncToCanvas}
            disabled={isSyncing}
            title="Sincronizar y publicar portada oficial en Canvas LMS"
            className="flex items-center gap-1.5 bg-[#C8102E] hover:bg-[#A00C24] text-white border-transparent"
          >
            <UploadCloud size={14} />
            <span>{isSyncing ? "Guardando..." : "Sincronizar"}</span>
          </CanvasButton>

          <a
            href={`https://udp.instructure.com/courses/${courseId}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir este curso en Canvas LMS"
            className="px-2.5 py-1.5 text-xs font-semibold rounded-[4px] border border-gray-300 hover:border-gray-400 bg-white text-[#2D3B45] hover:text-[#008EE2] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <ExternalLink size={13} />
            <span>Canvas</span>
          </a>
        </div>
      </div>

      {aiMessage && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded text-xs flex items-center gap-2 animate-fadeIn">
          <Sparkles size={15} className="text-[#008EE2] shrink-0" />
          <span>{aiMessage}</span>
        </div>
      )}

      {syncSuccess && (
        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded text-xs flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            <span>{syncSuccess}</span>
          </div>
          <a
            href={`https://udp.instructure.com/courses/${courseId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#008EE2] hover:underline shrink-0 text-xs"
          >
            Abrir Curso en Canvas ↗
          </a>
        </div>
      )}

      {syncError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-800 rounded text-xs flex items-center gap-2">
          <AlertCircle size={15} className="text-red-600 shrink-0" />
          <span>{syncError}</span>
        </div>
      )}

      {/* Selector de Modo (Vista Previa / Editor / Código HTML) */}
      <div className="flex items-center justify-between border-t border-gray-200 mt-4 pt-3 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSelectMode("preview")}
            className={`px-3 py-1.5 rounded-[4px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeMode === "preview"
                ? "bg-[#2D3B45] text-white shadow-2xs"
                : "bg-gray-100 hover:bg-gray-200 text-[#55636E]"
            }`}
          >
            <Eye size={13} />
            <span>Vista previa</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMode("editor")}
            className={`px-3 py-1.5 rounded-[4px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeMode === "editor"
                ? "bg-[#2D3B45] text-white shadow-2xs"
                : "bg-gray-100 hover:bg-gray-200 text-[#55636E]"
            }`}
          >
            <Edit3 size={13} />
            <span>Editor</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMode("html")}
            className={`px-3 py-1.5 rounded-[4px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeMode === "html"
                ? "bg-[#2D3B45] text-white shadow-2xs"
                : "bg-gray-100 hover:bg-gray-200 text-[#55636E]"
            }`}
          >
            <Code size={13} />
            <span>HTML</span>
          </button>
        </div>

        {activeMode === "html" && (
          <button
            type="button"
            onClick={onCopyHtml}
            className="text-xs font-semibold text-[#008EE2] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Copy size={13} />
            <span>{copiedHtml ? "Copiado" : "Copiar"}</span>
          </button>
        )}
      </div>
    </div>
  );
};
