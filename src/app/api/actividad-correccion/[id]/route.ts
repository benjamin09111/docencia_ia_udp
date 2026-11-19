import type { NextRequest } from "next/server";
import { MAX_ACTIVITY_PDF_BYTES } from "@/types/activityReview";
import {
  activityFailure, activityNotFound, activityResponse, courseRoles, isActivityId, requireActivityAccess,
} from "@/lib/server/activityReview/access";
import { reviewSubmission } from "@/lib/server/activityReview/evaluate";
import { makeActivityPdf, readSubmissionPdf } from "@/lib/server/activityReview/pdf";
import { findActivity, reviewFields, studentFields, submissions, toActivity } from "@/lib/server/activityReview/store";
import { findUserById } from "@/lib/server/userStore";

type Context = { params: Promise<{ id: string }> };
export const maxDuration = 60;

export async function GET(request: NextRequest, { params }: Context) {
  const auth = await requireActivityAccess(request, courseRoles);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  if (!isActivityId(id)) return activityNotFound();

  try {
    const record = await findActivity(id);
    const isStudent = auth.session.role === "estudiante";
    if (!record || (!isStudent && record.teacher_id !== auth.session.userId)) return activityNotFound();
    const activity = toActivity(record);

    const document = request.nextUrl.searchParams.get("pdf");
    if (document === "tarea" || document === "pauta") {
      const bytes = await makeActivityPdf(activity, document === "pauta");
      return new Response(Buffer.from(bytes), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${document}-cit3000.pdf"`,
          "Cache-Control": "private, no-store",
        },
      });
    }

    if (isStudent) {
      const { data, error } = await submissions().select(studentFields)
        .eq("activity_id", id).eq("student_id", auth.session.userId!).maybeSingle();
      if (error) throw error;
      return activityResponse({ activity: { ...activity, context: "" }, submission: data });
    }

    const { data, error } = await submissions().select(reviewFields).eq("activity_id", id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return activityResponse({ activity, reviews: data });
  } catch (error) {
    return activityFailure(error);
  }
}

export async function POST(request: NextRequest, { params }: Context) {
  const auth = await requireActivityAccess(request, ["estudiante"]);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  if (!isActivityId(id)) return activityNotFound();

  const size = Number(request.headers.get("content-length") || "0");
  if (size > MAX_ACTIVITY_PDF_BYTES + 16_384) {
    return activityResponse({ error: "La entrega debe pesar como máximo 2 MB." }, 413);
  }

  try {
    const record = await findActivity(id);
    if (!record) return activityNotFound();
    const student = await findUserById(auth.session.userId!);
    if (!student) return activityResponse({ error: "No se pudo identificar tu cuenta." }, 403);

    const form = await request.formData().catch(() => null);
    const file = form?.get("pdf");
    const document = file instanceof File ? await readSubmissionPdf(file) : null;
    if (!document || !(file instanceof File)) {
      return activityResponse({ error: "Sube un PDF con texto seleccionable, de hasta 20 páginas y 2 MB." }, 400);
    }

    const processingAt = new Date().toISOString();
    const { data, error } = await submissions().insert({
      ...document, activity_id: id, student_id: student.id, student_name: student.name,
      file_name: file.name.slice(0, 255), processing_at: processingAt,
    }).select("id").single();
    if (error?.code === "23505") return activityResponse({ error: "Ya registraste una entrega para esta tarea." }, 409);
    if (error) throw error;

    await reviewSubmission(id, record.details, { id: data.id, solution: document.solution, student_id: student.id }, processingAt);
    return activityResponse({ submitted: true }, 201);
  } catch (error) {
    return activityFailure(error);
  }
}
