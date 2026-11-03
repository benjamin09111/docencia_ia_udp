import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/server/auth";
import { ActivityAgentRequest, ActivityAgentDraft } from "@/types/activityAgent";
import { checkAiPrivacy } from "@/lib/server/aiPrivacy";
import { postAgentServices } from "@/lib/server/agentServicesClient";
import { getAiSandboxCourseCode, resolveAiCourseCode } from "@/lib/server/aiCoursePolicy";

const validFormats = ["individual", "grupal"];
const validAssessments = ["decimas", "nota"];
const DESIGN_TIMEOUT_MS = 60_000;

type PyDesignResponse = {
  title?: string;
  description?: string;
  instructions?: Array<{ paso: number; titulo: string; descripcion: string; puntaje: number }>;
  decimas_sugeridas?: number;
};

export async function POST(req: NextRequest) {
  const auth = await requireRole(req);
  if ("response" in auth) return auth.response;

  try {
    const body = (await req.json()) as ActivityAgentRequest;
    if (!body.objective?.trim() || !validFormats.includes(body.format) || !validAssessments.includes(body.assessment)) {
      return NextResponse.json({ error: "Completa los datos requeridos para generar la actividad." }, { status: 400 });
    }

    const content = body.content || "contenidos definidos por el docente";
    const modality = body.format === "grupal" ? "en equipos" : "de manera individual";
    const durationMin = parseInt(body.duration || "45", 10) || 45;
    const privacy = checkAiPrivacy(`${body.objective}\n${content}\n${body.courseName || ""}`);
    if (!privacy.allowed) {
      return NextResponse.json(
        { error: "Elimina datos personales o sensibles antes de solicitar asistencia de IA.", code: "personal_data_blocked" },
        { status: 422, headers: { "Cache-Control": "no-store" } }
      );
    }

    const sandboxCode = getAiSandboxCourseCode();
    const courseCode = resolveAiCourseCode(body.courseCode) || sandboxCode;

    const upstream = await postAgentServices<PyDesignResponse>(
      "/api/v1/agent/design-activity",
      {
        objective: body.objective.trim(),
        course_name: body.courseName || "Arquitectura de Software",
        course_code: courseCode,
        topic_content: content,
        duration_minutes: durationMin,
        format: body.format,
        assessment_type: body.assessment,
        max_decimas: 0.3,
      },
      DESIGN_TIMEOUT_MS
    );

    if (upstream.ok && upstream.data.title && Array.isArray(upstream.data.instructions)) {
      const draft: ActivityAgentDraft = {
        title: upstream.data.title,
        description: upstream.data.description || "",
        content: body.content,
        instructions: upstream.data.instructions.map((step, idx) => ({
          id: `agent_${idx + 1}`,
          numero: step.paso,
          titulo: step.titulo,
          descripcion: step.descripcion,
          puntaje: step.puntaje,
        })),
        pointsPossible: 100,
        assessment: body.assessment,
        decimas: String(upstream.data.decimas_sugeridas ?? "0.3"),
        isGroupAssignment: body.format === "grupal",
      };
      return NextResponse.json(draft);
    }

    const draft: ActivityAgentDraft = {
      title: `Taller: ${body.objective.trim()}`,
      description: `Actividad ${modality} de ${body.duration || "45 minutos"}, orientada a ${body.objective.trim()}. Se alinea con ${content} del programa oficial de ${body.courseName}.`,
      content: body.content,
      instructions: [
        { id: "agent_1", numero: 1, titulo: "Analizar el desafío", descripcion: `Identifica conceptos y restricciones de ${content} pertinentes al caso propuesto.`, puntaje: 30 },
        { id: "agent_2", numero: 2, titulo: "Desarrollar una propuesta", descripcion: `Elabora una solución fundamentada para ${body.objective.trim()} y justifica las decisiones tomadas.`, puntaje: 40 },
        { id: "agent_3", numero: 3, titulo: "Reflexionar y comunicar", descripcion: "Expón evidencias, límites de la propuesta y oportunidades de mejora.", puntaje: 30 },
      ],
      pointsPossible: 100,
      assessment: body.assessment,
      decimas: "0.3",
      isGroupAssignment: body.format === "grupal",
    };
    return NextResponse.json(draft);
  } catch (error) {
    console.error("Error al generar borrador de actividad:", error);
    return NextResponse.json({ error: "No se pudo generar la actividad en este momento." }, { status: 500 });
  }
}
