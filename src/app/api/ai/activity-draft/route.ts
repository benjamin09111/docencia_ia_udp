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
