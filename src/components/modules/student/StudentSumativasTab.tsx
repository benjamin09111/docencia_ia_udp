"use client";

import React, { useState } from "react";
import { CourseDeliverable, StudentSubmission } from "@/types";
import { CanvasItemGroup, CanvasItemRow } from "@/components/canvas/CanvasItemGroup";
import { FileText, Calendar, Award } from "lucide-react";

interface StudentSumativasTabProps {
  entregables: CourseDeliverable[];
  entregasAlumnos?: StudentSubmission[];
}

export const StudentSumativasTab: React.FC<StudentSumativasTabProps> = ({
  entregables,
  entregasAlumnos = [],
}) => {
  const sumativas = entregables.filter((e) => e.tipo === "tarea_oficial");
  const [selectedItem, setSelectedItem] = useState<CourseDeliverable | null>(
    sumativas[0] || null
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Cabecera Canvas de Evaluaciones Sumativas */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-base font-bold text-[#2D3B45] flex items-center gap-2">
              <FileText size={18} className="text-[#B71C1C]" />
              Evaluaciones Sumativas Oficiales
            </h2>
            <p className="text-xs text-[#6B7780] mt-1">
              Solemnes, Exámenes y proyectos curriculares con ponderación directa en la Nota de Presentación (NP).
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#F5F6F8] border border-[#C7CDD1] text-[#2D3B45] rounded-[3px]">
            {sumativas.length} Evaluaciones Oficiales
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lista de Evaluaciones (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <CanvasItemGroup
            title="Tareas y Solemnes del Semestre"
            countBadge={`${sumativas.length} ítems`}
            defaultExpanded={true}
          >
            {sumativas.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              const sub = entregasAlumnos.find((s) => s.deliverable_id === item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? "bg-red-50/40 border-l-[3px] border-[#B71C1C]" : ""
                  }`}
                >
                  <CanvasItemRow
                    id={item.id}
                    icon={<FileText size={16} />}
                    title={item.titulo}
                    subtitle={`Plazo: ${item.fecha_limite} • Ponderación: ${item.ponderacion_o_decimas}`}
                    rightBadge={
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[3px] ${
                        sub ? "bg-emerald-50 text-[#2E7D32] border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}>
                        {sub ? "Entregada" : "Pendiente"}
                      </span>
                    }
                    isPublished={true}
                  />
                </div>
              );
            })}
          </CanvasItemGroup>
        </div>

        {/* Detalle y Rúbrica Canvas de la Evaluación Seleccionada (7 cols) */}
        <div className="lg:col-span-7">
          {selectedItem ? (
            <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
              <div className="border-b border-[#E0E3E6] pb-3 flex justify-between items-start gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#B71C1C] bg-red-50 border border-red-200 px-2 py-0.5 rounded uppercase">
                    Evaluación Sumativa
                  </span>
                  <h3 className="text-base font-bold text-[#2D3B45] mt-1">{selectedItem.titulo}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#6B7780]">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> Fecha de Entrega: {selectedItem.fecha_limite}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#2D3B45]">
                      <Award size={13} className="text-[#B71C1C]" /> Ponderación: {selectedItem.ponderacion_o_decimas}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#2D3B45] leading-relaxed bg-[#F9FAFB] p-3 rounded-[3px] border border-[#E0E3E6]">
                <strong>Descripción Oficial:</strong>
                <p className="mt-1 text-[#6B7780]">{selectedItem.descripcion}</p>
              </div>

              {/* Rúbrica Oficial de Canvas */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#2D3B45] uppercase tracking-wide">
                  Criterios de Evaluación y Rúbrica Canvas
                </h4>
                <div className="border border-[#E0E3E6] rounded-[3px] overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#F5F6F8] border-b border-[#E0E3E6] text-[#2D3B45] font-semibold">
                      <tr>
                        <th className="p-2.5">Criterio</th>
                        <th className="p-2.5">Niveles de Desempeño</th>
                        <th className="p-2.5 text-right">Pts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0E3E6]">
                      {selectedItem.rubrica.map((criterio) => (
                        <tr key={criterio.id} className="hover:bg-gray-50/50">
                          <td className="p-2.5 align-top font-semibold text-[#2D3B45] w-2/5">
                            {criterio.descripcion}
                          </td>
                          <td className="p-2.5 align-top space-y-1">
                            {criterio.indicadores.map((ind, i) => (
                              <div key={i} className="text-[11px] text-[#6B7780]">
                                <span className="font-semibold text-[#2D3B45]">{ind.nivel}:</span> {ind.detalle}
                              </div>
                            ))}
                          </td>
                          <td className="p-2.5 align-top text-right font-bold text-[#B71C1C] shrink-0">
                            {criterio.puntaje_max}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white border border-[#E0E3E6] rounded-[4px] text-xs text-[#6B7780]">
              Selecciona una evaluación para ver su rúbrica y detalles oficiales.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
