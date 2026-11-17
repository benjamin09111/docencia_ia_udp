export const ACTIVITY_REVIEW_COURSE_ID = 900001;
export const ACTIVITY_REVIEW_COURSE_CODE = "CIT3000_CA02";
export const MAX_ACTIVITY_PDF_BYTES = 2 * 1024 * 1024;
export const ACTIVITY_TYPES = ["Taller", "Caso de estudio", "Proyecto", "Ejercicio"] as const;

export interface ActivityCriterion {
  name: string;
  description: string;
  points: number;
}

export interface ReviewActivityInput {
  title: string;
  type: typeof ACTIVITY_TYPES[number];
  assessment: "nota" | "decimas";
  instructions: string;
  context: string;
  gradeBase: number;
  maxDecimas: number;
  rubric: ActivityCriterion[];
}

export interface ReviewActivity extends ReviewActivityInput {
  id: string;
}

export interface SuggestedReview {
  value: number;
  summary: string;
  feedback: string;
  method: "ia" | "heuristica" | "sin_confirmar";
}

export interface ActivityReviewEntry {
  id: string;
  student_name: string;
  file_name: string;
  created_at: string;
  suggested: SuggestedReview | null;
  final_value: number | null;
  final_feedback: string | null;
  approved_at: string | null;
  processing_at: string | null;
  review_error: string | null;
}

export interface StudentReviewStatus {
  final_value: number | null;
  final_feedback: string | null;
  approved_at: string | null;
}

export function activityPoints(activity: ReviewActivityInput) {
  return activity.rubric.reduce((total, criterion) => total + criterion.points, 0);
}

export function formatActivityValue(value: number, assessment: ReviewActivityInput["assessment"]) {
  return assessment === "nota" ? value.toFixed(1) : `+${value.toFixed(1)} décimas`;
}
