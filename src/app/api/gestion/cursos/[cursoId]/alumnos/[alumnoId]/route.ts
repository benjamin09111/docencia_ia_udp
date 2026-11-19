import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonSinCache, leerJson, requireCursoPropio, respuestaDeError } from "@/lib/server/gestionAcceso";
import { actualizarAlumno, eliminarAlumno, listarAlumnos } from "@/services/gestion/alumnosRepository";
import { alumnoSchema, validarFilasAlumnos } from "@/utils/gestion/validarAlumnos";

type Contexto = { params: Promise<{ cursoId: string; alumnoId: string }> };

const noEncontrado = () => jsonSinCache({ error: "Alumno no encontrado." }, 404);

/** PATCH: edita nombres, apellidos, RUT o correo de un alumno. */
export async function PATCH(req: NextRequest, { params }: Contexto) {
  try {
    const { cursoId, alumnoId } = await params;
    const acceso = await requireCursoPropio(req, cursoId);
    if ("response" in acceso) return acceso.response;
    if (!z.uuid().safeParse(alumnoId).success) return noEncontrado();

    const parsed = alumnoSchema.safeParse(await leerJson(req));
    if (!parsed.success) return jsonSinCache({ error: "Datos del alumno inválidos." }, 400);

    const otros = (await listarAlumnos(cursoId)).filter((a) => a.id !== alumnoId);
    const [fila] = validarFilasAlumnos([{ fila: 1, ...parsed.data }], otros);
    if (!fila.valida) return jsonSinCache({ error: fila.errores.join(" "), errores: fila.errores }, 400);

    return jsonSinCache({ alumno: await actualizarAlumno(cursoId, alumnoId, fila.datos) });
  } catch (error) {
    return respuestaDeError(error, "PATCH alumno");
  }
}

/** DELETE: elimina al alumno y sus notas. */
export async function DELETE(req: NextRequest, { params }: Contexto) {
  try {
    const { cursoId, alumnoId } = await params;
    const acceso = await requireCursoPropio(req, cursoId);
    if ("response" in acceso) return acceso.response;
    if (!z.uuid().safeParse(alumnoId).success) return noEncontrado();

    await eliminarAlumno(cursoId, alumnoId);
    return jsonSinCache({ ok: true });
  } catch (error) {
    return respuestaDeError(error, "DELETE alumno");
  }
}
