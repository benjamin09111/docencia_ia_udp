export type AutomationRuleType = "asistencia_compartida" | "nota_grupal" | "alerta_riesgo";

export interface SharedAttendanceConfig {
  sectionId?: string; // "all" | "sec_1" | "CIT3203_CA01"
  minPresentCount?: number; // ej. 2 (mínimo de integrantes presentes)
  minPresentPct?: number; // ej. 50 (%)
  onlyAyudantias?: boolean;
}

export interface AutomationRule {
  id: string;
  courseCode: string;
  name: string; // ej. "Asistencia Compartida - Sección 1"
  description: string;
  type: AutomationRuleType;
  enabled: boolean;
  config: SharedAttendanceConfig;
  createdAt: string;
  lastExecutedAt?: string;
  lastExecutionStats?: {
    benefitedCount: number;
    sessionsCount: number;
  };
}

export interface RuleExecutionAffectedStudent {
  studentName: string;
  canvasId: number;
  sessionId: string;
  sessionDate: string;
  groupName: string;
}

export interface RuleExecutionResult {
  ruleId: string;
  ruleName: string;
  appliedCount: number;
  affectedDetails: RuleExecutionAffectedStudent[];
  timestamp: string;
}
