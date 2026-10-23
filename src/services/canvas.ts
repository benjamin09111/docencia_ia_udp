import { CanvasCourse, CanvasUser } from "@/types";

const CANVAS_BASE_URL = process.env.CANVAS_BASE_URL || "https://udp.instructure.com";
const CANVAS_TOKEN = process.env.CANVAS_API_TOKEN || "";

export async function fetchCanvasUser(): Promise<CanvasUser> {
  if (!CANVAS_TOKEN) {
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
        Authorization: `Bearer ${CANVAS_TOKEN}`,
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("Error fetching Canvas user");
    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      short_name: data.short_name || data.name,
      avatar_url: data.avatar_url,
      email: data.primary_email || "usuario@mail.udp.cl",
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

export async function fetchCanvasCourses(): Promise<CanvasCourse[]> {
  if (!CANVAS_TOKEN) {
    return getFallbackCourses();
  }

  try {
    // Obtenemos los cursos favoritos que están activos en el Tablero de Canvas
    const res = await fetch(`${CANVAS_BASE_URL}/api/v1/users/self/favorites/courses?include[]=term`, {
      headers: {
        Authorization: `Bearer ${CANVAS_TOKEN}`,
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error("Error fetching Canvas favorite courses");
    const data = await res.json();

    return data
      .filter((c: { name?: string; id?: number }) => c.name && c.id)
      .map((c: { id: number; name: string; course_code?: string; term?: { name: string } }) => {
        const isTeacherCourse =
          c.id === 44999 ||
          c.id === 45002 ||
          c.id === 47552 ||
          c.id === 47047 ||
          c.id === 44988 ||
          (c.course_code && (c.course_code.includes("CIT3203") || c.course_code.includes("CIT2206") || c.course_code.includes("CIT3100")));

        let agentId = undefined;
        if (c.id === 44999 || c.id === 45002 || c.id === 47552 || (c.course_code && c.course_code.includes("CIT3203"))) {
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
          students_count: Math.floor(Math.random() * 10) + 25,
          is_automated: isTeacherCourse,
          agent_id: agentId,
        };
      });
  } catch {
    return getFallbackCourses();
  }
}

function getFallbackCourses(): CanvasCourse[] {
  return [
    {
      id: 41210,
      name: "ARQUITECTURA DE SOFTWARE (SANDBOX UDP)",
      code: "CIT3000_CA02",
      term: "2026-02 Semestre Primavera",
      students_count: 36,
      is_automated: true,
      agent_id: "agent_arq_soft",
    },
  ];
}
