import { notFound } from "next/navigation";
import { ActivityReviewWorkspace } from "@/components/modules/teacher/activity-review/ActivityReviewWorkspace";
import { ACTIVITY_REVIEW_COURSE_ID } from "@/types/activityReview";

export default async function ActivityReviewPage({ params }: { params: Promise<{ cursoId: string }> }) {
  const { cursoId } = await params;
  if (cursoId !== String(ACTIVITY_REVIEW_COURSE_ID)) notFound();
  return <ActivityReviewWorkspace />;
}
