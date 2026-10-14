-- ==============================================================================
-- MIGRACIÓN 2026-10-16 — Fase 3C: BLOQUEO de la base (clave pública sin acceso a nada)
-- ------------------------------------------------------------------------------
-- ⚠️  EJECUTAR AL FINAL, SOLO DESPUÉS de desplegar la versión de la app que usa /api/data.
--     La app antigua escribía directo en la base con la clave pública: si esta migración se
--     ejecuta antes del despliegue, la asistencia deja de funcionar hasta que se despliegue.
--     Requiere haber ejecutado antes 20261015_fase3b_checkin_atomico.sql.
--
-- Después de esto la clave pública (anon) NO puede leer ni escribir NADA en la base:
-- todo pasa por el servidor con la clave service_role, que ignora estas restricciones.
-- Idempotente: se puede ejecutar más de una vez.
-- ==============================================================================

-- 1. (La tabla revoked_sessions se crea en 20261015_fase3b_checkin_atomico.sql)

-- 2. RLS activado en TODAS las tablas y SIN políticas: deniega todo a anon/authenticated ----
DO $$
DECLARE r RECORD;
BEGIN
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
    END LOOP;
    FOR r IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' LOOP
        EXECUTE format('DROP POLICY %I ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- 3. Quitar los privilegios a la clave pública (segunda barrera, además de RLS) ------------
--    Incluye vistas (v_student_attendance_summary se ejecuta con los permisos de su dueño y se saltaría RLS).
REVOKE ALL ON ALL TABLES    IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Lo que se cree en el futuro tampoco queda abierto por defecto
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES    FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon, authenticated;

-- 4. Verificación: las dos columnas "anon" deben ser 0 y service_role debe conservar acceso --
SELECT
  (SELECT COUNT(*) FROM pg_tables t WHERE t.schemaname = 'public' AND NOT t.rowsecurity)                         AS tablas_sin_rls,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public')                                                  AS politicas_restantes,
  (SELECT COUNT(*) FROM pg_proc p WHERE p.pronamespace = 'public'::regnamespace AND p.prokind = 'f'
     AND has_function_privilege('anon', p.oid, 'EXECUTE'))                                                        AS funciones_abiertas_a_anon,
  (SELECT COUNT(*) FROM information_schema.role_table_grants
     WHERE table_schema = 'public' AND grantee IN ('anon', 'authenticated'))                                      AS privilegios_de_tabla_anon,
  (SELECT COUNT(*) FROM pg_proc p WHERE p.pronamespace = 'public'::regnamespace AND p.prokind = 'f'
     AND NOT has_function_privilege('service_role', p.oid, 'EXECUTE'))                                            AS funciones_sin_acceso_service_role;
