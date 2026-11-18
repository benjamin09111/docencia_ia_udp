import { afterEach, describe, expect, it, vi } from "vitest";
import { configIaDesdeEntorno, crearClienteIa, ErrorIa, type ConfigIa } from "./aiClient";

const ENV_OK: Record<string, string> = {
  AI_EXTERNAL_PROCESSING_ENABLED: "true",
  AI_BASE_URL: "https://ia.ejemplo.test/v1/",
  AI_API_KEY: "clave-de-prueba",
  AI_MODEL: "qwen-demo",
};

describe("configIaDesdeEntorno", () => {
  it("lee base_url, api_key y modelo, y quita la barra final", () => {
    expect(configIaDesdeEntorno(ENV_OK)).toEqual({
      baseUrl: "https://ia.ejemplo.test/v1",
      apiKey: "clave-de-prueba",
      modelo: "qwen-demo",
      jsonMode: false,
      timeoutMs: 60_000,
    });
  });

  it("queda deshabilitada si el interruptor de privacidad no está activo o falta el modelo", () => {
    expect(configIaDesdeEntorno({ ...ENV_OK, AI_EXTERNAL_PROCESSING_ENABLED: "false" })).toBeNull();
    expect(configIaDesdeEntorno({ ...ENV_OK, AI_MODEL: "" })).toBeNull();
  });
});

describe("crearClienteIa", () => {
  const config: ConfigIa = { baseUrl: "https://ia.ejemplo.test/v1", apiKey: "k", modelo: "m", jsonMode: true, timeoutMs: 1000 };
  afterEach(() => vi.unstubAllGlobals());

  it("llama a /chat/completions con el formato de OpenAI y devuelve el contenido", async () => {
    const fetchMock = vi.fn(async () => Response.json({ choices: [{ message: { content: "{\"ok\":true}" } }] }));
    vi.stubGlobal("fetch", fetchMock);
    const respuesta = await crearClienteIa(config)([{ role: "user", content: "hola" }]);
    expect(respuesta).toBe("{\"ok\":true}");
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://ia.ejemplo.test/v1/chat/completions");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer k");
    expect(JSON.parse(String(init.body))).toMatchObject({
      model: "m",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: "hola" }],
    });
  });

  it("convierte errores HTTP y respuestas vacías en ErrorIa", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("no", { status: 500 })));
    await expect(crearClienteIa(config)([])).rejects.toMatchObject({ motivo: "http" });
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ choices: [] })));
    await expect(crearClienteIa(config)([])).rejects.toBeInstanceOf(ErrorIa);
  });
});
