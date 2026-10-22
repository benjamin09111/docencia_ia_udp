"use client";

import React from "react";
import { CronogramaRow } from "@/services/cronogramaService";

interface CronogramaTableRowProps {
  row: CronogramaRow;
  isEditing: boolean;
  onCellChange: (semana: number, field: keyof CronogramaRow, value: string) => void;
}

export const CronogramaTableRow: React.FC<CronogramaTableRowProps> = ({
  row,
  isEditing,
  onCellChange,
}) => {
  if (row.isSpecialRow) {
    const bgClass =
      row.specialType === "receso"
        ? "bg-amber-200/50 text-amber-950 font-bold"
        : row.specialType === "examenes"
        ? "bg-emerald-100/60 text-emerald-950 font-bold"
        : "bg-blue-100/60 text-blue-950 font-bold";

    return (
      <React.Fragment>
        <tr className={`border-b border-gray-400 ${bgClass}`}>
          <td className="p-1.5 text-center font-bold border-r border-gray-400 bg-white">
            {row.semana}
          </td>
          <td className="p-1.5 text-center font-medium border-r border-gray-400 bg-white">
            {row.fechas}
          </td>
          <td colSpan={6} className="p-2 text-center uppercase tracking-wide">
            {row.specialText}
          </td>
          <td className="p-1.5 text-xs text-gray-700 bg-white">
            {row.observaciones}
          </td>
        </tr>
        {row.catedraMartes !== "-" && (
          <tr className="border-b border-gray-300 hover:bg-gray-50/80">
            <td className="p-1.5 text-center text-gray-400 border-r border-gray-300">↳</td>
            <td className="p-1.5 text-center text-gray-500 border-r border-gray-300">
              Detalle
            </td>
            <td className="p-1.5 border-r border-gray-300">
              {isEditing ? (
                <input
                  type="text"
                  value={row.catedraMartes}
                  onChange={(e) => onCellChange(row.semana, "catedraMartes", e.target.value)}
                  className="w-full p-1 border border-blue-300 rounded text-xs"
                />
              ) : (
                row.catedraMartes
              )}
            </td>
            <td className="p-1.5 border-r border-gray-300 font-semibold text-[#008EE2]">
              {isEditing ? (
                <input
                  type="text"
                  value={row.catedraViernes}
                  onChange={(e) => onCellChange(row.semana, "catedraViernes", e.target.value)}
                  className="w-full p-1 border border-blue-300 rounded text-xs"
                />
              ) : (
                row.catedraViernes
              )}
            </td>
            <td className="p-1.5 border-r border-gray-300">{row.ayudantia}</td>
            <td className="p-1.5 text-center font-bold text-rose-700 border-r border-gray-300">
              {row.evaluacionesIndividuales}
            </td>
            <td className="p-1.5 text-center border-r border-gray-300">{row.evaluacionesGrupales}</td>
            <td className="p-1.5 text-center border-r border-gray-300">{row.laboratorios}</td>
            <td className="p-1.5 text-xs text-gray-600">-</td>
          </tr>
        )}
      </React.Fragment>
    );
  }

  return (
    <tr className="border-b border-gray-300 hover:bg-gray-50/70">
      <td className="p-2 text-center font-bold border-r border-gray-300 text-gray-700">
        {row.semana}
      </td>
      <td className="p-2 text-center font-medium border-r border-gray-300 text-gray-800 whitespace-nowrap">
        {row.fechas}
      </td>
      <td className="p-2 border-r border-gray-300 text-gray-800">
        {isEditing ? (
          <input
            type="text"
            value={row.catedraMartes}
            onChange={(e) => onCellChange(row.semana, "catedraMartes", e.target.value)}
            className="w-full p-1 border border-blue-300 rounded text-xs"
          />
        ) : (
          row.catedraMartes
        )}
      </td>
      <td className="p-2 border-r border-gray-300 text-gray-800">
        {isEditing ? (
          <input
            type="text"
            value={row.catedraViernes}
            onChange={(e) => onCellChange(row.semana, "catedraViernes", e.target.value)}
            className="w-full p-1 border border-blue-300 rounded text-xs"
          />
        ) : (
          row.catedraViernes
        )}
      </td>
      <td className="p-2 border-r border-gray-300 text-gray-700">
        {isEditing ? (
          <input
            type="text"
            value={row.ayudantia}
            onChange={(e) => onCellChange(row.semana, "ayudantia", e.target.value)}
            className="w-full p-1 border border-blue-300 rounded text-xs"
          />
        ) : (
          row.ayudantia
        )}
      </td>
      <td className="p-2 text-center border-r border-gray-300 font-semibold text-rose-700">
        {isEditing ? (
          <input
            type="text"
            value={row.evaluacionesIndividuales}
            onChange={(e) => onCellChange(row.semana, "evaluacionesIndividuales", e.target.value)}
            className="w-full p-1 border border-blue-300 rounded text-xs text-center"
          />
        ) : (
          row.evaluacionesIndividuales
        )}
      </td>
      <td className="p-2 text-center border-r border-gray-300 font-semibold text-purple-800">
        {isEditing ? (
          <input
            type="text"
            value={row.evaluacionesGrupales}
            onChange={(e) => onCellChange(row.semana, "evaluacionesGrupales", e.target.value)}
            className="w-full p-1 border border-blue-300 rounded text-xs text-center"
          />
        ) : (
          row.evaluacionesGrupales
        )}
      </td>
      <td className="p-2 text-center border-r border-gray-300 text-emerald-800 font-medium">
        {isEditing ? (
          <input
            type="text"
            value={row.laboratorios}
            onChange={(e) => onCellChange(row.semana, "laboratorios", e.target.value)}
            className="w-full p-1 border border-blue-300 rounded text-xs text-center"
          />
        ) : (
          row.laboratorios
        )}
      </td>
      <td className="p-2 text-xs text-gray-600 leading-tight">
        {isEditing ? (
          <input
            type="text"
            value={row.observaciones}
            onChange={(e) => onCellChange(row.semana, "observaciones", e.target.value)}
            className="w-full p-1 border border-blue-300 rounded text-xs"
          />
        ) : (
          row.observaciones
        )}
      </td>
    </tr>
  );
};
