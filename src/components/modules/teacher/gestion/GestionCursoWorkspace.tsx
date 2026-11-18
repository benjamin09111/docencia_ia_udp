"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Settings, Table2, Users } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasCourseNav, type CourseNavItem } from "@/components/canvas/CanvasCourseNav";
import { mensajeDeError, obtenerCursoApi, type CursoDetalle } from "@/services/gestion/clienteApi";
import { EncabezadoCurso } from "./EncabezadoCurso";
import { PanelConfiguracion } from "./PanelConfiguracion";
import { Aviso } from "./piezasFormulario";

export type PestanaCurso = "notas" | "alumnos" | "configuracion";

const PESTANAS: Array<CourseNavItem & { id: PestanaCurso }> = [
  { id: "notas", label: "Notas", icon: <Table2 size={15} /> },
  { id: "alumnos", label: "Alumnos", icon: <Users size={15} /> },
  { id: "configuracion", label: "Configuración", icon: <Settings size={15} /> },
];

const RUTA_LISTA = "/docente?vista=gestion";

/** Espacio de un curso del Módulo 1: menú lateral Canvas + pestaña activa. */
export const GestionCursoWorkspace: React.FC<{ cursoId: string }> = ({ cursoId }) => {
  const router = useRouter();
  const [detalle, setDetalle] = useState<CursoDetalle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pestana, setPestana] = useState<PestanaCurso>("configuracion");

  const cargar = useCallback(async () => {
    try {
      setDetalle(await obtenerCursoApi(cursoId));
      setError(null);
    } catch (e) {
      setError(mensajeDeError(e));
    }
  }, [cursoId]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const contenido = useMemo(() => {
    if (!detalle) return null;
    switch (pestana) {
      case "configuracion":
        return <PanelConfiguracion detalle={detalle} onGuardado={cargar} />;
      default:
        return <Aviso tipo="info">Esta sección se habilita en la siguiente etapa del módulo.</Aviso>;
    }
  }, [detalle, pestana, cargar]);

  if (error && !detalle) {
    return (
      <div className="max-w-xl space-y-3">
        <Aviso tipo="error">{error}</Aviso>
        <CanvasButton variant="outline" size="sm" onClick={() => router.push(RUTA_LISTA)}>
          ← Volver a mis cursos
        </CanvasButton>
      </div>
    );
  }

  if (!detalle) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-3">
        <Loader2 size={24} className="animate-spin text-[#B71C1C]" />
        <span className="text-xs text-[#6B7780] font-semibold">Cargando curso…</span>
      </div>
    );
  }

  const { curso } = detalle;
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start w-full">
      <CanvasCourseNav
        termText={curso.semestre}
        sectionText={curso.seccion ? `SECCIÓN ${curso.seccion}` : undefined}
        items={PESTANAS}
        activeId={pestana}
        onSelect={(id) => setPestana(id as PestanaCurso)}
        backLink={{ label: "Volver a mis cursos", onBack: () => router.push(RUTA_LISTA) }}
      />

      {/* Selector móvil, igual que en el espacio de curso existente */}
      <div className="md:hidden w-full bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-canvas-card flex items-center justify-between gap-2">
        <button type="button" onClick={() => router.push(RUTA_LISTA)} className="text-xs text-[#B71C1C] hover:underline font-bold">
          ← Cursos
        </button>
        <select
          value={pestana}
          aria-label="Seleccionar sección del curso"
          onChange={(e) => setPestana(e.target.value as PestanaCurso)}
          className="border border-gray-300 rounded px-2 py-1 text-xs bg-white text-[#2D3B45] font-semibold flex-1"
        >
          {PESTANAS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-0 w-full">
        <EncabezadoCurso curso={curso} />
        {error && <Aviso tipo="error">{error}</Aviso>}
        {contenido}
      </div>
    </div>
  );
};
