"use client";

import React from "react";
import { StudentExcelRow } from "@/types";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { EyeOff } from "lucide-react";

interface GradebookStudentRowProps {
  row: StudentExcelRow;
  hiddenCols: Record<string, boolean>;
  isEditingExcel: boolean;
  onUpdateGrade: (canvasId: number, field: keyof StudentExcelRow, value: number) => void;
}

export const GradebookStudentRow: React.FC<GradebookStudentRowProps> = ({
  row,
  hiddenCols,
  isEditingExcel,
  onUpdateGrade,
}) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50/80">
      <td className="p-2.5 font-semibold text-[#2D3B45] border-r border-gray-200">
        {row.nombres} {row.apellidos}
      </td>

      {/* Solemne 1 */}
      <td className={`p-1.5 text-center border-r border-gray-200 ${hiddenCols["solemne_1"] ? "bg-amber-50/40" : "bg-blue-50/30"}`}>
        {isEditingExcel ? (
          <input
            type="number"
            step="0.1"
            min="1.0"
            max="7.0"
            value={row.solemne_1}
            onChange={(e) => onUpdateGrade(row.canvas_id, "solemne_1", parseFloat(e.target.value) || 1.0)}
            className="w-14 text-center p-1 border border-blue-400 bg-white rounded font-bold text-xs focus:ring-1 focus:ring-[#008EE2]"
          />
        ) : (
          <div className="flex items-center justify-center gap-1">
            <span className="font-semibold text-gray-800">{row.solemne_1.toFixed(1)}</span>
            {hiddenCols["solemne_1"] && <span title="Oculta para el alumno"><EyeOff size={11} className="text-amber-600" /></span>}
          </div>
        )}
      </td>

      {/* Décimas */}
      <td className={`p-1.5 text-center border-r border-gray-200 ${hiddenCols["decimas"] ? "bg-amber-50/40" : "bg-purple-50/30"}`}>
        <span className="font-bold text-purple-800 px-2 py-0.5 bg-purple-100 rounded text-xs">
          +{row.decimas_act1.toFixed(1)}
        </span>
        {hiddenCols["decimas"] && <span title="Oculta para el alumno"><EyeOff size={11} className="text-amber-600 inline ml-1" /></span>}
      </td>

      {/* Solemne 2 */}
      <td className={`p-2.5 text-center border-r border-gray-200 ${hiddenCols["solemne_2"] ? "bg-amber-50/40" : ""}`}>
        <span className="font-medium text-gray-800">{row.solemne_2.toFixed(1)}</span>
        {hiddenCols["solemne_2"] && <span title="Oculta para el alumno"><EyeOff size={11} className="text-amber-600 inline ml-1" /></span>}
      </td>

      {/* Avance 1 */}
      <td className={`p-2.5 text-center border-r border-gray-200 ${hiddenCols["avance_1"] ? "bg-amber-50/40" : ""}`}>
        <span className="text-gray-700">6.0</span>
        {hiddenCols["avance_1"] && <span title="Oculta para el alumno"><EyeOff size={11} className="text-amber-600 inline ml-1" /></span>}
      </td>

      {/* Avance 2 */}
      <td className={`p-2.5 text-center border-r border-gray-200 ${hiddenCols["avance_2"] ? "bg-amber-50/40" : ""}`}>
        <span className="text-gray-700">5.8</span>
        {hiddenCols["avance_2"] && <span title="Oculta para el alumno"><EyeOff size={11} className="text-amber-600 inline ml-1" /></span>}
      </td>

      {/* Final */}
      <td className={`p-2.5 text-center border-r border-gray-200 ${hiddenCols["final"] ? "bg-amber-50/40" : ""}`}>
        <span className="font-medium text-gray-800">{row.taller_proyecto.toFixed(1)}</span>
        {hiddenCols["final"] && <span title="Oculta para el alumno"><EyeOff size={11} className="text-amber-600 inline ml-1" /></span>}
      </td>

      <td className="p-2.5 text-center border-r border-gray-200 font-semibold">{row.asistencia_pct}%</td>
      <td className="p-2.5 text-center font-extrabold text-xs bg-yellow-50 border-r border-gray-200">{row.nota_final.toFixed(1)}</td>
      <td className="p-2 text-center">
        <CanvasBadge variant={row.asistencia_pct < 75 ? "danger" : row.nota_final >= 4.0 ? "success" : "danger"}>
          {row.asistencia_pct < 75 ? "RI" : row.nota_final >= 4.0 ? "Aprobado" : "Reprobado"}
        </CanvasBadge>
      </td>
    </tr>
  );
};
