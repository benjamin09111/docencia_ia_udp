"use client";

import React, { useState, useMemo } from "react";
import { ClassSession, AttendanceValue } from "@/types/attendance";
import { StudentVisualRow } from "./PublicAttendanceRosterMatrix";
import { CanvasSearchableSelect, CanvasSearchOption } from "@/components/canvas/CanvasSearchableSelect";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  Search,
  CheckCircle2,
  XCircle,
  Award,
  Calendar,
  AlertTriangle,
  FileText,
  UserCheck,
  Zap,
} from "lucide-react";

interface PublicMobileStudentViewProps {
  students: StudentVisualRow[];
  sessions: ClassSession[];
  attendanceMap: Record<string, AttendanceValue>;
  totalTrabajos: number;
  onOpenAppealModal: () => void;
}

export const PublicMobileStudentView: React.FC<PublicMobileStudentViewProps> = ({
  students,
  sessions,
  attendanceMap,
  totalTrabajos,
  onOpenAppealModal,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  // Mapear opciones para el selector con sugerencias de búsqueda
  const studentOptions: CanvasSearchOption[] = useMemo(() => {
    return students.map((st) => ({
      value: st.canvas_id,
      label: st.nombreCompleto,
      subLabel: st.rut ? `RUT: ${st.rut}` : `ID: ${st.canvas_id}`,
      badge: st.ok ? `${st.pct}% OK` : `${st.pct}% Riesgo`,
      keywords: [st.rut, st.nombres || "", st.apellidos || ""],
    }));
  }, [students]);

  const selectedStudent = useMemo(() => {
    if (!selectedStudentId) return null;
    return students.find((s) => s.canvas_id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  return (
    <div className="space-y-4">
      {/* Tarjeta de Búsqueda de Estudiante en Celulares */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-[#2D3B45]">
          <Search size={16} className="text-[#008EE2]" />
          <h3 className="font-bold text-sm">Consulta de Asistencia Personal</h3>
        </div>
        <p className="text-xs text-[#6B7780]">
          Selecciona o busca tu nombre/RUT para ver tu ficha detallada de asistencia y entregas.
        </p>

        <CanvasSearchableSelect
          label="Buscar mi nombre:"
          placeholder="Escribe tu nombre o RUT..."
          options={studentOptions}
          value={selectedStudentId}
          onChange={(val) => setSelectedStudentId(val ? Number(val) : null)}
          selectedCardLabel="Estudiante Seleccionado"
        />
      </div>

      {/* Si no se ha seleccionado estudiante aún */}
      {!selectedStudent && (
        <div className="bg-white border border-dashed border-gray-300 rounded-[4px] p-6 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#008EE2] flex items-center justify-center mx-auto">
            <UserCheck size={20} />
          </div>
          <h4 className="font-bold text-xs text-[#2D3B45]">Ingresa tu nombre arriba</h4>
          <p className="text-[11px] text-[#6B7780] max-w-xs mx-auto">
            Al seleccionar tu nombre, aparecerá tu resumen completo de asistencia, décimas ganadas y estado por cada clase.
          </p>
        </div>
      )}

      {/* Ficha Individual del Estudiante Seleccionado */}
      {selectedStudent && (
        <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-xs p-4 space-y-4 animate-fadeIn">
          {/* Encabezado Ficha */}
          <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h4 className="font-bold text-sm text-[#2D3B45]">{selectedStudent.nombreCompleto}</h4>
              <p className="text-xs text-[#6B7780] font-mono">
                {selectedStudent.rut ? `RUT: ${selectedStudent.rut}` : `ID Canvas: ${selectedStudent.canvas_id}`}
              </p>
            </div>
            <CanvasBadge variant={selectedStudent.ok ? "success" : "danger"}>
              {selectedStudent.ok ? "Cumple Asistencia" : "En Riesgo (RI)"}
            </CanvasBadge>
          </div>

          {/* Grid 2x2 Métricas Rápidas */}
          <div className="grid grid-cols-2 gap-2">
            <div className={`p-2.5 rounded-[4px] border ${selectedStudent.ok ? "bg-emerald-50/60 border-emerald-200" : "bg-red-50/60 border-red-200"}`}>
              <span className="text-[10px] uppercase font-bold text-[#6B7780] block">Asistencia</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`text-lg font-extrabold ${selectedStudent.ok ? "text-emerald-800" : "text-red-800"}`}>
                  {selectedStudent.pct}%
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  ({selectedStudent.asistidas}/{selectedStudent.validas})
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-[4px] border bg-amber-50/60 border-amber-200">
              <span className="text-[10px] uppercase font-bold text-amber-900 flex items-center gap-1">
                <Award size={11} /> Trabajos
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-extrabold text-amber-900">
                  {selectedStudent.trabajosRealizados}/{totalTrabajos}
                </span>
                <span className="text-[10px] text-amber-800 font-mono">entregados</span>
              </div>
            </div>

            <div className="p-2.5 rounded-[4px] border bg-purple-50/60 border-purple-200">
              <span className="text-[10px] uppercase font-bold text-purple-900 block">Décimas Acum.</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-extrabold text-purple-900">
                  +{selectedStudent.decimas.toFixed(1)}d
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-[4px] border bg-gray-50 border-gray-200">
              <span className="text-[10px] uppercase font-bold text-[#6B7780] block">Requisito 75%</span>
              <div className="flex items-center gap-1 mt-1 text-xs font-bold text-[#2D3B45]">
                {selectedStudent.ok ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={13} /> OK
                  </span>
                ) : (
                  <span className="text-red-700 flex items-center gap-1">
                    <AlertTriangle size={13} /> Peligro RI
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Historial Detallado por Clase */}
          <div className="space-y-2 pt-2">
            <h5 className="text-xs font-bold text-[#2D3B45] flex items-center gap-1.5">
              <Calendar size={13} className="text-[#008EE2]" />
              <span>Historial por Clase de Ayudantía</span>
            </h5>

            <div className="divide-y divide-gray-100 border border-gray-200 rounded-[4px] overflow-hidden">
              {sessions.length === 0 ? (
                <div className="p-3 text-center text-xs text-gray-500">No hay sesiones evaluadas aún.</div>
              ) : (
                sessions.map((sess) => {
                  const val = attendanceMap[`${sess.id}_${selectedStudent.canvas_id}`] ?? 0;
                  const isPresent = val === 1;
                  const parts = sess.fecha.split("-");
                  const dateFormatted = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : sess.fecha;

                  return (
                    <div key={sess.id} className="p-2.5 flex items-center justify-between text-xs hover:bg-gray-50/80 transition-colors">
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#2D3B45] block">{sess.diaSemana} {dateFormatted}</span>
                        <span className="text-[10px] text-gray-500 block font-mono">
                          Horario: {sess.horaInicio || "16:00"} - {sess.horaFin || "17:20"} • {sess.modalidad === "online" ? "Online" : "Presencial"}
                        </span>
                      </div>

                      <div>
                        {isPresent ? (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded font-bold flex items-center gap-1 text-[11px] border border-emerald-300">
                            <CheckCircle2 size={13} /> Presente
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded font-bold flex items-center gap-1 text-[11px] border border-red-300">
                            <XCircle size={13} /> Ausente
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Botón Apelación Móvil */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenAppealModal}
              className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-[#C8102E] border border-red-200 rounded-[4px] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText size={14} />
              <span>Solicitar Justificación o Apelación</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
