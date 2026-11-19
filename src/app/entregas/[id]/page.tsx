import { ActivityReviewSubmission } from "@/components/modules/student/ActivityReviewSubmission";

export default async function StudentSubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ActivityReviewSubmission id={id} />;
}
