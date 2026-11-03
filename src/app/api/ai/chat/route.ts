import { NextRequest, NextResponse } from "next/server";
import { AiChatRequest, AiChatResponse } from "@/types/ai";
import { requireRole } from "@/lib/server/auth";
import { checkAiPrivacy } from "@/lib/server/aiPrivacy";
import { postAgentServices } from "@/lib/server/agentServicesClient";
import { resolveAiCourseCode, toAgentCourseNodeId } from "@/lib/server/aiCoursePolicy";
import { buildLocalAiChatReply } from "@/lib/server/aiChatFallback";

const MAX_MESSAGE_CHARS = 8_000;
const CHAT_TIMEOUT_MS = 45_000;

type PyChatResponse = {
  reply?: string;
  tokens_estimated?: number;
  sources?: string[];
};

/**
 * Chat institucional. Hoy las sesiones firmadas solo emiten docente|admin
 * (incl. vistas alumno en DEV). Cuando exista rol alumno, ampliar requireRole
 * y restringir agentRole a tutores teóricos/técnicos.
 */
export async function POST(req: NextRequest) {
  const auth = await requireRole(req);
  if ("response" in auth) return auth.response;

  try {
    const body = (await req.json()) as AiChatRequest;
    const { agentRole, message, courseCode, courseName } = body;

    if (!agentRole || !message || typeof message !== "string" || message.length > MAX_MESSAGE_CHARS) {
      return NextResponse.json({ error: "El mensaje es requerido." }, { status: 400 });
    }

    const privacy = checkAiPrivacy(message);
    if (!privacy.allowed) {
      return NextResponse.json(
        {
          error: "La consulta contiene datos personales o sensibles. Elimínalos o reemplázalos por alias antes de usar IA.",
          code: "personal_data_blocked",
        },
        { status: 422, headers: { "Cache-Control": "no-store" } }
      );
    }

    const safeCourseCode = resolveAiCourseCode(courseCode);
    const safeCourseName = courseName || "Arquitectura de Software (Sandbox)";

    const upstream = await postAgentServices<PyChatResponse>(
      "/api/v1/agent/chat",
      {
        message,
        node_id: toAgentCourseNodeId(safeCourseCode),
        worker_role: agentRole,
        context_data: { course_code: safeCourseCode, course_name: safeCourseName },
      },
      CHAT_TIMEOUT_MS
    );

    if (upstream.ok && upstream.data.reply) {
      const response: AiChatResponse = {
        reply: upstream.data.reply,
        agentRole,
        tokensUsed: upstream.data.tokens_estimated || Math.round(upstream.data.reply.length / 4),
        sources: upstream.data.sources || ["Agente Jerárquico UDP"],
      };
      return NextResponse.json(response);
    }

    const local = buildLocalAiChatReply(agentRole, message, safeCourseName, safeCourseCode);
    const response: AiChatResponse = {
      reply: local.reply,
      agentRole,
      tokensUsed: Math.round(local.reply.length / 4),
      sources: local.sources,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error en API de Agente IA:", error);
    return NextResponse.json({ error: "Error interno al procesar la consulta con el agente." }, { status: 500 });
  }
}
