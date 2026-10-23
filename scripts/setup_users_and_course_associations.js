const { Client } = require('pg');
const crypto = require('crypto');

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

const SEED_USERS = [
  {
    id: "usr_admin_bmorales",
    email: "benjamin.morales3@mail.udp.cl",
    username: "bmorales",
    name: "Benjamín Morales Pizarro",
    role: "admin",
    is_owner: true,
    salt: "7b4c6e8f1a2d3e4f5a6b7c8d9e0f1a2b",
    rawPass: "AdminUdp2026!BM",
  },
  {
    id: "usr_admin_dev1",
    email: "dev1@udp.cl",
    username: "dev1",
    name: "Admin Desarrollador 1",
    role: "admin",
    is_owner: false,
    salt: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
    rawPass: "DevAdmin2026!1",
  },
  {
    id: "usr_admin_dev2",
    email: "dev2@udp.cl",
    username: "dev2",
    name: "Admin Desarrollador 2",
    role: "admin",
    is_owner: false,
    salt: "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
    rawPass: "DevAdmin2026!2",
  },
  {
    id: "usr_admin_coordinacion",
    email: "coordinacion.tics@udp.cl",
    username: "coordinacion",
    name: "Coordinación Académica TICs",
    role: "admin",
    is_owner: false,
    salt: "3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
    rawPass: "CoordUdp2026!",
  },
  {
    id: "usr_admin_qa",
    email: "qa.admin@udp.cl",
    username: "qa.admin",
    name: "Auditor QA / Evaluador",
    role: "admin",
    is_owner: false,
    salt: "4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
    rawPass: "QaAdmin2026!",
  },
];

async function run() {
  const client = new Client({
    host: process.env.SUPABASE_DB_HOST,
    port: Number(process.env.SUPABASE_DB_PORT || 5432),
    user: process.env.SUPABASE_DB_USER,
    password: process.env.SUPABASE_PASSWORD,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('Connected to PostgreSQL database.');

  // 1. Crear tabla app_users si no existe
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.app_users (
      id VARCHAR(100) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      is_owner BOOLEAN DEFAULT FALSE,
      salt VARCHAR(64) NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_app_users_email ON public.app_users(LOWER(email));
    CREATE INDEX IF NOT EXISTS idx_app_users_username ON public.app_users(LOWER(username));
  `);
  console.log('Table public.app_users ready.');

  // 2. Insertar/actualizar usuarios en app_users
  for (const u of SEED_USERS) {
    const hash = hashPassword(u.rawPass, u.salt);
    await client.query(
      `INSERT INTO public.app_users (id, email, username, name, role, is_owner, salt, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (email) DO UPDATE SET
         username = EXCLUDED.username,
         name = EXCLUDED.name,
         role = EXCLUDED.role,
         is_owner = EXCLUDED.is_owner,
         salt = EXCLUDED.salt,
         password_hash = EXCLUDED.password_hash,
         updated_at = NOW()`,
      [u.id, u.email, u.username, u.name, u.role, u.is_owner, u.salt, hash]
    );
  }
  console.log('5 Admin users seeded into database.');

  // 3. Asociar cursos y secciones en la BD por docente / ayudante
  // Benjamín Morales Pizarro (Titular) -> Asistente/Docente en CIT3203, CIT2206, CIT3100
  await client.query(`
    UPDATE public.sections 
    SET assistant_email = 'benjamin.morales3@mail.udp.cl', assistant_name = 'Benjamín Morales Pizarro'
    WHERE code IN ('CIT3203_CA01', 'CIT3203_CA02', 'CIT3203_CA03', 'CIT2206_CA01', 'CIT3100_CA02');
  `);
  console.log('Associated Benjamin Morales courses in DB.');

  // Dev 1 -> Asignado a CIT3000_CA02 (Arquitectura de Software)
  await client.query(`
    UPDATE public.sections 
    SET teacher_email = 'dev1@udp.cl', teacher_name = 'Admin Desarrollador 1'
    WHERE code = 'CIT3000_CA02';
  `);
  console.log('Associated dev1 course in DB.');

  // Check columns in courses
  const colRes = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'courses'`);
  const courseCols = new Set(colRes.rows.map(r => r.column_name));
  console.log('Available columns in courses:', Array.from(courseCols));

  // Dev 2 -> Crear o asegurar curso CIT1000_CA01 (Taller de Programación - Sandbox Dev 2)
  const dev2CourseRes = await client.query(`
    INSERT INTO public.courses (canvas_course_id, code, name, term)
    VALUES (41002, 'CIT1000_CA01', 'TALLER DE PROGRAMACIÓN (SANDBOX DEV 2)', '2026-02')
    ON CONFLICT (canvas_course_id) DO UPDATE SET name = EXCLUDED.name, code = EXCLUDED.code
    RETURNING id;
  `);
  const dev2CourseId = dev2CourseRes.rows[0].id;
  await client.query(`
    INSERT INTO public.sections (course_id, code, name, teacher_name, teacher_email, pin_activo, requiere_pin, requiere_geo)
    VALUES ($1, 'CIT1000_CA01', 'Sección 1 (Sandbox Dev 2)', 'Admin Desarrollador 2', 'dev2@udp.cl', '1234', true, false)
    ON CONFLICT (course_id, code) DO UPDATE SET teacher_email = EXCLUDED.teacher_email, teacher_name = EXCLUDED.teacher_name;
  `, [dev2CourseId]);
  console.log('Associated dev2 course in DB.');

  // Coordinación Académica -> Curso CIT4000_CA01 (Seminario de Titulación - Coordinación)
  const coordCourseRes = await client.query(`
    INSERT INTO public.courses (canvas_course_id, code, name, term)
    VALUES (41003, 'CIT4000_CA01', 'SEMINARIO DE TITULACIÓN (COORDINACIÓN TICs)', '2026-02')
    ON CONFLICT (canvas_course_id) DO UPDATE SET name = EXCLUDED.name, code = EXCLUDED.code
    RETURNING id;
  `);
  const coordCourseId = coordCourseRes.rows[0].id;
  await client.query(`
    INSERT INTO public.sections (course_id, code, name, teacher_name, teacher_email, pin_activo, requiere_pin, requiere_geo)
    VALUES ($1, 'CIT4000_CA01', 'Sección 1 (Coordinación)', 'Coordinación Académica TICs', 'coordinacion.tics@udp.cl', '4321', true, false)
    ON CONFLICT (course_id, code) DO UPDATE SET teacher_email = EXCLUDED.teacher_email, teacher_name = EXCLUDED.teacher_name;
  `, [coordCourseId]);
  console.log('Associated coordinacion course in DB.');

  // QA Admin -> Curso CIT5000_CA01 (Calidad y Testing de Software - QA)
  const qaCourseRes = await client.query(`
    INSERT INTO public.courses (canvas_course_id, code, name, term)
    VALUES (41004, 'CIT5000_CA01', 'CALIDAD Y TESTING DE SOFTWARE (SANDBOX QA)', '2026-02')
    ON CONFLICT (canvas_course_id) DO UPDATE SET name = EXCLUDED.name, code = EXCLUDED.code
    RETURNING id;
  `);
  const qaCourseId = qaCourseRes.rows[0].id;
  await client.query(`
    INSERT INTO public.sections (course_id, code, name, teacher_name, teacher_email, pin_activo, requiere_pin, requiere_geo)
    VALUES ($1, 'CIT5000_CA01', 'Sección 1 (QA Sandbox)', 'Auditor QA / Evaluador', 'qa.admin@udp.cl', '9876', true, false)
    ON CONFLICT (course_id, code) DO UPDATE SET teacher_email = EXCLUDED.teacher_email, teacher_name = EXCLUDED.teacher_name;
  `, [qaCourseId]);
  console.log('Associated qa.admin course in DB.');

  await client.end();
  console.log('Migration completed successfully!');
}

run().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
