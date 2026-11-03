import type { AiSubmissionEvaluationRequest, AiSubmissionEvaluationResult } from "@/types/ai";

export type EvaluateSubmissionInput = AiSubmissionEvaluationRequest & {
  assignmentTitle?: string;
  courseCode?: string;
};

/**
 * Cliente hacia /api/ai/evaluate (pre-corrección; siempre human-in-the-loop en backend).
 */
export async function evaluateSubmissionWithAi(
  req: EvaluateSubmissionInput
): Promise<AiSubmissionEvaluationResult | null> {
  try {
    const res = await fetch("/api/ai/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) {
      console.error("evaluateSubmissionWithAi status", res.status);
      return null;
    }
    return (await res.json()) as AiSubmissionEvaluationResult;
  } catch (error) {
    console.error("evaluateSubmissionWithAi error", error);
    return null;
  }
}
