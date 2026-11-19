import { postAgentServices } from "@/lib/server/agentServicesClient";
import { checkAiPrivacy } from "@/lib/server/aiPrivacy";
import { pseudonymizePersonNames } from "@/lib/server/aiPseudonymize";
import { sanitizeAiOutput, validateAiInput } from "@/lib/server/aiGuardrails";
import { calculateGradeFromScore, DEFAULT_GRADE_SCALE_CONFIG } from "@/utils/gradeScaleCalculator";
import { activityPoints, type ReviewActivityInput, type SuggestedReview } from "@/types/activityReview";
import { saveSuggestion } from "./store";

type AgentResult = {
  metodo?: SuggestedReview["method"];
  resumen_entrega?: string;
  resumen_feedback?: string;
  criterios_evaluados?: Array<{ criterio: string; puntaje_obtenido: number }>;
};

async function suggestReview(activity: ReviewActivityInput, solution: string, studentId: string): Promise<SuggestedReview | string> {
  const context = [activity.context, activity.instructions, ...activity.rubric.flatMap(item => [item.name, item.description])].join("\n");
  if (!checkAiPrivacy(`${solution}\n${activity.title}\n${context}`).allowed) {
    return "La entrega o la pauta contiene datos identificables que impiden la evaluación asistida.";
  }
  const guardrail = validateAiInput(solution, studentId);
  if (!guardrail.allowed) return guardrail.reason ?? "No se pudo evaluar el contenido de la entrega.";

  const { text: safeSolution } = pseudonymizePersonNames(solution);
  const anonymize = (value: string) => pseudonymizePersonNames(value).text;
  const result = await postAgentServices<AgentResult>("/api/v1/agent/evaluate", {
    student_solution: safeSolution,
    assignment_title: anonymize(activity.title),
    assignment_context: anonymize([activity.context, activity.instructions].filter(Boolean).join("\n")),
    course_id: "course:cit3000",
    max_decimas: 0,
    rubric: activity.rubric.map((criterion, index) => ({
      criterio: `C${index + 1} ${anonymize(criterion.name)}`,
      puntaje_max: criterion.points,
      descriptores: [anonymize(criterion.description)],
    })),
  });

  if (!result.ok) return "El evaluador está temporalmente indisponible. Puedes reintentar desde el historial.";
  const criteria = result.data.criterios_evaluados;
  if (!Array.isArray(criteria) || criteria.length !== activity.rubric.length) {
    return "La evaluación llegó incompleta. Reintenta la corrección.";
  }
  const scores = activity.rubric.map((criterion, index) => {
    const score = criteria.find(item => item?.criterio?.startsWith(`C${index + 1} `))?.puntaje_obtenido;
    return typeof score === "number" && Number.isFinite(score) && score >= 0 && score <= criterion.points
      ? score : null;
  });
  if (scores.some(score => score === null)) return "La evaluación devolvió puntajes inválidos. Reintenta la corrección.";

  const score = scores.reduce<number>((total, item) => total + (item ?? 0), 0);
  const total = activityPoints(activity);
  const value = activity.assessment === "decimas"
    ? Math.round(score / total * activity.maxDecimas * 10) / 10
    : calculateGradeFromScore(score, total, { ...DEFAULT_GRADE_SCALE_CONFIG, puntoBase: activity.gradeBase });
  const safeOutput = (text: unknown, fallback: string) => {
    if (typeof text !== "string" || !text.trim() || !checkAiPrivacy(text).allowed) return fallback;
    return sanitizeAiOutput(text.trim()).slice(0, 1200);
  };

  return {
    value,
    method: result.data.metodo === "ia" || result.data.metodo === "heuristica" ? result.data.metodo : "sin_confirmar",
    summary: safeOutput(result.data.resumen_entrega, safeSolution.replace(/\s+/g, " ").slice(0, 360)),
    feedback: safeOutput(result.data.resumen_feedback, `Puntaje sugerido: ${score} de ${total} puntos.`),
  };
}

export async function reviewSubmission(
  activityId: string, activity: ReviewActivityInput, submission: { id: string; solution: string; student_id: string }, processingAt: string,
) {
  let result: SuggestedReview | string;
  try {
    result = await suggestReview(activity, submission.solution, submission.student_id);
  } catch {
    result = "No se pudo procesar la evaluación. Reintenta la corrección.";
  }
  await saveSuggestion(activityId, submission.id, processingAt,
    typeof result === "string" ? null : result, typeof result === "string" ? result : null);
}
