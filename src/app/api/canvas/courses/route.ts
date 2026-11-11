import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { fetchCanvasCourses } from "@/services/canvas";
import { findUserById } from "@/lib/server/userStore";
import { getSandboxCoursesForUser } from "@/lib/server/sandboxCourses";
import { getUserCanvasToken } from "@/lib/server/userTokenStore";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Sesión requerida." }, { status: 401 });
    }

    const user = await findUserById(session.userId);
    if (!user) return NextResponse.json({ error: "Sesión requerida." }, { status: 401 });

    // 1. Cada cuenta consulta con su propio token adjuntado
    const userToken = await getUserCanvasToken(user.id, session.isOwner);
    const sandboxCourses = await getSandboxCoursesForUser(user.id, session.role);

    if (userToken) {
      try {
        const liveCanvasCourses = await fetchCanvasCourses(userToken);
        if (Array.isArray(liveCanvasCourses) && liveCanvasCourses.length > 0) {
          // Devuelve los cursos oficiales de Canvas correspondientes a ESTA cuenta
          return NextResponse.json(liveCanvasCourses, {
            headers: { "Cache-Control": "no-store" },
          });
        }
      } catch (err) {
        console.warn("[courses] Canvas API falló para la cuenta actual:", err);
      }
    }

    // 2. Si no tiene token adjuntado, devuelve los cursos asignados para su rol/usuario
    return NextResponse.json(sandboxCourses, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Error al consultar cursos:", error);
    return NextResponse.json(
      { error: "Error al consultar cursos de la plataforma." },
      { status: 500 }
    );
  }
}
