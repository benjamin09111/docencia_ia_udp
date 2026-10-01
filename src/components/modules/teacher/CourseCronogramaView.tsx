"use client";

import React, { useState, useEffect } from "react";
import {
  CronogramaRow,
  INITIAL_CRONOGRAMA_ROWS,
  getStoredCronograma,
  saveStoredCronograma,
} from "@/services/cronogramaService";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  Calendar,
  Printer,
  Edit3,
  Check,
  RotateCcw,
  Sparkles,
  Download,
  AlertCircle,
  FileText,
  Clock,
} from "lucide-react";

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
    setRows((prev) =>
      prev.map((r) => (r.semana === semana ? { ...r, [field]: value } : r))
    );
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

  const handlePrint = () => {
    window.print();
  };

  const filteredRows = filtroTipo === "evaluaciones"
    ? rows.filter(
        (r) =>
          r.isSpecialRow ||
          (r.evaluacionesIndividuales && r.evaluacionesIndividuales !== "-") ||
          (r.evaluacionesGrupales && r.evaluacionesGrupales !== "-") ||
          (r.laboratorios && r.laboratorios !== "-")
      )
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
                className={`px-2.5 py-1 ${
                  filtroTipo === "todas" ? "bg-gray-100 font-bold text-gray-900" : "bg-white text-gray-600"
                }`}
              >
                Todas las semanas
              </button>
              <button
                type="button"
                onClick={() => setFiltroTipo("evaluaciones")}
                className={`px-2.5 py-1 ${
                  filtroTipo === "evaluaciones" ? "bg-gray-100 font-bold text-gray-900" : "bg-white text-gray-600"
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
              onClick={handlePrint}
              title="Descargar versión para impresión o PDF"
            >
              Descargar PDF
            </CanvasButton>

            {isEditing && (
              <button
                type="button"
                onClick={handleReset}
                title="Restablecer plantilla inicial"
                className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
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

      {/* Tabla Oficial de Cronograma (Clon exacto de cronograma.pdf) */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card print:border-none print:shadow-none print:p-0">
        {/* Cabecera institucional idéntica a cronograma.pdf */}
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
          <table className="w-full text-left text-[11px] border-collapse min-w-[980px]">
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
              {filteredRows.map((r) => {
                // Filas especiales destacadas con banner horizontal (Receso, Solemne 1, Solemne 2, Exámenes)
                if (r.isSpecialRow) {
                  const bgClass =
                    r.specialType === "receso"
                      ? "bg-amber-200/50 text-amber-950 font-bold"
                      : r.specialType === "examenes"
                      ? "bg-emerald-100/60 text-emerald-950 font-bold"
                      : "bg-blue-100/60 text-blue-950 font-bold";

                  return (
                    <React.Fragment key={`special_${r.semana}`}>
                      <tr className={`border-b border-gray-400 ${bgClass}`}>
                        <td className="p-1.5 text-center font-bold border-r border-gray-400 bg-white">
                          {r.semana}
                        </td>
                        <td className="p-1.5 text-center font-medium border-r border-gray-400 bg-white">
                          {r.fechas}
                        </td>
                        <td colSpan={6} className="p-2 text-center uppercase tracking-wide">
                          {r.specialText}
                        </td>
                        <td className="p-1.5 text-[10px] text-gray-700 bg-white">
                          {r.observaciones}
                        </td>
                      </tr>
                      {/* Si la semana además tiene detalle de clases (ej. semana 7 solemne) */}
                      {r.catedraMartes !== "-" && (
                        <tr className="border-b border-gray-300 hover:bg-gray-50/80">
                          <td className="p-1.5 text-center text-gray-400 border-r border-gray-300">↳</td>
                          <td className="p-1.5 text-center text-gray-500 border-r border-gray-300">
                            Detalle
                          </td>
                          <td className="p-1.5 border-r border-gray-300">
                            {isEditing ? (
                              <input
                                type="text"
                                value={r.catedraMartes}
                                onChange={(e) => handleCellChange(r.semana, "catedraMartes", e.target.value)}
                                className="w-full p-1 border border-blue-300 rounded text-[11px]"
                              />
                            ) : (
                              r.catedraMartes
                            )}
                          </td>
                          <td className="p-1.5 border-r border-gray-300 font-semibold text-[#008EE2]">
                            {isEditing ? (
                              <input
                                type="text"
                                value={r.catedraViernes}
                                onChange={(e) => handleCellChange(r.semana, "catedraViernes", e.target.value)}
                                className="w-full p-1 border border-blue-300 rounded text-[11px]"
                              />
                            ) : (
                              r.catedraViernes
                            )}
                          </td>
                          <td className="p-1.5 border-r border-gray-300">{r.ayudantia}</td>
                          <td className="p-1.5 text-center font-bold text-rose-700 border-r border-gray-300">
                            {r.evaluacionesIndividuales}
                          </td>
                          <td className="p-1.5 text-center border-r border-gray-300">{r.evaluacionesGrupales}</td>
                          <td className="p-1.5 text-center border-r border-gray-300">{r.laboratorios}</td>
                          <td className="p-1.5 text-[10px] text-gray-600">-</td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                }

                // Fila normal
                return (
                  <tr key={r.semana} className="border-b border-gray-300 hover:bg-gray-50/70">
                    <td className="p-2 text-center font-bold border-r border-gray-300 text-gray-700">
                      {r.semana}
                    </td>
                    <td className="p-2 text-center font-medium border-r border-gray-300 text-gray-800 whitespace-nowrap">
                      {r.fechas}
                    </td>
                    <td className="p-2 border-r border-gray-300 text-gray-800">
                      {isEditing ? (
                        <input
                          type="text"
                          value={r.catedraMartes}
                          onChange={(e) => handleCellChange(r.semana, "catedraMartes", e.target.value)}
                          className="w-full p-1 border border-blue-300 rounded text-[11px]"
                        />
                      ) : (
                        r.catedraMartes
                      )}
                    </td>
                    <td className="p-2 border-r border-gray-300 text-gray-800">
                      {isEditing ? (
                        <input
                          type="text"
                          value={r.catedraViernes}
                          onChange={(e) => handleCellChange(r.semana, "catedraViernes", e.target.value)}
                          className="w-full p-1 border border-blue-300 rounded text-[11px]"
                        />
                      ) : (
                        r.catedraViernes
                      )}
                    </td>
                    <td className="p-2 border-r border-gray-300 text-gray-700">
                      {isEditing ? (
                        <input
                          type="text"
                          value={r.ayudantia}
                          onChange={(e) => handleCellChange(r.semana, "ayudantia", e.target.value)}
                          className="w-full p-1 border border-blue-300 rounded text-[11px]"
                        />
                      ) : (
                        r.ayudantia
                      )}
                    </td>
                    <td className="p-2 text-center border-r border-gray-300 font-semibold text-rose-700">
                      {isEditing ? (
                        <input
                          type="text"
                          value={r.evaluacionesIndividuales}
                          onChange={(e) =>
                            handleCellChange(r.semana, "evaluacionesIndividuales", e.target.value)
                          }
                          className="w-full p-1 border border-blue-300 rounded text-[11px] text-center"
                        />
                      ) : (
                        r.evaluacionesIndividuales
                      )}
                    </td>
                    <td className="p-2 text-center border-r border-gray-300 font-semibold text-purple-800">
                      {isEditing ? (
                        <input
                          type="text"
                          value={r.evaluacionesGrupales}
                          onChange={(e) => handleCellChange(r.semana, "evaluacionesGrupales", e.target.value)}
                          className="w-full p-1 border border-blue-300 rounded text-[11px] text-center"
                        />
                      ) : (
                        r.evaluacionesGrupales
                      )}
                    </td>
                    <td className="p-2 text-center border-r border-gray-300 text-emerald-800 font-medium">
                      {isEditing ? (
                        <input
                          type="text"
                          value={r.laboratorios}
                          onChange={(e) => handleCellChange(r.semana, "laboratorios", e.target.value)}
                          className="w-full p-1 border border-blue-300 rounded text-[11px] text-center"
                        />
                      ) : (
                        r.laboratorios
                      )}
                    </td>
                    <td className="p-2 text-[10px] text-gray-600 leading-tight">
                      {isEditing ? (
                        <input
                          type="text"
                          value={r.observaciones}
                          onChange={(e) => handleCellChange(r.semana, "observaciones", e.target.value)}
                          className="w-full p-1 border border-blue-300 rounded text-[10px]"
                        />
                      ) : (
                        r.observaciones
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Resumen inferior idéntico a cronograma.pdf */}
        <div className="mt-3 p-3 bg-amber-50/70 border border-gray-400 rounded text-xs text-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-amber-200 pb-2 mb-2">
            <span className="font-mono font-bold text-[11px] text-amber-900">
              Versión 1.2 (Planificación oficial aprobada por Dirección de Escuela)
            </span>
            <span className="text-[11px] text-gray-600 italic">
              La siguiente planificación de solemnes es referencial y podría sufrir modificaciones por contingencia institucional.
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div>
              <span className="font-bold text-gray-700">Solemne 1: </span>
              <span className="font-mono font-semibold">Jueves 24 – Miércoles 30 septiembre</span>
            </div>
            <div>
              <span className="font-bold text-gray-700">Solemne 2: </span>
              <span className="font-mono font-semibold">Lunes 23 – Viernes 27 noviembre</span>
            </div>
            <div>
              <span className="font-bold text-gray-700">Fin de clases: </span>
              <span className="font-mono font-semibold">Viernes 4 de diciembre</span>
            </div>
            <div>
              <span className="font-bold text-gray-700">Exámenes: </span>
              <span className="font-mono font-semibold">9, 11, 14, 16 y 18 de diciembre</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
