import { CanvasCourse } from "@/types";
import { getSupabaseAdmin } from "./supabaseAdmin";

const USER_SPECIFIC_COURSES: Record<string, CanvasCourse[]> = {
  // Docente 1 (Benjamín Morales)
  usr_docente_1: [
    { id: 900001, name: "Arquitectura de Software — Cátedra", code: "CIT3000_CA02", term: "2026-2 Primavera", students_count: 32, is_automated: true, agent_id: "agent_arq_soft", source: "sandbox" },
    { id: 900005, name: "Proyecto en TICs II — Cátedra", code: "CIT3203_CA01", term: "2026-2 Primavera", students_count: 28, is_automated: true, agent_id: "agent_cit3621", source: "sandbox" },
  ],
  // Docente 2 (Alejandro Silva - Programación)
  usr_docente_2: [
    { id: 900010, name: "Taller de Programación — Cátedra Piloto", code: "CIT1000_CA01", term: "2026-2 Primavera", students_count: 36, is_automated: true, agent_id: "agent_prog_code", source: "sandbox" },
    { id: 900011, name: "Algoritmos y Estructuras de Datos", code: "CIT1100_CA01", term: "2026-2 Primavera", students_count: 30, is_automated: true, agent_id: "agent_prog_code", source: "sandbox" },
  ],
  // Docente 3 (Marcela Soto - Gestión)
  usr_docente_3: [
    { id: 900020, name: "Gestión Organizacional — Cátedra Piloto", code: "CIT2206_CA01", term: "2026-2 Primavera", students_count: 34, is_automated: true, agent_id: "agent_gestion_org", source: "sandbox" },
    { id: 900021, name: "Liderazgo y Gestión de Proyectos", code: "CIT2300_CA01", term: "2026-2 Primavera", students_count: 26, is_automated: true, agent_id: "agent_gestion_org", source: "sandbox" },
  ],

  // Ayudante 1 (Lucas Meneses)
  usr_ayudante_1: [
    { id: 900001, name: "Arquitectura de Software (Laboratorio & Taller)", code: "CIT3000_CA02", term: "2026-2 Ayudantía", students_count: 32, is_automated: true, agent_id: "agent_arq_soft", source: "sandbox" },
  ],
  // Ayudante 2 (Sofía Valenzuela)
  usr_ayudante_2: [
    { id: 900010, name: "Taller de Programación (Ayudantía y Práctica)", code: "CIT1000_CA01", term: "2026-2 Ayudantía", students_count: 36, is_automated: true, agent_id: "agent_prog_code", source: "sandbox" },
  ],
  // Ayudante 3 (Matías Riquelme)
  usr_ayudante_3: [
    { id: 900020, name: "Gestión Organizacional (Ayudantía & Casos)", code: "CIT2206_CA01", term: "2026-2 Ayudantía", students_count: 34, is_automated: true, agent_id: "agent_gestion_org", source: "sandbox" },
  ],

  // Estudiante 1 (Camila Andrea Rojas)
  usr_estudiante_1: [
    { id: 900001, name: "Arquitectura de Software", code: "CIT3000_CA02", term: "2026-2 Cátedra", students_count: 32, is_automated: false, source: "sandbox" },
    { id: 900005, name: "Proyecto en TICs II", code: "CIT3203_CA01", term: "2026-2 Cátedra", students_count: 28, is_automated: false, source: "sandbox" },
  ],
  // Estudiante 2 (Nicolás Ignacio Pérez)
  usr_estudiante_2: [
    { id: 900010, name: "Taller de Programación", code: "CIT1000_CA01", term: "2026-2 Cátedra", students_count: 36, is_automated: false, source: "sandbox" },
  ],
  // Estudiante 3 (Valentina Paz Castro)
  usr_estudiante_3: [
    { id: 900020, name: "Gestión Organizacional", code: "CIT2206_CA01", term: "2026-2 Cátedra", students_count: 34, is_automated: false, source: "sandbox" },
  ],
};

const DEFAULT_ADMIN_COURSES: CanvasCourse[] = [
  { id: 900001, name: "Arquitectura de Software (CIT3000)", code: "CIT3000_CA02", term: "2026-2 Piloto", students_count: 32, is_automated: true, agent_id: "agent_arq_soft", source: "sandbox" },
  { id: 900010, name: "Taller de Programación (CIT1000)", code: "CIT1000_CA01", term: "2026-2 Piloto", students_count: 36, is_automated: true, agent_id: "agent_prog_code", source: "sandbox" },
  { id: 900020, name: "Gestión Organizacional (CIT2206)", code: "CIT2206_CA01", term: "2026-2 Piloto", students_count: 34, is_automated: true, agent_id: "agent_gestion_org", source: "sandbox" },
  { id: 900005, name: "Proyecto en TICs II (CIT3203)", code: "CIT3203_CA01", term: "2026-2 Piloto", students_count: 28, is_automated: true, agent_id: "agent_cit3621", source: "sandbox" },
];

export async function getSandboxCoursesForUser(userId: string, role = "docente"): Promise<CanvasCourse[]> {
  // 1. Cursos específicos mapeados al ID de usuario
  if (USER_SPECIFIC_COURSES[userId]) {
    return USER_SPECIFIC_COURSES[userId];
  }

  // 2. Intentar buscar asignaciones en Supabase si existen
  try {
    const { data } = await getSupabaseAdmin()
      .from("sandbox_course_members")
      .select("course:sandbox_courses(canvas_like_id, name, code, term, students_count, agent_id)")
      .eq("user_id", userId);

    if (Array.isArray(data) && data.length > 0) {
      const courses = data.flatMap((row) => {
        const course = Array.isArray(row.course) ? row.course[0] : row.course;
        if (!course?.canvas_like_id || !course.name || !course.code) return [];
        return [{
          id: course.canvas_like_id,
          name: course.name,
          code: course.code,
          term: course.term || "Sandbox",
          students_count: course.students_count || 0,
          is_automated: true,
          agent_id: course.agent_id || "agent_docente_generico",
          source: "sandbox" as const,
        }];
      });
      if (courses.length > 0) return courses;
    }
  } catch {}

  // 3. Fallback según rol
  if (role === "admin") return DEFAULT_ADMIN_COURSES;
  if (role === "ayudante") return USER_SPECIFIC_COURSES.usr_ayudante_1;
  if (role === "estudiante") return USER_SPECIFIC_COURSES.usr_estudiante_1;
  return USER_SPECIFIC_COURSES.usr_docente_1;
}
