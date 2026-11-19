"use client";

import React from "react";
import { Plus, ShieldAlert, Trash2 } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasSelect } from "@/components/canvas/CanvasSelect";
import { ETIQUETAS_CRITERIO_RESTRICCION, ETIQUETAS_TIPO_EVALUACION } from "@/constants/gestion";
import { CRITERIOS_RESTRICCION, TIPOS_EVALUACION, type CriterioRestriccion, type TipoEvaluacion } from "@/types/gestion";
import type { CursoFormApi } from "./useCursoForm";
import { CampoNumero, TarjetaSeccion } from "./piezasFormulario";

interface Props {
  form: CursoFormApi;
  errores: Record<string, string>;
}

const OPCIONES_CRITERIO = CRITERIOS_RESTRICCION.map((c) => ({ value: c, label: ETIQUETAS_CRITERIO_RESTRICCION[c] }));
const OPCIONES_TIPO = TIPOS_EVALUACION.map((t) => ({ value: t, label: ETIQUETAS_TIPO_EVALUACION[t].plural }));

export const SeccionRestricciones: React.FC<Props> = ({ form, errores }) => {
  const { borrador, actualizar, actualizarRestriccion, agregarRestriccion, quitarRestriccion } = form;

  return (
    <TarjetaSeccion
      titulo="Restricciones y supuestos"
      descripcion="Una restricción incumplida deja al alumno Reprobado y muestra el motivo; no cambia el número de la nota final."
      icono={<ShieldAlert size={16} className="text-[#008EE2]" />}
    >
      {borrador.restricciones.length === 0 && (
        <p className="text-xs text-[#6B7780]">Sin restricciones. Ejemplo: el promedio de solemnes debe ser al menos 4.0.</p>
      )}

      <ul className="space-y-2">
        {borrador.restricciones.map((r, i) => (
          <li key={r.clave} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_8rem_auto] gap-2 items-start">
            <CanvasSelect
              aria-label={`Criterio de la restricción ${i + 1}`}
              value={r.criterio}
              options={OPCIONES_CRITERIO}
              onChange={(e) => actualizarRestriccion(r.clave, { criterio: e.target.value as CriterioRestriccion })}
            />
            <CanvasSelect
              aria-label={`Tipo de evaluación de la restricción ${i + 1}`}
              value={r.tipo_evaluacion}
              options={OPCIONES_TIPO}
              onChange={(e) => actualizarRestriccion(r.clave, { tipo_evaluacion: e.target.value as TipoEvaluacion })}
            />
            <span className="text-xs text-[#2D3B45] sm:pt-2">debe ser al menos</span>
            <CampoNumero
              label=""
              ariaLabel={`Nota mínima de la restricción ${i + 1}`}
              valor={r.nota_minima}
              error={errores[`restricciones.${i}.nota_minima`]}
              onCambio={(v) => actualizarRestriccion(r.clave, { nota_minima: v })}
            />
            <CanvasButton
              variant="ghost"
              size="sm"
              aria-label={`Quitar restricción ${i + 1}`}
              title="Quitar restricción"
              icon={<Trash2 size={14} className="text-[#C8102E]" />}
              onClick={() => quitarRestriccion(r.clave)}
            />
          </li>
        ))}
      </ul>

      <CanvasButton variant="secondary" size="sm" icon={<Plus size={14} />} onClick={agregarRestriccion}>
        Agregar restricción
      </CanvasButton>

      <div className="space-y-1">
        <label htmlFor="curso-supuestos" className="block text-xs font-bold text-[#2D3B45]">
          Supuestos del programa (uno por línea)
        </label>
        <textarea
          id="curso-supuestos"
          rows={4}
          value={borrador.supuestos.join("\n")}
          placeholder="Ej. La asignatura no contempla eximición."
          onChange={(e) => actualizar("supuestos", e.target.value.split("\n"))}
          className="w-full rounded-[4px] border border-gray-300 bg-white px-3 py-1.5 text-xs text-[#2D3B45] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:border-[#008EE2] focus:ring-[#008EE2]"
        />
        <p className="text-[11px] text-[#6B7780]">Son informativos: quedan guardados con el curso pero no cambian el cálculo.</p>
        {errores.supuestos && <p className="text-[11px] text-[#C8102E] font-medium">{errores.supuestos}</p>}
      </div>
    </TarjetaSeccion>
  );
};
