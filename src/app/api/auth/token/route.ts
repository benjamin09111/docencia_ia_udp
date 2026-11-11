import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import {
  getUserCanvasToken,
  setUserCanvasToken,
  removeUserCanvasToken,
  maskToken,
  verifyCanvasToken,
} from "@/lib/server/userTokenStore";
import { isTrustedMutation, invalidRequestOriginResponse } from "@/lib/server/requestSecurity";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session || !session.userId) {
    return NextResponse.json({ error: "Sesión requerida." }, { status: 401 });
  }

  const token = await getUserCanvasToken(session.userId, session.isOwner);
  const hasToken = Boolean(token && token.length > 10);

  return NextResponse.json(
    {
      hasToken,
      tokenMasked: hasToken && token ? maskToken(token) : null,
      isOwner: Boolean(session.isOwner),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(req: NextRequest) {
  if (!isTrustedMutation(req)) return invalidRequestOriginResponse();

  const session = await getSession(req);
  if (!session || !session.userId) {
    return NextResponse.json({ error: "Sesión requerida." }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    const token = typeof body?.token === "string" ? body.token.trim() : "";

    if (!token || token.length < 10) {
      return NextResponse.json(
        { error: "Debe ingresar un token de acceso válido de Canvas UDP." },
        { status: 400 }
      );
    }

    // 1. Probar conectividad con Canvas LMS antes de guardar
    const verification = await verifyCanvasToken(token);
    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.error || "El token no fue aceptado por Canvas UDP." },
        { status: 400 }
      );
    }

    // 2. Guardar token para esta cuenta específica
    await setUserCanvasToken(session.userId, token);

    return NextResponse.json({
      success: true,
      message: "Token personal de Canvas vinculado correctamente.",
      tokenMasked: maskToken(token),
      canvasUser: verification.user,
    });
  } catch (err) {
    console.error("[api/auth/token] Error al guardar token:", err);
    return NextResponse.json(
      { error: "No fue posible vincular el token de Canvas en este momento." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!isTrustedMutation(req)) return invalidRequestOriginResponse();

  const session = await getSession(req);
  if (!session || !session.userId) {
    return NextResponse.json({ error: "Sesión requerida." }, { status: 401 });
  }

  try {
    await removeUserCanvasToken(session.userId);
    return NextResponse.json({
      success: true,
      message: "Token de Canvas desvinculado exitosamente.",
    });
  } catch (err) {
    console.error("[api/auth/token] Error al desvincular token:", err);
    return NextResponse.json(
      { error: "No fue posible desvincular el token." },
      { status: 500 }
    );
  }
}

