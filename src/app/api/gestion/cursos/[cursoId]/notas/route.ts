import { NextRequest } from "next/server";
import { jsonSinCache, leerJson, requireCursoPropio, respuestaDeError } from "@/lib/server/gestionAcceso";
import { listarAlumnos } from "@/services/gestion/alumnosRepository";
import { guardarDecimas, guardarNotas, listarNotas } from "@/services/gestion/notasRepository";
import { guardarNotasSchema } from "@/utils/gestion/esquemasNotas";

type Contexto = { params: Promise<{ cursoId: string }> };

/** GET: todo lo que necesita la tabla de notas (alumnos con décimas y notas guardadas). */
export async function GET(req: NextRequest, { params }: Contexto) {
  try {
    const { cursoId } = await params;
    const acceso = await requireCursoPropio(req, cursoId);
    if ("response" in acceso) return acceso.response;
    const [alumnos, notas] = await Promise.all([listarAlumnos(cursoId), listarNotas(cursoId)]);
    return jsonSinCache({
      alumnos,
      notas: notas.map(({ evaluacion_id, alumno_id, valor, origen }) => ({ evaluacion_id, alumno_id, valor, origen })),
    });
  } catch (error) {
    return respuestaDeError(error, "GET notas");
  }
}

/** PUT: guarda celdas editadas (valor null = borrar) y décimas. La nota final no se guarda: se calcula. */
export async function PUT(req: NextRequest, { params }: Contexto) {
  try {
    const { cursoId } = await params;
    const acceso = await requireCursoPropio(req, cursoId);
    if ("response" in acceso) return acceso.response;

    const parsed = guardarNotasSchema.safeParse(await leerJson(req));
    if (!parsed.success) {
      return jsonSinCache({ error: parsed.error.issues[0]?.message ?? "Notas inválidas." }, 400);
    }
    const { notas, decimas } = parsed.data;
    const tope = acceso.curso.decimas_totales;
    if (decimas.some((d) => d.decimas > (tope ?? 0))) {
      return jsonSinCache({ error: `Las décimas no pueden superar el total disponible del curso (${tope ?? 0}).` }, 400);
    }
    await guardarNotas(cursoId, notas, { origen: "manual", updated_by: acceso.session.userId ?? null });
    await guardarDecimas(cursoId, decimas);
    return jsonSinCache({ ok: true });
  } catch (error) {
    return respuestaDeError(error, "PUT notas");
  }
}
