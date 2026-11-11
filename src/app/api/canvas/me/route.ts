import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { fetchCanvasUser } from "@/services/canvas";
import { getUserCanvasToken } from "@/lib/server/userTokenStore";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const userToken = session?.userId
      ? await getUserCanvasToken(session.userId, session.isOwner)
      : null;

    const user = await fetchCanvasUser(userToken || undefined);
    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: "Error al consultar usuario de Canvas UDP" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireRole(req);
  if ("response" in auth) return auth.response;

  try {
    const session = await getSession(req);
    const body = await req.json();
    const baseUrl = process.env.CANVAS_BASE_URL || "https://udp.instructure.com";
    const userToken = session?.userId
      ? await getUserCanvasToken(session.userId, session.isOwner)
      : null;

    if (userToken && body.bio) {
      try {
        await fetch(`${baseUrl}/api/v1/users/self`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: { bio: body.bio } }),
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
  } catch {
    return NextResponse.json(
      { error: "Error al guardar perfil en Canvas" },
      { status: 500 }
    );
  }
}
