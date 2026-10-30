import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { fetchCanvasCourses } from "@/services/canvas";
import { findUserById } from "@/lib/server/userStore";
import { getSandboxCoursesForUser } from "@/lib/server/sandboxCourses";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Sesión requerida." }, { status: 401 });
    }

    const user = await findUserById(session.userId);
    if (!user) return NextResponse.json({ error: "Sesión requerida." }, { status: 401 });

    const isOwner = Boolean(session.isOwner);
    const hasCanvasToken = Boolean(process.env.CANVAS_API_TOKEN && process.env.CANVAS_API_TOKEN.trim().length > 10);
    const sandboxCourses = await getSandboxCoursesForUser(user.id);

    // 1. Si es el titular y tiene token activo de Canvas, sincroniza cursos favoritos oficiales de Canvas
    if (isOwner && hasCanvasToken) {
      try {
        const liveCanvasCourses = await fetchCanvasCourses();
        if (Array.isArray(liveCanvasCourses) && liveCanvasCourses.length > 0) {
          return NextResponse.json([...liveCanvasCourses, ...sandboxCourses], { headers: { "Cache-Control": "no-store" } });
        }
      } catch (err) {
        console.warn("[courses] Canvas API falló, recurriendo a asociaciones de base de datos:", err);
      }
    }

    return NextResponse.json(sandboxCourses, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Error al consultar cursos:", error);
    return NextResponse.json(
      { error: "Error al consultar cursos de la plataforma." },
      { status: 500 }
    );
  }
}
