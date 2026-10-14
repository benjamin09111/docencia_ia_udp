import React from "react";
import { ActividadFormativa } from "@/types/actividadesFormativas";
import { getDeckCardMeta } from "./deckTypes";
import { Clock, Users, Zap, RotateCw, CheckCircle, Target } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";

interface PedagogicalDeckCardFrontProps {
  actividad: ActividadFormativa;
  index: number;
  total: number;
  onFlip: () => void;
  onSelect: () => void;
}

export const PedagogicalDeckCardFront: React.FC<PedagogicalDeckCardFrontProps> = ({
  actividad,
  index,
  total,
  onFlip,
  onSelect,
}) => {
  const meta = getDeckCardMeta(actividad);
  const Icon = meta.icon;

  return (
    <div className="w-full h-full bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl border border-[#C7CDD1] select-none">
      {/* Header de la Carta: Momento de Clase, Duración y Número */}
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2.5 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs font-bold tracking-wide uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5"
              style={{
                backgroundColor: meta.badgeBg,
                color: meta.accentColor,
                border: `1px solid ${meta.badgeBorder}`,
              }}
            >
              {meta.faseTag}
            </span>
            <span className="text-xs font-semibold text-[#6B7780] bg-gray-50 px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-gray-200">
              <Clock size={12} />
              {actividad.duracionSugerida}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-[#2D3B45] bg-[#F5F6F8] border border-[#C7CDD1] px-2.5 py-1 rounded-full shadow-2xs">
            {index + 1}/{total}
          </span>
        </div>

        {/* Hero de la Dinámica: Ícono central + Título */}
        <div className="flex items-start gap-3.5 mb-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
            style={{
              backgroundColor: meta.badgeBg,
              color: meta.accentColor,
              border: `1px solid ${meta.badgeBorder}`,
            }}
          >
            <Icon size={22} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#2D3B45] leading-tight">
              {actividad.nombre}
            </h3>
            <span className="text-xs font-medium text-[#6B7780] flex items-center gap-1.5 mt-0.5">
              <Users size={13} />
              {actividad.agrupacion || "Dinámica individual y grupal"}
            </span>
          </div>
        </div>

        {/* Premisa en 1 Frase */}
        <p className="text-sm text-[#2D3B45] leading-relaxed mb-3 italic bg-gray-50 p-3 rounded-lg border-l-4 border-[#B71C1C]">
          &ldquo;{actividad.queHace}&rdquo;
        </p>

        {/* 3 Superpoderes Pedagógicos */}
        <div className="space-y-1.5 mb-3">
          <span className="text-xs font-bold tracking-wider text-[#6B7780] uppercase flex items-center gap-1.5">
            <Zap size={13} className="text-amber-500" /> Superpoderes Pedagógicos
          </span>
          <div className="space-y-1.5">
            {meta.puntosClave.map((punto, i) => (
              <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#2D3B45]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B71C1C] mt-1.5 shrink-0" />
                <span className="leading-snug">{punto}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gatillante: ¿Cuándo conviene usarla? */}
        {actividad.momentoAplicacion && (
          <div className="text-xs text-[#2D3B45] bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-lg flex items-start gap-2">
            <Target size={14} className="text-amber-700 mt-0.5 shrink-0" />
            <div>
              <strong className="text-amber-900 font-semibold">¿Cuándo usarla?: </strong>
              <span>{actividad.momentoAplicacion}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer de Acciones */}
      <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2 mt-2">
        <button
          type="button"
          onClick={onFlip}
          className="text-xs font-semibold text-gray-600 hover:text-[#B71C1C] transition-colors flex items-center gap-1.5 py-1.5 px-2 rounded-md hover:bg-gray-100 cursor-pointer"
        >
          <RotateCw size={12} />
          Ver guión paso a paso
        </button>

        <CanvasButton
          variant="primary-udp"
          size="sm"
          onClick={onSelect}
          icon={<CheckCircle size={13} />}
        >
          Elegir esta Dinámica
        </CanvasButton>
      </div>
    </div>
  );
};
