"use client";

import React from "react";
import { Scale } from "lucide-react";
import { CanvasSelect } from "@/components/canvas/CanvasSelect";
import { ETIQUETAS_NOTAS_FALTANTES } from "@/constants/gestion";
import { MODOS_NOTAS_FALTANTES, type ModoNotasFaltantes } from "@/types/gestion";
import type { CursoFormApi } from "./useCursoForm";
import { CampoNumero, TarjetaSeccion } from "./piezasFormulario";

interface Props {
  form: CursoFormApi;
  errores: Record<string, string>;
}

const OPCIONES_FALTANTES = MODOS_NOTAS_FALTANTES.map((m) => ({ value: m, label: ETIQUETAS_NOTAS_FALTANTES[m] }));

export const SeccionEscalaReglas: React.FC<Props> = ({ form, errores }) => {
  const { borrador, actualizar } = form;
  const tieneExamen = borrador.evaluaciones.some((e) => e.tipo === "examen");

  return (
    <TarjetaSeccion
      titulo="Escala y reglas de cálculo"
      descripcion="El cálculo de la nota final usa estos valores. Los campos opcionales vacíos no se aplican."
      icono={<Scale size={16} className="text-[#008EE2]" />}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <CampoNumero
          id="escala-minima"
          label="Nota mínima"
          requerido
          valor={borrador.nota_minima}
          error={errores.nota_minima}
          onCambio={(v) => actualizar("nota_minima", v)}
        />
        <CampoNumero
          id="escala-maxima"
          label="Nota máxima"
          requerido
          valor={borrador.nota_maxima}
          error={errores.nota_maxima}
          onCambio={(v) => actualizar("nota_maxima", v)}
        />
        <CampoNumero
          id="escala-aprobacion"
          label="Nota de aprobación"
          requerido
          valor={borrador.nota_aprobacion}
          error={errores.nota_aprobacion}
          onCambio={(v) => actualizar("nota_aprobacion", v)}
        />
        <CampoNumero
          id="escala-exigencia"
          label="Exigencia (%)"
          requerido
          step={1}
          valor={borrador.exigencia_pct}
          error={errores.exigencia_pct}
          ayuda="Puntaje para el 4.0"
          onCambio={(v) => actualizar("exigencia_pct", v)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <CampoNumero
          id="regla-eximicion"
          label="Nota de eximición"
          valor={borrador.nota_eximicion}
          error={errores.nota_eximicion}
          ayuda={tieneExamen ? "Con NP ≥ esta nota no rinde examen" : "Solo aplica si hay un examen"}
          onCambio={(v) => actualizar("nota_eximicion", v)}
        />
        <CampoNumero
          id="regla-minima-examen"
          label="Nota mínima para rendir examen"
          valor={borrador.nota_minima_examen}
          error={errores.nota_minima_examen}
          ayuda={tieneExamen ? "Con NP menor, reprueba sin examen" : "Solo aplica si hay un examen"}
          onCambio={(v) => actualizar("nota_minima_examen", v)}
        />
        <CampoNumero
          id="regla-decimas"
          label="Décimas totales disponibles"
          valor={borrador.decimas_totales}
          error={errores.decimas_totales}
          ayuda="En puntos de nota: 0.5 = 5 décimas"
          onCambio={(v) => actualizar("decimas_totales", v)}
        />
        <CampoNumero
          id="regla-asistencia"
          label="Asistencia mínima (%)"
          step={1}
          valor={borrador.asistencia_minima_pct}
          error={errores.asistencia_minima_pct}
          ayuda="Referencia; no cambia el cálculo"
          onCambio={(v) => actualizar("asistencia_minima_pct", v)}
        />
      </div>

      <div className="max-w-xl">
        <CanvasSelect
          id="regla-faltantes"
          label="Notas faltantes"
          value={borrador.notas_faltantes}
          options={OPCIONES_FALTANTES}
          onChange={(e) => actualizar("notas_faltantes", e.target.value as ModoNotasFaltantes)}
        />
      </div>
    </TarjetaSeccion>
  );
};
