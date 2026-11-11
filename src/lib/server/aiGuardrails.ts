import { checkRateLimit } from "./rateLimit";

const PROMPT_INJECTION_PATTERNS = [
  /(?:ignore|disregard|forget|override)\s+(?:all\s+)?(?:previous|prior|system|initial)\s+(?:instructions|prompts|rules|commands)/i,
  /(?:ignora|olvida|descarta|anula)\s+(?:todas\s+)?(?:las\s+)?(?:instrucciones|reglas|ordenes|prompts)\s+(?:anteriores|previas|del\s+sistema)/i,
  /\b(?:dan\s+mode|jailbreak|developer\s+mode|unrestricted\s+mode|modo\s+desarrollador)\b/i,
  /\b(?:you\s+are\s+now|act\s+as|ahora\s+eres)\s+(?:an?\s+)?(?:unfiltered|uncensored|evil|sin\s+restricciones|sin\s+censura)\b/i,
  /(?:system\s*override|bypass\s+safety|bypassing\s+guardrails|saltarse\s+las?\s+reglas)/i,
];

const PROMPT_EXTRACTION_PATTERNS = [
  /(?:reveal|output|display|show|print|tell\s+me|extract|dump|repeat)\s+(?:your\s+)?(?:system\s+prompt|initial\s+prompt|hidden\s+instructions|system\s+instructions|developer\s+instructions|rules|core\s+prompt)/i,
  /(?:muestra|dime|revela|imprime|cual\s+es|repite|extrae|copia)\s+(?:tu\s+)?(?:system\s+prompt|prompt\s+del\s+sistema|instrucciones\s+iniciales|instrucciones\s+del\s+sistema|reglas\s+base|prompt\s+interno)/i,
  /(?:what\s+is\s+your\s+system\s+prompt|what\s+are\s+your\s+instructions|cu[aá]les\s+son\s+tus\s+instrucciones)/i,
  /(?:repeat\s+everything\s+(?:above|before)|repite\s+todo\s+(?:lo\s+anterior|arriba))/i,
];

const CODE_EXTRACTION_PATTERNS = [
  /(?:print|show|dump|view|read|cat|export)\s+(?:the\s+)?(?:source\s+code|backend\s+code|python\s+code|internal\s+files?|endpoints?|secrets?|keys?)/i,
  /(?:mu[eé]strame|imprime|muestra|dame|lee|extrae)\s+(?:el\s+)?(?:c[oó]digo\s+fuente|c[oó]digo\s+python|c[oó]digo\s+del\s+backend|archivos\s+internos|claves?|secretos?)/i,
  /\b(?:main\.py|engine\.py|submission_evaluator\.py|agentServicesClient\.ts|userTokenStore\.ts)\b/i,
  /(?:eval\s*\(|exec\s*\(|__import__|process\.env|subprocess\.Popen)/i,
];

const SENSITIVE_OUTPUT_PATTERNS = [
  /\b(?:AGENT_SERVICE_API_KEY|OPENROUTER_API_KEY|SESSION_SECRET|SUPABASE_SERVICE_ROLE_KEY|CANVAS_API_TOKEN)\b/,
  /\b(?:sb_secret_|sk-or-v1-|sk-[a-zA-Z0-9]{20,})\b/,
  /class\s+(?:AgenticLoopEngine|SubmissionEvaluatorWorker)/,
  /def\s+(?:run_turn|evaluate_submission|_call_llm)/,
  /(?:DIRECTIVA DE SEGURIDAD ESTRICTA|Eres el Agente Evaluador formativa)/,
];

export interface GuardrailCheckResult {
  allowed: boolean;
  reason?: string;
  category?: "prompt_injection" | "prompt_extraction" | "code_extraction" | "rate_limited";
}

/**
 * Valida la entrada del usuario antes de invocar los modelos de lenguaje (LLM).
 * Protege contra inyecciones de prompts, intentos de extracción del sistema y robo de código.
 */
export function validateAiInput(text: string, userId = "anonymous"): GuardrailCheckResult {
  const clean = text.trim();

  // 1. Rate Limiting de consultas IA por usuario (anti-fuzzing y anti-scraping de LLMs)
  const rate = checkRateLimit(`ai:user:${userId}`, 30, 60 * 1000);
  if (!rate.allowed) {
    return {
      allowed: false,
      reason: "Demasiadas consultas de IA en poco tiempo. Por seguridad, espera unos segundos.",
      category: "rate_limited",
    };
  }

  // 2. Detección de Prompt Injection / Jailbreaks
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(clean)) {
      return {
        allowed: false,
        reason: "La consulta contiene patrones de manipulación o anulación de instrucciones no permitidos.",
        category: "prompt_injection",
      };
    }
  }

  // 3. Detección de Extracción de System Prompts
  for (const pattern of PROMPT_EXTRACTION_PATTERNS) {
    if (pattern.test(clean)) {
      return {
        allowed: false,
        reason: "Por directiva de seguridad, las instrucciones internas del sistema y configuración no son divulgables.",
        category: "prompt_extraction",
      };
    }
  }

  // 4. Detección de Extracción de Código Fuente
  for (const pattern of CODE_EXTRACTION_PATTERNS) {
    if (pattern.test(clean)) {
      return {
        allowed: false,
        reason: "Por seguridad institucional, el código fuente y arquitectura interna del servidor están blindados.",
        category: "code_extraction",
      };
    }
  }

  return { allowed: true };
}

/**
 * Filtro de Salida (Data Loss Prevention - DLP).
 * Inspecciona las respuestas de los LLMs para asegurar que jamás revelen secretos o código del servidor.
 */
export function sanitizeAiOutput(output: string): string {
  if (!output) return output;

  for (const pattern of SENSITIVE_OUTPUT_PATTERNS) {
    if (pattern.test(output)) {
      console.warn("[aiGuardrails] Bloqueada respuesta de LLM con posible fuga de código o credenciales.");
      return "Respuesta protegida por la política de seguridad institucional. Los agentes operan exclusivamente en el ámbito pedagógico.";
    }
  }

  return output;
}
