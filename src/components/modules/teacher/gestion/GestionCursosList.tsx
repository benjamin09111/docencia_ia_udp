"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, FileSpreadsheet, Loader2, Plus } from "lucide-react";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasItemGroup, CanvasItemRow } from "@/components/canvas/CanvasItemGroup";
import type { CursoResumen } from "@/types/gestion";
import { listarCursosApi, mensajeDeError } from "@/services/gestion/clienteApi";
import { Aviso } from "./piezasFormulario";

function subtitulo(c: CursoResumen): string {
  const partes = [c.codigo, c.seccion ? `Sección ${c.seccion}` : null, c.semestre];
  partes.push(`${c.total_alumnos} alumno${c.total_alumnos === 1 ? "" : "s"}`);
  partes.push(`${c.total_evaluaciones} evaluaci${c.total_evaluaciones === 1 ? "ón" : "ones"}`);
  return partes.filter(Boolean).join(" · ");
}

/** Lista de cursos del Módulo 1 (Gestión y Calificaciones) del docente. */
export const GestionCursosList: React.FC = () => {
  const router = useRouter();
  const [cursos, setCursos] = useState<CursoResumen[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setError(null);
    try {
      setCursos(await listarCursosApi());
    } catch (e) {
      setError(mensajeDeError(e));
      setCursos([]);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const nuevoCurso = () => router.push("/docente/gestion/nuevo");

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2 py-0.5 bg-[#FFEBEE] text-[#C8102E] text-xs font-bold rounded uppercase tracking-wider">
            Act-IA · Módulo 1
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#2D3B45] mt-1 flex items-center gap-2">
            <ClipboardList size={18} className="text-[#008EE2]" />
            Gestión y calificaciones
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5 max-w-3xl leading-relaxed">
            Crea el curso desde el PDF del programa o a mano, carga a tus alumnos, edita las notas con la nota final
            calculada al instante y exporta el acta oficial en Excel.
          </p>
        </div>
        <CanvasButton variant="primary-udp" size="sm" icon={<Plus size={14} />} onClick={nuevoCurso}>
          Curso
        </CanvasButton>
      </div>

      {error && (
        <Aviso tipo="error">
          {error}{" "}
          <button type="button" className="underline font-semibold cursor-pointer" onClick={() => void cargar()}>
            Reintentar
          </button>
        </Aviso>
      )}

      {cursos === null ? (
        <div className="flex items-center gap-2 text-xs text-[#6B7780] p-6">
          <Loader2 size={16} className="animate-spin text-[#B71C1C]" /> Cargando cursos…
        </div>
      ) : (
        <CanvasItemGroup
          title="Mis cursos con calificaciones"
          countBadge={<CanvasBadge>{cursos.length}</CanvasBadge>}
          onAddClick={nuevoCurso}
        >
          {cursos.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#6B7780]">
              Aún no tienes cursos. Usa <strong>+ Curso</strong> para crear el primero desde el programa en PDF o a mano.
            </div>
          ) : (
            cursos.map((c) => (
              <CanvasItemRow
                key={c.id}
                id={c.id}
                icon={<FileSpreadsheet size={18} />}
                title={c.nombre}
                subtitle={subtitulo(c)}
                isPublished={false}
                rightBadge={c.origen === "pdf" ? <CanvasBadge variant="info">Desde PDF</CanvasBadge> : undefined}
                onClick={() => router.push(`/docente/gestion/${c.id}`)}
              />
            ))
          )}
        </CanvasItemGroup>
      )}
    </div>
  );
};
