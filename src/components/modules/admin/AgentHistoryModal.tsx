"use client";

import React from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import {
  CanvasTable,
  CanvasTableHeader,
  CanvasTableRow,
  CanvasTableCell,
} from "@/components/canvas/CanvasTable";
import {
  X,
  History,
  CheckCircle2,
  Cpu,
  Clock,
  Zap,
  Sparkles,
  Bot,
} from "lucide-react";

export interface AgentHistoryEntry {
  id: string;
  timestamp: string;
  curso: string;
  accion: string;
  tokens: number;
  duracionMs: number;
  estado: "completado" | "advertencia" | "error";
}

export interface TechnicalAgentItem {
  id: string;
  codigo: string;
  nombre: string;
  especialidad: string;
  descripcion: string;
  ambito: string;
  modelo: string;
  temperatura: number;
  systemPrompt: string;
  historial: AgentHistoryEntry[];
}

interface AgentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: TechnicalAgentItem | null;
}

export const AgentHistoryModal: React.FC<AgentHistoryModalProps> = ({
  isOpen,
  onClose,
  agent,
}) => {
  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-[6px] border border-[#E0E3E6] shadow-canvas-modal max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex justify-between items-start bg-[#FAFBFB]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-[#008EE2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {agent.codigo}
              </span>
              <span className="text-xs text-[#6B7780]">{agent.ambito}</span>
            </div>
            <h2 className="text-base font-bold text-[#2D3B45] flex items-center gap-2">
              <History size={17} className="text-[#008EE2]" />
              Historial de Ejecuciones: {agent.nombre}
            </h2>
            <p className="text-xs text-[#6B7780]">
              Auditoría de llamadas, tiempos de respuesta y tokens consumidos en el ecosistema UDP.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Resumen Superior */}
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-[10px] text-gray-500 uppercase block font-semibold">Total Invocaciones</span>
            <span className="text-sm font-bold text-[#2D3B45]">{agent.historial.length} eventos</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase block font-semibold">Modelo Activo</span>
            <span className="text-sm font-mono font-bold text-purple-700">{agent.modelo}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase block font-semibold">Tasa de Éxito</span>
            <span className="text-sm font-bold text-emerald-700">100% OK</span>
          </div>
        </div>

        {/* Tabla de Historial Reutilizable */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          <CanvasTable tableClassName="min-w-[550px]">
            <CanvasTableHeader>
              <tr>
                <th className="p-2.5">Fecha & Hora</th>
                <th className="p-2.5">Curso / Contexto</th>
                <th className="p-2.5">Acción Ejecutada</th>
                <th className="p-2.5 text-center">Tokens</th>
                <th className="p-2.5 text-center">Latencia</th>
                <th className="p-2.5 text-right">Estado</th>
              </tr>
            </CanvasTableHeader>
            <tbody>
              {agent.historial.map((item) => (
                <CanvasTableRow key={item.id} hoverable={true}>
                  <CanvasTableCell>
                    <span className="text-[11px] font-mono text-gray-600 block">
                      {item.timestamp}
                    </span>
                  </CanvasTableCell>
                  <CanvasTableCell>
                    <span className="text-xs font-semibold text-[#008EE2]">
                      {item.curso}
                    </span>
                  </CanvasTableCell>
                  <CanvasTableCell>
                    <span className="text-xs text-[#2D3B45] font-medium">
                      {item.accion}
                    </span>
                  </CanvasTableCell>
                  <CanvasTableCell align="center">
                    <span className="text-[11px] font-mono text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                      {item.tokens.toLocaleString()}
                    </span>
                  </CanvasTableCell>
                  <CanvasTableCell align="center">
                    <span className="text-[11px] text-gray-500 font-mono">
                      {item.duracionMs} ms
                    </span>
                  </CanvasTableCell>
                  <CanvasTableCell align="right">
                    <CanvasBadge variant="success">Éxito 200</CanvasBadge>
                  </CanvasTableCell>
                </CanvasTableRow>
              ))}
            </tbody>
          </CanvasTable>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-200 bg-[#FAFBFB] flex justify-between items-center text-xs">
          <span className="text-[11px] text-[#6B7780]">
            Registro auditado bajo la gobernanza del Centro CREA y Escuela de Informática UDP
          </span>
          <CanvasButton variant="outline" size="sm" onClick={onClose}>
            Cerrar Historial
          </CanvasButton>
        </div>
      </div>
    </div>
  );
};
