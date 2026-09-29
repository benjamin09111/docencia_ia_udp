"use client";

import React from "react";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import {
  CanvasTable,
  CanvasTableHeader,
  CanvasTableRow,
  CanvasTableCell,
} from "@/components/canvas/CanvasTable";
import { FileSpreadsheet, ShieldCheck, CheckCircle2, Award } from "lucide-react";

export const StudentExcelTab: React.FC = () => {
  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-6 shadow-canvas-card space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase">
              Planilla Oficial de Calificaciones
            </span>
            <span className="text-xs text-[#6B7780] flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-700" />
              Vista Individual Privada (Solo tu registro)
            </span>
          </div>
          <h2 className="text-base font-bold text-[#2D3B45] mt-1 flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-emerald-700" />
            Mi Planilla Final de Rendimiento Académico
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Sincronizado en tiempo real con el Agente de Planilla y el sistema oficial de la Escuela de Informática UDP.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CanvasBadge variant="success">Estado: Alumno Regular • Aprobado</CanvasBadge>
        </div>
      </div>

      {/* Tabla con Únicamente la Fila del Alumno */}
      <CanvasTable>
        <CanvasTableHeader>
          <tr>
            <th className="p-3">Estudiante</th>
            <th className="p-3 text-center">Informe Inicial (20%)</th>
            <th className="p-3 text-center">Solemne Oficial (20%)</th>
            <th className="p-3 text-center">Bono Ayudantía</th>
            <th className="p-3 text-center">Avance 1 Final (20%)</th>
            <th className="p-3 text-center">Avance 2 (20%)</th>
            <th className="p-3 text-center">Feria Final (20%)</th>
            <th className="p-3 text-center">Asistencia</th>
            <th className="p-3 text-center">Nota Final</th>
            <th className="p-3 text-center">Condición</th>
          </tr>
        </CanvasTableHeader>
        <tbody>
          <CanvasTableRow hoverable={false} className="bg-emerald-50/20 font-medium">
            <CanvasTableCell>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-red-100 text-[#C8102E] font-bold text-xs flex items-center justify-center">
                  BM
                </div>
                <div>
                  <strong className="text-xs text-[#2D3B45] block">Benjamín</strong>
                  <span className="text-[10px] text-gray-500 font-mono">ID Canvas: 29248</span>
                </div>
              </div>
            </CanvasTableCell>

            <CanvasTableCell align="center">
              <span className="text-xs font-semibold text-[#2D3B45]">6.2</span>
            </CanvasTableCell>

            <CanvasTableCell align="center">
              <span className="text-xs font-semibold text-[#2D3B45]">5.8</span>
            </CanvasTableCell>

            <CanvasTableCell align="center">
              <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                +0.3
              </span>
            </CanvasTableCell>

            <CanvasTableCell align="center">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#008EE2]">6.5</span>
                <span className="text-[10px] text-gray-400 block font-normal">(6.2 + 0.3)</span>
              </div>
            </CanvasTableCell>

            <CanvasTableCell align="center">
              <span className="text-xs font-semibold text-[#2D3B45]">6.0</span>
            </CanvasTableCell>

            <CanvasTableCell align="center">
              <span className="text-xs font-semibold text-[#2D3B45]">6.7</span>
            </CanvasTableCell>

            <CanvasTableCell align="center">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                95% (OK)
              </span>
            </CanvasTableCell>

            <CanvasTableCell align="center">
              <span className="text-sm font-extrabold text-[#2D3B45] bg-gray-100 px-2.5 py-1 rounded border border-gray-200">
                6.2
              </span>
            </CanvasTableCell>

            <CanvasTableCell align="center">
              <CanvasBadge variant="success">Aprobado</CanvasBadge>
            </CanvasTableCell>
          </CanvasTableRow>
        </tbody>
      </CanvasTable>

      {/* Tarjeta de Resumen y Reglas de Aprobación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-[4px] space-y-1">
          <span className="text-[11px] font-bold text-[#2D3B45] block">Regla de Asistencia (75% Mínimo):</span>
          <p className="text-[11px] text-emerald-800 font-medium">
            Cumplida (95%). Te encuentras formalmente exento de reprobación por inasistencia (RI).
          </p>
        </div>

        <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-[4px] space-y-1">
          <span className="text-[11px] font-bold text-[#2D3B45] block">Décimas Acumuladas en Ayudantías:</span>
          <p className="text-[11px] text-purple-900 font-medium">
            +0.3 décimas inyectadas exitosamente sobre el Reporte de Avance 1.
          </p>
        </div>

        <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-[4px] space-y-1">
          <span className="text-[11px] font-bold text-[#2D3B45] block">Aprobación Final Proyectada:</span>
          <p className="text-[11px] text-blue-900 font-medium">
            Promedio ponderado 6.2 en escala chilena 1.0 a 7.0 (Mínimo de aprobación: 4.0).
          </p>
        </div>
      </div>
    </div>
  );
};
