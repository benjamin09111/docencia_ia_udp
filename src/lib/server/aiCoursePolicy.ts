/**
 * Política de curso para rutas de IA: por defecto solo sandbox.
 * Los cursos reales blindados (AGENTS.md) no deben ser destino implícito del LLM.
 */

const SANDBOX_COURSE_CODE = (process.env.AI_SANDBOX_COURSE_CODE || "CIT3000").toUpperCase();

/** Códigos de curso reales que la IA no debe usar como default ni forzar sin sandbox. */
const BLOCKED_DEFAULT_PREFIXES = ["CIT3203", "CIT2206", "CIT3100"];

export function getAiSandboxCourseCode(): string {
  return SANDBOX_COURSE_CODE;
}

/**
 * Resuelve un código de curso seguro para prompts / node_id del microservicio.
 * Si no hay código, o apunta a un curso real blindado, usa el sandbox.
 */
export function resolveAiCourseCode(raw?: string | null): string {
  const code = (raw || "").trim().toUpperCase();
  if (!code) return SANDBOX_COURSE_CODE;

  const base = code.split("_")[0] || code;
  if (BLOCKED_DEFAULT_PREFIXES.some((p) => base.startsWith(p))) {
    return SANDBOX_COURSE_CODE;
  }
  return base;
}

/** Identificador de nodo en el árbol agéntico Python (`course:cit3000`). */
export function toAgentCourseNodeId(raw?: string | null): string {
  return `course:${resolveAiCourseCode(raw).toLowerCase()}`;
}
