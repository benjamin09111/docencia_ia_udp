/**
 * Seed de la demo del Módulo 1: crea en Supabase el curso "Arquitectura de Software (Demo con notas)"
 * (CIT3000, Sección 1, 2026-2) con 6 evaluaciones, 10 alumnos ficticios y notas de ejemplo.
 *
 * Idempotente: si ese mismo curso demo ya existe para el docente, lo borra (con sus evaluaciones,
 * alumnos y notas, en cascada) y lo vuelve a crear. No toca ninguna otra tabla ni curso.
 *
 * Uso: npm run seed:m1 -- [userId del docente]   (por defecto usr_docente_1)
 * Requiere en .env.local: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY, y la migración
 * supabase/migrations/20261118_modulo1_gestion_calificaciones.sql aplicada.
 */
import { createClient } from "@supabase/supabase-js";
import { ALUMNOS, CURSO_SEED, EVALUACIONES, correo, rut } from "../../seed/modulo1/datos-demo.mjs";

const owner = process.argv[2] || "usr_docente_1";
const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: clave } = process.env;
if (!url || !clave) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. Ejecuta: npm run seed:m1");
  process.exit(1);
}
const db = createClient(url, clave, { auth: { persistSession: false, autoRefreshToken: false } });

function revisar(paso, { data, error }) {
  if (error) {
    console.error(`✗ ${paso}: ${error.message}`);
    process.exit(1);
  }
  return data;
}

// 1. Borra solo el curso demo previo de este docente (misma clave única)
revisar(
  "borrar curso demo previo",
  await db
    .from("cursos")
    .delete()
    .eq("owner_user_id", owner)
    .eq("codigo", CURSO_SEED.codigo)
    .eq("seccion", CURSO_SEED.seccion)
    .eq("semestre", CURSO_SEED.semestre)
);

// 2. Curso, evaluaciones y alumnos
const curso = revisar("crear curso", await db.from("cursos").insert({ ...CURSO_SEED, owner_user_id: owner }).select("id").single());
const evaluaciones = revisar(
  "crear evaluaciones",
  await db
    .from("evaluaciones")
    .insert(EVALUACIONES.map((e, orden) => ({ ...e, curso_id: curso.id, orden })))
    .select("id, orden")
);
const evalPorOrden = new Map(evaluaciones.map((e) => [e.orden, e.id]));
const alumnos = revisar(
  "crear alumnos",
  await db
    .from("alumnos")
    .insert(
      ALUMNOS.map((a) => ({
        curso_id: curso.id,
        nombres: a.nombres,
        apellidos: a.apellidos,
        rut: rut(a.cuerpo),
        correo: correo(a),
        decimas: a.decimas,
      }))
    )
    .select("id, rut")
);
const alumnoPorRut = new Map(alumnos.map((a) => [a.rut, a.id]));

// 3. Notas (las celdas null quedan vacías a propósito)
const notas = ALUMNOS.flatMap((a) =>
  a.notas.flatMap((valor, orden) =>
    valor === null
      ? []
      : [{ evaluacion_id: evalPorOrden.get(orden), alumno_id: alumnoPorRut.get(rut(a.cuerpo)), valor, origen: "importacion" }]
  )
);
revisar("crear notas", await db.from("notas").insert(notas));

console.log(`✓ Curso demo creado para ${owner}: ${CURSO_SEED.nombre} (id ${curso.id})`);
console.log(`  ${evaluaciones.length} evaluaciones · ${alumnos.length} alumnos · ${notas.length} notas`);
