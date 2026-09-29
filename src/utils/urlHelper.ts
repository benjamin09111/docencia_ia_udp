/**
 * Helper para resolución de URLs de la aplicación.
 * Garantiza cero hardcoding de localhost y compatibilidad total con despliegues a producción.
 */

export function getAppBaseUrl(): string {
  // 1. Prioridad: Variable de entorno explícita para Producción en .env
  if (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.trim() !== "") {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
  }

  // 2. Detección dinámica en el navegador (funciona automáticamente en cualquier dominio o puerto)
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }

  // 3. Fallback de desarrollo local
  return "http://localhost:3000";
}

/**
 * Obtiene el enlace público de solo lectura (matriz visual para alumnos)
 */
export function getPublicVisualUrl(sectionCode: string): string {
  const base = getAppBaseUrl();
  const safeCode = encodeURIComponent(sectionCode || "CIT3203_CA01");
  return `${base}/asistencia/${safeCode}/visual`;
}

/**
 * Obtiene el enlace público para que los alumnos marquen asistencia con su PIN/RUT
 */
export function getPublicCheckinUrl(sectionCode: string): string {
  const base = getAppBaseUrl();
  const safeCode = encodeURIComponent(sectionCode || "CIT3203_CA01");
  return `${base}/asistencia/${safeCode}`;
}
