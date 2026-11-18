"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { crearCursoApi } from "@/services/gestion/clienteApi";
import { borradorVacio } from "@/utils/gestion/borradorCurso";
import { CursoConfigForm } from "./CursoConfigForm";

const RUTA_LISTA = "/docente?vista=gestion";

/** Creación de un curso del Módulo 1. Nada se guarda hasta presionar "Crear curso". */
export const NuevoCursoView: React.FC = () => {
  const router = useRouter();
  const inicial = useMemo(() => borradorVacio(), []);

  return (
    <div className="max-w-5xl space-y-4">
      <button
        type="button"
        onClick={() => router.push(RUTA_LISTA)}
        className="text-xs text-[#B71C1C] hover:text-[#8B1010] hover:underline font-semibold cursor-pointer"
      >
        ← Volver a mis cursos
      </button>
      <div>
        <h2 className="text-base sm:text-lg font-bold text-[#2D3B45]">Nuevo curso</h2>
        <p className="text-xs text-[#6B7780] mt-0.5">
          Completa los datos del programa. Revisa que las ponderaciones sumen 100% antes de crear el curso.
        </p>
      </div>

      <CursoConfigForm
        inicial={inicial}
        textoGuardar="Crear curso"
        onCancelar={() => router.push(RUTA_LISTA)}
        onGuardar={async (input) => {
          const curso = await crearCursoApi(input);
          router.push(`/docente/gestion/${curso.id}`);
        }}
      />
    </div>
  );
};
