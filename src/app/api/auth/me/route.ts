import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const hasCanvasToken = Boolean(
    session.isOwner && process.env.CANVAS_API_TOKEN && process.env.CANVAS_API_TOKEN.trim().length > 10
  );

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.userId || "usr_unknown",
      email: session.email || "usuario@udp.cl",
      name: session.name || (session.role === "admin" ? "Administrador UDP" : "Docente UDP"),
      role: session.role,
      isOwner: Boolean(session.isOwner),
      hasCanvasToken,
    },
  });
}
