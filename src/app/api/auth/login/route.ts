import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    const expectedKey = process.env.APP_ACCESS_KEY || process.env.NEXT_PUBLIC_APP_ACCESS_KEY;

    if (!expectedKey) {
      console.error("APP_ACCESS_KEY no está configurada en las variables de entorno.");
      return NextResponse.json(
        { error: "Error de configuración: Clave institucional no configurada en el servidor." },
        { status: 500 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Debe ingresar una clave de acceso." }, { status: 400 });
    }

    if (password.trim() !== expectedKey.trim()) {
      return NextResponse.json({ error: "Clave de acceso incorrecta. Intente nuevamente." }, { status: 401 });
    }

    // Generar respuesta exitosa y asignar cookie HttpOnly de sesión
    const response = NextResponse.json({ success: true, message: "Acceso autorizado." });

    response.cookies.set("udp_auth_session", "authenticated_udp_session_2026", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 horas de sesión
    });

    return response;
  } catch (error) {
    console.error("Error en autenticación institucional:", error);
    return NextResponse.json(
      { error: "No fue posible procesar el inicio de sesión en este momento." },
      { status: 500 }
    );
  }
}
