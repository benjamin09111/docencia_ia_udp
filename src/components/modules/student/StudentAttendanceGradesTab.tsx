"use client";

import React, { useState, useEffect } from "react";
import { StudentExcelRow } from "@/types";
import { StudentGradesTable } from "./StudentGradesTable";
import {
  CheckCircle2,
  AlertTriangle,
  Shuffle,
  CalendarCheck,
} from "lucide-react";

interface StudentAttendanceGradesTabProps {
  estudiantesExcel: StudentExcelRow[];
}

export const StudentAttendanceGradesTab: React.FC<StudentAttendanceGradesTabProps> = ({
  estudiantesExcel,
}) => {
  const [selectedStudent, setSelectedStudent] = useState<StudentExcelRow | null>(null);

  useEffect(() => {
    if (estudiantesExcel && estudiantesExcel.length > 0) {
      setSelectedStudent(estudiantesExcel[0]);
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
      <div className="p-8 text-center bg-white border border-[#E0E3E6] rounded-[4px] text-xs text-[#6B7780]">
        Cargando datos de asistencia y calificaciones...
      </div>
    );
  }

  const isAsistenciaOk = selectedStudent.asistencia_pct >= 75;
  const totalSesiones = 20;
  const asistidas = Math.round((selectedStudent.asistencia_pct / 100) * totalSesiones);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Selector de Estudiante estilo Canvas */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 text-[#B71C1C] border border-red-200 font-bold text-sm flex items-center justify-center shrink-0">
            {selectedStudent.nombres.charAt(0)}
            {selectedStudent.apellidos.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-[#2D3B45] border border-[#C7CDD1] uppercase">
                Estudiante Canvas
              </span>
              <span className="text-xs text-[#6B7780] font-mono">
                ID: {selectedStudent.canvas_id} • RUT: {selectedStudent.rut}
              </span>
            </div>
            <h2 className="text-base font-bold text-[#2D3B45] mt-0.5">
              {selectedStudent.nombres} {selectedStudent.apellidos}
            </h2>
            <span className="text-xs text-[#6B7780]">{selectedStudent.email}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePickRandom}
          className="px-3.5 py-1.5 bg-[#F5F6F8] hover:bg-gray-100 border border-[#C7CDD1] rounded-[3px] text-xs text-[#2D3B45] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Shuffle size={13} />
          <span>Ver otro estudiante al azar</span>
        </button>
      </div>

      {/* Módulo: Asistencia a la Fecha */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#E0E3E6] pb-3">
          <div>
            <span className="text-[10px] font-bold text-[#6B7780] uppercase tracking-wider block">
              Registro Oficial de Asistencia UDP
            </span>
            <h3 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2 mt-0.5">
              <CalendarCheck size={16} className="text-[#008EE2]" />
              Mi Asistencia Acumulada a la Fecha
            </h3>
          </div>

          <div>
            {isAsistenciaOk ? (
              <span className="text-xs font-bold text-[#2E7D32] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-[3px] flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                Asistencia Regular • Sin Riesgo RI
              </span>
            ) : (
              <span className="text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-[3px] flex items-center gap-1.5">
                <AlertTriangle size={13} />
                Bajo 75% • En Riesgo de Inasistencia (RI)
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-center">
          <div className="p-4 bg-[#F9FAFB] border border-[#E0E3E6] rounded-[3px] text-center">
            <span className="text-xs text-[#6B7780] block font-medium">Porcentaje a la Fecha</span>
            <span
              className={`text-3xl font-black block mt-1 ${
                isAsistenciaOk ? "text-[#2E7D32]" : "text-rose-700"
              }`}
            >
              {selectedStudent.asistencia_pct}%
            </span>
            <span className="text-[11px] text-[#6B7780] mt-0.5 block">
              Mínimo exigido UDP: <strong>75%</strong>
            </span>
          </div>

          <div className="p-4 bg-[#F9FAFB] border border-[#E0E3E6] rounded-[3px] md:col-span-2 space-y-2">
            <div className="flex justify-between text-xs font-medium text-[#2D3B45]">
              <span>Sesiones Asistidas: <strong>{asistidas} de {totalSesiones}</strong></span>
              <span className="font-mono text-[#6B7780]">
                Inasistencias: {totalSesiones - asistidas}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isAsistenciaOk ? "bg-[#2E7D32]" : "bg-rose-500"
                }`}
                style={{ width: `${selectedStudent.asistencia_pct}%` }}
              />
            </div>

            <p className="text-[11px] text-[#6B7780] leading-snug">
              {isAsistenciaOk
                ? "Cumples con el porcentaje reglamentario de asistencia de la Escuela de Informática y Telecomunicaciones."
                : "Atención: Te encuentras bajo el 75% mínimo. Es indispensable asistir a las próximas sesiones para evitar causal RI."}
            </p>
          </div>
        </div>
      </div>

      {/* Módulo: Calificaciones */}
      <StudentGradesTable student={selectedStudent} />
    </div>
  );
};
