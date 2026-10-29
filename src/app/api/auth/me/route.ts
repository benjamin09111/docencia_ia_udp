import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { findUserById } from "@/lib/server/userStore";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
  const user = await findUserById(session.userId || "");
  if (!user) return NextResponse.json({ authenticated: false, user: null }, { status: 401 });

  const hasCanvasToken = Boolean(
    session.isOwner && process.env.CANVAS_API_TOKEN && process.env.CANVAS_API_TOKEN.trim().length > 10
  );

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: session.role,
      isOwner: Boolean(session.isOwner),
      hasCanvasToken,
    },
  });
}
