import type { NextRequest } from "next/server";
import { ACTIVITY_REVIEW_COURSE_ID } from "@/types/activityReview";
import { activityFailure, activityResponse, requireActivityAccess, teacherRoles } from "@/lib/server/activityReview/access";
import { parseActivity, tasks, toActivity, type ActivityRecord } from "@/lib/server/activityReview/store";

export async function GET(request: NextRequest) {
  const auth = await requireActivityAccess(request, teacherRoles);
  if ("response" in auth) return auth.response;

  try {
    const { data, error } = await tasks().select("id,teacher_id,details")
      .eq("course_id", ACTIVITY_REVIEW_COURSE_ID).eq("teacher_id", auth.session.userId!)
      .order("created_at", { ascending: false }).returns<ActivityRecord[]>();
    if (error) throw error;
    return activityResponse(data.map(toActivity));
  } catch (error) {
    return activityFailure(error);
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireActivityAccess(request, teacherRoles);
  if ("response" in auth) return auth.response;

  const details = parseActivity(await request.json().catch(() => null));
  if (!details) return activityResponse({ error: "Revisa el título, las instrucciones y los criterios de la pauta." }, 400);
  try {
    const { data, error } = await tasks().insert({
      course_id: ACTIVITY_REVIEW_COURSE_ID, teacher_id: auth.session.userId!, details,
    }).select("id,teacher_id,details").single<ActivityRecord>();
    if (error) throw error;
    return activityResponse(toActivity(data), 201);
  } catch (error) {
    return activityFailure(error);
  }
}
