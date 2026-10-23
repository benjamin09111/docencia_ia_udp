"use client";

import React from "react";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { EvaluationItem } from "@/constants/initialEvaluations";
import { Calendar, Clock, Printer, ExternalLink } from "lucide-react";

interface EvaluationCardProps {
  item: EvaluationItem;
  onPrint: (item: EvaluationItem) => void;
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({ item, onPrint }) => {
  return (
    <div className="p-4 bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card hover:border-blue-300 transition-all flex flex-col justify-between space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-bold rounded uppercase">
              {item.tipo}
            </span>
            <span className="px-2 py-0.5 bg-blue-50 text-[#008EE2] text-xs font-bold rounded">
              {item.ponderacion}
            </span>
          </div>
          <CanvasBadge variant={item.canvasSync ? "success" : "neutral"}>
            {item.canvasSync ? "✓ Tarea Canvas" : "Pendiente"}
          </CanvasBadge>
        </div>

        <h3 className="font-bold text-sm text-[#2D3B45] leading-snug">
          {item.titulo}
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-1">
          <div className="flex items-center gap-1">
            <Calendar size={13} className="text-gray-400" />
            <span>Fecha: {item.fecha}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={13} className="text-gray-400" />
            <span>Tiempo: {item.tiempo}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
        <span className="text-xs font-mono text-gray-500">
          Puntaje: {item.puntajeTotal} pts • {item.preguntasCount} preg.
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPrint(item)}
            className="px-2.5 py-1 text-xs font-semibold rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 flex items-center gap-1 cursor-pointer transition-colors"
            title="Imprimir prueba en formato oficial UDP"
          >
            <Printer size={13} />
            <span>Imprimir PDF</span>
          </button>

          <a
            href="https://udp.instructure.com/courses/44999/assignments"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 text-xs font-semibold rounded bg-blue-50 text-[#008EE2] hover:bg-blue-100 flex items-center gap-1 transition-colors"
            title="Ver en módulo de Tareas de Canvas"
          >
            <ExternalLink size={13} />
            <span>Canvas</span>
          </a>
        </div>
      </div>
    </div>
  );
};
