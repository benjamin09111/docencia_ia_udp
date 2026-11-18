import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "./auth";
import { AdminConfigError } from "./supabaseAdmin";
import type { SessionClaims } from "./session";
import type { CursoConEvaluaciones } from "@/types/gestion";
import { obtenerCurso } from "@/services/gestion/cursosRepository";
import { ErrorGestion } from "@/services/gestion/errores";

/**
 * Guardias de las rutas /api/gestion (Módulo 1).
 * Acceso: docente dueño del curso o admin. Un curso ajeno responde 404 para no
 * revelar que existe.
 */

const SIN_CACHE = { "Cache-Control": "no-store" };

type Rechazo = { response: NextResponse };

export function jsonSinCache(cuerpo: unknown, status = 200): NextResponse {
  return NextResponse.json(cuerpo, { status, headers: SIN_CACHE });
}

const noEncontrado = (): Rechazo => ({ response: jsonSinCache({ error: "Curso no encontrado." }, 404) });

/** Sesión de docente o admin con userId (necesario para ser dueño de cursos). */
export async function requireDocente(req: NextRequest): Promise<{ session: SessionClaims } | Rechazo> {
  const auth = await requireRole(req, ["docente", "admin"]);
  if ("response" in auth) return auth;
  if (!auth.session.userId) return { response: jsonSinCache({ error: "Sesión requerida." }, 401) };
  return auth;
}

/** Sesión válida + curso existente que pertenece al usuario (o el usuario es admin). */
export async function requireCursoPropio(
  req: NextRequest,
  cursoId: string
): Promise<{ session: SessionClaims; curso: CursoConEvaluaciones } | Rechazo> {
  const auth = await requireDocente(req);
  if ("response" in auth) return auth;
  if (!z.uuid().safeParse(cursoId).success) return noEncontrado();

  const curso = await obtenerCurso(cursoId);
  const esDueno = curso?.owner_user_id === auth.session.userId;
  if (!curso || (!esDueno && auth.session.role !== "admin")) return noEncontrado();
  return { session: auth.session, curso };
}

const STATUS_POR_TIPO = { invalido: 400, no_encontrado: 404, conflicto: 409, interno: 500 } as const;

/** Respuesta genérica para errores: nunca expone mensajes de la base ni stack traces. */
export function respuestaDeError(error: unknown, contexto: string): NextResponse {
  if (error instanceof ErrorGestion) {
    return jsonSinCache({ error: error.mensajePublico }, STATUS_POR_TIPO[error.tipo]);
  }
  if (error instanceof AdminConfigError) {
    console.error(`[gestion] ${contexto}: Supabase no configurado.`);
    return jsonSinCache({ error: "El almacenamiento del módulo no está configurado." }, 503);
  }
  console.error(`[gestion] ${contexto}:`, error instanceof Error ? error.message : error);
  return jsonSinCache({ error: "No se pudo procesar la solicitud en este momento." }, 500);
}

/** Lee el body JSON; devuelve undefined si no es JSON válido. */
export async function leerJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return undefined;
  }
}
