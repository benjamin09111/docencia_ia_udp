"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PencilLine } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { crearCursoApi, type ResultadoExtraccionApi } from "@/services/gestion/clienteApi";
import { borradorVacio, type CursoBorrador } from "@/utils/gestion/borradorCurso";
import { CursoConfigForm } from "./CursoConfigForm";
import { SubirProgramaPdf } from "./SubirProgramaPdf";
import { Aviso, TarjetaSeccion } from "./piezasFormulario";

const RUTA_LISTA = "/docente?vista=gestion";

interface Formulario {
  /** Cambia en cada carga para reiniciar el formulario. */
  clave: number;
  inicial: CursoBorrador;
  encabezado: React.ReactNode;
}

function encabezadoDeExtraccion(r: ResultadoExtraccionApi, nombreArchivo: string): React.ReactNode {
  if (r.fuente === "vacio") return <Aviso tipo="advertencia">{r.motivo}</Aviso>;
  return (
    <Aviso tipo="info">
      <strong>Datos extraídos por IA desde «{nombreArchivo}».</strong> Revisa y corrige cada campo antes de crear el
      curso: la IA puede equivocarse.
      {r.avisos.length > 0 && (
        <ul className="list-disc pl-5 mt-1.5 space-y-0.5">
          {r.avisos.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      )}
    </Aviso>
  );
}

/** Creación de un curso del Módulo 1: desde el PDF del programa (con IA) o a mano. */
export const NuevoCursoView: React.FC = () => {
  const router = useRouter();
  const [formulario, setFormulario] = useState<Formulario | null>(null);

  const abrirFormulario = (inicial: CursoBorrador, encabezado: React.ReactNode = null) =>
    setFormulario({ clave: Date.now(), inicial, encabezado });

  return (
    <div className="max-w-5xl space-y-4">
      <button
        type="button"
        onClick={() => (formulario ? setFormulario(null) : router.push(RUTA_LISTA))}
        className="text-xs text-[#B71C1C] hover:text-[#8B1010] hover:underline font-semibold cursor-pointer"
      >
        {formulario ? "← Cambiar forma de creación" : "← Volver a mis cursos"}
      </button>
      <div>
        <h2 className="text-base sm:text-lg font-bold text-[#2D3B45]">Nuevo curso</h2>
        <p className="text-xs text-[#6B7780] mt-0.5">
          Nada se guarda hasta que presiones <strong>Crear curso</strong>. Las ponderaciones deben sumar 100%.
        </p>
      </div>

      {!formulario ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <SubirProgramaPdf
            onResultado={(r, nombre) => abrirFormulario(r.borrador, encabezadoDeExtraccion(r, nombre))}
          />
          <TarjetaSeccion
            titulo="Manualmente"
            descripcion="Completa el formulario desde cero: datos del curso, evaluaciones, escala y reglas."
            icono={<PencilLine size={16} className="text-[#008EE2]" />}
          >
            <CanvasButton variant="secondary" onClick={() => abrirFormulario(borradorVacio())}>
              Crear manualmente
            </CanvasButton>
          </TarjetaSeccion>
        </div>
      ) : (
        <CursoConfigForm
          key={formulario.clave}
          inicial={formulario.inicial}
          encabezado={formulario.encabezado}
          textoGuardar="Crear curso"
          onCancelar={() => router.push(RUTA_LISTA)}
          onGuardar={async (input) => {
            const curso = await crearCursoApi(input);
            router.push(`/docente/gestion/${curso.id}`);
          }}
        />
      )}
    </div>
  );
};
