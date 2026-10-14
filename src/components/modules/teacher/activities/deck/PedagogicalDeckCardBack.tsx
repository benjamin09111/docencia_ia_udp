import React from "react";
import { ActividadFormativa } from "@/types/actividadesFormativas";
import { getDeckCardMeta } from "./deckTypes";
import { RotateCcw, CheckCircle, BookOpen, UserCheck, GraduationCap } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";

interface PedagogicalDeckCardBackProps {
  actividad: ActividadFormativa;
  index: number;
  total: number;
  onFlip: () => void;
  onSelect: () => void;
}

export const PedagogicalDeckCardBack: React.FC<PedagogicalDeckCardBackProps> = ({
  actividad,
  index,
  total,
  onFlip,
  onSelect,
}) => {
  const meta = getDeckCardMeta(actividad);

  return (
    <div className="w-full h-full bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl border border-[#C7CDD1] select-none overflow-y-auto">
      <div>
        {/* Header reverso */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-[#B71C1C] uppercase block">
                Guión Operativo de Aula
              </span>
              <span className="text-xs font-mono font-bold text-[#2D3B45] bg-[#F5F6F8] border border-[#C7CDD1] px-2.5 py-0.5 rounded-full">
                {index + 1}/{total}
              </span>
            </div>
            <h4 className="text-lg font-bold text-[#2D3B45] leading-snug mt-1">
              {actividad.nombre}
            </h4>
          </div>
          <button
            type="button"
            onClick={onFlip}
            className="text-xs font-semibold text-gray-500 hover:text-[#B71C1C] flex items-center gap-1.5 py-1 px-2.5 rounded hover:bg-gray-100 cursor-pointer"
          >
            <RotateCcw size={13} />
            Volver
          </button>
        </div>

        {/* Pasos de ejecución */}
        <div className="space-y-2 mb-4">
          <span className="text-xs font-bold tracking-wider text-[#6B7780] uppercase flex items-center gap-1.5">
            <BookOpen size={13} className="text-[#B71C1C]" /> Paso a Paso en Clases
          </span>
          <div className="space-y-2">
            {actividad.comoFunciona.slice(0, 4).map((paso, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#2D3B45] bg-gray-50/80 p-2.5 rounded-lg">
                <span className="w-5 h-5 rounded-full bg-red-50 text-[#B71C1C] font-bold text-xs flex items-center justify-center shrink-0 border border-red-100">
                  {idx + 1}
                </span>
                <span className="leading-snug">{paso.replace(/^\d+[\.\)]\s*/, "")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Roles Docente vs Estudiante */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5 mb-1">
              <UserCheck size={13} /> Rol del Docente
            </span>
            <p className="text-xs sm:text-sm text-blue-950 leading-snug">
              {actividad.rolDocente || "Facilitador y guía socrático."}
            </p>
          </div>

          <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
              <GraduationCap size={13} /> Rol del Estudiante
            </span>
            <p className="text-xs sm:text-sm text-emerald-950 leading-snug">
              {actividad.rolEstudiante || "Participación activa y co-construcción."}
            </p>
          </div>
        </div>

        {/* Ejemplo Práctico */}
        {actividad.ejemploPractico && (
          <div className="text-xs sm:text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <strong className="text-gray-900 block font-semibold mb-1">Ejemplo en Asignatura:</strong>
            <p className="italic leading-snug line-clamp-3">{actividad.ejemploPractico}</p>
          </div>
        )}
      </div>

      {/* Footer reverso */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3 mt-3">
        <button
          type="button"
          onClick={onFlip}
          className="text-xs font-semibold text-gray-600 hover:text-[#B71C1C] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw size={13} />
          Frente de la carta
        </button>

        <CanvasButton
          variant="primary-udp"
          size="sm"
          onClick={onSelect}
          icon={<CheckCircle size={14} />}
        >
          Elegir esta Dinámica
        </CanvasButton>
      </div>
    </div>
  );
};
