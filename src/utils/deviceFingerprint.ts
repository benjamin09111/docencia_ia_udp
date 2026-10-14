/**
 * Huella del dispositivo para la regla "un dispositivo = un alumno por clase".
 *
 * Usa solo señales de HARDWARE y NAVEGADOR que NO cambian entre una ventana normal y una de incógnito
 * (a diferencia de cookies y localStorage, que el incógnito vacía). El servidor la vuelve a firmar con un
 * secreto antes de guardarla.
 *
 * LIMITACIONES (hay que conocerlas):
 *  - Dos teléfonos idénticos (mismo modelo, mismo sistema y misma versión) pueden dar la misma huella:
 *    el segundo alumno recibe un bloqueo y debe usar "Apelar".
 *  - Navegadores que aleatorizan el canvas (p. ej. Brave) pueden generar una huella distinta en incógnito.
 *  - Detiene el truco casual del incógnito; un atacante técnico con herramientas de falsificación
 *    podría evadirla. Es una capa disuasiva, no infalible.
 */

async function sha256Hex(text: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Respaldo (contexto no seguro): hash FNV-1a repetido hasta 64 hex
  let h = 0x811c9dc5;
  let out = "";
  for (let round = 0; round < 8; round++) {
    for (let i = 0; i < text.length; i++) h = Math.imul(h ^ (text.charCodeAt(i) + round), 0x01000193) >>> 0;
    out += h.toString(16).padStart(8, "0");
  }
  return out;
}

function canvasSignal(): string {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 40;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "no-canvas";
    ctx.textBaseline = "top";
    ctx.font = "16px Arial";
    ctx.fillStyle = "#f60";
    ctx.fillRect(10, 5, 80, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("UDP asistencia ñÁ 2026", 4, 12);
    return canvas.toDataURL();
  } catch {
    return "canvas-error";
  }
}

function webglSignal(): string {
  try {
    const gl = document.createElement("canvas").getContext("webgl") as WebGLRenderingContext | null;
    if (!gl) return "no-webgl";
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    return ext
      ? `${gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)}|${gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)}`
      : `${gl.getParameter(gl.VENDOR)}|${gl.getParameter(gl.RENDERER)}`;
  } catch {
    return "webgl-error";
  }
}

/** Huella de 64 caracteres hexadecimales, estable entre ventana normal e incógnito. */
export async function getDeviceFingerprint(): Promise<string> {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const signals = [
    nav.userAgent,
    nav.language,
    (nav.languages || []).join(","),
    nav.platform,
    nav.hardwareConcurrency,
    nav.deviceMemory,
    nav.maxTouchPoints,
    screen.width,
    screen.height,
    screen.colorDepth,
    window.devicePixelRatio,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvasSignal(),
    webglSignal(),
  ];
  return sha256Hex(signals.join("||"));
}
