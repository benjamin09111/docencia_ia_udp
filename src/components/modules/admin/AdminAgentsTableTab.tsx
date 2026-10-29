"use client";

import React, { useMemo, useState } from "react";
import { CanvasTable, CanvasTableHeader, CanvasTableRow, CanvasTableCell } from "@/components/canvas/CanvasTable";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";
import { CanvasBadge, BadgeVariant } from "@/components/canvas/CanvasBadge";
import { CanvasActionMenu, ActionMenuItem } from "@/components/canvas/CanvasActionMenu";
import { SystemAgentRecord } from "@/types/aiAgentCatalog";
import { SYSTEM_AGENTS_DATA } from "@/constants/systemAgentsCatalog";
import { Bot, Cpu, Sparkles, Wrench, ExternalLink, PlayCircle } from "lucide-react";

interface AdminAgentsTableTabProps {
  agents?: SystemAgentRecord[];
  showTierFilters?: boolean;
  searchPlaceholder?: string;
  onSelectAgent?: (agent: SystemAgentRecord) => void;
  onTestInSandbox?: (agent: SystemAgentRecord) => void;
}

export const AdminAgentsTableTab: React.FC<AdminAgentsTableTabProps> = ({
  agents = SYSTEM_AGENTS_DATA,
  showTierFilters = true,
  searchPlaceholder = "Buscar por agente, código o modelo OpenRouter...",
  onSelectAgent,
  onTestInSandbox,
}) => {
  const [search, setSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("all");

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchSearch =
        agent.name.toLowerCase().includes(search.toLowerCase()) ||
        agent.code.toLowerCase().includes(search.toLowerCase()) ||
        agent.openRouterModel.toLowerCase().includes(search.toLowerCase()) ||
        agent.scope.toLowerCase().includes(search.toLowerCase());
      const matchTier = selectedTier === "all" || agent.tier === selectedTier;
      return matchSearch && (showTierFilters ? matchTier : true);
    });
  }, [agents, search, selectedTier, showTierFilters]);

  const getTierBadgeVariant = (tier: string): BadgeVariant => {
    if (tier === "root") return "udp";
    if (tier === "supervisor") return "info";
    if (tier === "course_manager") return "warning";
    return "success";
  };

  const getCostBadgeVariant = (cost: string): BadgeVariant => {
    if (cost === "low") return "success";
    if (cost === "medium") return "info";
    return "warning";
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <CanvasToolbar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder={searchPlaceholder}
        primaryButtonLabel="+ Registrar Agente"
        onPrimaryClick={() => {}}
      />

      {/* Filtros rápidos por nivel jerárquico */}
      {showTierFilters && (
        <div className="flex items-center gap-2 text-xs text-[#2D3B45] overflow-x-auto pb-1">
          <span className="font-semibold text-gray-500">Jerarquía:</span>
        {[
          { id: "all", label: "Todos los niveles" },
          { id: "specialist_worker", label: "Workers Especialistas" },
          { id: "course_manager", label: "Supervisores de Curso" },
          { id: "supervisor", label: "Supervisores Escuela" },
          { id: "root", label: "Orquestador Raíz" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedTier(t.id)}
            className={`px-2.5 py-1 rounded-[4px] border transition-colors ${
              selectedTier === t.id
                ? "bg-[#2D3B45] text-white border-[#2D3B45] font-semibold"
                : "bg-white text-[#2D3B45] border-[#E0E3E6] hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      )}

      {/* Tabla Canónica de Agentes Canvas */}
      <CanvasTable>
        <CanvasTableHeader>
          <tr>
            <th className="p-3 text-left">Agente / Identificador</th>
            <th className="p-3 text-left">Nivel Jerárquico</th>
            <th className="p-3 text-left">Ámbito / Especialidad</th>
            <th className="p-3 text-left">Modelo OpenRouter</th>
            <th className="p-3 text-center">Herramientas</th>
            <th className="p-3 text-center">Estado</th>
            <th className="p-3 text-right">Acciones</th>
          </tr>
        </CanvasTableHeader>
        <tbody>
          {filteredAgents.length === 0 ? (
            <CanvasTableRow hoverable={false}>
              <CanvasTableCell colSpan={7} className="text-center py-8 text-gray-500">
                No se encontraron agentes que coincidan con la búsqueda.
              </CanvasTableCell>
            </CanvasTableRow>
          ) : (
            filteredAgents.map((agent) => {
              const menuActions: ActionMenuItem[] = [
                {
                  label: "Ver detalles del agente",
                  icon: <ExternalLink size={14} />,
                  onClick: () => onSelectAgent?.(agent),
                },
                {
                  label: "Probar en Sandbox (CIT3000)",
                  icon: <PlayCircle size={14} className="text-emerald-600" />,
                  onClick: () => onTestInSandbox?.(agent),
                  disabled: !agent.sandboxReady,
                },
              ];

              return (
                <CanvasTableRow key={agent.id} onClick={() => onSelectAgent?.(agent)}>
                  <CanvasTableCell>
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 p-1.5 rounded bg-gray-50 border border-gray-200 text-[#008EE2] shrink-0">
                        {agent.tier === "specialist_worker" ? <Wrench size={15} /> : <Bot size={15} />}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-[#2D3B45] hover:text-[#008EE2]">
                          {agent.name}
                        </div>
                        <div className="font-mono text-xs text-gray-400">
                          {agent.code}
                        </div>
                      </div>
                    </div>
                  </CanvasTableCell>

                  <CanvasTableCell>
                    <CanvasBadge variant={getTierBadgeVariant(agent.tier)}>
                      {agent.tierLabel}
                    </CanvasBadge>
                  </CanvasTableCell>

                  <CanvasTableCell>
                    <div className="font-medium text-sm text-[#2D3B45]">{agent.scope}</div>
                    <div className="text-xs text-gray-500 line-clamp-1" title={agent.roleDescription}>
                      {agent.roleDescription}
                    </div>
                  </CanvasTableCell>

                  <CanvasTableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-medium">
                        {agent.openRouterModel}
                      </span>
                      <CanvasBadge variant={getCostBadgeVariant(agent.costTier)}>
                        {agent.costTier}
                      </CanvasBadge>
                    </div>
                  </CanvasTableCell>

                  <CanvasTableCell align="center">
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                      <Sparkles size={12} className="text-amber-600" />
                      {agent.tools.length} tools
                    </span>
                  </CanvasTableCell>

                  <CanvasTableCell align="center">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Activo
                    </span>
                  </CanvasTableCell>

                  <CanvasTableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <CanvasActionMenu items={menuActions} ariaLabel={`Acciones para ${agent.name}`} />
                  </CanvasTableCell>
                </CanvasTableRow>
              );
            })
          )}
        </tbody>
      </CanvasTable>
    </div>
  );
};
