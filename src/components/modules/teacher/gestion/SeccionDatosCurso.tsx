"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import { CanvasInput } from "@/components/canvas/CanvasInput";
import type { CursoFormApi } from "./useCursoForm";
import { TarjetaSeccion } from "./piezasFormulario";

interface Props {
  form: CursoFormApi;
  errores: Record<string, string>;
}

export const SeccionDatosCurso: React.FC<Props> = ({ form, errores }) => {
  const { borrador, actualizar } = form;
  return (
    <TarjetaSeccion
      titulo="Datos del curso"
      descripcion="Identificación del curso tal como aparece en el programa y en el acta de notas."
      icono={<BookOpen size={16} className="text-[#008EE2]" />}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <CanvasInput
            id="curso-nombre"
            label="Nombre del curso"
            required
            value={borrador.nombre}
            maxLength={150}
            placeholder="Ej. Arquitectura de Software"
            error={errores.nombre}
            onChange={(e) => actualizar("nombre", e.target.value)}
          />
        </div>
        <CanvasInput
          id="curso-codigo"
          label="Código"
          required
          value={borrador.codigo}
          maxLength={30}
          placeholder="Ej. CIT3000"
          error={errores.codigo}
          onChange={(e) => actualizar("codigo", e.target.value)}
        />
        <CanvasInput
          id="curso-seccion"
          label="Sección"
          value={borrador.seccion}
          maxLength={20}
          placeholder="Ej. 2"
          error={errores.seccion}
          onChange={(e) => actualizar("seccion", e.target.value)}
        />
        <CanvasInput
          id="curso-semestre"
          label="Semestre"
          required
          value={borrador.semestre}
          maxLength={20}
          placeholder="Ej. 2026-2"
          error={errores.semestre}
          onChange={(e) => actualizar("semestre", e.target.value)}
        />
        <CanvasInput
          id="curso-docente"
          label="Docente"
          value={borrador.docente_nombre}
          maxLength={150}
          placeholder="Nombre del profesor o profesora"
          error={errores.docente_nombre}
          onChange={(e) => actualizar("docente_nombre", e.target.value)}
        />
      </div>
    </TarjetaSeccion>
  );
};
