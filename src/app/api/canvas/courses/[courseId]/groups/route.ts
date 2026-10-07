import { NextRequest, NextResponse } from "next/server";

const CANVAS_BASE_URL = process.env.CANVAS_BASE_URL || "https://udp.instructure.com";
const CANVAS_TOKEN = process.env.CANVAS_API_TOKEN || "";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;

    if (!CANVAS_TOKEN) {
      return NextResponse.json({ error: "No CANVAS_API_TOKEN configured" }, { status: 401 });
    }

    // 1. Obtener grupos del curso en Canvas
    const res = await fetch(`${CANVAS_BASE_URL}/api/v1/courses/${courseId}/groups?per_page=50`, {
      headers: {
        Authorization: `Bearer ${CANVAS_TOKEN}`,
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error("Error fetching Canvas course groups:", res.status, res.statusText);
      return NextResponse.json(
        { error: "Error al consultar los grupos del curso en Canvas UDP." },
        { status: res.status }
      );
    }

    const canvasGroups = await res.json();

    if (!Array.isArray(canvasGroups)) {
      return NextResponse.json([]);
    }

    // 2. Traer usuarios de cada grupo en paralelo
    const detailedGroups = await Promise.all(
      canvasGroups.map(async (g: any) => {
        try {
          const membersRes = await fetch(`${CANVAS_BASE_URL}/api/v1/groups/${g.id}/users?per_page=50`, {
            headers: {
              Authorization: `Bearer ${CANVAS_TOKEN}`,
            },
            next: { revalidate: 300 },
          });

          const membersData = membersRes.ok ? await membersRes.json() : [];
          const members = Array.isArray(membersData)
            ? membersData.map((u: any) => {
                const parts = (u.name || "").trim().split(" ");
                return {
                  canvas_id: u.id,
                  nombres: parts.slice(0, 2).join(" ") || u.name,
                  apellidos: parts.slice(2).join(" ") || "",
                  email: u.login_id || u.email,
                };
              })
            : [];

          return {
            id: `canvas_grp_${g.id}`,
            canvasGroupId: g.id,
            name: g.name,
            categoryName: "Canvas LMS",
            members,
            createdAt: g.created_at || new Date().toISOString(),
          };
        } catch {
          return {
            id: `canvas_grp_${g.id}`,
            canvasGroupId: g.id,
            name: g.name,
            categoryName: "Canvas LMS",
            members: [],
            createdAt: g.created_at || new Date().toISOString(),
          };
        }
      })
    );

    return NextResponse.json(detailedGroups);
  } catch (error) {
    console.error("Excepción en consulta de grupos Canvas:", error);
    return NextResponse.json(
      { error: "No fue posible procesar los grupos en este momento." },
      { status: 500 }
    );
  }
}
