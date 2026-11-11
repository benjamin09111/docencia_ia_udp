import { CanvasCourse, CanvasUser } from "@/types";

const CANVAS_BASE_URL = process.env.CANVAS_BASE_URL || "https://udp.instructure.com";

export async function fetchCanvasUser(token?: string): Promise<CanvasUser> {
  const activeToken = token || process.env.CANVAS_API_TOKEN || "";
  if (!activeToken) {
    return {
      id: 10001,
      name: "Docente / Administrador UDP",
      short_name: "Usuario UDP",
      avatar_url: "",
      email: "docente.udp@mail.udp.cl",
      role: "admin",
    };
  }

  try {
    const res = await fetch(`${CANVAS_BASE_URL}/api/v1/users/self`, {
      headers: {
        Authorization: `Bearer ${activeToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Error fetching Canvas user");
    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      short_name: data.short_name || data.name,
      avatar_url: data.avatar_url || "",
      email: data.primary_email || data.login_id || "usuario@mail.udp.cl",
      role: "admin",
    };
  } catch {
    return {
      id: 10001,
      name: "Docente / Administrador UDP",
      short_name: "Usuario UDP",
      avatar_url: "",
      email: "docente.udp@mail.udp.cl",
      role: "admin",
    };
  }
}

export async function fetchCanvasCourses(token?: string): Promise<CanvasCourse[]> {
  const activeToken = token || process.env.CANVAS_API_TOKEN || "";
  if (!activeToken) return [];

  try {
    // 1. Primero intentar obtener cursos favoritos del tablero
    let res = await fetch(`${CANVAS_BASE_URL}/api/v1/users/self/favorites/courses?include[]=term`, {
      headers: { Authorization: `Bearer ${activeToken}` },
      cache: "no-store",
    });

    let data = res.ok ? await res.json() : [];

    // 2. Si no tiene favoritos marcados con estrella, obtener todos los cursos activos del usuario
    if (!Array.isArray(data) || data.length === 0) {
      res = await fetch(`${CANVAS_BASE_URL}/api/v1/courses?enrollment_state=active&include[]=term`, {
        headers: { Authorization: `Bearer ${activeToken}` },
        cache: "no-store",
      });
      data = res.ok ? await res.json() : [];
    }

    if (!Array.isArray(data)) return [];

    return data
      .filter((c: { name?: string; id?: number }) => c && c.name && c.id)
      .map((c: { id: number; name: string; course_code?: string; term?: { name: string } }) => {
        const isTeacherCourse = Boolean(
          c.id === 44999 ||
          c.id === 45002 ||
          c.id === 47552 ||
          c.id === 47047 ||
          c.id === 44988 ||
          (c.course_code &&
            (c.course_code.includes("CIT3203") ||
              c.course_code.includes("CIT2206") ||
              c.course_code.includes("CIT3100")))
        );

        let agentId = undefined;
        if (
          c.id === 44999 ||
          c.id === 45002 ||
          c.id === 47552 ||
          (c.course_code && c.course_code.includes("CIT3203"))
        ) {
          agentId = "agent_cit3621";
        } else if (c.id === 47047 || (c.course_code && c.course_code.includes("CIT2206"))) {
          agentId = "agent_gestion_org";
        } else if (c.id === 44988 || (c.course_code && c.course_code.includes("CIT3100"))) {
          agentId = "agent_arq_emergentes";
        }

        return {
          id: c.id,
          name: c.name,
          code: c.course_code || `UDP_${c.id}`,
          term: c.term?.name || "2026-02 Semestre Primavera",
          students_count: 30,
          is_automated: isTeacherCourse,
          agent_id: agentId,
          source: "canvas" as const,
        };
      });
  } catch (err) {
    console.warn("[fetchCanvasCourses] Error al conectar con Canvas:", err);
    return [];
  }
}
