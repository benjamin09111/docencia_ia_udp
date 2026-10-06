import { AiChatRequest, AiChatResponse } from "@/types/ai";

/**
 * Servicio cliente para interactuar con los agentes de IA de forma desacoplada y asíncrona.
 */
export async function sendAgentQuery(req: AiChatRequest): Promise<AiChatResponse> {
  try {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      throw new Error(`Error en el servicio de agente: ${res.statusText}`);
    }

    const data: AiChatResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Error al comunicarse con el agente IA:", error);
    // Fallback institucional en caso de pérdida de conexión
    return {
      agentRole: req.agentRole,
      reply: "No fue posible conectar con el agente institucional en este momento. Por favor reintenta en unos instantes.",
      sources: ["Fallback Local"],
    };
  }
}
