import { NextRequest, NextResponse } from "next/server";

const CANVAS_BASE_URL = process.env.CANVAS_BASE_URL || "https://udp.instructure.com";
const CANVAS_TOKEN = process.env.CANVAS_API_TOKEN || "";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "courseId es requerido" }, { status: 400 });
    }

    if (!CANVAS_TOKEN) {
      return NextResponse.json({
        configured: false,
        message: "Token de Canvas no configurado. Operando en modo local.",
      });
    }

    const res = await fetch(`${CANVAS_BASE_URL}/api/v1/courses/${courseId}/front_page`, {
      headers: {
        Authorization: `Bearer ${CANVAS_TOKEN}`,
      },
      next: { revalidate: 60 },
    });

    if (res.status === 404) {
      return NextResponse.json({
        configured: true,
        exists: false,
        message: "El curso no tiene una Página de Inicio (Front Page) asignada en Canvas aún.",
      });
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Error Canvas Frontpage GET:", errorData);
      return NextResponse.json(
        { error: "Error al consultar la página de inicio en Canvas UDP." },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({
      configured: true,
      exists: true,
      frontPage: data,
    });
  } catch (error) {
    console.error("Error en GET /api/canvas/frontpage:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al obtener la portada." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId, title, htmlBody, setAsDefaultView = true } = body;

    if (!courseId || !htmlBody) {
      return NextResponse.json(
        { error: "courseId y htmlBody son requeridos" },
        { status: 400 }
      );
    }

    if (!CANVAS_TOKEN) {
      // Modo local simulado (sin token oficial configurado)
      return NextResponse.json({
        success: true,
        isSimulated: true,
        message: "Página de inicio guardada localmente (modo demostración / sin token Canvas activo).",
        htmlUrl: `${CANVAS_BASE_URL}/courses/${courseId}`,
        updatedAt: new Date().toISOString(),
      });
    }

    // 1. Intentar actualizar la página principal actual (PUT /front_page)
    let pageData: any = null;
    let updateRes = await fetch(`${CANVAS_BASE_URL}/api/v1/courses/${courseId}/front_page`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${CANVAS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wiki_page: {
          title: title || "Página Principal del Curso",
          body: htmlBody,
          published: true,
        },
      }),
    });

    if (updateRes.status === 404) {
      // Si Canvas no tiene front_page aún, creamos una nueva wiki page con front_page = true
      const createRes = await fetch(`${CANVAS_BASE_URL}/api/v1/courses/${courseId}/pages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CANVAS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wiki_page: {
            title: title || "Página Principal del Curso",
            body: htmlBody,
            published: true,
            front_page: true,
          },
        }),
      });

      if (!createRes.ok) {
        const errorData = await createRes.json().catch(() => ({}));
        throw new Error(errorData.message || "No se pudo crear la página en Canvas.");
      }

      pageData = await createRes.json();
    } else if (!updateRes.ok) {
      const errorData = await updateRes.json().catch(() => ({}));
      throw new Error(errorData.message || "No se pudo actualizar la página de inicio en Canvas.");
    } else {
      pageData = await updateRes.json();
    }

    // 2. Asegurar que la vista predeterminada del curso sea 'wiki' (Front Page)
    if (setAsDefaultView) {
      await fetch(`${CANVAS_BASE_URL}/api/v1/courses/${courseId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${CANVAS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course: {
            default_view: "wiki",
          },
        }),
      }).catch((e) => {
        console.warn("Aviso: No se pudo configurar default_view a wiki en Canvas:", e);
      });
    }

    return NextResponse.json({
      success: true,
      assignmentId: pageData?.page_id || pageData?.id,
      title: pageData?.title || title,
      htmlUrl: pageData?.html_url || `${CANVAS_BASE_URL}/courses/${courseId}`,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Excepción al guardar Front Page en Canvas:", error);
    return NextResponse.json(
      { error: "Error interno al sincronizar con Canvas UDP." },
      { status: 500 }
    );
  }
}
