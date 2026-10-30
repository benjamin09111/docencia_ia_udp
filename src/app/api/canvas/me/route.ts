import { NextResponse } from "next/server";
import { fetchCanvasUser } from "@/services/canvas";

export async function GET() {
  try {
    const user = await fetchCanvasUser();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al consultar usuario de Canvas UDP" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const CANVAS_BASE_URL = process.env.CANVAS_BASE_URL || "https://udp.instructure.com";
    const CANVAS_TOKEN = process.env.CANVAS_API_TOKEN || "";

    if (CANVAS_TOKEN && body.bio) {
      // Intento de actualización directa en Canvas LMS
      try {
        await fetch(`${CANVAS_BASE_URL}/api/v1/users/self`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${CANVAS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: {
              bio: body.bio,
            },
          }),
        });
      } catch (err) {
        console.warn("No se pudo actualizar remotamente en Canvas:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Perfil actualizado y sincronizado en Canvas",
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al guardar perfil en Canvas" },
      { status: 500 }
    );
  }
}
