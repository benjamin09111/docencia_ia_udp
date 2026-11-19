import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const CURSO = "c1000000-0000-4000-8000-000000000001";
const sesion = vi.hoisted(() => ({ actual: { role: "docente", userId: "usr_docente_1" } as Record<string, unknown> }));

vi.mock("./auth", () => ({
  requireRole: vi.fn(async () => ({ session: { ...sesion.actual, jti: "x", iat: 0, exp: 0, idleExp: 0 } })),
}));
vi.mock("@/services/gestion/cursosRepository", () => ({
  obtenerCurso: vi.fn(async (id: string) => (id === CURSO ? { id, owner_user_id: "usr_docente_1", evaluaciones: [] } : null)),
}));

import { requireCursoPropio, requireDocente } from "./gestionAcceso";

const pedir = (metodo: string, headers: Record<string, string> = {}) =>
  new NextRequest("http://localhost:3000/api/gestion/cursos", { method: metodo, headers });

beforeEach(() => {
  sesion.actual = { role: "docente", userId: "usr_docente_1" };
});

describe("requireDocente (anti-CSRF)", () => {
  it("rechaza modificaciones declaradas cross-site o desde otro origen", async () => {
    const r1 = await requireDocente(pedir("POST", { "sec-fetch-site": "cross-site" }));
    const r2 = await requireDocente(pedir("PUT", { origin: "https://otro-sitio.test" }));
    expect("response" in r1 && r1.response.status).toBe(403);
    expect("response" in r2 && r2.response.status).toBe(403);
  });

  it("acepta modificaciones del mismo origen y lecturas", async () => {
    expect("session" in (await requireDocente(pedir("DELETE", { origin: "http://localhost:3000", "sec-fetch-site": "same-origin" })))).toBe(true);
    expect("session" in (await requireDocente(pedir("GET", { "sec-fetch-site": "cross-site" })))).toBe(true);
  });
});

describe("requireCursoPropio", () => {
  const acceso = (id: string) => requireCursoPropio(pedir("GET"), id);

  it("entrega el curso a su docente", async () => {
    const r = await acceso(CURSO);
    expect("curso" in r && r.curso.id).toBe(CURSO);
  });

  it("responde 404 (sin revelar que existe) a otro docente, a ids inválidos y a cursos inexistentes", async () => {
    sesion.actual = { role: "docente", userId: "usr_docente_2" };
    for (const id of [CURSO, "no-es-uuid", "c1000000-0000-4000-8000-000000000099"]) {
      const r = await acceso(id);
      expect("response" in r && r.response.status).toBe(404);
    }
  });

  it("un admin puede abrir cualquier curso", async () => {
    sesion.actual = { role: "admin", userId: "usr_admin_1" };
    expect("curso" in (await acceso(CURSO))).toBe(true);
  });
});
