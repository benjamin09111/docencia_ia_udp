"use client";

import React, { useState } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasCourse, StudentExcelRow } from "@/types";
import { X, Send } from "lucide-react";

interface SendSchoolGradesModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CanvasCourse;
  estudiantesExcel: StudentExcelRow[];
  onConfirmSend: () => void;
}

export const SendSchoolGradesModal: React.FC<SendSchoolGradesModalProps> = ({
  isOpen,
  onClose,
  course,
  estudiantesExcel,
  onConfirmSend,
}) => {
  const [declared, setDeclared] = useState(true);

  if (!isOpen) return null;

  const averageGrade = (
    estudiantesExcel.reduce((acc, r) => acc + r.nota_final, 0) / (estudiantesExcel.length || 1)
  ).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-2xl max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-start border-b border-gray-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#2D3B45]">
                Enviar Planilla Oficial a Dirección de Escuela
              </h3>
              <span className="text-[10px] bg-red-100 text-red-800 font-mono font-bold px-1.5 py-0.5 rounded border border-red-200">
                Cierre Oficial
              </span>
            </div>
            <p className="text-xs text-[#6B7780] mt-0.5">
              Escuela de Informática y Telecomunicaciones • Envío de actas finales consolidadas
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs space-y-2">
          <div className="flex justify-between text-gray-700">
            <span className="font-semibold">Asignatura:</span>
            <span className="font-mono text-gray-900">{course.code} — {course.name}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span className="font-semibold">Profesor Titular a Cargo:</span>
            <span className="font-medium text-gray-900">Jorge Esteban Cruz León</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span className="font-semibold">Nómina Estudiantes:</span>
            <span>{estudiantesExcel.length} alumnos registrados (solo RUT)</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span className="font-semibold">Promedio General del Curso:</span>
            <span className="font-bold text-[#008EE2]">{averageGrade}</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900 space-y-1">
          <span className="font-bold block text-blue-950">
            📋 Certificación y Cierre Académico:
          </span>
          <span className="text-[11px] block leading-relaxed text-blue-900">
            Al confirmar el envío, la planilla final anonimizada por RUT con el 100% de las notas y cálculo de asistencia quedará radicada en la Secretaría de Estudios de la Escuela de Informática. Se emitirá el comprobante oficial de recepción con folio electrónico.
          </span>
        </div>

        <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={declared}
            onChange={(e) => setDeclared(e.target.checked)}
            className="rounded text-[#C8102E] focus:ring-[#C8102E]"
          />
          <span className="text-[11px]">
            Declaro que he revisado las calificaciones y asistencia conforme al reglamento académico UDP.
          </span>
        </label>

        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <CanvasButton variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </CanvasButton>
          <CanvasButton
            variant="primary-udp"
            size="sm"
            icon={<Send size={14} />}
            disabled={!declared}
            onClick={onConfirmSend}
          >
            Confirmar Envío a la Escuela
          </CanvasButton>
        </div>
      </div>
    </div>
  );
};
