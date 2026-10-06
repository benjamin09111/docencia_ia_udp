import { NextRequest, NextResponse } from "next/server";

const CANVAS_BASE_URL = process.env.CANVAS_BASE_URL || "https://udp.instructure.com";
const CANVAS_TOKEN = process.env.CANVAS_API_TOKEN || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId, name, description, dueAt, unlockAt, pointsPossible } = body;

    if (!CANVAS_TOKEN) {
      return NextResponse.json(
        { error: "Token de Canvas no configurado" },
        { status: 400 }
      );
    }

    const payload = {
      assignment: {
        name: name,
        description: description || "<p>Entregable oficial generado por Docencia IA UDP.</p>",
        points_possible: pointsPossible || 7.0,
        grading_type: "points",
        due_at: dueAt || null,
        unlock_at: unlockAt || null,
        submission_types: ["online_upload"],
        allowed_extensions: ["pdf"],
        published: false, // REGLA ESTRICTA: NUNCA PUBLICAR DIRECTO (SIEMPRE BORRADOR)
        notify_of_update: false,
      },
    };

    const res = await fetch(`${CANVAS_BASE_URL}/api/v1/courses/${courseId}/assignments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CANVAS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Error Canvas API:", data);
      return NextResponse.json(
        { error: "No fue posible crear la tarea en Canvas UDP." },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      assignmentId: data.id,
      name: data.name,
      htmlUrl: data.html_url,
      published: data.published,
      workflowState: data.workflow_state,
    });
  } catch (error) {
    console.error("Excepción en creación de tarea:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la solicitud." },
      { status: 500 }
    );
  }
}
