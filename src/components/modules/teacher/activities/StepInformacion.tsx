"use client";

import React from "react";
import { FileText, BookOpen, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasInput } from "@/components/canvas/CanvasInput";
import { CONTENIDOS_OFICIALES } from "@/constants/metodologiasDocentes";

interface StepInformacionProps {
  titulo: string;
  setTitulo: (v: string) => void;
  descripcion: string;
  setDescripcion: (v: string) => void;
  contenidoSeleccionado: string;
  setContenidoSeleccionado: (v: string) => void;
  contenidoManual: string;
  setContenidoManual: (v: string) => void;
  fecha: string;
  setFecha: (v: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const StepInformacion: React.FC<StepInformacionProps> = ({
  titulo,
  setTitulo,
  descripcion,
  setDescripcion,
  contenidoSeleccionado,
  setContenidoSeleccionado,
  contenidoManual,
  setContenidoManual,
  fecha,
  setFecha,
  onPrev,
  onNext,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
          <FileText size={16} className="text-[#008EE2]" />
          Paso 2: Información General y Contenidos a Evaluar
        </h2>
        <p className="text-xs text-[#6B7780] mt-0.5">
          Define el título, enunciado general y selecciona la temática oficial del programa a evaluar en este taller.
        </p>
      </div>

      <CanvasInput
        label="Título del Taller / Dinámica"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <div className="space-y-1">
        <label className="text-xs font-bold text-[#2D3B45]">Descripción del Taller</label>
        <textarea
          rows={2}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full text-xs border border-gray-300 rounded-[4px] p-2 focus:ring-1 focus:ring-[#008EE2]"
        />
      </div>

      <div className="space-y-2 bg-[#F9FAFB] p-3.5 rounded-[4px] border border-gray-200">
        <label className="text-xs font-bold text-[#2D3B45] flex items-center gap-1.5">
          <BookOpen size={14} className="text-[#008EE2]" />
          Contenidos del Curso Evaluados en la Actividad
        </label>
        <p className="text-[11px] text-[#6B7780]">
          Selecciona la unidad temática oficial del descriptor o escribe un contenido específico.
        </p>

        <select
          value={contenidoSeleccionado}
          onChange={(e) => setContenidoSeleccionado(e.target.value)}
          className="w-full text-xs border border-gray-300 rounded-[4px] p-2 bg-white font-medium text-[#2D3B45]"
        >
          {CONTENIDOS_OFICIALES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {contenidoSeleccionado.startsWith("Personalizado") && (
          <div className="pt-1">
            <CanvasInput
              placeholder="Escribe los contenidos o temas específicos a evaluar..."
              value={contenidoManual}
              onChange={(e) => setContenidoManual(e.target.value)}
            />
          </div>
        )}
      </div>

      <CanvasInput
        label="Fecha Límite de Entrega"
        type="date"
        icon={<Calendar size={13} className="text-[#008EE2]" />}
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      <div className="pt-3 border-t flex justify-between">
        <CanvasButton variant="outline" size="sm" onClick={onPrev} icon={<ChevronLeft size={14} />}>
          Volver a Tipo
        </CanvasButton>
        <CanvasButton variant="primary-udp" size="sm" onClick={onNext} icon={<ChevronRight size={14} />}>
          Continuar a Instrucciones
        </CanvasButton>
      </div>
    </div>
  );
};
