import { NextRequest } from "next/server";
import { jsonSinCache, leerJson, requireDocente, respuestaDeError } from "@/lib/server/gestionAcceso";
import { crearCurso, listarCursos } from "@/services/gestion/cursosRepository";
import { cursoInputSchema, erroresPorCampo } from "@/utils/gestion/esquemasCurso";

/** GET: cursos del docente (admin ve todos). */
export async function GET(req: NextRequest) {
  const auth = await requireDocente(req);
  if ("response" in auth) return auth.response;
  try {
    const owner = auth.session.role === "admin" ? null : auth.session.userId!;
    return jsonSinCache({ cursos: await listarCursos(owner) });
  } catch (error) {
    return respuestaDeError(error, "GET /api/gestion/cursos");
  }
}

/** POST: crea el curso que el docente revisó y confirmó en el formulario. */
export async function POST(req: NextRequest) {
  const auth = await requireDocente(req);
  if ("response" in auth) return auth.response;
  try {
    const parsed = cursoInputSchema.safeParse(await leerJson(req));
    if (!parsed.success) {
      return jsonSinCache({ error: "Revisa los datos del curso.", campos: erroresPorCampo(parsed.error) }, 400);
    }
    const curso = await crearCurso(auth.session.userId!, parsed.data);
    return jsonSinCache({ curso }, 201);
  } catch (error) {
    return respuestaDeError(error, "POST /api/gestion/cursos");
  }
}
