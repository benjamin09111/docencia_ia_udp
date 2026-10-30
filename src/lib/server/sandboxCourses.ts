import { CanvasCourse } from "@/types";
import { getSupabaseAdmin } from "./supabaseAdmin";

const FALLBACK_SANDBOX_COURSES: CanvasCourse[] = [
  { id: 900001, name: "Arquitectura de Software — Sandbox", code: "CIT3000_CA02", term: "2026-2 Sandbox", students_count: 32, is_automated: true, agent_id: "agent_arq_soft", source: "sandbox" },
  { id: 900002, name: "Gestión de Proyectos Digitales — Mock", code: "MOCK2101_CA01", term: "2026-2 Sandbox", students_count: 28, is_automated: true, agent_id: "agent_docente_generico", source: "sandbox" },
  { id: 900003, name: "Taller de Innovación Tecnológica — Mock", code: "MOCK3102_CA01", term: "2026-2 Sandbox", students_count: 24, is_automated: true, agent_id: "agent_docente_generico", source: "sandbox" },
];

export async function getSandboxCoursesForUser(userId: string): Promise<CanvasCourse[]> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("sandbox_course_members")
      .select("course:sandbox_courses(canvas_like_id, name, code, term, students_count, agent_id)")
      .eq("user_id", userId);
    if (error || !Array.isArray(data) || data.length === 0) return FALLBACK_SANDBOX_COURSES;
    return data.flatMap((row) => {
      const course = Array.isArray(row.course) ? row.course[0] : row.course;
      if (!course?.canvas_like_id || !course.name || !course.code) return [];
      return [{ id: course.canvas_like_id, name: course.name, code: course.code, term: course.term || "Sandbox", students_count: course.students_count || 0, is_automated: true, agent_id: course.agent_id || "agent_docente_generico", source: "sandbox" as const }];
    });
  } catch {
    return FALLBACK_SANDBOX_COURSES;
  }
}
