"use client";

import React, { useState } from "react";
import { Lock, ShieldCheck, KeyRound, AlertCircle, ArrowRight } from "lucide-react";
import { CourseSection } from "@/types/attendance";
import { getSectionVisualPin } from "@/services/attendanceStore";

interface PublicAttendancePinLockScreenProps {
  section: CourseSection;
  onUnlocked: () => void;
}

export const PublicAttendancePinLockScreen: React.FC<PublicAttendancePinLockScreenProps> = ({
  section,
  onUnlocked,
}) => {
  const [pinInput, setPinInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const correctPin = getSectionVisualPin(section);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pinInput.trim();
    if (!clean) {
      setErrorMsg("Por favor, ingresa el PIN de la sección.");
      return;
    }

    if (clean === correctPin) {
      if (typeof window !== "undefined") {
        localStorage.setItem(`udp_visual_unlocked_${section.codigo}`, "true");
        localStorage.setItem(`udp_visual_unlocked_${section.id}`, "true");
      }
      setErrorMsg(null);
      onUnlocked();
    } else {
      setErrorMsg("PIN incorrecto. Consulta el PIN oficial de planilla con tu profesor o ayudante.");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white border border-[#E0E3E6] rounded-[6px] shadow-canvas-card p-6 sm:p-8 max-w-md w-full mx-auto space-y-5 text-center animate-fadeIn">
        <div className="w-14 h-14 bg-blue-50 text-[#008EE2] rounded-full flex items-center justify-center mx-auto shadow-xs border border-blue-100">
          <Lock size={26} />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#008EE2] uppercase tracking-wider block">
            Universidad Diego Portales • FING
          </span>
          <h2 className="text-lg font-bold text-[#2D3B45]">
            Planilla Privada de Asistencia
          </h2>
          <p className="text-xs text-[#6B7780]">
            {section.cursoNombre || "Asignatura UDP"} • <strong>{section.nombre}</strong> ({section.codigo})
          </p>
        </div>

        <div className="p-3 bg-gray-50 border border-gray-200 rounded-[4px] text-xs text-[#55636E] text-left space-y-1">
          <div className="font-semibold text-[#2D3B45] flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
            <span>Protección de Privacidad Estudiantil</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Por confidencialidad, la planilla solo muestra RUTs y requiere el PIN semestral de tu sección para acceder.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-[#2D3B45] flex items-center gap-1">
              <KeyRound size={13} className="text-[#008EE2]" />
              <span>PIN de Sección (4 dígitos)</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Ingresa el PIN..."
              className="w-full h-11 text-center font-mono font-black text-xl tracking-widest bg-gray-50 border border-gray-300 rounded-[4px] text-[#2D3B45] focus:bg-white focus:border-[#008EE2] focus:outline-hidden"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-[4px] text-xs text-red-800 flex items-center gap-2 text-left animate-fadeIn">
              <AlertCircle size={14} className="shrink-0 text-[#C8102E]" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-[#008EE2] hover:bg-[#0077BE] text-white rounded-[4px] text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <span>Desbloquear Planilla</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <p className="text-[10px] text-gray-400">
          Una vez ingresado, tu navegador recordará el acceso para este curso durante todo el semestre.
        </p>
      </div>
    </div>
  );
};
