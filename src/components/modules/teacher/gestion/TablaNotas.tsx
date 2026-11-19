"use client";

import React from "react";
import { CanvasTable, CanvasTableHeader } from "@/components/canvas/CanvasTable";
import type { Alumno, Evaluacion } from "@/types/gestion";
import type { ResultadoCalculo } from "@/utils/gestion/calcularNotaFinal";
import type { NotasPorAlumno } from "@/utils/gestion/calcularTabla";
import { FilaNotas, type AccionesCeldas, type ReglasCeldas } from "./FilaNotas";

interface Props {
  alumnos: Alumno[];
  evaluaciones: Evaluacion[];
  notas: NotasPorAlumno;
  decimas: Record<string, number>;
  resultados: Record<string, ResultadoCalculo>;
  decimasTope: number | null;
  reglas: ReglasCeldas;
  acciones: AccionesCeldas;
  simNotas: NotasPorAlumno;
  simDecimas: Record<string, number>;
}

/** Grilla editable: filas = alumnos; columnas = evaluaciones, décimas, NP, nota final y estado. */
export const TablaNotas: React.FC<Props> = ({
  alumnos,
  evaluaciones,
  notas,
  decimas,
  resultados,
  decimasTope,
  reglas,
  acciones,
  simNotas,
  simDecimas,
}) => (
  <CanvasTable tableClassName="min-w-max">
    <CanvasTableHeader>
      <tr>
        <th scope="col" className="sticky left-0 z-[2] bg-[#F5F6F8] p-2.5 text-left border-r border-[#E0E3E6]">
          Alumno
        </th>
        {evaluaciones.map((e) => (
          <th key={e.id} scope="col" className="px-2 py-2.5 text-center whitespace-nowrap">
            <div>{e.nombre}</div>
            <div className="font-normal normal-case tracking-normal text-[10.5px]">{e.ponderacion}%</div>
          </th>
        ))}
        {reglas.conDecimas && (
          <th scope="col" className="p-2.5 text-center bg-purple-50/70 whitespace-nowrap">
            <div>Décimas</div>
            <div className="font-normal normal-case tracking-normal text-[10.5px]">máx. {decimasTope?.toFixed(1)}</div>
          </th>
        )}
        {reglas.conExamen && (
          <th scope="col" className="p-2.5 text-center whitespace-nowrap" title="Nota de presentación (antes del examen)">
            NP
          </th>
        )}
        <th scope="col" className="p-2.5 text-center bg-yellow-100/70 w-20">
          Nota final
        </th>
        <th scope="col" className="p-2.5 text-left">
          Estado
        </th>
      </tr>
    </CanvasTableHeader>
    <tbody>
      {alumnos.map((a, i) => (
        <FilaNotas
          key={a.id}
          indice={i}
          alumno={a}
          notas={notas[a.id]}
          decimas={decimas[a.id] ?? 0}
          resultado={resultados[a.id]}
          evaluaciones={evaluaciones}
          reglas={reglas}
          acciones={acciones}
          simNotas={simNotas[a.id]}
          decimasSimuladas={a.id in simDecimas}
        />
      ))}
    </tbody>
  </CanvasTable>
);
