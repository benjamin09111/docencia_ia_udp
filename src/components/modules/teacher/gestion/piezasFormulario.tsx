"use client";

import React from "react";
import { CanvasInput } from "@/components/canvas/CanvasInput";

/**
 * Piezas mínimas del formulario del Módulo 1, construidas sobre los componentes
 * canónicos (CanvasInput) y el estilo de tarjeta de las vistas del docente.
 */

interface CampoNumeroProps {
  label: string;
  valor: number | null;
  onCambio: (valor: number | null) => void;
  error?: string;
  ayuda?: string;
  min?: number;
  max?: number;
  step?: number;
  requerido?: boolean;
  placeholder?: string;
  id?: string;
  /** Para campos sin etiqueta visible (ej. dentro de una tabla). */
  ariaLabel?: string;
}

/** Input numérico que admite quedar vacío (null) mientras el docente escribe. */
export const CampoNumero: React.FC<CampoNumeroProps> = ({
  label,
  valor,
  onCambio,
  error,
  ayuda,
  min,
  max,
  step = 0.1,
  requerido,
  placeholder,
  id,
  ariaLabel,
}) => (
  <CanvasInput
    id={id}
    label={label || undefined}
    aria-label={ariaLabel}
    type="number"
    inputMode="decimal"
    value={valor ?? ""}
    min={min}
    max={max}
    step={step}
    required={requerido}
    placeholder={placeholder}
    error={error}
    helperText={ayuda}
    onChange={(e) => {
      const texto = e.target.value.replace(",", ".");
      onCambio(texto === "" ? null : Number(texto));
    }}
  />
);

interface TarjetaSeccionProps {
  titulo: string;
  descripcion?: string;
  icono?: React.ReactNode;
  acciones?: React.ReactNode;
  children: React.ReactNode;
}

/** Tarjeta blanca con título, igual a las secciones de las vistas del docente. */
export const TarjetaSeccion: React.FC<TarjetaSeccionProps> = ({ titulo, descripcion, icono, acciones, children }) => (
  <section className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card space-y-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 border-b border-[#E0E3E6] pb-3">
      <div>
        <h3 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
          {icono}
          {titulo}
        </h3>
        {descripcion && <p className="text-xs text-[#6B7780] mt-0.5 leading-relaxed">{descripcion}</p>}
      </div>
      {acciones && <div className="flex items-center gap-2 shrink-0">{acciones}</div>}
    </div>
    {children}
  </section>
);

/** Mensaje de aviso (error o advertencia) con el estilo de los avisos existentes. */
export const Aviso: React.FC<{ tipo: "error" | "advertencia" | "info" | "exito"; children: React.ReactNode }> = ({
  tipo,
  children,
}) => {
  const estilos = {
    error: "bg-red-50 border-red-200 text-red-900",
    advertencia: "bg-amber-50 border-amber-300 text-amber-900",
    info: "bg-blue-50 border-blue-200 text-blue-900",
    exito: "bg-emerald-50 border-emerald-200 text-emerald-800",
  };
  return (
    <div role={tipo === "error" ? "alert" : "status"} className={`p-3 border rounded-[4px] text-xs leading-relaxed ${estilos[tipo]}`}>
      {children}
    </div>
  );
};
