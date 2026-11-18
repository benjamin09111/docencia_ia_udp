"use client";

import React from "react";
import { ListChecks, Plus, Trash2 } from "lucide-react";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasInput } from "@/components/canvas/CanvasInput";
import { CanvasSelect } from "@/components/canvas/CanvasSelect";
import { CanvasTable, CanvasTableCell, CanvasTableHeader, CanvasTableRow } from "@/components/canvas/CanvasTable";
import { ETIQUETAS_TIPO_EVALUACION } from "@/constants/gestion";
import { TIPOS_EVALUACION, type TipoEvaluacion } from "@/types/gestion";
import type { CursoFormApi } from "./useCursoForm";
import { Aviso, CampoNumero, TarjetaSeccion } from "./piezasFormulario";

interface Props {
  form: CursoFormApi;
  errores: Record<string, string>;
  /** Notas guardadas por evaluación (solo al editar), para advertir antes de borrar. */
  notasPorEvaluacion?: Record<string, number>;
}

const OPCIONES_TIPO = TIPOS_EVALUACION.map((t) => ({ value: t, label: ETIQUETAS_TIPO_EVALUACION[t].singular }));

export const SeccionEvaluaciones: React.FC<Props> = ({ form, errores, notasPorEvaluacion = {} }) => {
  const { borrador, ponderaciones, actualizarEvaluacion, agregarEvaluacion, quitarEvaluacion } = form;

  return (
    <TarjetaSeccion
      titulo="Evaluaciones y ponderaciones"
      descripcion="Cada evaluación es una columna de la tabla de notas. Las ponderaciones son sobre la nota final e incluyen el examen; deben sumar 100%."
      icono={<ListChecks size={16} className="text-[#008EE2]" />}
      acciones={
        <CanvasBadge variant={ponderaciones.ok ? "success" : "danger"} size="md">
          Total: {ponderaciones.suma}%
        </CanvasBadge>
      }
    >
      <CanvasTable tableClassName="min-w-[560px]">
        <CanvasTableHeader>
          <tr>
            <th className="p-3">Evaluación</th>
            <th className="p-3 w-44">Tipo</th>
            <th className="p-3 w-44 whitespace-nowrap">Ponderación (%)</th>
            <th className="p-3 w-12">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </CanvasTableHeader>
        <tbody>
          {borrador.evaluaciones.map((e, i) => {
            const notas = e.id ? notasPorEvaluacion[e.id] ?? 0 : 0;
            return (
              <CanvasTableRow key={e.clave} hoverable={false}>
                <CanvasTableCell className="align-top">
                  <CanvasInput
                    aria-label={`Nombre de la evaluación ${i + 1}`}
                    value={e.nombre}
                    maxLength={80}
                    placeholder="Ej. Solemne 1"
                    error={errores[`evaluaciones.${i}.nombre`]}
                    helperText={notas > 0 ? `${notas} nota(s) registradas` : undefined}
                    onChange={(ev) => actualizarEvaluacion(e.clave, { nombre: ev.target.value })}
                  />
                </CanvasTableCell>
                <CanvasTableCell className="align-top">
                  <CanvasSelect
                    aria-label={`Tipo de la evaluación ${i + 1}`}
                    value={e.tipo}
                    options={OPCIONES_TIPO}
                    onChange={(ev) => actualizarEvaluacion(e.clave, { tipo: ev.target.value as TipoEvaluacion })}
                  />
                </CanvasTableCell>
                <CanvasTableCell className="align-top">
                  <CampoNumero
                    label=""
                    ariaLabel={`Ponderación de la evaluación ${i + 1}`}
                    id={`evaluacion-ponderacion-${e.clave}`}
                    valor={e.ponderacion}
                    step={0.01}
                    min={0}
                    max={100}
                    placeholder="%"
                    error={errores[`evaluaciones.${i}.ponderacion`]}
                    onCambio={(v) => actualizarEvaluacion(e.clave, { ponderacion: v })}
                  />
                </CanvasTableCell>
                <CanvasTableCell className="align-top text-center">
                  <CanvasButton
                    variant="ghost"
                    size="sm"
                    aria-label={`Quitar ${e.nombre || "evaluación"}`}
                    title="Quitar evaluación"
                    icon={<Trash2 size={14} className="text-[#C8102E]" />}
                    disabled={borrador.evaluaciones.length <= 1}
                    onClick={() => quitarEvaluacion(e.clave)}
                  />
                </CanvasTableCell>
              </CanvasTableRow>
            );
          })}
        </tbody>
      </CanvasTable>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <CanvasButton variant="secondary" size="sm" icon={<Plus size={14} />} onClick={agregarEvaluacion}>
          Agregar evaluación
        </CanvasButton>
        {!ponderaciones.ok && (
          <Aviso tipo="advertencia">
            Las ponderaciones suman <strong>{ponderaciones.suma}%</strong>. Deben sumar exactamente 100% para poder guardar.
          </Aviso>
        )}
      </div>
      {errores.evaluaciones && ponderaciones.ok && <Aviso tipo="error">{errores.evaluaciones}</Aviso>}
    </TarjetaSeccion>
  );
};
