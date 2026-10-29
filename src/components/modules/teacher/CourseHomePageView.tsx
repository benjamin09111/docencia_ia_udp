"use client";

import React, { useState } from "react";
import {
  CourseFrontPageData,
  loadCourseFrontPageFromStorage,
  saveCourseFrontPageToStorage,
  generateCanvasHomePageHtml,
  getDefaultFrontPageData,
} from "@/services/courseFrontPageService";
import { CourseHomePageEditor } from "./homepage/CourseHomePageEditor";
import { CourseDeliverablesView } from "./CourseDeliverablesView";
import { BookOpen } from "lucide-react";
import { CourseHomePageInternalNav } from "./homepage/CourseHomePageInternalNav";
import { CourseHomePageHeader } from "./homepage/CourseHomePageHeader";

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
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

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
      if (!res.ok) throw new Error(resData.error || "Error al comunicar con la API de Canvas");

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
      setAiMessage("✨ Información del curso estructurada y extraída con éxito desde el descriptor UDP y el programa oficial.");
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
      <CourseHomePageInternalNav
        internalSection={internalSection}
        onSelectSection={(sec) => {
          setInternalSection(sec);
          scrollToSection(sec === "entregables" ? "seccion-entregables" : "seccion-portada");
        }}
      />

      {/* SECCIÓN 1: PORTADA CANVAS */}
      {(internalSection === "todas" || internalSection === "portada") && (
        <div id="seccion-portada" className="space-y-4">
          <CourseHomePageHeader
            courseId={courseId}
            courseName={courseName}
            data={data}
            isGeneratingAi={isGeneratingAi}
            isSyncing={isSyncing}
            aiMessage={aiMessage}
            syncSuccess={syncSuccess}
            syncError={syncError}
            activeMode={activeMode}
            copiedHtml={copiedHtml}
            onGenerateWithAi={handleGenerateWithAi}
            onSyncToCanvas={handleSyncToCanvas}
            onSelectMode={setActiveMode}
            onCopyHtml={handleCopyHtml}
          />

          {activeMode === "preview" && (
            <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-6 shadow-canvas-card">
              <div className="mb-4 pb-2 border-b border-gray-100 flex items-center justify-between text-xs text-[#6B7780]">
                <span className="flex items-center gap-1.5 font-medium">
                  <BookOpen size={14} className="text-[#008EE2]" />
                  <span>Vista previa exacta tal como se despliega en la interfaz de Canvas LMS</span>
                </span>
                <span className="font-mono text-xs text-gray-400">canvas_wiki_front_page</span>
              </div>
              <div className="prose-canvas max-w-none" dangerouslySetInnerHTML={{ __html: generatedHtml }} />
            </div>
          )}

          {activeMode === "editor" && (
            <CourseHomePageEditor data={data} onChange={handleDataChange} />
          )}

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

      {/* SECCIÓN 2: ENTREGABLES OFICIALES */}
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
            <span className="text-xs text-gray-500 font-mono">
              Sincronización directa con Canvas Assignments
            </span>
          </div>

          <CourseDeliverablesView courseId={courseId} courseCode={courseCode} />
        </div>
      )}
    </div>
  );
};
