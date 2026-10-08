"use client";

import React from "react";
import { StudentExcelRow } from "@/types";
import {
  CanvasTable,
  CanvasTableHeader,
  CanvasTableRow,
  CanvasTableCell,
} from "@/components/canvas/CanvasTable";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";

interface StudentGradesTableProps {
  student: StudentExcelRow;
}

export const StudentGradesTable: React.FC<StudentGradesTableProps> = ({ student }) => {
  const isAprobado = student.nota_final >= 4.0;

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#E0E3E6] pb-3">
        <div>
          <span className="text-[10px] font-bold text-[#6B7780] uppercase tracking-wider block">
            Planilla Oficial de Calificaciones Canvas
          </span>
          <h3 className="text-sm font-bold text-[#2D3B45] mt-0.5">
            Mis Calificaciones y Desglose Ponderado
          </h3>
        </div>

        <CanvasBadge variant={isAprobado ? "success" : "danger"}>
          {isAprobado ? "Condición: Aprobado" : "Condición: Reprobado"}
        </CanvasBadge>
      </div>

      <CanvasTable tableClassName="min-w-[620px]">
        <CanvasTableHeader>
          <tr>
            <th className="p-2.5">Evaluación</th>
            <th className="p-2.5 text-center">Ponderación</th>
            <th className="p-2.5 text-center">Nota Base</th>
            <th className="p-2.5 text-center">Bono Ayudantía</th>
            <th className="p-2.5 text-center">Nota Final Ítem</th>
            <th className="p-2.5 text-center">Estado</th>
          </tr>
        </CanvasTableHeader>
        <tbody>
          <CanvasTableRow hoverable={false}>
            <CanvasTableCell>
              <strong className="text-xs text-[#2D3B45]">Solemne Oficial 1</strong>
              <span className="text-[11px] text-[#6B7780] block">Atributos de Calidad y Patrones</span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <span className="text-xs text-[#6B7780]">30%</span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <span className="text-xs font-semibold text-[#2D3B45]">{student.solemne_1}</span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              {student.decimas_act1 > 0 ? (
                <span className="text-xs font-bold text-[#2E7D32] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[3px]">
                  +{student.decimas_act1}
                </span>
              ) : (
                <span className="text-xs text-[#6B7780]">-</span>
              )}
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <span className="text-xs font-bold text-[#008EE2]">{student.solemne_1_final}</span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <span className="text-[11px] font-bold text-[#2E7D32] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[3px]">
                Calificada
              </span>
            </CanvasTableCell>
          </CanvasTableRow>

          <CanvasTableRow hoverable={false}>
            <CanvasTableCell>
              <strong className="text-xs text-[#2D3B45]">Solemne Oficial 2</strong>
              <span className="text-[11px] text-[#6B7780] block">Planificación Ágil, Riesgos PMBOK y Cloud</span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <span className="text-xs text-[#6B7780]">30%</span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <span className="text-xs font-semibold text-[#2D3B45]">{student.solemne_2}</span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <span className="text-xs text-[#6B7780]">-</span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <span className="text-xs font-bold text-[#008EE2]">{student.solemne_2}</span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <span className="text-[11px] font-bold text-[#2E7D32] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[3px]">
                Calificada
              </span>
            </CanvasTableCell>
          </CanvasTableRow>

          <CanvasTableRow hoverable={false}>
            <CanvasTableCell>
              <strong className="text-xs text-[#2D3B45]">Taller y Proyecto Final</strong>
              <span className="text-[11px] text-[#6B7780] block">Arquitectura Ejecutable y Defensa</span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <span className="text-xs text-[#6B7780]">40%</span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <span className="text-xs font-semibold text-[#2D3B45]">{student.taller_proyecto}</span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <span className="text-xs text-[#6B7780]">-</span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <span className="text-xs font-bold text-[#008EE2]">{student.taller_proyecto}</span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <span className="text-[11px] font-bold text-[#2E7D32] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[3px]">
                Calificada
              </span>
            </CanvasTableCell>
          </CanvasTableRow>

          {/* Fila Totalizadora */}
          <CanvasTableRow hoverable={false} className="bg-[#F5F6F8] font-bold border-t-2 border-[#C7CDD1]">
            <CanvasTableCell>
              <span className="text-xs font-bold text-[#2D3B45] uppercase">
                Promedio Ponderado Final (NP)
              </span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <span className="text-xs font-bold text-[#2D3B45]">100%</span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <span className="text-xs text-[#6B7780]">-</span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <span className="text-xs font-bold text-[#2E7D32]">+{student.decimas_act1}</span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <span
                className={`text-sm font-black px-2.5 py-1 rounded-[3px] border ${
                  isAprobado
                    ? "text-[#2E7D32] bg-emerald-50 border-emerald-200"
                    : "text-rose-800 bg-rose-50 border-rose-200"
                }`}
              >
                {student.nota_final}
              </span>
            </CanvasTableCell>
            <CanvasTableCell align="center">
              <CanvasBadge variant={isAprobado ? "success" : "danger"}>
                {student.estado_curso}
              </CanvasBadge>
            </CanvasTableCell>
          </CanvasTableRow>
        </tbody>
      </CanvasTable>
    </div>
  );
};
