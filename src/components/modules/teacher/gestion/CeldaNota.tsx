"use client";

import React, { useEffect, useRef, useState } from "react";
import { leerNotaEscrita } from "@/utils/gestion/validacionNota";

interface Props {
  valor: number | null;
  /** Etiqueta accesible, ej. "Solemne 1 de Ana Pérez". */
  etiqueta: string;
  /** Coordenada "fila:columna" para mover el foco con Enter. */
  coordenada: [number, number];
  esValido: (n: number) => boolean;
  mensajeInvalido: string;
  /** Valor que representa la celda vacía (null para notas, 0 para décimas). */
  vacio: number | null;
  /** Celda cambiada en modo simulación (se resalta). */
  simulada?: boolean;
  onVivo: (valor: number | null) => void;
  onCancelarVivo: () => void;
  onConfirmar: (valor: number | null) => void;
  /** Se llama si el docente sale de la celda con un valor inválido (se mantiene el anterior). */
  onInvalido?: (mensaje: string) => void;
}

const formatear = (v: number | null) => (v === null ? "" : v.toFixed(1));

/** Celda editable estilo planilla: recalcula en vivo, guarda al salir o con Enter, Escape deshace. */
export const CeldaNota: React.FC<Props> = ({
  valor,
  etiqueta,
  coordenada,
  esValido,
  mensajeInvalido,
  vacio,
  simulada,
  onVivo,
  onCancelarVivo,
  onConfirmar,
  onInvalido,
}) => {
  const [texto, setTexto] = useState(formatear(valor));
  const [invalida, setInvalida] = useState(false);
  const enfocada = useRef(false);
  const cancelada = useRef(false);
  // Valor al entrar a la celda. Mientras se escribe, `valor` trae el valor "en vivo"
  // (para recalcular la nota final), así que guardar/deshacer se compara contra este.
  const original = useRef<number | null>(valor);

  // Si el valor cambia desde fuera (guardado, reversión, simulación), refleja el nuevo valor.
  useEffect(() => {
    if (!enfocada.current) setTexto(formatear(valor));
  }, [valor]);

  const interpretar = (t: string): { ok: true; valor: number | null } | { ok: false } => {
    const n = leerNotaEscrita(t);
    if (n === null) return { ok: true, valor: vacio };
    return Number.isNaN(n) || !esValido(n) ? { ok: false } : { ok: true, valor: n };
  };

  const confirmar = () => {
    const r = interpretar(texto);
    if (!r.ok) {
      onInvalido?.(`«${texto.trim()}» no es válido en ${etiqueta}. ${mensajeInvalido} Se mantuvo el valor anterior.`);
      setTexto(formatear(original.current));
      onCancelarVivo();
      setInvalida(false);
      return;
    }
    setTexto(formatear(r.valor));
    if (r.valor !== original.current) onConfirmar(r.valor);
    else onCancelarVivo();
  };

  const moverAbajo = () => {
    const [fila, col] = coordenada;
    document.querySelector<HTMLInputElement>(`[data-celda="${fila + 1}:${col}"]`)?.focus();
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      data-celda={`${coordenada[0]}:${coordenada[1]}`}
      aria-label={etiqueta}
      aria-invalid={invalida}
      title={invalida ? mensajeInvalido : undefined}
      value={texto}
      placeholder="—"
      onFocus={(e) => {
        enfocada.current = true;
        original.current = valor;
        e.target.select();
      }}
      onChange={(e) => {
        setTexto(e.target.value);
        const r = interpretar(e.target.value);
        setInvalida(!r.ok);
        if (r.ok) onVivo(r.valor);
        else onCancelarVivo();
      }}
      onBlur={() => {
        enfocada.current = false;
        if (cancelada.current) {
          cancelada.current = false;
          return;
        }
        confirmar();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          moverAbajo();
          (e.target as HTMLInputElement).blur();
        } else if (e.key === "Escape") {
          cancelada.current = true; // el blur que sigue no debe confirmar lo escrito
          setTexto(formatear(original.current));
          setInvalida(false);
          onCancelarVivo();
          (e.target as HTMLInputElement).blur();
        }
      }}
      className={`w-14 text-center text-xs font-semibold rounded-[3px] border px-1 py-1 transition-colors focus:outline-none focus:ring-1 ${
        invalida
          ? "border-[#C8102E] bg-red-50 text-[#C8102E] focus:ring-[#C8102E]"
          : simulada
            ? "border-amber-400 bg-amber-50 text-amber-900 focus:ring-amber-500"
            : "border-transparent bg-transparent hover:border-[#C7CDD1] focus:border-[#008EE2] focus:bg-white focus:ring-[#008EE2]"
      }`}
    />
  );
};
