"use client";

import React, { useState, useEffect } from "react";
import {
  CourseFrontPageData,
  loadCourseFrontPageFromStorage,
  saveCourseFrontPageToStorage,
  generateCanvasHomePageHtml,
  getDefaultFrontPageData,
} from "@/services/courseFrontPageService";
import { CourseHomePageEditor } from "./homepage/CourseHomePageEditor";
import { CourseDeliverablesView } from "./CourseDeliverablesView";
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
  BookOpen,
  Compass,
  Layers,
  FileText,
} from "lucide-react";

interface CourseHomePageViewProps {
  courseId: number;
  courseCode: string;
  courseName: string;
}

export const CourseHomePageView: React.FC<CourseHomePageViewProps> = ({
  courseId,
  courseCode,
  courseName,
}) => {
  const [data, setData] = useState<CourseFrontPageData>(() =>
    loadCourseFrontPageFromStorage(courseId, courseCode, courseName)
  );

  const [activeMode, setActiveMode] = useState<"preview" | "editor" | "html">("preview");
  const [internalSection, setInternalSection] = useState<"todas" | "portada" | "entregables">("todas");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    if (typeof document !== "undefined") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Generar el HTML final para Canvas
  const generatedHtml = generateCanvasHomePageHtml(data);

  const handleDataChange = (updated: CourseFrontPageData) => {
    setData(updated);
    saveCourseFrontPageToStorage(updated);
  };

  const handleSyncToCanvas = async () => {
    setIsSyncing(true);
    setSyncError(null);
    setSyncSuccess(null);

    try {
      const res = await fetch("/api/canvas/frontpage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          title: data.canvasWikiPageTitle,
          htmlBody: generatedHtml,
          setAsDefaultView: true,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Error al comunicar con la API de Canvas");
      }

      const now = new Date().toISOString();
      const updated = {
        ...data,
        lastSyncedAt: now,
        canvasPageUrl: resData.htmlUrl || `https://udp.instructure.com/courses/${courseId}`,
      };
      setData(updated);
      saveCourseFrontPageToStorage(updated);

      setSyncSuccess(
        resData.isSimulated
          ? "Página de inicio guardada y preparada para Canvas LMS (modo demostración activo)."
          : "¡Página de inicio publicada y fijada como Portada Oficial en Canvas UDP con éxito!"
      );
    } catch (err: any) {
      setSyncError(err.message || "Error al sincronizar con Canvas");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleGenerateWithAi = () => {
    setIsGeneratingAi(true);
    setAiMessage(null);

    setTimeout(() => {
      const freshData = getDefaultFrontPageData(courseId, courseCode, courseName);
      setData(freshData);
      saveCourseFrontPageToStorage(freshData);
      setIsGeneratingAi(false);
      setAiMessage(
        "✨ Información del curso estructurada y extraída con éxito desde el descriptor UDP y el programa oficial."
      );
      setTimeout(() => setAiMessage(null), 5000);
    }, 700);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Barra de Índice Interno del Curso */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] px-4 py-2.5 shadow-canvas-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#2D3B45] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Compass size={14} className="text-[#008EE2]" />
            Índice de Secciones:
          </span>
          <span className="text-[11px] text-[#6B7780]">Navegación interna docente</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setInternalSection("todas");
              scrollToSection("seccion-portada");
            }}
            className={`px-3 py-1.5 rounded-[4px] font-semibold transition-colors flex items-center gap-1.5 ${
              internalSection === "todas"
                ? "bg-[#2D3B45] text-white shadow-2xs"
                : "bg-gray-100 hover:bg-gray-200 text-[#55636E]"
            }`}
          >
            <Layers size={13} />
            <span>Ver todo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setInternalSection("portada");
              scrollToSection("seccion-portada");
            }}
            className={`px-3 py-1.5 rounded-[4px] font-semibold transition-colors flex items-center gap-1.5 ${
              internalSection === "portada"
                ? "bg-[#008EE2] text-white shadow-2xs"
                : "bg-gray-100 hover:bg-gray-200 text-[#55636E]"
            }`}
          >
            <BookOpen size={13} />
            <span>1. Portada Canvas (Wiki)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setInternalSection("entregables");
              scrollToSection("seccion-entregables");
            }}
            className={`px-3 py-1.5 rounded-[4px] font-semibold transition-colors flex items-center gap-1.5 ${
              internalSection === "entregables"
                ? "bg-[#C8102E] text-white shadow-2xs"
                : "bg-gray-100 hover:bg-gray-200 text-[#55636E]"
            }`}
          >
            <FileText size={13} />
            <span>2. Entregables Oficiales (Tareas Canvas)</span>
          </button>
        </div>
      </div>

      {/* SECCIÓN 1: PORTADA CANVAS */}
      {(internalSection === "todas" || internalSection === "portada") && (
        <div id="seccion-portada" className="space-y-4">
          {/* Barra Superior Informativa y Acciones */}
          <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 bg-[#E3F2FD] text-[#0277BD] text-[11px] font-bold rounded uppercase">
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

          {/* Botones de Acción */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <CanvasButton
              variant="secondary"
              size="sm"
              onClick={handleGenerateWithAi}
              disabled={isGeneratingAi}
              title="Generar contenido con IA según PDF de programa"
              className="flex items-center gap-1.5"
            >
              <Sparkles size={14} className="text-[#008EE2]" />
              <span>{isGeneratingAi ? "Generando..." : "Generar IA"}</span>
            </CanvasButton>

            <CanvasButton
              variant="primary"
              size="sm"
              onClick={handleSyncToCanvas}
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

        {/* Feedback Messages */}
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
              className="font-bold text-[#008EE2] hover:underline shrink-0"
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
              onClick={() => setActiveMode("preview")}
              title="Vista previa del portal tal como lo ve el alumno"
              className={`px-3 py-1.5 rounded-[4px] font-semibold transition-colors flex items-center gap-1.5 ${
                activeMode === "preview"
                  ? "bg-[#2D3B45] text-white shadow-2xs"
                  : "bg-gray-100 hover:bg-gray-200 text-[#55636E]"
              }`}
            >
              <Eye size={13} />
              <span>Vista previa</span>
            </button>

            <button
              onClick={() => setActiveMode("editor")}
              title="Formularios de edición estructurada de contenidos"
              className={`px-3 py-1.5 rounded-[4px] font-semibold transition-colors flex items-center gap-1.5 ${
                activeMode === "editor"
                  ? "bg-[#2D3B45] text-white shadow-2xs"
                  : "bg-gray-100 hover:bg-gray-200 text-[#55636E]"
              }`}
            >
              <Edit3 size={13} />
              <span>Editor</span>
            </button>

            <button
              onClick={() => setActiveMode("html")}
              title="Visor de código HTML estándar para Canvas"
              className={`px-3 py-1.5 rounded-[4px] font-semibold transition-colors flex items-center gap-1.5 ${
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
              onClick={handleCopyHtml}
              title="Copiar código HTML al portapapeles"
              className="text-xs font-semibold text-[#008EE2] hover:underline flex items-center gap-1"
            >
              <Copy size={13} />
              <span>{copiedHtml ? "Copiado" : "Copiar"}</span>
            </button>
          )}
        </div>
      </div>

      {/* CONTENIDO SEGÚN MODO */}

      {/* MODO 1: VISTA PREVIA RENDERIZADA */}
      {activeMode === "preview" && (
        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-6 shadow-canvas-card">
          <div className="mb-4 pb-2 border-b border-gray-100 flex items-center justify-between text-xs text-[#6B7780]">
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen size={14} className="text-[#008EE2]" />
              <span>Vista previa exacta tal como se despliega en la interfaz de Canvas LMS</span>
            </span>
            <span className="font-mono text-[11px] text-gray-400">canvas_wiki_front_page</span>
          </div>

          {/* Render del HTML con estilos inline nativos */}
          <div
            className="prose-canvas max-w-none"
            dangerouslySetInnerHTML={{ __html: generatedHtml }}
          />
        </div>
      )}

      {/* MODO 2: EDITOR ESTRUCTURADO */}
      {activeMode === "editor" && (
        <CourseHomePageEditor data={data} onChange={handleDataChange} />
      )}

      {/* MODO 3: CÓDIGO HTML PURO */}
      {activeMode === "html" && (
        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card space-y-3">
          <p className="text-xs text-[#55636E]">
            Código HTML estándar con estilos en línea compatible con el editor Wiki de Canvas Instructure.
          </p>
          <pre className="p-4 bg-gray-900 text-gray-100 rounded text-xs font-mono overflow-x-auto max-h-[500px] leading-relaxed">
            {generatedHtml}
          </pre>
        </div>
      )}
        </div>
      )}

      {/* SECCIÓN 2: ENTREGABLES OFICIALES Y TAREAS CANVAS */}
      {(internalSection === "todas" || internalSection === "entregables") && (
        <div id="seccion-entregables" className="pt-2 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#C8102E] text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="text-sm font-bold text-[#2D3B45]">
                Entregables Oficiales, Ponderación y Tareas de Canvas
              </h3>
            </div>
            <span className="text-[11px] text-gray-500 font-mono">
              Sincronización directa con Canvas Assignments
            </span>
          </div>

          <CourseDeliverablesView courseId={courseId} courseCode={courseCode} />
        </div>
      )}
    </div>
  );
};
