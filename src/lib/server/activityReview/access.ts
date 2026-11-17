import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/server/auth";
import { getAssignedSandboxCoursesForUser } from "@/lib/server/sandboxCourses";
import { isTrustedMutation, invalidRequestOriginResponse } from "@/lib/server/requestSecurity";
import { ACTIVITY_REVIEW_COURSE_CODE, ACTIVITY_REVIEW_COURSE_ID } from "@/types/activityReview";
import type { SessionRole } from "@/lib/server/session";

export const teacherRoles: SessionRole[] = ["docente", "admin"];
export const courseRoles: SessionRole[] = [...teacherRoles, "estudiante"];
export const isActivityId = (id: string) =>
  /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(id);

export function activityResponse(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function requireActivityAccess(request: NextRequest, roles: SessionRole[]) {
  if (request.method !== "GET" && !isTrustedMutation(request)) {
    return { response: invalidRequestOriginResponse() } as const;
  }
  const auth = await requireRole(request, roles);
  if ("response" in auth) return auth;

  if (auth.session.role !== "admin") {
    const assigned = await getAssignedSandboxCoursesForUser(auth.session.userId!);
    if (!assigned.some(course => course.id === ACTIVITY_REVIEW_COURSE_ID && course.code === ACTIVITY_REVIEW_COURSE_CODE)) {
      return { response: activityResponse({ error: "El curso de prueba no está asignado a tu cuenta." }, 403) } as const;
    }
  }
  return auth;
}

export const activityNotFound = () => activityResponse({ error: "No se encontró la actividad o entrega." }, 404);
export function activityFailure(error: unknown) {
  console.error("[activity-review]", error instanceof Error ? error.name : "database error");
  return activityResponse({ error: "No se pudo completar la operación. Vuelve a intentarlo." }, 500);
}
