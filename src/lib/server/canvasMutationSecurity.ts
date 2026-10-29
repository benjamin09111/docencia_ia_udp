import { NextResponse } from "next/server";
import type { SessionClaims } from "./session";

const SANDBOX_COURSE_ID = process.env.SANDBOX_CANVAS_COURSE_ID || "41210";

export function canMutateCanvas(session: SessionClaims, courseId: unknown): boolean {
  if (session.role !== "admin" || !session.isOwner) return false;
  const id = String(courseId || "").trim();
  if (!/^\d{1,12}$/.test(id)) return false;

  const configured = (process.env.CANVAS_MUTATION_ALLOWED_COURSE_IDS || SANDBOX_COURSE_ID)
    .split(",")
    .map((value) => value.trim())
    .filter((value) => /^\d{1,12}$/.test(value));
  return configured.includes(id);
}

export function canvasMutationDenied(): NextResponse {
  return NextResponse.json(
    { error: "No tienes autorización para modificar este curso." },
    { status: 403, headers: { "Cache-Control": "no-store" } }
  );
}

export function isSafeCanvasHtml(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0 || value.length > 100_000) return false;
  return !/(<\/?(?:script|iframe|object|embed|form|base)\b|\son\w+\s*=|javascript\s*:|data\s*:text\/html)/i.test(value);
}
