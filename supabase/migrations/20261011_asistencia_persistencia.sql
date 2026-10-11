-- ==============================================================================
-- MIGRACIÓN 2026-10-11 — Persistencia completa del Módulo de Asistencia
-- ------------------------------------------------------------------------------
-- Idempotente y NO destructiva: solo agrega columnas, tablas, funciones y
-- políticas. No modifica ni borra ningún registro de asistencia existente.
-- Ejecutar completa en Supabase → SQL Editor.
-- ==============================================================================

-- 1. Segundo horario de ayudantía (Bloque 2) y parámetros de décimas por sección
ALTER TABLE public.sections ADD COLUMN IF NOT EXISTS horario_ayudantia2 JSONB NULL;
ALTER TABLE public.sections ADD COLUMN IF NOT EXISTS total_trabajos INT NULL;
ALTER TABLE public.sections ADD COLUMN IF NOT EXISTS decimas_por_trabajo NUMERIC(4, 2) NULL;

-- 2. Historial inalterable de marcajes (alumnos y cambios manuales del docente)
CREATE TABLE IF NOT EXISTS public.attendance_checkin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_code VARCHAR(50) NOT NULL,
    session_code VARCHAR(100) NOT NULL,
    session_date DATE NOT NULL,
    student_canvas_id BIGINT NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(255) NULL,
    value SMALLINT NOT NULL CHECK (value IN (0, 1)),
    method VARCHAR(40) NOT NULL,                  -- 'PIN', 'PIN + GPS', 'Docente Manual', 'Apelación aceptada'
    schedule_label VARCHAR(60) NULL,              -- ej. '16:00 - 17:20' (horario usado por el alumno)
    distancia_metros INT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_checkin_logs_section_date
    ON public.attendance_checkin_logs(section_code, session_date);

-- 3. Apelaciones de asistencia enviadas por los alumnos
CREATE TABLE IF NOT EXISTS public.attendance_appeals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_code VARCHAR(50) NOT NULL,
    student_canvas_id BIGINT NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    student_rut VARCHAR(20) NULL,
    appeal_date DATE NOT NULL,
    comentario VARCHAR(300) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'resuelta', 'rechazada')),
    resolved_by VARCHAR(100) NULL,
    resolved_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Un alumno no puede tener dos apelaciones pendientes para la misma clase
CREATE UNIQUE INDEX IF NOT EXISTS uq_pending_appeal
    ON public.attendance_appeals(section_code, student_canvas_id, appeal_date)
    WHERE status = 'pendiente';

-- 4. Décimas y trabajos por estudiante (tabla y funciones que faltaban en la base)
CREATE TABLE IF NOT EXISTS public.student_work_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    decimas_acumuladas NUMERIC(4, 2) NOT NULL DEFAULT 0.0 CHECK (decimas_acumuladas >= 0),
    trabajos_realizados INT NOT NULL DEFAULT 0 CHECK (trabajos_realizados >= 0),
    observaciones TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_student_work_section UNIQUE (section_id, student_id)
);

CREATE OR REPLACE FUNCTION public.upsert_student_work_record(
    p_section_code TEXT,
    p_student_canvas_id BIGINT,
    p_decimas NUMERIC,
    p_trabajos INT
)
RETURNS VOID AS $$
DECLARE
    v_section_id UUID;
    v_student_id UUID;
BEGIN
    SELECT id INTO v_section_id FROM public.sections WHERE code = p_section_code LIMIT 1;
    SELECT id INTO v_student_id FROM public.students WHERE canvas_id = p_student_canvas_id LIMIT 1;

    IF v_section_id IS NOT NULL AND v_student_id IS NOT NULL THEN
        INSERT INTO public.student_work_records (section_id, student_id, decimas_acumuladas, trabajos_realizados, updated_at)
        VALUES (v_section_id, v_student_id, p_decimas, p_trabajos, NOW())
        ON CONFLICT (section_id, student_id)
        DO UPDATE SET
            decimas_acumuladas = EXCLUDED.decimas_acumuladas,
            trabajos_realizados = EXCLUDED.trabajos_realizados,
            updated_at = NOW();
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_section_work_records(p_section_code TEXT)
RETURNS TABLE (
    student_canvas_id BIGINT,
    decimas_acumuladas NUMERIC,
    trabajos_realizados INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT st.canvas_id, wr.decimas_acumuladas, wr.trabajos_realizados
    FROM public.student_work_records wr
    JOIN public.students st ON st.id = wr.student_id
    JOIN public.sections sec ON sec.id = wr.section_id
    WHERE sec.code = p_section_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Políticas de acceso: lectura abierta, escritura sin borrado.
--    Se reemplazan todas las políticas previas de estas tablas (algunas permitían BORRAR
--    con la clave pública, lo que habría eliminado asistencia en cascada).
DO $$
DECLARE r RECORD;
BEGIN
    FOR r IN
        SELECT policyname, tablename FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename IN ('courses', 'sections', 'students', 'enrollments', 'class_sessions',
                            'attendance_records', 'student_work_records',
                            'attendance_checkin_logs', 'attendance_appeals')
    LOOP
        EXECUTE format('DROP POLICY %I ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_work_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_checkin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_appeals ENABLE ROW LEVEL SECURITY;

-- Catálogos: leer, crear y actualizar (nunca borrar)
CREATE POLICY "lectura" ON public.courses FOR SELECT USING (true);
CREATE POLICY "creacion" ON public.courses FOR INSERT WITH CHECK (true);
CREATE POLICY "actualizacion" ON public.courses FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "lectura" ON public.sections FOR SELECT USING (true);
CREATE POLICY "creacion" ON public.sections FOR INSERT WITH CHECK (true);
CREATE POLICY "actualizacion" ON public.sections FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "lectura" ON public.students FOR SELECT USING (true);
CREATE POLICY "creacion" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "actualizacion" ON public.students FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "lectura" ON public.enrollments FOR SELECT USING (true);
CREATE POLICY "creacion" ON public.enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "actualizacion" ON public.enrollments FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "lectura" ON public.class_sessions FOR SELECT USING (true);
CREATE POLICY "creacion" ON public.class_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "actualizacion" ON public.class_sessions FOR UPDATE USING (true) WITH CHECK (true);

-- Asistencia y décimas: leer, crear y actualizar (valores acotados por CHECK). Sin DELETE:
-- ningún registro de asistencia puede borrarse con la clave pública.
CREATE POLICY "lectura" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "creacion" ON public.attendance_records FOR INSERT WITH CHECK (true);
CREATE POLICY "actualizacion" ON public.attendance_records FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "lectura" ON public.student_work_records FOR SELECT USING (true);
CREATE POLICY "creacion" ON public.student_work_records FOR INSERT WITH CHECK (true);
CREATE POLICY "actualizacion" ON public.student_work_records FOR UPDATE USING (true) WITH CHECK (true);

-- Historial: leer y agregar. Sin UPDATE ni DELETE: es inalterable.
CREATE POLICY "lectura" ON public.attendance_checkin_logs FOR SELECT USING (true);
CREATE POLICY "creacion" ON public.attendance_checkin_logs FOR INSERT WITH CHECK (true);

-- Apelaciones: leer, crear y resolver (sin borrado)
CREATE POLICY "lectura" ON public.attendance_appeals FOR SELECT USING (true);
CREATE POLICY "creacion" ON public.attendance_appeals FOR INSERT WITH CHECK (true);
CREATE POLICY "actualizacion" ON public.attendance_appeals FOR UPDATE USING (true) WITH CHECK (true);

-- 6. Verificación: debe listar las tablas nuevas y las políticas sin DELETE
SELECT tablename, policyname, cmd FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('attendance_records', 'class_sessions', 'attendance_checkin_logs', 'attendance_appeals', 'student_work_records')
ORDER BY tablename, cmd;
