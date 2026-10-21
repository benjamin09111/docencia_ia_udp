export interface DeviceSignals {
  canvas: string;
  webgl: string;
  audio: string;
  screen: {
    w: number;
    h: number;
    availW: number;
    availH: number;
    colorDepth: number;
    pixelRatio: number;
  };
  hardware: {
    cores: number;
    memory?: number;
    touchPoints: number;
    platform: string;
  };
  locale: {
    timezone: string;
    languages: string;
  };
}

async function sha256Hex(text: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
  }
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

async function audioSignal(): Promise<string> {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return "no-audio";
    const ctx = new OfflineAudioContext(1, 44100, 44100);
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(10000, ctx.currentTime);

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.setValueAtTime(-50, ctx.currentTime);
    comp.knee.setValueAtTime(40, ctx.currentTime);
    comp.ratio.setValueAtTime(12, ctx.currentTime);
    comp.attack.setValueAtTime(0, ctx.currentTime);
    comp.release.setValueAtTime(0.25, ctx.currentTime);

    osc.connect(comp);
    comp.connect(ctx.destination);
    osc.start(0);

    const rendered = await ctx.startRendering();
    let sum = 0;
    const channel = rendered.getChannelData(0);
    for (let i = 4500; i < 5000; i++) sum += Math.abs(channel[i] || 0);
    return sum.toFixed(6);
  } catch {
    return "audio-error";
  }
}

/** Recopila las señales de hardware inmutables entre ventana normal e incógnito */
export async function getDeviceSignals(): Promise<DeviceSignals> {
  const nav = (typeof navigator !== "undefined" ? navigator : {}) as Navigator & { deviceMemory?: number };
  const scr = typeof screen !== "undefined" ? screen : ({} as Screen);
  const audio = typeof window !== "undefined" ? await audioSignal() : "ssr";

  return {
    canvas: typeof document !== "undefined" ? canvasSignal() : "ssr",
    webgl: typeof document !== "undefined" ? webglSignal() : "ssr",
    audio,
    screen: {
      w: scr.width || 0,
      h: scr.height || 0,
      availW: scr.availWidth || 0,
      availH: scr.availHeight || 0,
      colorDepth: scr.colorDepth || 0,
      pixelRatio: typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
    },
    hardware: {
      cores: nav.hardwareConcurrency || 2,
      memory: nav.deviceMemory,
      touchPoints: nav.maxTouchPoints || 0,
      platform: nav.platform || "unknown",
    },
    locale: {
      timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "America/Santiago",
      languages: (nav.languages || [nav.language || "es"]).join(","),
    },
  };
}

/** Huella SHA-256 única para el dispositivo */
export async function getDeviceFingerprint(): Promise<string> {
  const sig = await getDeviceSignals();
  const raw = [
    sig.canvas,
    sig.webgl,
    sig.audio,
    sig.screen.w,
    sig.screen.h,
    sig.hardware.cores,
    sig.hardware.touchPoints,
    sig.hardware.platform,
    sig.locale.timezone,
  ].join("||");
  return sha256Hex(raw);
}
