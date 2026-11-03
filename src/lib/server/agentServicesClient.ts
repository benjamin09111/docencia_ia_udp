/**
 * Cliente servidor → microservicio agent-services.
 * Centraliza URL, API key, timeouts y manejo de fallos (sin filtrar detalles al cliente).
 */

import { externalAiProcessingEnabled } from "./aiPrivacy";

const DEFAULT_TIMEOUT_MS = 45_000;

export type AgentServicesResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "disabled" | "misconfigured" | "upstream" | "timeout" };

function agentServicesBaseUrl(): string {
  return (process.env.AGENT_SERVICES_URL || "http://127.0.0.1:8080").replace(/\/$/, "");
}

function agentServiceApiKey(): string {
  return process.env.AGENT_SERVICE_API_KEY || "";
}

/** True solo si el flag está on y hay clave compartida (no se llama a Python a ciegas). */
export function canCallAgentServices(): boolean {
  return externalAiProcessingEnabled() && Boolean(agentServiceApiKey());
}

export async function postAgentServices<T>(
  path: string,
  body: unknown,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<AgentServicesResult<T>> {
  if (!externalAiProcessingEnabled()) {
    return { ok: false, reason: "disabled" };
  }

  const apiKey = agentServiceApiKey();
  if (!apiKey) {
    console.error("[agent-services] AGENT_SERVICE_API_KEY ausente; no se invoca el microservicio.");
    return { ok: false, reason: "misconfigured" };
  }

  const url = `${agentServicesBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Agent-Service-Key": apiKey,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
      console.error("[agent-services] upstream status", res.status, path);
      return { ok: false, reason: "upstream" };
    }

    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    if (name === "TimeoutError" || name === "AbortError") {
      console.error("[agent-services] timeout", path);
      return { ok: false, reason: "timeout" };
    }
    console.error("[agent-services] error de red", path);
    return { ok: false, reason: "upstream" };
  }
}
