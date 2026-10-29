const PERSONAL_DATA_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "RUT", pattern: /\b\d{1,2}(?:\.\d{3}){2}-?[\dKk]\b|\b\d{7,8}-?[\dKk]\b/ },
  { label: "correo electrónico", pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i },
  { label: "teléfono", pattern: /(?:\+?56\s?)?(?:9\s?\d{4}\s?\d{4}|2\s?\d{4}\s?\d{4})\b/ },
  { label: "dirección IP", pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/ },
  { label: "coordenadas", pattern: /-?\d{1,2}\.\d{4,}\s*,\s*-?\d{1,3}\.\d{4,}/ },
  { label: "identificador Canvas", pattern: /\bcanvas\s*(?:id|user|usuario)?\s*[:#-]?\s*\d{4,}\b/i },
];

export type AiPrivacyCheck =
  | { allowed: true }
  | { allowed: false; categories: string[] };

/**
 * Barrera previa a cualquier proveedor externo: la IA no recibe identificadores
 * personales ni datos de localización. Los nombres y entregas identificables se
 * deben pseudonimizar en un flujo especializado antes de llegar a esta ruta.
 */
export function checkAiPrivacy(text: string): AiPrivacyCheck {
  const categories = PERSONAL_DATA_PATTERNS.filter(({ pattern }) => pattern.test(text)).map(({ label }) => label);
  return categories.length ? { allowed: false, categories } : { allowed: true };
}

/** Las llamadas fuera de la red local requieren habilitación explícita en entorno. */
export function externalAiProcessingEnabled(): boolean {
  return process.env.AI_EXTERNAL_PROCESSING_ENABLED === "true";
}
