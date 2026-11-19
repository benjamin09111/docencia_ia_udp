import { NextRequest } from "next/server";
import { jsonSinCache, leerJson, requireCursoPropio, respuestaDeError } from "@/lib/server/gestionAcceso";
import { actualizarCurso } from "@/services/gestion/cursosRepository";
import { contarNotasPorEvaluacion } from "@/services/gestion/notasRepository";
import { cursoInputSchema, erroresPorCampo } from "@/utils/gestion/esquemasCurso";

type Contexto = { params: Promise<{ cursoId: string }> };

/** GET: curso con evaluaciones y cuántas notas tiene cada evaluación. */
export async function GET(req: NextRequest, { params }: Contexto) {
  try {
    const { cursoId } = await params;
    const acceso = await requireCursoPropio(req, cursoId);
    if ("response" in acceso) return acceso.response;
    const notasPorEvaluacion = await contarNotasPorEvaluacion(acceso.curso.evaluaciones.map((e) => e.id));
    return jsonSinCache({ curso: acceso.curso, notas_por_evaluacion: notasPorEvaluacion });
  } catch (error) {
    return respuestaDeError(error, "GET /api/gestion/cursos/[cursoId]");
  }
}

/** PUT: guarda la configuración editada (datos, escala, reglas y evaluaciones). */
export async function PUT(req: NextRequest, { params }: Contexto) {
  try {
    const { cursoId } = await params;
    const acceso = await requireCursoPropio(req, cursoId);
    if ("response" in acceso) return acceso.response;

    const parsed = cursoInputSchema.safeParse(await leerJson(req));
    if (!parsed.success) {
      return jsonSinCache({ error: "Revisa los datos del curso.", campos: erroresPorCampo(parsed.error) }, 400);
    }
    // El origen del curso (PDF o manual) no se cambia al editar.
    const input = { ...parsed.data, origen: acceso.curso.origen, programa_archivo: acceso.curso.programa_archivo };
    const curso = await actualizarCurso(cursoId, input);
    return jsonSinCache({ curso });
  } catch (error) {
    return respuestaDeError(error, "PUT /api/gestion/cursos/[cursoId]");
  }
}
