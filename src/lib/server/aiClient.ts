/**
 * Cliente mínimo compatible con la API de OpenAI (POST {base}/chat/completions).
 * Sirve para OpenRouter, vLLM, Ollama o LM Studio: un modelo abierto (Qwen, DeepSeek)
 * hospedado en la UDP solo requiere cambiar las variables de entorno:
 *
 *   AI_BASE_URL   ej. https://openrouter.ai/api/v1  ·  http://ia.interna.udp:8000/v1
 *   AI_API_KEY    clave del proveedor (vacía si el servidor interno no la pide)
 *   AI_MODEL      ej. qwen/qwen-2.5-72b-instruct  ·  deepseek-chat
 *   AI_JSON_MODE  "true" envía response_format: json_object (si el servidor lo soporta)
 *   AI_TIMEOUT_MS tiempo máximo por llamada (por defecto 60000)
 *
 * Además respeta el interruptor existente AI_EXTERNAL_PROCESSING_ENABLED (aiPrivacy.ts).
 */

export interface ConfigIa {
  baseUrl: string;
  apiKey: string;
  modelo: string;
  jsonMode: boolean;
  timeoutMs: number;
}

export interface MensajeChat {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Función que envía mensajes y devuelve el texto de la respuesta (inyectable en tests). */
export type ClienteIa = (mensajes: MensajeChat[]) => Promise<string>;

export class ErrorIa extends Error {
  constructor(
    public readonly motivo: "timeout" | "http" | "respuesta" | "red",
    detalle: string
  ) {
    super(detalle);
    this.name = "ErrorIa";
  }
}

/** Configuración desde el entorno, o null si la IA no está habilitada o le faltan datos. */
export function configIaDesdeEntorno(env: Record<string, string | undefined> = process.env): ConfigIa | null {
  // Mismo interruptor que externalAiProcessingEnabled() (aiPrivacy.ts), leído desde `env` para poder testearlo.
  if (env.AI_EXTERNAL_PROCESSING_ENABLED !== "true") return null;
  const baseUrl = (env.AI_BASE_URL || "").trim().replace(/\/+$/, "");
  const modelo = (env.AI_MODEL || "").trim();
  if (!baseUrl || !modelo) return null;
  const timeout = Number(env.AI_TIMEOUT_MS);
  return {
    baseUrl,
    apiKey: (env.AI_API_KEY || "").trim(),
    modelo,
    jsonMode: env.AI_JSON_MODE === "true",
    timeoutMs: Number.isFinite(timeout) && timeout > 0 ? timeout : 60_000,
  };
}

export function crearClienteIa(config: ConfigIa): ClienteIa {
  return async (mensajes) => {
    let res: Response;
    try {
      res = await fetch(`${config.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
        },
        body: JSON.stringify({
          model: config.modelo,
          messages: mensajes,
          temperature: 0,
          ...(config.jsonMode ? { response_format: { type: "json_object" } } : {}),
        }),
        signal: AbortSignal.timeout(config.timeoutMs),
      });
    } catch (err) {
      const nombre = err instanceof Error ? err.name : "";
      if (nombre === "TimeoutError" || nombre === "AbortError") throw new ErrorIa("timeout", "La IA no respondió a tiempo.");
      throw new ErrorIa("red", "No se pudo conectar con el proveedor de IA.");
    }
    if (!res.ok) throw new ErrorIa("http", `El proveedor de IA respondió ${res.status}.`);

    const cuerpo = (await res.json().catch(() => null)) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    } | null;
    const contenido = cuerpo?.choices?.[0]?.message?.content;
    if (typeof contenido !== "string" || !contenido.trim()) {
      throw new ErrorIa("respuesta", "El proveedor de IA devolvió una respuesta vacía.");
    }
    return contenido;
  };
}
