import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/server/auth";
import { ActivityAgentRequest, ActivityAgentDraft } from "@/types/activityAgent";

const validFormats = ["individual", "grupal"];
const validAssessments = ["decimas", "nota"];

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

    // 1. Invocar Agente 1 (Diseñador de Actividades) en microservicio desacoplado Python
    const agentServiceUrl = process.env.AGENT_SERVICES_URL || "http://127.0.0.1:8080";
    try {
      const pyRes = await fetch(`${agentServiceUrl}/api/v1/agent/design-activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objective: body.objective.trim(),
          course_name: body.courseName || "Arquitectura de Software",
          course_code: "CIT3000", // Sandbox seguro
          topic_content: content,
          duration_minutes: durationMin,
          format: body.format,
          assessment_type: body.assessment,
          max_decimas: 0.3,
        }),
        signal: AbortSignal.timeout(3500),
      });

      if (pyRes.ok) {
        const pyData = await pyRes.json();
        const draft: ActivityAgentDraft = {
          title: pyData.title,
          description: pyData.description,
          content: body.content,
          instructions: pyData.instructions.map((step: any, idx: number) => ({
            id: `agent_${idx + 1}`,
            numero: step.paso,
            titulo: step.titulo,
            descripcion: step.descripcion,
            puntaje: step.puntaje,
          })),
          pointsPossible: 100,
          assessment: body.assessment,
          decimas: String(pyData.decimas_sugeridas ?? "0.3"),
          isGroupAssignment: body.format === "grupal",
        };
        return NextResponse.json(draft);
      }
    } catch {
      // Si el microservicio está offline o en timeout, continúa a la contingencia determinista
    }

    // 2. Fallback determinista local institucional
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
