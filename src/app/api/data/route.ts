import { NextRequest, NextResponse } from "next/server";
import { clientIp, getSession } from "@/lib/server/auth";
import { verifyBoardToken } from "@/lib/server/boardToken";
import { DATA_OPS } from "@/lib/server/dataOps";
import { OpError } from "@/lib/server/dataOps/types";
import { AdminConfigError, getSupabaseAdmin } from "@/lib/server/supabaseAdmin";

const MAX_BODY_BYTES = 600_000; // un lote de 3000 marcajes pesa ~300 KB
const OP_NAME_RE = /^[A-Za-z]+(\.[A-Za-z]+){1,2}$/;

const failure = (status: number, code: string, message: string) =>
  NextResponse.json({ ok: false, code, message }, { status, headers: { "Cache-Control": "no-store" } });

/**
 * Puerta única de datos. El middleware deja pasar esta ruta sin sesión porque algunas operaciones son
 * públicas (alumnos); por eso CADA operación declara su nivel de acceso y se verifica aquí.
 */
export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) return failure(413, "too_large", "La solicitud es demasiado grande.");
    let body: { op?: unknown; args?: unknown } | null = null;
    try {
      body = JSON.parse(raw);
    } catch {}

    const opName = typeof body?.op === "string" ? body.op : "";
    const op = OP_NAME_RE.test(opName) ? DATA_OPS[opName] : undefined;
    if (!op) return failure(400, "unknown_op", "Operación no válida.");
    const args = body?.args && typeof body.args === "object" && !Array.isArray(body.args) ? (body.args as Record<string, unknown>) : {};

    const isTeacher = Boolean(await getSession(req));

    if (op.access === "teacher" && !isTeacher) return failure(401, "auth_required", "Sesión requerida.");
    if (op.access === "board" && !isTeacher) {
      const section = typeof args.sectionCode === "string" ? args.sectionCode : "";
      if (!(await verifyBoardToken(req.headers.get("x-board-token"), section))) {
        return failure(401, "board_locked", "Ingresa el PIN de la sección para ver la planilla.");
      }
    }

    const data = await op.run({ admin: getSupabaseAdmin(), ip: clientIp(req), isTeacher }, args);
    return NextResponse.json({ ok: true, data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof OpError) return failure(error.status, error.code, error.message);
    if (error instanceof AdminConfigError) console.error("[data]", error.message);
    else console.error("[data]", error);
    // Regla 12: nunca se devuelve el detalle interno del error
    return failure(500, "server_error", "No se pudo procesar la solicitud en este momento.");
  }
}
