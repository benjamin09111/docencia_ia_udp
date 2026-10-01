"use client";

import React, { useState } from "react";
import { CanvasBadge } from "./CanvasBadge";
import { CanvasButton } from "./CanvasButton";
import { CheckCircle2, Edit2, Plus, Trash2, Award, FileText } from "lucide-react";

export interface RubricMatrixSubcriterio {
  id: string;
  nombre: string;
  descriptores: string[];
  puntaje: number;
}

export interface RubricMatrixCriterio {
  id: string;
  nombre: string;
  subcriterios: RubricMatrixSubcriterio[];
}

export interface RubricMatrixRubro {
  id: string;
  nombre: string;
  criterios: RubricMatrixCriterio[];
  puntajeRubro: number;
}

interface CanvasOfficialRubricTableProps {
  rubros: RubricMatrixRubro[];
  onChangeRubros?: (updated: RubricMatrixRubro[]) => void;
  isEditable?: boolean;
  tituloPauta?: string;
  subtituloPauta?: string;
}

export const CanvasOfficialRubricTable: React.FC<CanvasOfficialRubricTableProps> = ({
  rubros,
  onChangeRubros,
  isEditable = false,
  tituloPauta = "MATRIZ OFICIAL DE EVALUACIÓN Y CRITERIOS",
  subtituloPauta = "Pauta oficial estructurada por rubros, criterios y subcriterios con descriptores técnicos",
}) => {
  const [editingSubcriterioId, setEditingSubcriterioId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editDescriptoresText, setEditDescriptoresText] = useState("");
  const [editPuntos, setEditPuntos] = useState(25);

  // Calcular total general de la pauta
  const puntajeTotalGeneral = rubros.reduce((acc, r) => acc + r.puntajeRubro, 0);

  const startEditSubcriterio = (sub: RubricMatrixSubcriterio) => {
    setEditingSubcriterioId(sub.id);
    setEditNombre(sub.nombre);
    setEditDescriptoresText(sub.descriptores.join("\n"));
    setEditPuntos(sub.puntaje);
  };

  const saveEditSubcriterio = () => {
    if (!editingSubcriterioId || !onChangeRubros) return;

    const updatedRubros = rubros.map((rubro) => {
      let rubroTotal = 0;
      const updatedCriterios = rubro.criterios.map((criterio) => {
        const updatedSubs = criterio.subcriterios.map((sub) => {
          if (sub.id === editingSubcriterioId) {
            const descs = editDescriptoresText
              .split("\n")
              .map((d) => d.trim())
              .filter((d) => d.length > 0);
            return {
              ...sub,
              nombre: editNombre,
              descriptores: descs,
              puntaje: editPuntos,
            };
          }
          return sub;
        });
        rubroTotal += updatedSubs.reduce((a, s) => a + s.puntaje, 0);
        return { ...criterio, subcriterios: updatedSubs };
      });

      return {
        ...rubro,
        criterios: updatedCriterios,
        puntajeRubro: rubroTotal,
      };
    });

    onChangeRubros(updatedRubros);
    setEditingSubcriterioId(null);
  };

  return (
    <div className="space-y-3">
      {/* Encabezado Formal Institucional */}
      <div className="bg-[#2D3B45] text-white p-3 sm:p-4 rounded-t-[4px] border border-[#2D3B45] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded">
              Pauta Oficial UDP
            </span>
            <span className="text-[11px] text-gray-300">Total: {puntajeTotalGeneral} pts</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white mt-1">
            {tituloPauta}
          </h3>
          <p className="text-xs text-gray-300 mt-0.5 font-light">
            {subtituloPauta}
          </p>
        </div>

        {isEditable && (
          <span className="text-[10.5px] bg-[#008EE2] text-white px-2 py-1 rounded font-medium shadow-2xs">
            Modo Edición Habilitado
          </span>
        )}
      </div>

      {/* Tabla Oficial con Estructura Jerárquica */}
      <div className="overflow-x-auto border border-[#C7CDD1] rounded-b-[4px] bg-white shadow-2xs">
        <table className="w-full text-xs border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-[#EBF3F8] text-[#2D3B45] border-b border-[#C7CDD1] font-bold text-left">
              <th className="p-3 border-r border-[#C7CDD1] w-48 uppercase text-[11px] tracking-wider">
                Rubro / Dimensión
              </th>
              <th className="p-3 border-r border-[#C7CDD1] w-48 uppercase text-[11px] tracking-wider">
                Criterio
              </th>
              <th className="p-3 border-r border-[#C7CDD1] uppercase text-[11px] tracking-wider">
                Subcriterio / Descriptores de Evaluación
              </th>
              <th className="p-3 border-r border-[#C7CDD1] w-28 text-center uppercase text-[10px] tracking-wider">
                Puntaje máx. por Subcriterio
              </th>
              <th className="p-3 w-28 text-center uppercase text-[10px] tracking-wider">
                Puntaje máx. por rubro
              </th>
            </tr>
          </thead>
          <tbody>
            {rubros.map((rubro, rIdx) => {
              // Calcular total de subcriterios en este rubro para el rowSpan
              const totalSubsEnRubro = rubro.criterios.reduce(
                (acc, c) => acc + c.subcriterios.length,
                0
              );

              let subcriterioGlobalIndex = 0;

              return rubro.criterios.map((criterio, cIdx) => {
                const totalSubsEnCriterio = criterio.subcriterios.length;

                return criterio.subcriterios.map((sub, sIdx) => {
                  const isFirstRowOfRubro = cIdx === 0 && sIdx === 0;
                  const isFirstRowOfCriterio = sIdx === 0;
                  subcriterioGlobalIndex++;

                  return (
                    <tr
                      key={sub.id}
                      className="border-b border-[#E0E3E6] hover:bg-[#F9FAFB] transition-colors"
                    >
                      {/* Celda de Rubro con rowSpan */}
                      {isFirstRowOfRubro && (
                        <td
                          rowSpan={totalSubsEnRubro}
                          className="p-3.5 border-r border-[#C7CDD1] align-top bg-[#FAFAFA] font-bold text-[#2D3B45]"
                        >
                          <div className="space-y-1">
                            <span className="text-xs block text-[#2D3B45] font-bold">
                              {rubro.nombre}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono block">
                              ({rubro.puntajeRubro} pts acumulados)
                            </span>
                          </div>
                        </td>
                      )}

                      {/* Celda de Criterio con rowSpan */}
                      {isFirstRowOfCriterio && (
                        <td
                          rowSpan={totalSubsEnCriterio}
                          className="p-3 border-r border-[#C7CDD1] align-top font-semibold text-[#2D3B45] bg-white"
                        >
                          <span className="text-[11.5px] block">{criterio.nombre}</span>
                        </td>
                      )}

                      {/* Celda de Subcriterio y Descriptores */}
                      <td className="p-3 border-r border-[#C7CDD1] align-top bg-white">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start gap-2">
                            <strong className="text-xs text-[#2D3B45] font-bold block">
                              {sub.nombre}
                            </strong>
                            {isEditable && (
                              <button
                                type="button"
                                onClick={() => startEditSubcriterio(sub)}
                                className="text-gray-400 hover:text-[#008EE2] p-1 rounded transition-colors"
                                title="Editar descriptores y puntaje"
                              >
                                <Edit2 size={12} />
                              </button>
                            )}
                          </div>

                          {/* Lista con viñetas oficiales idéntica a la imagen */}
                          <ul className="space-y-1 mt-1 text-[11px] text-[#55636E] leading-relaxed">
                            {sub.descriptores.map((desc, dIdx) => (
                              <li key={dIdx} className="flex items-start gap-1.5">
                                <span className="text-[#008EE2] font-bold select-none">•</span>
                                <span>{desc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>

                      {/* Puntaje Máximo por Subcriterio */}
                      <td className="p-3 border-r border-[#C7CDD1] text-center align-middle font-mono font-bold text-xs text-[#2D3B45] bg-[#FCFDFE]">
                        <span className="bg-gray-100 px-2.5 py-1 rounded border border-gray-200">
                          {sub.puntaje}
                        </span>
                      </td>

                      {/* Puntaje Máximo por Rubro con rowSpan */}
                      {isFirstRowOfRubro && (
                        <td
                          rowSpan={totalSubsEnRubro}
                          className="p-3 text-center align-middle font-mono font-extrabold text-sm text-[#008EE2] bg-[#F5F9FD]"
                        >
                          <span className="bg-blue-50 px-3 py-1.5 rounded border border-blue-200 shadow-2xs block">
                            {rubro.puntajeRubro}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                });
              });
            })}
          </tbody>

          {/* Fila Total General */}
          <tfoot>
            <tr className="bg-[#F0F4F8] border-t-2 border-[#C7CDD1] font-bold text-xs text-[#2D3B45]">
              <td colSpan={3} className="p-3 text-right uppercase tracking-wider pr-4 border-r border-[#C7CDD1]">
                Puntaje Total Máximo Oficial de la Pauta:
              </td>
              <td className="p-3 text-center border-r border-[#C7CDD1] font-mono text-xs">
                {puntajeTotalGeneral} pts
              </td>
              <td className="p-3 text-center font-mono font-extrabold text-sm text-[#008EE2] bg-[#E3F2FD]">
                {puntajeTotalGeneral} pts
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modal Rápido de Edición si se hace clic en Editar un Subcriterio */}
      {editingSubcriterioId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-3">
          <div className="bg-white rounded-[4px] max-w-lg w-full p-4 sm:p-5 shadow-xl border border-gray-200 space-y-3 animate-scaleUp">
            <div className="flex justify-between items-start border-b pb-2">
              <h4 className="text-sm font-bold text-[#2D3B45] flex items-center gap-1.5">
                <Edit2 size={14} className="text-[#008EE2]" />
                Editar Subcriterio y Descriptores
              </h4>
              <button
                type="button"
                onClick={() => setEditingSubcriterioId(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="font-bold text-[#2D3B45] block mb-1">Nombre del Subcriterio</label>
                <input
                  type="text"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-[4px] p-2"
                />
              </div>

              <div>
                <label className="font-bold text-[#2D3B45] block mb-1">
                  Descriptores e Indicadores (un requisito por línea)
                </label>
                <textarea
                  rows={4}
                  value={editDescriptoresText}
                  onChange={(e) => setEditDescriptoresText(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-[4px] p-2 font-mono leading-relaxed"
                />
              </div>

              <div>
                <label className="font-bold text-[#2D3B45] block mb-1">Puntaje Máximo</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={editPuntos}
                  onChange={(e) => setEditPuntos(Number(e.target.value))}
                  className="w-24 text-xs font-bold border border-gray-300 rounded-[4px] p-1.5"
                />
              </div>
            </div>

            <div className="pt-2 border-t flex justify-end gap-2">
              <CanvasButton variant="outline" size="sm" onClick={() => setEditingSubcriterioId(null)}>
                Cancelar
              </CanvasButton>
              <CanvasButton variant="primary-udp" size="sm" onClick={saveEditSubcriterio}>
                Guardar Cambios
              </CanvasButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
