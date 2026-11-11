import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/server/auth";
import { checkAiPrivacy } from "@/lib/server/aiPrivacy";
import { postAgentServices } from "@/lib/server/agentServicesClient";
import { resolveAiCourseCode, toAgentCourseNodeId } from "@/lib/server/aiCoursePolicy";
import { pseudonymizePersonNames } from "@/lib/server/aiPseudonymize";
import { validateAiInput, sanitizeAiOutput } from "@/lib/server/aiGuardrails";
import type { AiSubmissionEvaluationRequest, AiSubmissionEvaluationResult } from "@/types/ai";

const MAX_SOLUTION_CHARS = 40_000;
const EVALUATE_TIMEOUT_MS = 90_000;

type PyEvaluateResponse = {
  nota_sugerida?: number;
  decimas_sugeridas?: number;
  resumen_feedback?: string;
  criterios_evaluados?: Array<{
    criterio: string;
    puntaje_obtenido: number;
    puntaje_max: number;
    cita_textual: string;
    comentario: string;
  }>;
  sugerencias_mejora?: string[];
};

export async function POST(req: NextRequest) {
  const auth = await requireRole(req);
  if ("response" in auth) return auth.response;

  try {
    const body = (await req.json()) as AiSubmissionEvaluationRequest & {
      assignmentTitle?: string;
      courseCode?: string;
    };

    if (!body?.studentSolution || typeof body.studentSolution !== "string") {
      return NextResponse.json({ error: "La solución del estudiante es requerida." }, { status: 400 });
    }
    if (body.studentSolution.length > MAX_SOLUTION_CHARS) {
      return NextResponse.json({ error: "La solución excede el tamaño permitido." }, { status: 400 });
    }
    if (!Array.isArray(body.rubric) || body.rubric.length === 0) {
      return NextResponse.json({ error: "La rúbrica es requerida." }, { status: 400 });
    }

    // 1. Guardrail de entrada: Anti-Inyección de Prompts en entregas de estudiantes
    const guardrail = validateAiInput(body.studentSolution, auth.session.userId);
    if (!guardrail.allowed) {
      return NextResponse.json(
        { error: guardrail.reason, code: guardrail.category },
        { status: 403, headers: { "Cache-Control": "no-store" } }
      );
    }

    // 2. Filtro de privacidad y PII
    const privacy = checkAiPrivacy(body.studentSolution);
    if (!privacy.allowed) {
      return NextResponse.json(
        {
          error: "La entrega contiene datos personales o sensibles. Pseudonimízala antes de usar IA.",
          code: "personal_data_blocked",
        },
        { status: 422, headers: { "Cache-Control": "no-store" } }
      );
    }

    const { text: safeSolution } = pseudonymizePersonNames(body.studentSolution);
    const courseCode = resolveAiCourseCode(body.courseCode);
    const upstream = await postAgentServices<PyEvaluateResponse>(
      "/api/v1/agent/evaluate",
      {
        student_solution: safeSolution,
        assignment_title: body.assignmentTitle || body.deliverableId || "Entrega formativa",
        course_id: toAgentCourseNodeId(courseCode),
        rubric: body.rubric.map((item) => ({
          criterio: item.criterio,
          puntaje_max: item.puntajeMax,
          descriptores: item.descriptores || [],
        })),
        max_decimas: body.maxDecimas ?? 0.6,
      },
      EVALUATE_TIMEOUT_MS
    );

    if (!upstream.ok || typeof upstream.data.nota_sugerida !== "number") {
      return NextResponse.json(
        { error: "No se pudo evaluar la entrega en este momento. Reintenta o usa el fallback docente." },
        { status: 503 }
      );
    }

    const result: AiSubmissionEvaluationResult = {
      notaSugerida: upstream.data.nota_sugerida,
      decimasSugeridas: upstream.data.decimas_sugeridas ?? 0,
      resumenFeedback: sanitizeAiOutput(upstream.data.resumen_feedback || ""),
      criteriosEvaluados: (upstream.data.criterios_evaluados || []).map((c) => ({
        criterio: c.criterio,
        puntajeObtenido: c.puntaje_obtenido,
        puntajeMax: c.puntaje_max,
        citaTextual: sanitizeAiOutput(c.cita_textual),
        comentario: sanitizeAiOutput(c.comentario),
      })),
      sugerenciasMejora: (upstream.data.sugerencias_mejora || []).map((s) => sanitizeAiOutput(s)),
    };

    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Error en API de evaluación IA:", error);
    return NextResponse.json({ error: "No se pudo procesar la evaluación en este momento." }, { status: 500 });
  }
}
