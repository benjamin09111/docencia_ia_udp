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
