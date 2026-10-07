/**
 * Helper para resolución de URLs de la aplicación.
 * Garantiza cero hardcoding de localhost y compatibilidad total con despliegues a producción.
 */

export function getAppBaseUrl(): string {
  // 1. En el navegador del usuario, el origen real es siempre window.location.origin
  if (typeof window !== "undefined" && window.location?.origin) {
    const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
    // Si hay un dominio institucional explícito de producción configurado (que no sea localhost), lo usamos
    if (envUrl && !envUrl.includes("localhost") && envUrl.startsWith("http")) {
      return envUrl.replace(/\/+$/, "");
    }
    return window.location.origin.replace(/\/+$/, "");
  }

  // 2. En SSR: Variable de entorno explícita de producción (.env)
  if (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.trim() !== "") {
    const envUrl = process.env.NEXT_PUBLIC_APP_URL.trim();
    if (!envUrl.includes("localhost")) {
      return envUrl.replace(/\/+$/, "");
    }
  }

  // 3. Dominio automático de Vercel en preview/production
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL.replace(/\/+$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, "")}`;
  }

  // 4. Fallback de desarrollo local
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
