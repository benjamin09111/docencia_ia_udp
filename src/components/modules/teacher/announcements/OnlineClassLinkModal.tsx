"use client";

import React, { useState } from "react";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { Video, Send, Copy, Check, Link as LinkIcon, Clock, ShieldCheck } from "lucide-react";

interface OnlineClassLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseCode: string;
  courseName: string;
  onPublish: (announcement: { titulo: string; mensaje: string }) => void;
}

export const OnlineClassLinkModal: React.FC<OnlineClassLinkModalProps> = ({
  isOpen,
  onClose,
  courseCode,
  courseName,
  onPublish,
}) => {
  const [platform, setPlatform] = useState<"Zoom UDP" | "Google Meet" | "Teams">("Zoom UDP");
  const [meetingUrl, setMeetingUrl] = useState("https://udp-cl.zoom.us/j/98452109823");
  const [meetingSchedule, setMeetingSchedule] = useState("Hoy, 08:30 - 11:20 hrs");
  const [meetingPasscode, setMeetingPasscode] = useState("ID: 984 5210 9823 | Clave: UDP2026");
  const [copiedLink, setCopiedLink] = useState(false);

  const handlePlatformChange = (p: "Zoom UDP" | "Google Meet" | "Teams") => {
    setPlatform(p);
    if (p === "Zoom UDP") {
      setMeetingUrl("https://udp-cl.zoom.us/j/98452109823");
      setMeetingPasscode("ID: 984 5210 9823 | Clave: UDP2026");
    } else if (p === "Google Meet") {
      setMeetingUrl("https://meet.google.com/udp-info-2026");
      setMeetingPasscode("Ingreso directo con correo @mail.udp.cl");
    } else {
      setMeetingUrl("https://teams.microsoft.com/l/meetup-join/udp2026");
      setMeetingPasscode("Requiere SSO UDP");
    }
  };

  const generatedTitle = `[CLASE ONLINE] Enlace de conexión cátedra virtual - ${courseCode}`;
  const generatedBody = `Estimadas y estimados estudiantes del curso ${courseName}:

Por medio del presente aviso se comparte el enlace oficial para la sesión de clase online:

🔗 Enlace de conexión: ${meetingUrl}
📌 Plataforma: ${platform}
⏰ Horario de conexión: ${meetingSchedule}
🔑 Acceso / Credenciales: ${meetingPasscode}

Indicaciones importantes:
• Ingresar puntualmente con su correo institucional UDP.
• Mantener el micrófono silenciado al ingresar a la sala.
• La sesión será grabada y quedará alojada en los módulos de Canvas.

Saludos cordiales,
Equipo Docente UDP`;

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${generatedTitle}\n\n${generatedBody}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSend = () => {
    onPublish({ titulo: generatedTitle, mensaje: generatedBody });
  };

  return (
    <CanvasModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2 text-[#2D3B45]">
          <Video size={18} className="text-[#008EE2]" />
          Mandar Link de Clase Online
        </span>
      }
      subtitle={`Emisión inmediata de enlace virtual a estudiantes de ${courseCode} (${courseName})`}
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
          >
            {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copiedLink ? "¡Texto copiado!" : "Copiar texto"}</span>
          </button>
          <div className="flex gap-2">
            <CanvasButton variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </CanvasButton>
            <CanvasButton variant="primary-canvas" size="sm" icon={<Send size={14} />} onClick={handleSend}>
              Mandar link a estudiantes (1 Clic)
            </CanvasButton>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Selector de Plataforma */}
        <div>
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide block mb-1.5">
            Plataforma Virtual:
          </label>
          <div className="flex gap-2">
            {(["Zoom UDP", "Google Meet", "Teams"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePlatformChange(p)}
                className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                  platform === p
                    ? "bg-blue-50 border-[#008EE2] text-[#008EE2]"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs de Enlace y Horario */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-medium text-gray-700 block mb-1 flex items-center gap-1">
              <LinkIcon size={12} className="text-[#008EE2]" /> Enlace de la Reunión:
            </label>
            <input
              type="text"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-gray-700 block mb-1 flex items-center gap-1">
              <Clock size={12} className="text-[#008EE2]" /> Horario / Sesión:
            </label>
            <input
              type="text"
              value={meetingSchedule}
              onChange={(e) => setMeetingSchedule(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-medium text-gray-700 block mb-1 flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-600" /> ID / Credenciales:
          </label>
          <input
            type="text"
            value={meetingPasscode}
            onChange={(e) => setMeetingPasscode(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white"
          />
        </div>

        {/* Vista previa del mensaje */}
        <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-1.5">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Vista Previa del Anuncio Canvas (Mock):
          </span>
          <p className="text-xs font-bold text-[#2D3B45]">{generatedTitle}</p>
          <pre className="text-[11px] text-gray-600 whitespace-pre-line font-sans bg-white p-2.5 rounded border border-gray-200 leading-relaxed max-h-36 overflow-y-auto">
            {generatedBody}
          </pre>
        </div>
      </div>
    </CanvasModal>
  );
};
