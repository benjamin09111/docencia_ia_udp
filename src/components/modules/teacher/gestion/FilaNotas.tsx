"use client";

import React from "react";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import type { Alumno, Evaluacion } from "@/types/gestion";
import type { EstadoAlumno, ResultadoCalculo } from "@/utils/gestion/calcularNotaFinal";
import { formatearNota } from "@/utils/gestion/redondeo";
import { CeldaNota } from "./CeldaNota";
import type { Vivo } from "./useTablaNotas";

export interface ReglasCeldas {
  esNotaValida: (n: number) => boolean;
  mensajeNota: string;
  esDecimaValida: (n: number) => boolean;
  mensajeDecimas: string;
  conDecimas: boolean;
  conExamen: boolean;
}

export interface AccionesCeldas {
  previsualizar: (vivo: Vivo | null) => void;
  confirmarNota: (alumnoId: string, evaluacionId: string, valor: number | null) => void;
  confirmarDecimas: (alumnoId: string, valor: number) => void;
  avisarInvalido: (mensaje: string) => void;
}

interface Props {
  indice: number;
  alumno: Alumno;
  notas: Record<string, number | null> | undefined;
  decimas: number;
  resultado: ResultadoCalculo;
  evaluaciones: Evaluacion[];
  reglas: ReglasCeldas;
  acciones: AccionesCeldas;
  simNotas: Record<string, number | null> | undefined;
  decimasSimuladas: boolean;
}

const VARIANTE: Record<EstadoAlumno, "success" | "danger" | "warning"> = {
  Aprobado: "success",
  Reprobado: "danger",
  Pendiente: "warning",
};

const COLOR_NF: Record<EstadoAlumno, string> = {
  Aprobado: "text-[#2E7D32]",
  Reprobado: "text-[#C62828]",
  Pendiente: "text-[#6B7780]",
};

/** Fila de un alumno. Memoizada: solo se vuelve a dibujar si cambian sus notas o su resultado. */
export const FilaNotas: React.FC<Props> = React.memo(
  ({ indice, alumno, notas, decimas, resultado, evaluaciones, reglas, acciones, simNotas, decimasSimuladas }) => {
    const nombre = `${alumno.nombres} ${alumno.apellidos}`;
    return (
      <tr className="border-b border-[#E0E3E6] last:border-b-0 hover:bg-[#F9FAFB]">
        <th
          scope="row"
          className="sticky left-0 z-[1] bg-white p-2.5 text-left font-normal border-r border-[#E0E3E6]"
        >
          {/* El ancho máximo va en el texto: las celdas de tabla ignoran max-width. */}
          <div
            className="text-xs font-semibold text-[#2D3B45] truncate max-w-[130px] sm:max-w-[170px]"
            title={`${alumno.apellidos}, ${alumno.nombres}`}
          >
            {alumno.apellidos}, {alumno.nombres}
          </div>
          <div className="text-[11px] text-[#6B7780] font-mono">{alumno.rut}</div>
        </th>

        {evaluaciones.map((e, col) => (
          <td key={e.id} className="px-1 py-1.5 text-center">
            <CeldaNota
              valor={notas?.[e.id] ?? null}
              etiqueta={`${e.nombre} de ${nombre}`}
              coordenada={[indice, col]}
              esValido={reglas.esNotaValida}
              mensajeInvalido={reglas.mensajeNota}
              vacio={null}
              simulada={simNotas !== undefined && e.id in simNotas}
              onVivo={(valor) => acciones.previsualizar({ tipo: "nota", alumnoId: alumno.id, evaluacionId: e.id, valor })}
              onCancelarVivo={() => acciones.previsualizar(null)}
              onConfirmar={(valor) => acciones.confirmarNota(alumno.id, e.id, valor)}
              onInvalido={acciones.avisarInvalido}
            />
          </td>
        ))}

        {reglas.conDecimas && (
          <td className="p-1.5 text-center bg-purple-50/40">
            <CeldaNota
              valor={decimas}
              etiqueta={`Décimas de ${nombre}`}
              coordenada={[indice, evaluaciones.length]}
              esValido={reglas.esDecimaValida}
              mensajeInvalido={reglas.mensajeDecimas}
              vacio={0}
              simulada={decimasSimuladas}
              onVivo={(valor) => acciones.previsualizar({ tipo: "decimas", alumnoId: alumno.id, valor: valor ?? 0 })}
              onCancelarVivo={() => acciones.previsualizar(null)}
              onConfirmar={(valor) => acciones.confirmarDecimas(alumno.id, valor ?? 0)}
              onInvalido={acciones.avisarInvalido}
            />
          </td>
        )}

        {reglas.conExamen && (
          <td className="p-2.5 text-center text-xs font-semibold text-[#2D3B45]">
            {formatearNota(resultado.nota_presentacion)}
            {resultado.eximido && <div className="text-[10px] font-normal text-[#2E7D32]">Eximido</div>}
          </td>
        )}

        <td
          className={`p-2.5 text-center text-sm font-extrabold bg-yellow-50/70 ${COLOR_NF[resultado.estado]}`}
          title={resultado.decimas_aplicadas > 0 ? `Incluye +${resultado.decimas_aplicadas.toFixed(1)} de décimas` : undefined}
        >
          {resultado.nota_final === null ? "Pendiente" : formatearNota(resultado.nota_final)}
        </td>

        <td className="p-2 min-w-[124px]" title={resultado.motivos.join(" ")}>
          <CanvasBadge variant={VARIANTE[resultado.estado]}>{resultado.estado}</CanvasBadge>
          {/* max-w hace que el motivo se parta en líneas aunque la tabla use min-w-max */}
          {resultado.motivos[0] && (
            <p className="text-[10.5px] text-[#6B7780] mt-1 max-w-[124px] whitespace-normal line-clamp-2">{resultado.motivos[0]}</p>
          )}
        </td>
      </tr>
    );
  }
);

FilaNotas.displayName = "FilaNotas";
