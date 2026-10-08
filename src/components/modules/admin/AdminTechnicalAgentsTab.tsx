"use client";

import React, { useState } from "react";
import { Cpu, History, Edit3 } from "lucide-react";
import { CanvasItemGroup, CanvasItemRow } from "@/components/canvas/CanvasItemGroup";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";
import { TechnicalAgentItem } from "./AgentHistoryModal";

interface AdminTechnicalAgentsTabProps {
  technicalAgents: TechnicalAgentItem[];
  onOpenHistory: (agent: TechnicalAgentItem) => void;
  onOpenEdit: (agent: TechnicalAgentItem) => void;
}

export const AdminTechnicalAgentsTab: React.FC<AdminTechnicalAgentsTabProps> = ({
  technicalAgents,
  onOpenHistory,
  onOpenEdit,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgents = technicalAgents.filter((agent) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      agent.nombre.toLowerCase().includes(q) ||
      agent.codigo.toLowerCase().includes(q) ||
      agent.especialidad.toLowerCase().includes(q) ||
      agent.ambito.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <CanvasToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar agente técnico..."
        primaryButtonLabel="+ Agente Técnico"
        onPrimaryClick={() => {}}
        secondaryButtonLabel="+ Servicio"
        onSecondaryClick={() => {}}
      />

      <CanvasItemGroup
        title="Agentes Técnicos de Infraestructura (Servicios Compartidos)"
        weightBadge={`${technicalAgents.length} servicios activos`}
      >
        {filteredAgents.map((agent) => (
          <CanvasItemRow
            key={agent.id}
            id={agent.id}
            icon={<Cpu size={16} className="text-[#008EE2]" />}
            indicatorColor="blue"
            isPublished={true}
            title={
              <span className="flex items-center gap-2">
                <span>{agent.nombre}</span>
                <span className="font-mono text-[10px] text-gray-500 font-normal">
                  ({agent.codigo})
                </span>
                <span className="text-[10px] bg-gray-100 text-[#2D3B45] px-1.5 py-0.2 rounded font-normal border border-gray-200">
                  {agent.ambito}
                </span>
              </span>
            }
            subtitle={
              <span>
                <strong>{agent.especialidad}:</strong> {agent.descripcion}
              </span>
            }
            onClick={() => onOpenEdit(agent)}
            actionItems={[
              {
                label: "Ver historial del agente",
                icon: <History size={14} className="text-[#008EE2]" />,
                onClick: () => onOpenHistory(agent),
              },
              {
                label: "Editar parámetros del agente",
                icon: <Edit3 size={14} className="text-[#2D3B45]" />,
                onClick: () => onOpenEdit(agent),
              },
            ]}
          />
        ))}
      </CanvasItemGroup>
    </div>
  );
};
