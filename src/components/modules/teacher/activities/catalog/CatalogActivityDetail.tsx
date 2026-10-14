import React, { useState } from "react";
import { ActividadFormativa } from "@/types/actividadesFormativas";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  UserCheck,
  GraduationCap,
  Lightbulb,
  Check,
  Zap,
} from "lucide-react";

interface CatalogActivityDetailProps {
  actividad: ActividadFormativa;
  onSelectForCreation?: (id: string) => void;
}

export const CatalogActivityDetail: React.FC<CatalogActivityDetailProps> = ({
  actividad,
  onSelectForCreation,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    pasos: true,
    roles: true,
    ejemplo: false,
    evaluacion: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-4 text-[#2D3B45] overflow-y-auto pr-1">
      {/* Cabecera Principal con Identidad Canvas y Botón de Selección Rápida */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E0E3E6]">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[11px] font-bold text-[#B71C1C] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full uppercase">
              {actividad.faseClase}
            </span>
            <span className="text-[11px] font-semibold text-[#55636E] bg-[#F5F6F8] border border-[#C7CDD1] px-2 py-0.5 rounded-full flex items-center gap-1">
              <Clock size={11} />
              {actividad.duracionSugerida}
            </span>
            <span className="text-[11px] font-semibold text-[#55636E] bg-[#F5F6F8] border border-[#C7CDD1] px-2 py-0.5 rounded-full flex items-center gap-1">
              <Users size={11} />
              {actividad.agrupacion || "Grupal"}
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#2D3B45]">{actividad.nombre}</h3>
        </div>

        {onSelectForCreation && (
          <CanvasButton
            variant="primary-udp"
            size="sm"
            onClick={() => onSelectForCreation(actividad.id)}
            icon={<Check size={14} />}
          >
            Usar esta Dinámica
          </CanvasButton>
        )}
      </div>

      {/* Propósito y Desafío Central */}
      <div className="bg-[#F9FAFB] border-l-3 border-[#B71C1C] p-3 rounded-r-[3px] space-y-1">
        <p className="text-xs italic text-[#55636E]">&ldquo;{actividad.descripcion}&rdquo;</p>
        <p className="text-xs font-semibold text-[#2D3B45]">{actividad.queHace}</p>
      </div>

      {/* ACORDEÓN 1: Paso a Paso en Aula */}
      <div className="border border-[#C7CDD1] rounded-[3px] overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("pasos")}
          className="w-full bg-[#F5F6F8] p-2.5 text-left flex items-center justify-between font-bold text-xs text-[#2D3B45] hover:bg-gray-100 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <PlayCircle size={15} className="text-[#B71C1C]" />
            Paso a Paso en Aula ({actividad.comoFunciona.length} etapas)
          </span>
          {openSections.pasos ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {openSections.pasos && (
          <div className="p-3 bg-white space-y-2 border-t border-[#C7CDD1]">
            {actividad.comoFunciona.map((paso, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                <span className="w-5 h-5 rounded-full bg-red-50 text-[#B71C1C] font-bold text-[10px] flex items-center justify-center shrink-0 border border-red-200 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{paso.replace(/^\d+[\.\)]\s*/, "")}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACORDEÓN 2: Roles de Docente y Estudiante */}
      <div className="border border-[#C7CDD1] rounded-[3px] overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("roles")}
          className="w-full bg-[#F5F6F8] p-2.5 text-left flex items-center justify-between font-bold text-xs text-[#2D3B45] hover:bg-gray-100 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Users size={15} className="text-[#2563EB]" />
            Roles Pedagógicos en Aula
          </span>
          {openSections.roles ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {openSections.roles && (
          <div className="p-3 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-[#C7CDD1]">
            <div className="p-2.5 bg-blue-50/60 rounded border border-blue-200/60">
              <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                <UserCheck size={13} /> Rol del Docente
              </span>
              <p className="text-xs text-blue-950 leading-relaxed">{actividad.rolDocente}</p>
            </div>

            <div className="p-2.5 bg-emerald-50/60 rounded border border-emerald-200/60">
              <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                <GraduationCap size={13} /> Rol del Estudiante
              </span>
              <p className="text-xs text-emerald-950 leading-relaxed">{actividad.rolEstudiante}</p>
            </div>
          </div>
        )}
      </div>

      {/* ACORDEÓN 3: Ejemplo Práctico en Asignatura */}
      {actividad.ejemploPractico && (
        <div className="border border-[#C7CDD1] rounded-[3px] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("ejemplo")}
            className="w-full bg-[#F5F6F8] p-2.5 text-left flex items-center justify-between font-bold text-xs text-[#2D3B45] hover:bg-gray-100 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Lightbulb size={15} className="text-amber-600" />
              Ejemplo Práctico en Asignatura
            </span>
            {openSections.ejemplo ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {openSections.ejemplo && (
            <div className="p-3 bg-white border-t border-[#C7CDD1]">
              <p className="text-xs text-gray-700 italic leading-relaxed bg-amber-50/50 p-2.5 rounded border border-amber-200/50">
                {actividad.ejemploPractico}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ACORDEÓN 4: Ventajas y Evaluación */}
      <div className="border border-[#C7CDD1] rounded-[3px] overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("evaluacion")}
          className="w-full bg-[#F5F6F8] p-2.5 text-left flex items-center justify-between font-bold text-xs text-[#2D3B45] hover:bg-gray-100 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Zap size={15} className="text-purple-600" />
            Ventajas Pedagógicas y Evaluación Sugerida
          </span>
          {openSections.evaluacion ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {openSections.evaluacion && (
          <div className="p-3 bg-white space-y-2 border-t border-[#C7CDD1] text-xs">
            <p className="text-gray-700 leading-relaxed">{actividad.ventajasPedagogicas}</p>
            <div className="flex items-center gap-2 text-[11px] text-[#6B7780] pt-1">
              <span className="font-semibold">Modalidad por defecto:</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-800 font-medium">
                {actividad.modalidadDefecto === "decimas" ? "Bolsa de Décimas (+0.3)" : "Calificación Sumativa"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
