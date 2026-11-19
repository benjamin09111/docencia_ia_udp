import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import {
  ACTIVITY_REVIEW_COURSE_ID, ACTIVITY_TYPES, activityPoints,
  type ReviewActivity, type ReviewActivityInput, type SuggestedReview,
} from "@/types/activityReview";

export const tasks = () => getSupabaseAdmin().from("activity_review_tasks");
export const submissions = () => getSupabaseAdmin().from("activity_review_submissions");
export const reviewFields = "id,student_name,file_name,created_at,suggested,final_value,final_feedback,approved_at,processing_at,review_error";
export const studentFields = "final_value,final_feedback,approved_at";

export type ActivityRecord = { id: string; teacher_id: string; details: ReviewActivityInput };
export const toActivity = (record: ActivityRecord): ReviewActivity => ({ ...record.details, id: record.id });

export async function findActivity(id: string) {
  const { data, error } = await tasks().select("id,teacher_id,details")
    .eq("course_id", ACTIVITY_REVIEW_COURSE_ID).eq("id", id).maybeSingle<ActivityRecord>();
  if (error) throw error;
  return data;
}

const nonEmpty = (value: unknown, max: number) =>
  typeof value === "string" && value.trim().length > 0 && value.length <= max;
const validPoints = (value: number) => Number.isInteger(value) && value >= 0 && value <= 1000;

export function parseActivity(body: unknown): ReviewActivityInput | null {
  if (!body || typeof body !== "object") return null;
  const input = body as ReviewActivityInput;
  if (!nonEmpty(input.title, 150) || !ACTIVITY_TYPES.includes(input.type) ||
      !["nota", "decimas"].includes(input.assessment) || !nonEmpty(input.instructions, 6000) ||
      typeof input.context !== "string" || input.context.length > 1500 ||
      (input.assessment === "nota" && !validActivityValue(input.gradeBase, 1, 4)) ||
      !Array.isArray(input.rubric) || input.rubric.length < 1 || input.rubric.length > 5) return null;
  if (!input.rubric.every(item => item && nonEmpty(item.name, 100) && nonEmpty(item.description, 500) &&
      validPoints(item.points) && item.points > 0)) return null;
  const rubric = input.rubric.map(item => ({ name: item.name.trim(), description: item.description.trim(), points: item.points }));
  if (new Set(rubric.map(item => item.name.toLowerCase())).size !== rubric.length) return null;
  const maxDecimas = input.assessment === "decimas" ? input.maxDecimas : 0;
  if (!validActivityValue(maxDecimas, 0, 10) || (input.assessment === "decimas" && maxDecimas < 0.1)) return null;

  const activity = {
    title: input.title.trim(), instructions: input.instructions.trim(), context: input.context.trim(),
    type: input.type, assessment: input.assessment, gradeBase: input.assessment === "nota" ? input.gradeBase : 1, maxDecimas, rubric,
  };
  return activityPoints(activity) <= 1000 ? activity : null;
}

export function validActivityValue(value: number, min: number, max: number) {
  return Number.isFinite(value) && value >= min && value <= max && Math.round(value * 10) === value * 10;
}

export async function saveSuggestion(
  activityId: string, submissionId: string, processingAt: string, suggested: SuggestedReview | null, errorMessage: string | null,
) {
  const { error } = await submissions().update({ suggested, processing_at: null, review_error: errorMessage })
    .eq("activity_id", activityId).eq("id", submissionId).eq("processing_at", processingAt);
  if (error) throw error;
}
