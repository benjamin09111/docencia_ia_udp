const { Client } = require('pg');

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
  console.log('Connected to Supabase PostgreSQL database.');

  // 1. Crear tabla unificada public.users (estilo Canvas LMS)
  console.log('1. Setting up public.users table...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      canvas_user_id BIGINT UNIQUE NULL,
      rut VARCHAR(20) UNIQUE NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(100) UNIQUE NULL,
      name VARCHAR(255) NOT NULL,
      role_global VARCHAR(50) DEFAULT 'admin',
      is_owner BOOLEAN DEFAULT FALSE,
      salt VARCHAR(64) NULL,
      password_hash TEXT NULL,
      avatar_url TEXT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(LOWER(email));
    CREATE INDEX IF NOT EXISTS idx_users_canvas_id ON public.users(canvas_user_id);
  `);

  // 2. Migrar usuarios existentes desde app_users hacia public.users sin perder credenciales
  console.log('2. Syncing users from app_users into public.users...');
  await client.query(`
    INSERT INTO public.users (canvas_user_id, email, username, name, role_global, is_owner, salt, password_hash)
    SELECT 
      CASE WHEN email = 'benjamin.morales3@mail.udp.cl' THEN 29248 ELSE NULL END AS canvas_user_id,
      email, username, name, role, is_owner, salt, password_hash
    FROM public.app_users
    ON CONFLICT (email) DO UPDATE SET
      username = EXCLUDED.username,
      name = EXCLUDED.name,
      role_global = EXCLUDED.role_global,
      is_owner = EXCLUDED.is_owner,
      salt = EXCLUDED.salt,
      password_hash = EXCLUDED.password_hash,
      canvas_user_id = COALESCE(public.users.canvas_user_id, EXCLUDED.canvas_user_id),
      updated_at = NOW();
  `);

  // 3. Adaptar public.enrollments para soportar el estándar Canvas LMS (TeacherEnrollment, TaEnrollment, StudentEnrollment)
  console.log('3. Adapting enrollments table for Canvas LMS compatibility...');
  // Permitir user_id nullable y student_id nullable para soportar tanto profesores/ayudantes como alumnos históricos
  await client.query(`
    ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;
    ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS enrollment_type VARCHAR(50) DEFAULT 'StudentEnrollment';
    ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS canvas_enrollment_id BIGINT NULL;
    
    -- Hacer student_id nullable para inscripciones de profesores/ayudantes sin romper las de alumnos
    ALTER TABLE public.enrollments ALTER COLUMN student_id DROP NOT NULL;
  `);

  // 4. Crear índices para búsquedas relacionales ultra rápidas
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
    CREATE INDEX IF NOT EXISTS idx_enrollments_type ON public.enrollments(enrollment_type);
  `);

  // 5. Enrolar a cada uno de los 5 usuarios en sus respectivas secciones en la base de datos
  console.log('4. Enrolling teachers and staff into sections...');
  const enrollColsRes = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'enrollments'`);
  const enrollCols = new Set(enrollColsRes.rows.map(r => r.column_name));
  console.log('Enrollments columns:', Array.from(enrollCols));

  const enrollmentsToSeed = [
    // Benjamín Morales Pizarro (Titular) -> TaEnrollment en sus cursos reales
    { email: 'benjamin.morales3@mail.udp.cl', sectionCode: 'CIT3203_CA01', type: 'TaEnrollment' },
    { email: 'benjamin.morales3@mail.udp.cl', sectionCode: 'CIT3203_CA02', type: 'TaEnrollment' },
    { email: 'benjamin.morales3@mail.udp.cl', sectionCode: 'CIT3203_CA03', type: 'TaEnrollment' },
    { email: 'benjamin.morales3@mail.udp.cl', sectionCode: 'CIT2206_CA01', type: 'TaEnrollment' },
    { email: 'benjamin.morales3@mail.udp.cl', sectionCode: 'CIT3100_CA02', type: 'TeacherEnrollment' },
    // Dev 1 -> TeacherEnrollment en Arquitectura de Software
    { email: 'dev1@udp.cl', sectionCode: 'CIT3000_CA02', type: 'TeacherEnrollment' },
    // Dev 2 -> TeacherEnrollment en Taller de Programación Sandbox
    { email: 'dev2@udp.cl', sectionCode: 'CIT1000_CA01', type: 'TeacherEnrollment' },
    // Coordinación -> ObserverEnrollment / TeacherEnrollment en Seminario
    { email: 'coordinacion.tics@udp.cl', sectionCode: 'CIT4000_CA01', type: 'TeacherEnrollment' },
    // QA -> ObserverEnrollment en Testing
    { email: 'qa.admin@udp.cl', sectionCode: 'CIT5000_CA01', type: 'TeacherEnrollment' },
  ];

  for (const item of enrollmentsToSeed) {
    const userRes = await client.query('SELECT id FROM public.users WHERE email = $1 LIMIT 1', [item.email]);
    const sectionRes = await client.query('SELECT id FROM public.sections WHERE code = $1 LIMIT 1', [item.sectionCode]);

    if (userRes.rows.length > 0 && sectionRes.rows.length > 0) {
      const userId = userRes.rows[0].id;
      const sectionId = sectionRes.rows[0].id;

      await client.query(`
        INSERT INTO public.enrollments (section_id, user_id, enrollment_type)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING;
      `, [sectionId, userId, item.type]);
    }
  }

  // 6. ENDURECIMIENTO DE SEGURIDAD (RLS):
  // Cerrar políticas abiertas con USING (true) para clientes anónimos en todas las tablas existentes
  console.log('5. Hardening Row Level Security (RLS) policies...');
  const existingTablesRes = await client.query(`
    SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  `);
  const existingTables = existingTablesRes.rows.map(r => r.table_name);
  console.log('Existing tables in public schema:', existingTables);

  for (const table of existingTables) {
    try {
      // Asegurar RLS habilitado
      await client.query(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);

      // Eliminar políticas permisivas de desarrollo antiguas
      await client.query(`DROP POLICY IF EXISTS "Permitir edición general de ${table}" ON public.${table};`);
      await client.query(`DROP POLICY IF EXISTS "Permitir lectura general de ${table}" ON public.${table};`);
      await client.query(`DROP POLICY IF EXISTS "Permitir edición de ${table}" ON public.${table};`);
      await client.query(`DROP POLICY IF EXISTS "Permitir lectura de ${table}" ON public.${table};`);
      await client.query(`DROP POLICY IF EXISTS "Denegar mutaciones anonimas en ${table}" ON public.${table};`);

      // Política segura: denegar acceso directo anónimo a la base de datos (todo pasa por service_role del backend)
      await client.query(`
        CREATE POLICY "Denegar mutaciones anonimas en ${table}" 
        ON public.${table} FOR ALL TO anon USING (false);
      `);
      console.log(`Table ${table} hardened successfully.`);
    } catch (err) {
      console.warn(`Could not harden table ${table}:`, err.message);
    }
  }

  console.log('SECURITY HARDENING COMPLETED!');
  await client.end();
}

run().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
