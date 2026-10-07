import { AutomationRule } from "@/types/automations";

const RULES_STORAGE_KEY = "udp_course_rules_v1";

const DEFAULT_RULES: AutomationRule[] = [
  {
    id: "rule_cit3203_shared_att_sec1",
    courseCode: "CIT3203_CA01",
    name: "Regla Asistencia Compartida — Sección 1",
    description: "Si asisten al menos 2 integrantes de un grupo definido (quórum ≥ 50%), se marca presente a todo el grupo en la sesión de ayudantía.",
    type: "asistencia_compartida",
    enabled: true,
    config: {
      sectionId: "sec_1",
      minPresentCount: 2,
      minPresentPct: 50,
      onlyAyudantias: true,
    },
    createdAt: new Date().toISOString(),
  },
];

export function getSavedRules(courseCode?: string): AutomationRule[] {
  if (typeof window === "undefined") return DEFAULT_RULES;
  try {
    const raw = localStorage.getItem(RULES_STORAGE_KEY);
    const list: AutomationRule[] = raw ? JSON.parse(raw) : DEFAULT_RULES;
    if (!courseCode) return list;
    return list.filter((r) => r.courseCode === courseCode || courseCode.includes(r.courseCode));
  } catch {
    return DEFAULT_RULES;
  }
}

export function saveRules(rules: AutomationRule[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(rules));
    window.dispatchEvent(new CustomEvent("udp_rules_updated", { detail: rules }));
    if ("BroadcastChannel" in window) {
      try {
        const ch = new BroadcastChannel("udp_rules_channel");
        ch.postMessage({ type: "RULES_SYNC", timestamp: Date.now() });
        ch.close();
      } catch {}
    }
  } catch (e) {
    console.error("Error saving rules to localStorage:", e);
  }
}

export function createRule(courseCode: string, rule: Omit<AutomationRule, "id" | "createdAt" | "courseCode">): AutomationRule {
  const current = getSavedRules();
  const newRule: AutomationRule = {
    ...rule,
    id: `rule_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    courseCode,
    createdAt: new Date().toISOString(),
  };

  const updated = [newRule, ...current];
  saveRules(updated);
  return newRule;
}

export function updateRule(ruleId: string, updates: Partial<AutomationRule>): AutomationRule | null {
  const current = getSavedRules();
  let found: AutomationRule | null = null;
  const updated = current.map((r) => {
    if (r.id === ruleId) {
      found = { ...r, ...updates };
      return found;
    }
    return r;
  });
  if (found) saveRules(updated);
  return found;
}

export function deleteRule(ruleId: string): boolean {
  const current = getSavedRules();
  const filtered = current.filter((r) => r.id !== ruleId);
  if (filtered.length !== current.length) {
    saveRules(filtered);
    return true;
  }
  return false;
}

export function toggleRuleEnabled(ruleId: string, enabled?: boolean): AutomationRule | null {
  const current = getSavedRules();
  let found: AutomationRule | null = null;
  const updated = current.map((r) => {
    if (r.id === ruleId) {
      const nextState = enabled !== undefined ? enabled : !r.enabled;
      found = { ...r, enabled: nextState };
      return found;
    }
    return r;
  });
  if (found) saveRules(updated);
  return found;
}

export function recordRuleExecution(
  ruleId: string,
  stats: { benefitedCount: number; sessionsCount: number }
): void {
  updateRule(ruleId, {
    lastExecutedAt: new Date().toISOString(),
    lastExecutionStats: stats,
  });
}
