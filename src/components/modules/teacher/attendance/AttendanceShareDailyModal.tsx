"use client";

import React, { useState } from "react";
import { CourseSection, ClassSession } from "@/types/attendance";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  X,
  KeyRound,
  Link2,
  Copy,
  Check,
  RefreshCw,
  Tv,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Building2,
} from "lucide-react";

interface AttendanceShareDailyModalProps {
  section: CourseSection;
  todayDateStr: string;
  isOpen: boolean;
  onClose: () => void;
  pin: string;
  onRegeneratePin?: () => void;
}

export const AttendanceShareDailyModal: React.FC<AttendanceShareDailyModalProps> = ({
  section,
  todayDateStr,
  isOpen,
  onClose,
  pin,
  onRegeneratePin,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [isProjecting, setIsProjecting] = useState(false);

  if (!isOpen) return null;

  // Link del Día: incluye la sección y la fecha de hoy
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const dailyUrl = `${origin}/asistencia?sec=${encodeURIComponent(section.codigo)}&fecha=${todayDateStr}`;

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(dailyUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyPin = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(pin);
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2500);
    }
  };

  // Modo Proyección Pantalla Gigante para la Pizarra / Data Show
  if (isProjecting) {
    return (
      <div className="fixed inset-0 z-50 bg-[#1E272E] text-white flex flex-col justify-between p-6 sm:p-12 animate-fadeIn">
        <div className="flex justify-between items-center border-b border-gray-700 pb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#C8102E] text-white font-bold text-xs uppercase rounded">
              UDP Asistencia
            </span>
            <span className="text-sm font-mono text-gray-300">
              {section.codigo} • {section.nombre}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsProjecting(false)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs font-bold transition-colors"
          >
            Salir de Proyección (Esc)
          </button>
        </div>

        <div className="text-center space-y-6 my-auto max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#008EE2] font-black block">
            Ingresa a la Asistencia de Hoy en tu Celular o Notebook
          </span>

          <div className="bg-black/40 border-2 border-white/20 p-4 sm:p-6 rounded-[8px] max-w-xl mx-auto">
            <span className="text-xs text-gray-400 block mb-1">Enlace del Día:</span>
            <code className="text-base sm:text-lg font-mono text-[#008EE2] font-bold break-all">
              {dailyUrl}
            </code>
          </div>

          <div className="space-y-2">
            <span className="text-sm text-amber-300 font-bold uppercase tracking-wider block">
              PIN de Sala (Escribir en la Pizarra):
            </span>
            <div className="text-6xl sm:text-8xl font-black font-mono tracking-widest text-amber-400 bg-black/60 border-4 border-amber-400/50 py-6 px-10 rounded-[12px] inline-block shadow-2xl">
              {pin}
            </div>
          </div>

          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Recuerda que debes estar conectado en el campus de la Facultad de Ingeniería y Ciencias (Ejército 441) para validar tu asistencia.
          </p>
        </div>

        <div className="text-center text-xs text-gray-500 border-t border-gray-800 pt-3">
          Universidad Diego Portales • Sistema de Asistencia de Ayudantías
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-[6px] border border-[#E0E3E6] shadow-canvas-modal max-w-lg w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#FFEBEE] text-[#C8102E] text-[10px] font-bold rounded uppercase">
                Pase de Asistencia en Sala
              </span>
              <span className="text-xs text-[#6B7780] font-mono">
                {section.codigo} • {section.nombre}
              </span>
            </div>
            <h2 className="text-base font-bold text-[#2D3B45] mt-1 flex items-center gap-2">
              <KeyRound size={18} className="text-[#008EE2]" />
              Link del Día & PIN de Pizarra
            </h2>
            <p className="text-xs text-[#6B7780] mt-0.5">
              Comparte este enlace a los alumnos y escribe el PIN de 4 dígitos en la pizarra de la clase.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 1. Tarjeta Pizarra: PIN DEL DÍA (Grande y destacado) */}
        <div className="bg-[#1E272E] text-white p-5 rounded-[6px] text-center space-y-3 shadow-md border border-gray-700">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
            PIN del Día para Escribir en la Pizarra
          </span>

          <div className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-amber-300 bg-black/40 py-3 px-6 rounded-[4px] border border-amber-400/40 inline-block shadow-inner">
            {pin}
          </div>

          <p className="text-[11.5px] text-gray-300 leading-relaxed max-w-sm mx-auto">
            Anota este código en la pizarra. Los estudiantes deberán escribirlo para autenticar que están físicamente en la ayudantía.
          </p>

          <div className="flex justify-center items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopyPin}
              className={`px-3 py-1.5 rounded-[4px] text-xs font-bold flex items-center gap-1.5 transition-all ${
                copiedPin
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
              }`}
            >
              {copiedPin ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedPin ? "¡PIN Copiado!" : "Copiar PIN"}</span>
            </button>

            {onRegeneratePin && (
              <button
                type="button"
                onClick={onRegeneratePin}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 rounded-[4px] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Generar otro PIN aleatorio"
              >
                <RefreshCw size={13} />
                <span>Nuevo PIN</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsProjecting(true)}
              className="px-3 py-1.5 bg-[#008EE2] hover:bg-[#0077BE] text-white rounded-[4px] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Tv size={13} />
              <span>Proyectar en Pantalla</span>
            </button>
          </div>
        </div>

        {/* 2. Link Dinámico del Día */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#2D3B45] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Link2 size={14} className="text-[#008EE2]" />
              Enlace del Día (Válido para la Sesión de Hoy):
            </span>
            <span className="text-[10px] text-gray-400 font-mono">{todayDateStr}</span>
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={dailyUrl}
              className="flex-1 text-xs border border-gray-300 rounded-[4px] px-3 py-2 bg-gray-50 text-[#2D3B45] font-mono select-all focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-3 py-2 rounded-[4px] text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                copiedLink
                  ? "bg-emerald-600 text-white"
                  : "bg-[#2D3B45] hover:bg-[#1E272E] text-white"
              }`}
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedLink ? "¡Copiado!" : "Copiar"}</span>
            </button>
          </div>

          <div className="flex justify-between items-center pt-1 text-[11px]">
            <span className="text-gray-500">
              Los alumnos abrirán este link en sus celulares o laptops para registrarse.
            </span>
            <a
              href={dailyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#008EE2] hover:underline font-semibold flex items-center gap-1 shrink-0"
            >
              <span>Probar enlace</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* 3. Indicador de Ubicación Mandatoria */}
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-[4px] text-xs text-[#0277BD] space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck size={14} />
            <span>Validación de Probidad: Presencia en la Facultad Requerida</span>
          </div>
          <p className="text-[11px] text-[#01579B] leading-relaxed">
            La asistencia solo será aceptada si el estudiante se encuentra físicamente en el campus de la Facultad de Ingeniería y Ciencias UDP (Ejército 441, cerca de Metro Toesca).
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <CanvasButton variant="outline" size="sm" onClick={onClose}>
            Cerrar Ventana
          </CanvasButton>
        </div>
      </div>
    </div>
  );
};
