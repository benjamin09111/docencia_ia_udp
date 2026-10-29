export type AgentTier = "root" | "supervisor" | "course_manager" | "specialist_worker";
export type AgentStatus = "activo" | "en_pruebas" | "mantenimiento";

export interface SystemAgentRecord {
  id: string;
  name: string;
  code: string;
  tier: AgentTier;
  tierLabel: string;
  scope: string;
  roleDescription: string;
  openRouterModel: string;
  costTier: "low" | "medium" | "high" | "xhigh";
  tools: string[];
  status: AgentStatus;
  sandboxReady: boolean;
  targetCourse?: string;
}
