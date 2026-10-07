"use client";

import React, { useState, useEffect } from "react";
import { StudentExcelRow } from "@/types";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import {
  getHiddenColumns,
  setColumnVisibility,
  OFFICIAL_GRADE_COLUMNS,
  ColumnDefinition,
} from "@/services/gradesVisibilityStore";
import { Eye, EyeOff, MoreVertical, ShieldAlert } from "lucide-react";

interface TeacherGradebookTableViewProps {
  courseCode: string;
  filteredExcelStudents: StudentExcelRow[];
  isEditingExcel: boolean;
  onUpdateGrade: (canvasId: number, field: keyof StudentExcelRow, value: number) => void;
  onNotify?: (msg: string) => void;
}

export const TeacherGradebookTableView: React.FC<TeacherGradebookTableViewProps> = ({
  courseCode,
  filteredExcelStudents,
  isEditingExcel,
  onUpdateGrade,
  onNotify,
}) => {
  const [hiddenCols, setHiddenCols] = useState<Record<string, boolean>>({});
  const [activeMenuCol, setActiveMenuCol] = useState<string | null>(null);

  useEffect(() => {
    setHiddenCols(getHiddenColumns(courseCode));
    const handleSync = (e: any) => {
      if (e.detail?.courseCode === courseCode) {
        setHiddenCols(e.detail.updated);
      }
    };
    window.addEventListener("udp_hidden_columns_updated", handleSync);
    return () => window.removeEventListener("udp_hidden_columns_updated", handleSync);
  }, [courseCode]);

  const toggleVisibility = (colKey: string, label: string) => {
    const isCurrentlyHidden = Boolean(hiddenCols[colKey]);
    const updated = setColumnVisibility(courseCode, colKey, !isCurrentlyHidden);
    setHiddenCols(updated);
    setActiveMenuCol(null);
    const msg = !isCurrentlyHidden
      ? `👁️‍🗨️ Calificaciones de "${label}" ocultadas a los estudiantes (Política de Publicación Canvas).`
      : `✓ Calificaciones de "${label}" publicadas y visibles para los estudiantes.`;
    if (onNotify) onNotify(msg);
  };

  const hiddenCount = Object.values(hiddenCols).filter(Boolean).length;

  return (
    <div className="space-y-2">
      {/* Banner de Calificaciones Ocultas */}
      {hiddenCount > 0 && (
        <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-[4px] text-xs text-amber-900 flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <EyeOff size={15} className="text-amber-700 shrink-0" />
            <span>
              <strong>Política de Calificaciones Canvas:</strong> Hay <strong>{hiddenCount} columna(s)</strong> con notas ocultas para los estudiantes.
            </span>
          </div>
          <span className="text-[10px] font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded">
            Modo Borrador / En Corrección
          </span>
        </div>
      )}

      <div
        className={`overflow-x-auto border rounded-[4px] transition-colors ${
          isEditingExcel ? "border-blue-400 ring-1 ring-blue-300" : "border-gray-300"
        }`}
      >
        <table className="w-full text-left text-xs border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-gray-100 text-gray-700 font-bold border-b border-gray-300 text-[11px] uppercase">
              <th className="p-2.5 border-r border-gray-300 w-48">Estudiante</th>

              {OFFICIAL_GRADE_COLUMNS.map((col) => {
                const isHidden = Boolean(hiddenCols[col.key]);
                const isMenuOpen = activeMenuCol === col.key;

                return (
                  <th
                    key={col.key}
                    className={`p-2 border-r border-gray-300 text-center relative group transition-colors select-none ${
                      isHidden ? "bg-amber-100/60 text-amber-950" : col.key === "solemne_1" ? "bg-blue-50/70" : col.key === "decimas" ? "bg-purple-50/70" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>
                        {col.shortLabel} ({col.weight})
                      </span>

                      {/* Botón de Ocultar / Publicar Calificaciones */}
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuCol(isMenuOpen ? null : col.key);
                          }}
                          className={`p-1 rounded hover:bg-black/10 transition-colors ${
                            isHidden ? "text-amber-800 font-bold" : "text-gray-400 hover:text-gray-700"
                          }`}
                          title={`Gestionar visibilidad: ${col.label}`}
                        >
                          {isHidden ? <EyeOff size={13} className="text-amber-700" /> : <MoreVertical size={13} />}
                        </button>

                        {/* Menú Flotante Canvas Gradebook */}
                        {isMenuOpen && (
                          <div
                            className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-300 rounded-[4px] shadow-xl z-50 text-left normal-case font-normal p-1 text-xs animate-in fade-in"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="px-2 py-1.5 border-b border-gray-100 text-[11px] font-bold text-[#2D3B45]">
                              {col.label}
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleVisibility(col.key, col.label)}
                              className="w-full text-left px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
                            >
                              {isHidden ? (
                                <>
                                  <Eye size={13} className="text-emerald-600" />
                                  <span>Publicar calificaciones</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff size={13} className="text-amber-700" />
                                  <span>Ocultar calificaciones</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {isHidden && (
                      <div className="text-[9px] font-bold text-amber-700 tracking-tight flex items-center justify-center gap-0.5 mt-0.5">
                        <EyeOff size={10} />
                        <span>Oculta a alumnos</span>
                      </div>
                    )}
                  </th>
                );
              })}

              <th className="p-2.5 border-r border-gray-300 text-center">Asist %</th>
              <th className="p-2.5 border-r border-gray-300 text-center font-extrabold bg-yellow-100/60">Nota Final</th>
              <th className="p-2.5 text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredExcelStudents.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-6 text-center text-gray-500 text-xs">
                  No se encontraron estudiantes con el criterio de búsqueda.
                </td>
              </tr>
            ) : (
              filteredExcelStudents.map((row) => (
                <tr key={row.canvas_id} className="border-b border-gray-200 hover:bg-gray-50/80">
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
                    <span className="font-bold text-purple-800 px-2 py-0.5 bg-purple-100 rounded text-[11px]">
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
