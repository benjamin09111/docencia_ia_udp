"use client";

import React, { useState } from "react";
import { KeyRound, RefreshCw, Copy, Check, ShieldCheck, Lock } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { generateUniqueActivityPin } from "@/utils/activityPinHelpers";

interface ActivitySecurityPinCardProps {
  pin: string;
  setPin: (newPin: string) => void;
}

export const ActivitySecurityPinCard: React.FC<ActivitySecurityPinCardProps> = ({
  pin,
  setPin,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempPin, setTempPin] = useState(pin);

  const handleRegenerate = () => {
    const newPin = generateUniqueActivityPin();
    setPin(newPin);
    setTempPin(newPin);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCustomPin = () => {
    const clean = tempPin.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    if (clean.length === 6) {
      setPin(clean);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white border border-[#C7CDD1] rounded-[4px] p-4 sm:p-5 shadow-2xs space-y-3.5">
      <div className="border-b border-[#E0E3E6] pb-2 flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-bold text-[#2D3B45] uppercase tracking-wider flex items-center gap-2">
          <KeyRound size={16} className="text-[#B71C1C]" />
          PIN de Seguridad para Acceso Estudiantil (6 Caracteres)
        </h3>
        <span className="px-2 py-0.5 bg-green-50 text-[#2E7D32] border border-[#C8E6C9] rounded text-[11px] font-bold flex items-center gap-1">
          <ShieldCheck size={12} />
          Protección de Acceso Única
        </span>
      </div>

      <p className="text-xs text-[#6B7780] leading-relaxed">
        Este PIN se requerirá a los estudiantes cuando hagan clic en el enlace de la tarea publicado en el módulo de Canvas LMS. Garantiza que solo los alumnos autorizados en la sesión ingresen al taller interactivo y al agente tutor.
      </p>

      {/* Visualización del PIN */}
      <div className="bg-[#F5F6F8] border border-[#C7CDD1] rounded-[4px] p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-white border border-[#C7CDD1] flex items-center justify-center text-[#B71C1C] shadow-2xs">
            <Lock size={20} />
          </div>

          <div>
            <span className="text-[11px] font-bold text-[#6B7780] uppercase tracking-wider block">
              PIN Generado Automáticamente:
            </span>
            {isEditing ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  maxLength={6}
                  value={tempPin}
                  onChange={(e) => setTempPin(e.target.value.toUpperCase())}
                  className="font-mono text-xl font-extrabold text-[#2D3B45] bg-white border border-[#B71C1C] rounded px-2 py-0.5 w-28 text-center tracking-widest focus:outline-none"
                  autoFocus
                />
                <CanvasButton variant="primary-udp" size="sm" onClick={handleSaveCustomPin}>
                  Guardar
                </CanvasButton>
                <CanvasButton variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                  Cancelar
                </CanvasButton>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-2xl font-black text-[#2D3B45] tracking-[0.2em] bg-white px-3 py-1 rounded border border-[#C7CDD1] select-all">
                  {pin}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTempPin(pin);
                    setIsEditing(true);
                  }}
                  className="text-xs text-[#008EE2] hover:underline cursor-pointer ml-1"
                >
                  Editar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Acciones del PIN */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <CanvasButton
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            icon={copied ? <Check size={14} className="text-[#2E7D32]" /> : <Copy size={14} />}
          >
            {copied ? "¡Copiado!" : "Copiar PIN"}
          </CanvasButton>

          <CanvasButton
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            icon={<RefreshCw size={14} />}
            title="Generar un nuevo código PIN de 6 caracteres aleatorio"
          >
            Regenerar PIN
          </CanvasButton>
        </div>
      </div>
    </div>
  );
};
