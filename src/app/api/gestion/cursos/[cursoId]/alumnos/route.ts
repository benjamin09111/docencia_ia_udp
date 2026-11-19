import { NextRequest } from "next/server";
import { jsonSinCache, leerJson, requireCursoPropio, respuestaDeError } from "@/lib/server/gestionAcceso";
import { insertarAlumnos, listarAlumnos } from "@/services/gestion/alumnosRepository";
import { crearAlumnosSchema, validarFilasAlumnos } from "@/utils/gestion/validarAlumnos";

type Contexto = { params: Promise<{ cursoId: string }> };

/** GET: nómina del curso. */
export async function GET(req: NextRequest, { params }: Contexto) {
  try {
    const { cursoId } = await params;
    const acceso = await requireCursoPropio(req, cursoId);
    if ("response" in acceso) return acceso.response;
    return jsonSinCache({ alumnos: await listarAlumnos(cursoId) });
  } catch (error) {
    return respuestaDeError(error, "GET alumnos");
  }
}

/**
 * POST: agrega uno o varios alumnos (alta manual o carga confirmada del Excel).
 * Revalida todo (RUT módulo 11, correo, duplicados en el lote y contra el curso);
 * si alguna fila falla, no se guarda ninguna.
 */
export async function POST(req: NextRequest, { params }: Contexto) {
  try {
    const { cursoId } = await params;
    const acceso = await requireCursoPropio(req, cursoId);
    if ("response" in acceso) return acceso.response;

    const parsed = crearAlumnosSchema.safeParse(await leerJson(req));
    if (!parsed.success) {
      return jsonSinCache({ error: parsed.error.issues[0]?.message ?? "Datos de alumnos inválidos." }, 400);
    }
    const existentes = await listarAlumnos(cursoId);
    const filas = validarFilasAlumnos(
      parsed.data.alumnos.map((a, i) => ({ fila: i + 1, ...a })),
      existentes
    );
    const conErrores = filas.filter((f) => !f.valida);
    if (conErrores.length > 0) {
      return jsonSinCache(
        {
          error: `Hay ${conErrores.length} alumno(s) con errores. Corrígelos y vuelve a intentarlo.`,
          filas: conErrores.map((f) => ({ fila: f.fila, errores: f.errores })),
        },
        400
      );
    }
    const alumnos = await insertarAlumnos(cursoId, filas.map((f) => f.datos));
    return jsonSinCache({ alumnos }, 201);
  } catch (error) {
    return respuestaDeError(error, "POST alumnos");
  }
}
