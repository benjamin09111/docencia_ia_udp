"use client";

import React, { useState, useEffect } from "react";
import { StudentExcelRow } from "@/types";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import {
  CanvasTable,
  CanvasTableHeader,
  CanvasTableRow,
  CanvasTableCell,
} from "@/components/canvas/CanvasTable";
import {
  CheckCircle2,
  AlertTriangle,
  User,
  Shuffle,
  FileSpreadsheet,
  Award,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";

interface StudentAttendanceGradesTabProps {
  estudiantesExcel: StudentExcelRow[];
}

export const StudentAttendanceGradesTab: React.FC<StudentAttendanceGradesTabProps> = ({
  estudiantesExcel,
}) => {
  const [selectedStudent, setSelectedStudent] = useState<StudentExcelRow | null>(null);

  // Seleccionar un estudiante al azar al montar
  useEffect(() => {
    if (estudiantesExcel && estudiantesExcel.length > 0) {
      const randomIndex = Math.floor(Math.random() * estudiantesExcel.length);
      setSelectedStudent(estudiantesExcel[randomIndex]);
    }
  }, [estudiantesExcel]);

  const handlePickRandom = () => {
    if (!estudiantesExcel || estudiantesExcel.length === 0) return;
    const currentIndex = selectedStudent
      ? estudiantesExcel.findIndex((s) => s.canvas_id === selectedStudent.canvas_id)
      : -1;
    let nextIndex = Math.floor(Math.random() * estudiantesExcel.length);
    if (estudiantesExcel.length > 1 && nextIndex === currentIndex) {
      nextIndex = (nextIndex + 1) % estudiantesExcel.length;
    }
    setSelectedStudent(estudiantesExcel[nextIndex]);
  };

  if (!selectedStudent) {
    return (
      <div className="p-8 text-center bg-white border border-gray-200 rounded-[4px] text-xs text-gray-500">
        Cargando datos de asistencia y calificaciones...
      </div>
    );
  }

  const isAsistenciaOk = selectedStudent.asistencia_pct >= 75;
  const isAprobado = selectedStudent.nota_final >= 4.0;
  const totalSesiones = 20;
  const asistidas = Math.round((selectedStudent.asistencia_pct / 100) * totalSesiones);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Banner de Identificación y Selector de Alumno Azar */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 text-[#C8102E] font-bold text-sm flex items-center justify-center shrink-0">
            {selectedStudent.nombres.charAt(0)}
            {selectedStudent.apellidos.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 uppercase">
                Estudiante Seleccionado (Azar)
              </span>
              <span className="text-xs text-[#6B7780] font-mono">
                RUT: {selectedStudent.rut} • Canvas ID: {selectedStudent.canvas_id}
              </span>
            </div>
            <h2 className="text-base font-bold text-[#2D3B45] mt-0.5">
              {selectedStudent.nombres} {selectedStudent.apellidos}
            </h2>
            <span className="text-xs text-[#6B7780]">{selectedStudent.email}</span>
          </div>
        </div>

        <button
          onClick={handlePickRandom}
          className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-[4px] text-xs text-[#2D3B45] font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Shuffle size={13} />
          <span>Ver otro estudiante al azar</span>
        </button>
      </div>

      {/* 1. Módulo: Mi Asistencia a la Fecha */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-200 pb-3">
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Registro Oficial de Cátedras y Ayudantías
            </span>
            <h3 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2 mt-0.5">
              <CalendarCheck size={16} className="text-[#008EE2]" />
              Mi Asistencia Acumulada a la Fecha
            </h3>
          </div>

          <div>
            {isAsistenciaOk ? (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-[4px] flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                Asistencia Regular • Sin Riesgo RI
              </span>
            ) : (
              <span className="text-xs font-bold text-rose-800 bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-[4px] flex items-center gap-1.5">
                <AlertTriangle size={13} />
                Bajo 75% • En Riesgo de Inasistencia (RI)
              </span>
            )}
          </div>
        </div>

        {/* Tarjetas Visuales de Asistencia */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="p-4 bg-[#F9FAFB] border border-gray-200 rounded-[4px] text-center">
            <span className="text-xs text-[#6B7780] block font-medium">Porcentaje Total a la Fecha</span>
            <span
              className={`text-3xl font-black block mt-1 ${
                isAsistenciaOk ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {selectedStudent.asistencia_pct}%
            </span>
            <span className="text-[11px] text-gray-500 mt-0.5 block">
              Mínimo exigido UDP: <strong>75%</strong>
            </span>
          </div>

          <div className="p-4 bg-[#F9FAFB] border border-gray-200 rounded-[4px] md:col-span-2 space-y-2">
            <div className="flex justify-between text-xs font-medium text-[#2D3B45]">
              <span>Sesiones Asistidas: <strong>{asistidas} de {totalSesiones}</strong></span>
              <span className="font-mono text-gray-500">
                Inasistencias: {totalSesiones - asistidas}
              </span>
            </div>

            {/* Barra de progreso */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isAsistenciaOk ? "bg-emerald-500" : "bg-rose-500"
                }`}
                style={{ width: `${selectedStudent.asistencia_pct}%` }}
              />
            </div>

            <p className="text-[11px] text-[#6B7780] leading-snug">
              {isAsistenciaOk
                ? "Cumples satisfactoriamente con la regla de asistencia mínima de la Escuela de Informática y Telecomunicaciones."
                : "¡Atención! Te encuentras bajo el umbral mínimo reglamentario del 75%. Es indispensable asistir a las próximas sesiones para evitar causal RI."}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Módulo: Mis Notas según el Excel */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-200 pb-3">
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Planilla Oficial de Calificaciones
            </span>
            <h3 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2 mt-0.5">
              <FileSpreadsheet size={16} className="text-emerald-700" />
              Mis Calificaciones según el Excel Sincronizado
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <CanvasBadge variant={isAprobado ? "success" : "danger"}>
              {isAprobado ? "Condición: Aprobado" : "Condición: Reprobado"}
            </CanvasBadge>
          </div>
        </div>

        {/* Tabla Oficial de Calificaciones del Alumno */}
        <CanvasTable>
          <CanvasTableHeader>
            <tr>
              <th className="p-3">Evaluación</th>
              <th className="p-3 text-center">Ponderación</th>
              <th className="p-3 text-center">Nota Base</th>
              <th className="p-3 text-center">Bono Ayudantía</th>
              <th className="p-3 text-center">Nota Final Ítem</th>
              <th className="p-3 text-center">Estado</th>
            </tr>
          </CanvasTableHeader>
          <tbody>
            <CanvasTableRow hoverable={false}>
              <CanvasTableCell>
                <strong className="text-xs text-[#2D3B45]">Solemne Oficial 1</strong>
                <span className="text-[10px] text-gray-500 block">Atributos de Calidad y Patrones</span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <span className="text-xs text-gray-600">30%</span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <span className="text-xs font-semibold text-[#2D3B45]">{selectedStudent.solemne_1}</span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                {selectedStudent.decimas_act1 > 0 ? (
                  <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                    +{selectedStudent.decimas_act1}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">-</span>
                )}
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <span className="text-xs font-bold text-[#008EE2]">
                  {selectedStudent.solemne_1_final}
                </span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Calificada
                </span>
              </CanvasTableCell>
            </CanvasTableRow>

            <CanvasTableRow hoverable={false}>
              <CanvasTableCell>
                <strong className="text-xs text-[#2D3B45]">Solemne Oficial 2</strong>
                <span className="text-[10px] text-gray-500 block">Planificación Ágil, Riesgos PMBOK y Cloud</span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <span className="text-xs text-gray-600">30%</span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <span className="text-xs font-semibold text-[#2D3B45]">{selectedStudent.solemne_2}</span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <span className="text-xs text-gray-400">-</span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <span className="text-xs font-bold text-[#008EE2]">{selectedStudent.solemne_2}</span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Calificada
                </span>
              </CanvasTableCell>
            </CanvasTableRow>

            <CanvasTableRow hoverable={false}>
              <CanvasTableCell>
                <strong className="text-xs text-[#2D3B45]">Taller y Proyecto Final</strong>
                <span className="text-[10px] text-gray-500 block">Arquitectura Ejecutable y Defensa</span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <span className="text-xs text-gray-600">40%</span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <span className="text-xs font-semibold text-[#2D3B45]">{selectedStudent.taller_proyecto}</span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <span className="text-xs text-gray-400">-</span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <span className="text-xs font-bold text-[#008EE2]">{selectedStudent.taller_proyecto}</span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Calificada
                </span>
              </CanvasTableCell>
            </CanvasTableRow>

            {/* Fila Totalizadora */}
            <CanvasTableRow hoverable={false} className="bg-gray-50 font-bold border-t-2 border-gray-300">
              <CanvasTableCell>
                <span className="text-xs font-extrabold text-[#2D3B45] uppercase">
                  Promedio Ponderado Final
                </span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <span className="text-xs font-extrabold text-[#2D3B45]">100%</span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <span className="text-xs text-gray-400">-</span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <span className="text-xs text-purple-700">+{selectedStudent.decimas_act1}</span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <span
                  className={`text-sm font-black px-2.5 py-1 rounded border ${
                    isAprobado
                      ? "text-emerald-800 bg-emerald-100 border-emerald-200"
                      : "text-rose-800 bg-rose-100 border-rose-200"
                  }`}
                >
                  {selectedStudent.nota_final}
                </span>
              </CanvasTableCell>
              <CanvasTableCell align="center">
                <CanvasBadge variant={isAprobado ? "success" : "danger"}>
                  {selectedStudent.estado_curso}
                </CanvasBadge>
              </CanvasTableCell>
            </CanvasTableRow>
          </tbody>
        </CanvasTable>
      </div>
    </div>
  );
};
