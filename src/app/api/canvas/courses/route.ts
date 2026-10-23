import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { fetchCanvasCourses } from "@/services/canvas";
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import { CanvasCourse } from "@/types";

function mapCodeToAgentId(code: string): string | undefined {
  if (code.includes("CIT3203")) return "agent_cit3621";
  if (code.includes("CIT2206")) return "agent_gestion_org";
  if (code.includes("CIT3100")) return "agent_arq_emergentes";
  if (code.includes("CIT3000")) return "agent_arq_soft";
  return "agent_docente_generico";
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || !session.email) {
      return NextResponse.json({ error: "Sesión requerida." }, { status: 401 });
    }

    const userEmail = session.email.trim().toLowerCase();
    const isOwner = Boolean(session.isOwner || userEmail === "benjamin.morales3@mail.udp.cl");
    const hasCanvasToken = Boolean(process.env.CANVAS_API_TOKEN && process.env.CANVAS_API_TOKEN.trim().length > 10);

    // 1. Si es el titular y tiene token activo de Canvas, sincroniza cursos favoritos oficiales de Canvas
    if (isOwner && hasCanvasToken) {
      try {
        const liveCanvasCourses = await fetchCanvasCourses();
        if (Array.isArray(liveCanvasCourses) && liveCanvasCourses.length > 0) {
          return NextResponse.json(liveCanvasCourses);
        }
      } catch (err) {
        console.warn("[courses] Canvas API falló, recurriendo a asociaciones de base de datos:", err);
      }
    }

    // 2. Modelo Relacional Canvas: Consultar enrollments y secciones asociadas en Supabase
    try {
      const admin = getSupabaseAdmin();
      const { data: userRecord } = await admin
        .from("users")
        .select("id")
        .ilike("email", userEmail)
        .maybeSingle();

      let sections: Array<{ id: string; code: string; name: string; course: unknown }> = [];

      if (userRecord?.id) {
        const { data: enrolledRows } = await admin
          .from("enrollments")
          .select("section:sections(id, code, name, course:courses(id, code, name, canvas_course_id, term))")
          .eq("user_id", userRecord.id);

        if (Array.isArray(enrolledRows) && enrolledRows.length > 0) {
          sections = enrolledRows
            .map((r) => ((Array.isArray(r.section) ? r.section[0] : r.section) as unknown) as { id: string; code: string; name: string; course: unknown } | null)
            .filter((s): s is { id: string; code: string; name: string; course: unknown } => Boolean(s && s.code));
        }
      }

      // Fallback relacional por email en sections para compatibilidad absoluta
      if (sections.length === 0) {
        const { data: fallbackSections } = await admin
          .from("sections")
          .select("id, code, name, course:courses(id, code, name, canvas_course_id, term)")
          .or(`teacher_email.ilike.${userEmail},assistant_email.ilike.${userEmail}`);
        if (Array.isArray(fallbackSections)) {
          sections = (fallbackSections as unknown) as Array<{ id: string; code: string; name: string; course: unknown }>;
        }
      }

      if (sections.length > 0) {
        const userCourses: CanvasCourse[] = sections.map((sec, idx) => {
          const courseInfo = sec.course as { id?: string; code?: string; name?: string; canvas_course_id?: number; term?: string } | null;
          const canvasId = courseInfo?.canvas_course_id || (40000 + idx);
          const courseCode = sec.code || courseInfo?.code || "UDP_CURSO";
          const courseName = courseInfo?.name ? `${courseInfo.name} (${sec.name})` : sec.name;

          return {
            id: canvasId,
            name: courseName,
            code: courseCode,
            term: courseInfo?.term || "2026-02 Semestre Primavera",
            students_count: 30,
            is_automated: true,
            agent_id: mapCodeToAgentId(courseCode),
          };
        });

        return NextResponse.json(userCourses);
      }
    } catch (dbErr) {
      console.warn("[courses] Error al consultar Supabase:", dbErr);
    }

    // 3. Fallback de contingencia si no tiene cursos asignados en BD
    return NextResponse.json([
      {
        id: 41210,
        name: "ARQUITECTURA DE SOFTWARE (SANDBOX UDP)",
        code: "CIT3000_CA02",
        term: "2026-02 Semestre Primavera",
        students_count: 36,
        is_automated: true,
        agent_id: "agent_arq_soft",
      },
    ]);
  } catch (error) {
    console.error("Error al consultar cursos:", error);
    return NextResponse.json(
      { error: "Error al consultar cursos de la plataforma." },
      { status: 500 }
    );
  }
}
