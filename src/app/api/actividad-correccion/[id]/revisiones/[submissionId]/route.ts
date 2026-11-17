import type { NextRequest } from "next/server";
import { activityFailure, activityNotFound, activityResponse, isActivityId, requireActivityAccess, teacherRoles } from "@/lib/server/activityReview/access";
import { reviewSubmission } from "@/lib/server/activityReview/evaluate";
import { findActivity, submissions, validActivityValue } from "@/lib/server/activityReview/store";

type Context = { params: Promise<{ id: string; submissionId: string }> };
export const maxDuration = 60;
const REVIEW_STALE_MS = 2 * 60 * 1000;

export async function GET(request: NextRequest, { params }: Context) {
  const auth = await requireActivityAccess(request, teacherRoles);
  if ("response" in auth) return auth.response;
  const { id, submissionId } = await params;
  if (!isActivityId(id) || !isActivityId(submissionId)) return activityNotFound();

  try {
    const task = await findActivity(id);
    if (!task || task.teacher_id !== auth.session.userId) return activityNotFound();
    const { data, error } = await submissions().select("pdf").eq("activity_id", id).eq("id", submissionId).maybeSingle();
    if (error) throw error;
    if (!data) return activityNotFound();
    return new Response(Buffer.from(data.pdf.slice(2), "hex"), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="entrega.pdf"',
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    return activityFailure(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const auth = await requireActivityAccess(request, teacherRoles);
  if ("response" in auth) return auth.response;
  const { id, submissionId } = await params;
  if (!isActivityId(id) || !isActivityId(submissionId)) return activityNotFound();

  const body = await request.json().catch(() => null);
  if (body?.action !== "retry" && body?.action !== "approve") {
    return activityResponse({ error: "Acción inválida." }, 400);
  }

  try {
    const task = await findActivity(id);
    if (!task || task.teacher_id !== auth.session.userId) return activityNotFound();

    if (body.action === "retry") {
      const now = new Date().toISOString();
      const staleBefore = new Date(Date.now() - REVIEW_STALE_MS).toISOString();
      const { data, error } = await submissions().update({ processing_at: now, review_error: null })
        .eq("activity_id", id).eq("id", submissionId).is("approved_at", null).is("suggested", null)
        .or(`processing_at.is.null,processing_at.lt.${staleBefore}`)
        .select("id,student_id,solution").maybeSingle();
      if (error) throw error;
      if (!data) return activityResponse({ error: "Esta entrega ya tiene una revisión o se está procesando." }, 409);
      await reviewSubmission(id, task.details, data, now);
      return activityResponse({ updated: true });
    }

    const isGrade = task.details.assessment === "nota";
    if (!validActivityValue(body.value, isGrade ? task.details.gradeBase : 0, isGrade ? 7 : task.details.maxDecimas) ||
        typeof body.feedback !== "string" || body.feedback.length > 1200 || !body.feedback.trim()) {
      return activityResponse({ error: "Revisa el resultado final y el feedback antes de publicar." }, 400);
    }

    const { data, error } = await submissions().update({
      final_value: body.value, final_feedback: body.feedback.trim(), approved_at: new Date().toISOString(),
    }).eq("activity_id", id).eq("id", submissionId).is("approved_at", null)
      .not("suggested", "is", null).select("id").maybeSingle();
    if (error) throw error;
    if (!data) return activityResponse({ error: "La entrega no tiene una sugerencia pendiente de aprobación." }, 409);
    return activityResponse({ updated: true });
  } catch (error) {
    return activityFailure(error);
  }
}
