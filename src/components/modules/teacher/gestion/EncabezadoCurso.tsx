"use client";

import React from "react";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import type { Curso } from "@/types/gestion";

/** Encabezado del curso del Módulo 1 (mismo estilo que los banners de las vistas del docente). */
export const EncabezadoCurso: React.FC<{ curso: Curso; acciones?: React.ReactNode }> = ({ curso, acciones }) => (
  <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <span className="font-mono font-bold text-xs bg-blue-50 text-[#008EE2] px-2.5 py-0.5 rounded border border-blue-200">
          {curso.codigo}
        </span>
        {curso.seccion && <CanvasBadge>Sección {curso.seccion}</CanvasBadge>}
        <span className="text-xs text-[#6B7780] font-medium">{curso.semestre}</span>
        {curso.origen === "pdf" && <CanvasBadge variant="info">Creado desde el programa (PDF)</CanvasBadge>}
      </div>
      <h2 className="text-base sm:text-lg font-bold text-[#2D3B45] truncate">{curso.nombre}</h2>
      {curso.docente_nombre && <p className="text-xs text-[#6B7780] mt-0.5">Docente: {curso.docente_nombre}</p>}
    </div>
    {acciones && <div className="flex items-center gap-2 shrink-0">{acciones}</div>}
  </div>
);
