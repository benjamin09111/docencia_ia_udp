"use client";

import React from "react";
import { FileText, BookOpen } from "lucide-react";
import { getOfficialCourseContents } from "@/constants/courseOfficialContents";
import { CanvasSelect } from "@/components/canvas/CanvasSelect";

interface ActivityBasicInfoFormProps {
  courseCode: string;
  titulo: string;
  setTitulo: (v: string) => void;
  descripcion: string;
  setDescripcion: (v: string) => void;
  contenidoSeleccionado: string;
  setContenidoSeleccionado: (v: string) => void;
  contenidoManual: string;
  setContenidoManual: (v: string) => void;
}

export const ActivityBasicInfoForm: React.FC<ActivityBasicInfoFormProps> = ({
  courseCode,
  titulo,
  setTitulo,
  descripcion,
  setDescripcion,
  contenidoSeleccionado,
  setContenidoSeleccionado,
  contenidoManual,
  setContenidoManual,
}) => {
  const officialContents = getOfficialCourseContents(courseCode);
  return (
    <div className="bg-white border border-[#C7CDD1] rounded-[4px] p-4 sm:p-5 shadow-2xs space-y-4">
      <div className="border-b border-[#E0E3E6] pb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#2D3B45] uppercase tracking-wider flex items-center gap-2">
          <FileText size={15} className="text-[#B71C1C]" />
          1. Enunciado y Datos Generales de la Tarea
        </h3>
        <span className="text-xs text-[#6B7780]">Obligatorio en Canvas</span>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#2D3B45] mb-1">
          Nombre de la Tarea en Canvas <span className="text-[#C8102E]">*</span>
        </label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej: Taller 1: Análisis de Resiliencia y Diagramas de Secuencia"
          className="w-full text-sm text-[#2D3B45] border border-[#C7CDD1] rounded-[3px] px-3 py-2 bg-white focus:outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C] transition-colors"
        />
        <p className="text-xs text-[#6B7780] mt-1">
          Este nombre se mostrará en el Tablero de Canvas, en la vista del Estudiante y en el Libro de Calificaciones.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#2D3B45] mb-1">
          Descripción y Enunciado del Taller
        </label>
        <textarea
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Describe el objetivo del taller, el contexto del problema o la consigna general para los estudiantes..."
          className="w-full text-sm text-[#2D3B45] border border-[#C7CDD1] rounded-[3px] p-3 bg-white focus:outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C] transition-colors"
        />
      </div>

      {/* Eje temático del curso */}
      <div className="bg-[#F5F6F8] p-4 rounded-[4px] border border-[#C7CDD1] space-y-2">
        <label className="text-sm font-bold text-[#2D3B45] flex items-center gap-1.5">
          <BookOpen size={16} className="text-[#B71C1C]" />
          Escoger contenido del curso (opcional)
        </label>
        <p className="text-xs text-[#6B7780]">
          Contenidos indexados desde el programa oficial de esta asignatura.
        </p>

        <CanvasSelect
          value={contenidoSeleccionado}
          onChange={(e) => setContenidoSeleccionado(e.target.value)}
          className="text-sm font-medium"
        >
          <option value="">Sin contenido específico</option>
          {officialContents.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
          <option value="Personalizado (Definir manualmente)">Personalizado (Definir manualmente)</option>
        </CanvasSelect>

        {contenidoSeleccionado.startsWith("Personalizado") && (
          <div className="pt-2">
            <input
              type="text"
              placeholder="Escribe los contenidos o temas específicos a evaluar..."
              value={contenidoManual}
              onChange={(e) => setContenidoManual(e.target.value)}
              className="w-full text-sm text-[#2D3B45] border border-[#C7CDD1] rounded-[3px] px-3 py-2 bg-white focus:outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C]"
            />
          </div>
        )}
      </div>
    </div>
  );
};
