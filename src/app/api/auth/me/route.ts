import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { findUserById } from "@/lib/server/userStore";
import { getUserCanvasToken, maskToken } from "@/lib/server/userTokenStore";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
  const user = await findUserById(session.userId || "");
  if (!user) return NextResponse.json({ authenticated: false, user: null }, { status: 401 });

  const token = await getUserCanvasToken(user.id, session.isOwner);
  const hasCanvasToken = Boolean(token && token.trim().length > 10);

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: session.role,
      isOwner: Boolean(session.isOwner),
      faculty: "Facultad de Ingeniería y Ciencias",
      school: "Escuela de Informática y Telecomunicaciones",
      hasCanvasToken,
      tokenMasked: hasCanvasToken && token ? maskToken(token) : null,
    },
  });
}
