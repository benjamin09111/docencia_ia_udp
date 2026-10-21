"use client";

import React, { useState } from "react";
import { CourseSection } from "@/types/attendance";
import { getPublicCheckinUrl, getPublicVisualUrl } from "@/utils/urlHelper";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  publishAnnouncement,
  CanvasAnnouncement,
} from "@/services/announcementsService";
import { Copy, Check, Megaphone, ExternalLink, KeyRound, Sparkles } from "lucide-react";
import { fetchDailyPinForSection } from "@/utils/courseAttendanceAnnounceHelper";

interface QuickCopyAttendanceInfoButtonProps {
  courseCode: string;
  courseName: string;
  selectedSection: CourseSection;
  effectivePin: string;
  visualPin: string;
}

export const QuickCopyAttendanceInfoButton: React.FC<QuickCopyAttendanceInfoButtonProps> = ({
  courseCode,
  courseName,
  selectedSection,
  effectivePin,
  visualPin,
}) => {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const sectionName = selectedSection?.nombre || "Sección 1";
  const courseDisplayName = selectedSection?.cursoNombre || courseName || "Curso";
  const targetCode = selectedSection?.codigo || courseCode;

  const checkinUrl = getPublicCheckinUrl(targetCode);
  const visualUrl = getPublicVisualUrl(targetCode);

  const buildText = (pin: string) => `${courseDisplayName} - ${sectionName}
ASISTENCIA (Check-in hoy): ${checkinUrl}
Pin de Asistencia: ${pin}

PLANILLA DE NOTAS (Tablero): ${visualUrl}
Pin de Planilla: ${visualPin}`;

  const handleCopyAndPrompt = async () => {
    let pinToUse = effectivePin;
    if (!pinToUse || pinToUse === "····") {
      pinToUse = await fetchDailyPinForSection(targetCode);
    }
    const text = buildText(pinToUse);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.warn("Fallo al copiar al portapapeles:", err);
    }
    setIsModalOpen(true);
    setPublishedSuccess(false);
  };

  const handlePublishAsAnnouncement = async () => {
    let pinToUse = effectivePin;
    if (!pinToUse || pinToUse === "····") {
      pinToUse = await fetchDailyPinForSection(targetCode);
    }
    const text = buildText(pinToUse);

    publishAnnouncement(targetCode, {
      titulo: "Asistencia de la clase de hoy",
      mensaje: `Estimadas y estimados estudiantes:\n\nComparto los accesos para la sesión de hoy:\n\n${text}\n\nPor favor registrar su asistencia dentro del horario estipulado.`,
      categoria: "general",
      autor: selectedSection?.profesor || selectedSection?.ayudante || "Docente UDP",
    });
    setPublishedSuccess(true);
    setTimeout(() => { setIsModalOpen(false); setPublishedSuccess(false); }, 1800);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCopyAndPrompt}
        className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs border cursor-pointer ${
          copied
            ? "bg-emerald-50 border-emerald-400 text-emerald-800"
            : "bg-white hover:bg-gray-50 border-[#B71C1C] text-[#B71C1C]"
        }`}
        title="Copia el texto resumido con links de asistencia, pin y plantilla para compartirlo o publicarlo como anuncio"
      >
        {copied ? (
          <>
            <Check size={14} className="text-emerald-600 stroke-[2.5]" />
            <span>Copiado en el portapapeles</span>
          </>
        ) : (
          <>
            <Sparkles size={14} className="text-[#B71C1C]" />
            <span>Copiar información general rápidamente</span>
          </>
        )}
      </button>

      <CanvasModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        title={
          <div className="flex items-center gap-2">
            <Megaphone size={18} className="text-[#B71C1C]" />
            <span>¿Publicar como anuncio en el curso?</span>
          </div>
        }
        subtitle="La información general ya se encuentra copiada en tu portapapeles."
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] text-[#2E7D32] font-semibold flex items-center gap-1">
              <Check size={13} />
              Copiado en el portapapeles
            </span>
            <div className="flex items-center gap-2">
              <CanvasButton
                variant="secondary"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                Solo copiar
              </CanvasButton>
              <CanvasButton
                variant="primary-udp"
                size="sm"
                onClick={handlePublishAsAnnouncement}
                disabled={publishedSuccess}
                icon={<Megaphone size={13} />}
              >
                {publishedSuccess ? "¡Anuncio Publicado!" : "Publicar como anuncio en el curso"}
              </CanvasButton>
            </div>
          </div>
        }
      >
        <div className="space-y-3.5 text-xs text-[#2D3B45]">
          <div className="bg-[#F9FAFB] border border-[#C7CDD1] rounded-[4px] p-3 space-y-2 font-mono text-[11.5px] leading-relaxed">
            <div className="font-bold text-[#2D3B45] text-xs pb-1 border-b border-[#E0E3E6] font-sans">
              {courseDisplayName} - {sectionName}
            </div>
            <div>
              <span className="font-bold text-[#B71C1C]">ASISTENCIA (Check-in hoy): </span>
              <a href={checkinUrl} target="_blank" rel="noopener noreferrer" className="text-[#008EE2] hover:underline break-all">
                {checkinUrl}
              </a>
            </div>
            <div>
              <span className="font-bold text-[#2D3B45]">Pin de Asistencia: </span>
              <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">{effectivePin}</span>
            </div>
            <div className="pt-1 border-t border-gray-200">
              <span className="font-bold text-[#2D3B45]">PLANILLA DE NOTAS (Tablero): </span>
              <a href={visualUrl} target="_blank" rel="noopener noreferrer" className="text-[#008EE2] hover:underline break-all">
                {visualUrl}
              </a>
            </div>
            <div>
              <span className="font-bold text-[#2D3B45]">Pin de Planilla: </span>
              <span className="bg-gray-100 text-[#2D3B45] font-bold px-1.5 py-0.5 rounded border border-gray-300">{visualPin}</span>
            </div>
          </div>

          <p className="text-xs text-[#6B7780] leading-normal">
            Al presionar <strong>"Publicar como anuncio en el curso"</strong>, se creará automáticamente un anuncio en Canvas para que los estudiantes de <strong>{sectionName}</strong> accedan de inmediato a registrar su asistencia y ver la plantilla.
          </p>

          {publishedSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded text-xs flex items-center gap-2 animate-fadeIn font-semibold">
              <Check size={16} className="text-emerald-600" />
              <span>¡Anuncio publicado con éxito en el curso!</span>
            </div>
          )}
        </div>
      </CanvasModal>
    </>
  );
};
