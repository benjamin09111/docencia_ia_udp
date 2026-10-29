"use client";

import React, { useState, useEffect } from "react";
import {
  CronogramaRow,
  INITIAL_CRONOGRAMA_ROWS,
  getStoredCronograma,
  saveStoredCronograma,
} from "@/services/cronogramaService";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { Calendar, Printer, Edit3, Check, RotateCcw } from "lucide-react";
import { CronogramaTableRow } from "./cronograma/CronogramaTableRow";
import { CronogramaFooterSummary } from "./cronograma/CronogramaFooterSummary";

interface CourseCronogramaViewProps {
  courseCode: string;
  courseName: string;
}

export const CourseCronogramaView: React.FC<CourseCronogramaViewProps> = ({
  courseCode,
  courseName,
}) => {
  const [rows, setRows] = useState<CronogramaRow[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<"todas" | "evaluaciones">("todas");

  useEffect(() => {
    setRows(getStoredCronograma(courseCode));
  }, [courseCode]);

  const handleCellChange = (semana: number, field: keyof CronogramaRow, value: string) => {
    setRows((prev) => prev.map((r) => (r.semana === semana ? { ...r, [field]: value } : r)));
  };

  const handleSave = () => {
    saveStoredCronograma(courseCode, rows);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (confirm("¿Deseas restablecer el cronograma oficial del curso a su versión inicial?")) {
      setRows(INITIAL_CRONOGRAMA_ROWS);
      saveStoredCronograma(courseCode, INITIAL_CRONOGRAMA_ROWS);
    }
  };

  const filteredRows = filtroTipo === "evaluaciones"
    ? rows.filter((r) => r.isSpecialRow || (r.evaluacionesIndividuales && r.evaluacionesIndividuales !== "-") || (r.evaluacionesGrupales && r.evaluacionesGrupales !== "-") || (r.laboratorios && r.laboratorios !== "-"))
    : rows;

  return (
    <div className="space-y-4 print:p-0">
      {/* Barra de Acciones y Título */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card print:hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold text-xs bg-blue-50 text-[#008EE2] px-2 py-0.5 rounded border border-blue-200">
                {courseCode}
              </span>
              <span className="text-xs text-gray-500 font-medium">Segundo Semestre 2026</span>
            </div>
            <h2 className="text-base font-bold text-[#2D3B45] flex items-center gap-2">
              <Calendar size={18} className="text-[#008EE2]" />
              Cronograma Oficial y Planificación Semanal
            </h2>
            <p className="text-xs text-[#6B7780] mt-0.5">
              Planificación oficial de cátedras, ayudantías, evaluaciones y recesos institucionales UDP.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex rounded border border-gray-300 overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setFiltroTipo("todas")}
                className={`px-2.5 py-1 cursor-pointer transition-colors ${
                  filtroTipo === "todas" ? "bg-gray-100 font-bold text-gray-900" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Todas las semanas
              </button>
              <button
                type="button"
                onClick={() => setFiltroTipo("evaluaciones")}
                className={`px-2.5 py-1 cursor-pointer transition-colors ${
                  filtroTipo === "evaluaciones" ? "bg-gray-100 font-bold text-gray-900" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Solo Evaluaciones
              </button>
            </div>

            {isEditing ? (
              <CanvasButton
                variant="primary-canvas"
                size="sm"
                icon={<Check size={14} />}
                onClick={handleSave}
              >
                Guardar Cambios
              </CanvasButton>
            ) : (
              <CanvasButton
                variant="outline"
                size="sm"
                icon={<Edit3 size={14} />}
                onClick={() => setIsEditing(true)}
              >
                Modo Edición
              </CanvasButton>
            )}

            <CanvasButton
              variant="outline"
              size="sm"
              icon={<Printer size={14} />}
              onClick={() => window.print()}
              title="Descargar versión para impresión o PDF"
            >
              Descargar PDF
            </CanvasButton>

            {isEditing && (
              <button
                type="button"
                onClick={handleReset}
                title="Restablecer plantilla inicial"
                className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2 print:hidden">
          <Check size={16} className="text-emerald-600" />
          <span>Cronograma actualizado y guardado correctamente.</span>
        </div>
      )}

      {/* Tabla Oficial de Cronograma */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card print:border-none print:shadow-none print:p-0">
        <div className="border border-gray-400 rounded-t-[2px] bg-amber-100/40 p-2.5 mb-0 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-bold text-gray-700">Nombre del Curso: </span>
              <span className="font-semibold text-gray-900">{courseName}</span>
            </div>
            <div>
              <span className="font-bold text-gray-700">Docentes: </span>
              <span className="text-gray-900">Jorge Esteban Cruz León (Titular) / Miguel Carrasco</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border-x border-b border-gray-400">
          <table className="w-full text-left text-xs border-collapse min-w-[980px]">
            <thead>
              <tr className="bg-amber-100/60 text-gray-800 font-bold border-b border-gray-400 text-center uppercase tracking-tight">
                <th className="p-2 border-r border-gray-400 w-12">Semana</th>
                <th className="p-2 border-r border-gray-400 w-24">Fecha</th>
                <th className="p-2 border-r border-gray-400 w-44">Martes (Cátedra 1)</th>
                <th className="p-2 border-r border-gray-400 w-44">Viernes (Cátedra 2)</th>
                <th className="p-2 border-r border-gray-400 w-36">Ayudantía</th>
                <th className="p-2 border-r border-gray-400 w-32">Eval. Individuales</th>
                <th className="p-2 border-r border-gray-400 w-32">Eval. Grupales</th>
                <th className="p-2 border-r border-gray-400 w-28">Laboratorios</th>
                <th className="p-2 w-52 text-left">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r) => (
                <CronogramaTableRow
                  key={r.semana}
                  row={r}
                  isEditing={isEditing}
                  onCellChange={handleCellChange}
                />
              ))}
            </tbody>
          </table>
        </div>

        <CronogramaFooterSummary />
      </div>
    </div>
  );
};
