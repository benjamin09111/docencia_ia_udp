"use client";

import React, { useState } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { Printer, Download, X, CheckCircle2, FileText, Check } from "lucide-react";

interface EvaluationPdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluacion: {
    titulo: string;
    tipo: string;
    codigo: string;
    curso: string;
    tiempo: string;
    preguntasCount: number;
    puntajeTotal: number;
  };
}

export const EvaluationPdfPreviewModal: React.FC<EvaluationPdfPreviewModalProps> = ({
  isOpen,
  onClose,
  evaluacion,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-[#E0E3E6] rounded-[6px] shadow-2xl max-w-3xl w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-start border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-50 text-[#C8102E] rounded border border-red-200">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2D3B45]">
                Vista Previa de Impresión: Formato Estándar UDP
              </h3>
              <p className="text-xs text-[#6B7780]">
                {evaluacion.tipo} Oficial • Listo para imprenta o aplicación presencial
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={18} />
          </button>
        </div>

        {downloaded && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>Documento enviado al spooler de impresión institucional / PDF descargado.</span>
          </div>
        )}

        {/* Simulación Hoja Impresa Estándar UDP */}
        <div className="p-6 bg-white border-2 border-gray-300 rounded shadow-xs space-y-4 text-xs font-serif text-gray-900">
          {/* Membrete Oficial */}
          <div className="flex justify-between items-start border-b-2 border-black pb-3">
            <div>
              <div className="font-bold text-xs uppercase tracking-wider text-black font-sans">
                Universidad Diego Portales
              </div>
              <div className="text-[11px] text-gray-700 font-sans">
                Facultad de Ingeniería • Escuela de Informática y Telecomunicaciones
              </div>
              <div className="text-[11px] text-gray-800 font-bold font-sans mt-0.5">
                {evaluacion.curso} ({evaluacion.codigo})
              </div>
            </div>
            <div className="text-right font-sans text-[11px]">
              <div className="font-bold uppercase text-[#C8102E]">{evaluacion.tipo}</div>
              <div>Semestre Otoño 2026</div>
              <div className="text-gray-600 font-mono text-[10px]">Tiempo: {evaluacion.tiempo}</div>
            </div>
          </div>

          {/* Casillas de Identificación */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-gray-50 border border-gray-300 rounded text-[11px] font-sans">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Estudiante:</span>
              <span className="border-b border-dotted border-gray-400 block h-4" />
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">RUT:</span>
              <span className="border-b border-dotted border-gray-400 block h-4" />
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Sección:</span>
              <span className="border-b border-dotted border-gray-400 block h-4" />
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Puntaje / Nota:</span>
              <span className="border-b border-dotted border-gray-400 block h-4 font-bold text-center">/ {evaluacion.puntajeTotal} pts</span>
            </div>
          </div>

          {/* Instrucciones Generales */}
          <div className="p-2.5 bg-gray-50/70 border border-gray-200 rounded text-[10px] font-sans text-gray-600 space-y-0.5">
            <strong>Instrucciones:</strong> Lea atentamente cada enunciado. Responda con letra clara y legible. Justifique técnicamente cada una de sus afirmaciones según los estándares y bibliografía oficial del curso. El puntaje máximo es de {evaluacion.puntajeTotal} puntos correspondientes a la nota 7.0. Prohibido el uso de dispositivos celulares.
          </div>

          {/* Preguntas de Ejemplo Estándar */}
          <div className="space-y-4 pt-2 font-sans">
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-xs text-gray-900">
                <span>Pregunta 1: Análisis de Dominio y Estimación (25 pts)</span>
                <span className="text-[10px] text-gray-500 font-mono">[RAP 1 - PMBOK 7ma]</span>
              </div>
              <p className="text-[11px] text-gray-700 leading-relaxed">
                Considere una empresa fintech que debe migrar su pasarela de pagos a microservicios bajo regulación CMF. Describa la estructura de desglose de trabajo (EDT/WBS) para la fase de arquitectura y proponga 3 indicadores de riesgo crítico.
              </p>
              <div className="border border-gray-200 rounded h-16 bg-gray-50/40 p-2 text-[10px] text-gray-400 italic">
                [Espacio asignado para desarrollo del estudiante]
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-bold text-xs text-gray-900">
                <span>Pregunta 2: Aplicación Metodológica y Gobernanza (25 pts)</span>
                <span className="text-[10px] text-gray-500 font-mono">[RAP 2 - SCRUM & GÉNERO]</span>
              </div>
              <p className="text-[11px] text-gray-700 leading-relaxed">
                Diseñe una propuesta de asignación de roles técnicos para un sprint de 3 semanas, garantizando rotación en el liderazgo de arquitectura y cumplimiento del protocolo CREA UDP.
              </p>
              <div className="border border-gray-200 rounded h-16 bg-gray-50/40 p-2 text-[10px] text-gray-400 italic">
                [Espacio asignado para desarrollo del estudiante]
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-[11px] text-gray-500">
            Formato oficial estandarizado de evaluaciones UDP • Tipografía Inter & Times
          </span>
          <div className="flex gap-2">
            <CanvasButton variant="outline" size="sm" onClick={onClose}>
              Cerrar
            </CanvasButton>
            <CanvasButton
              variant="primary-udp"
              size="sm"
              icon={<Printer size={14} />}
              onClick={handlePrint}
            >
              Imprimir PDF Oficial UDP
            </CanvasButton>
          </div>
        </div>
      </div>
    </div>
  );
};
