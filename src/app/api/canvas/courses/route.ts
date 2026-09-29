import { NextResponse } from "next/server";
import { fetchCanvasCourses } from "@/services/canvas";

export async function GET() {
  try {
    const courses = await fetchCanvasCourses();
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al consultar cursos de Canvas UDP" },
      { status: 500 }
    );
  }
}
