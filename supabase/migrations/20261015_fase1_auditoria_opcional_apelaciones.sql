-- ==============================================================================
-- MIGRACIÓN 2026-10-15 — Fase 1: Auditoría inmutable, clases opcionales,
--                         apelaciones multi-fecha/décimas, anti-doble-marcaje
-- ------------------------------------------------------------------------------
-- ADITIVA E IDEMPOTENTE: no borra ni modifica datos existentes de asistencia.
-- Segura de ejecutar con la app en uso. Ejecutar completa en Supabase → SQL Editor.
-- ==============================================================================

-- 1. Clase opcional: suma a quien asiste, nunca resta a quien falta -------------
ALTER TABLE public.class_sessions
    ADD COLUMN IF NOT EXISTS is_optional BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Auditoría inmutable (append-only) ----------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_events (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    table_name  TEXT NOT NULL,
    op          TEXT NOT NULL,                 -- INSERT | UPDATE
    row_pk      TEXT NULL,
    section_code TEXT NULL,
    session_code TEXT NULL,
    student_canvas_id BIGINT NULL,
    actor       TEXT NULL,
    old_data    JSONB NULL,
    new_data    JSONB NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_section_time ON public.audit_events(section_code, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_table_time   ON public.audit_events(table_name, occurred_at DESC);

-- Nadie (ni service_role) puede editar o borrar la bitácora
CREATE OR REPLACE FUNCTION public.audit_events_block_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'audit_events es inmutable (append-only)';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_events_no_update ON public.audit_events;
CREATE TRIGGER trg_audit_events_no_update
    BEFORE UPDATE OR DELETE ON public.audit_events
    FOR EACH ROW EXECUTE FUNCTION public.audit_events_block_mutation();

DROP TRIGGER IF EXISTS trg_audit_events_no_truncate ON public.audit_events;
CREATE TRIGGER trg_audit_events_no_truncate
    BEFORE TRUNCATE ON public.audit_events
    FOR EACH STATEMENT EXECUTE FUNCTION public.audit_events_block_mutation();

-- RLS activado SIN políticas: el cliente público no puede leer ni escribir.
-- Solo los triggers (SECURITY DEFINER) escriben y solo el servidor (service_role) lee.
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- 2a. Trigger de asistencia: registra solo cambios reales de valor
CREATE OR REPLACE FUNCTION public.audit_attendance_records()
RETURNS TRIGGER AS $$
DECLARE
    v_session_code TEXT;
    v_section_code TEXT;
    v_canvas_id BIGINT;
BEGIN
    IF TG_OP = 'UPDATE' AND OLD.value IS NOT DISTINCT FROM NEW.value THEN
        RETURN NEW;
    END IF;

    SELECT cs.session_code, sec.code INTO v_session_code, v_section_code
    FROM public.class_sessions cs JOIN public.sections sec ON sec.id = cs.section_id
    WHERE cs.id = NEW.session_id;
    SELECT canvas_id INTO v_canvas_id FROM public.students WHERE id = NEW.student_id;

    INSERT INTO public.audit_events(table_name, op, row_pk, section_code, session_code, student_canvas_id, actor, old_data, new_data)
    VALUES ('attendance_records', TG_OP, NEW.id::TEXT, v_section_code, v_session_code, v_canvas_id, NEW.marked_by,
            CASE WHEN TG_OP = 'UPDATE' THEN jsonb_build_object('value', OLD.value, 'marked_by', OLD.marked_by, 'marked_at', OLD.marked_at) END,
            jsonb_build_object('value', NEW.value, 'marked_by', NEW.marked_by, 'marked_at', NEW.marked_at));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_audit_attendance_records ON public.attendance_records;
CREATE TRIGGER trg_audit_attendance_records
    AFTER INSERT OR UPDATE ON public.attendance_records
    FOR EACH ROW EXECUTE FUNCTION public.audit_attendance_records();

-- 2b. Trigger de apelaciones (alta y cada cambio de estado)
CREATE OR REPLACE FUNCTION public.audit_attendance_appeals()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND OLD.status IS NOT DISTINCT FROM NEW.status THEN
        RETURN NEW;
    END IF;
    INSERT INTO public.audit_events(table_name, op, row_pk, section_code, student_canvas_id, actor, old_data, new_data)
    VALUES ('attendance_appeals', TG_OP, NEW.id::TEXT, NEW.section_code, NEW.student_canvas_id,
            CASE WHEN TG_OP = 'UPDATE' THEN NEW.resolved_by ELSE NEW.student_name END,
            CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) END,
            to_jsonb(NEW));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_audit_attendance_appeals ON public.attendance_appeals;
CREATE TRIGGER trg_audit_attendance_appeals
    AFTER INSERT OR UPDATE ON public.attendance_appeals
    FOR EACH ROW EXECUTE FUNCTION public.audit_attendance_appeals();

-- 2c. Trigger de sesiones: cancelar, modalidad, opcional, PIN
CREATE OR REPLACE FUNCTION public.audit_class_sessions()
RETURNS TRIGGER AS $$
DECLARE v_section_code TEXT;
BEGIN
    IF OLD.status IS NOT DISTINCT FROM NEW.status
       AND OLD.modality IS NOT DISTINCT FROM NEW.modality
       AND OLD.is_optional IS NOT DISTINCT FROM NEW.is_optional
       AND OLD.motivo_cancelacion IS NOT DISTINCT FROM NEW.motivo_cancelacion THEN
        RETURN NEW;
    END IF;
    SELECT code INTO v_section_code FROM public.sections WHERE id = NEW.section_id;
    INSERT INTO public.audit_events(table_name, op, row_pk, section_code, session_code, old_data, new_data)
    VALUES ('class_sessions', 'UPDATE', NEW.id::TEXT, v_section_code, NEW.session_code,
            jsonb_build_object('status', OLD.status, 'modality', OLD.modality, 'is_optional', OLD.is_optional, 'motivo', OLD.motivo_cancelacion),
            jsonb_build_object('status', NEW.status, 'modality', NEW.modality, 'is_optional', NEW.is_optional, 'motivo', NEW.motivo_cancelacion));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_audit_class_sessions ON public.class_sessions;
CREATE TRIGGER trg_audit_class_sessions
    AFTER UPDATE ON public.class_sessions
    FOR EACH ROW EXECUTE FUNCTION public.audit_class_sessions();

-- 2d. Trigger de décimas / trabajos por alumno
CREATE OR REPLACE FUNCTION public.audit_student_work_records()
RETURNS TRIGGER AS $$
DECLARE v_section_code TEXT; v_canvas_id BIGINT;
BEGIN
    IF TG_OP = 'UPDATE'
       AND OLD.decimas_acumuladas IS NOT DISTINCT FROM NEW.decimas_acumuladas
       AND OLD.trabajos_realizados IS NOT DISTINCT FROM NEW.trabajos_realizados THEN
        RETURN NEW;
    END IF;
    SELECT code INTO v_section_code FROM public.sections WHERE id = NEW.section_id;
    SELECT canvas_id INTO v_canvas_id FROM public.students WHERE id = NEW.student_id;
    INSERT INTO public.audit_events(table_name, op, row_pk, section_code, student_canvas_id, old_data, new_data)
    VALUES ('student_work_records', TG_OP, NEW.id::TEXT, v_section_code, v_canvas_id,
            CASE WHEN TG_OP = 'UPDATE' THEN jsonb_build_object('decimas', OLD.decimas_acumuladas, 'trabajos', OLD.trabajos_realizados) END,
            jsonb_build_object('decimas', NEW.decimas_acumuladas, 'trabajos', NEW.trabajos_realizados));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_audit_student_work_records ON public.student_work_records;
CREATE TRIGGER trg_audit_student_work_records
    AFTER INSERT OR UPDATE ON public.student_work_records
    FOR EACH ROW EXECUTE FUNCTION public.audit_student_work_records();

-- 3. Apelaciones: tipo (asistencia | decimas), multi-fecha y sin justificación -
ALTER TABLE public.attendance_appeals ADD COLUMN IF NOT EXISTS kind VARCHAR(20) NOT NULL DEFAULT 'asistencia';
ALTER TABLE public.attendance_appeals ADD COLUMN IF NOT EXISTS request_id UUID NULL;   -- agrupa las fechas enviadas juntas
ALTER TABLE public.attendance_appeals ALTER COLUMN comentario DROP NOT NULL;           -- asistencia ya no pide justificación

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'attendance_appeals_kind_check') THEN
        ALTER TABLE public.attendance_appeals
            ADD CONSTRAINT attendance_appeals_kind_check CHECK (kind IN ('asistencia', 'decimas'));
    END IF;
END $$;

-- Una apelación pendiente por alumno y fecha (asistencia)…
DROP INDEX IF EXISTS public.uq_pending_appeal;
CREATE UNIQUE INDEX IF NOT EXISTS uq_pending_appeal_asistencia
    ON public.attendance_appeals(section_code, student_canvas_id, appeal_date)
    WHERE status = 'pendiente' AND kind = 'asistencia';
-- …y una sola pendiente de décimas por alumno y sección
CREATE UNIQUE INDEX IF NOT EXISTS uq_pending_appeal_decimas
    ON public.attendance_appeals(section_code, student_canvas_id)
    WHERE status = 'pendiente' AND kind = 'decimas';

-- 4. Resolución ATÓMICA de apelaciones de asistencia ---------------------------
-- Marca presente + deja constancia en el historial + resuelve, todo en una transacción.
-- Si la fecha apelada no tiene clase válida, la apelación queda PENDIENTE (antes se
-- marcaba resuelta aunque el alumno siguiera ausente).
CREATE OR REPLACE FUNCTION public.resolve_attendance_appeals(
    p_ids UUID[],
    p_resolved_by TEXT DEFAULT 'Docente'
)
RETURNS TABLE (appeal_id UUID, outcome TEXT) AS $$
DECLARE
    a RECORD;
    v_session RECORD;
    v_student_id UUID;
BEGIN
    FOR a IN
        SELECT * FROM public.attendance_appeals
        WHERE id = ANY(p_ids) AND status = 'pendiente' AND kind = 'asistencia'
        ORDER BY appeal_date
        FOR UPDATE
    LOOP
        SELECT cs.id, cs.session_code INTO v_session
        FROM public.class_sessions cs
        JOIN public.sections sec ON sec.id = cs.section_id
        WHERE sec.code = a.section_code AND cs.date = a.appeal_date
          AND cs.type = 'ayudantia' AND cs.status <> 'cancelada'
        LIMIT 1;
        SELECT id INTO v_student_id FROM public.students WHERE canvas_id = a.student_canvas_id;

        IF v_session.id IS NULL OR v_student_id IS NULL THEN
            appeal_id := a.id; outcome := 'sin_sesion_valida'; RETURN NEXT;
            CONTINUE;
        END IF;

        INSERT INTO public.attendance_records (session_id, student_id, value, marked_by, marked_at)
        VALUES (v_session.id, v_student_id, 1, 'profesor', NOW())
        ON CONFLICT (session_id, student_id)
        DO UPDATE SET value = 1, marked_by = 'profesor', marked_at = NOW();

        INSERT INTO public.attendance_checkin_logs
            (section_code, session_code, session_date, student_canvas_id, student_name, value, method)
        VALUES (a.section_code, v_session.session_code, a.appeal_date, a.student_canvas_id, a.student_name, 1, 'Apelación aceptada');

        UPDATE public.attendance_appeals
        SET status = 'resuelta', resolved_by = p_resolved_by, resolved_at = NOW()
        WHERE id = a.id;

        appeal_id := a.id; outcome := 'resuelta'; RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. Anti-doble-marcaje: un dispositivo = un alumno por clase -------------------
CREATE TABLE IF NOT EXISTS public.checkin_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_code VARCHAR(100) NOT NULL,
    device_hash  VARCHAR(64) NOT NULL,          -- huella SHA-256 (no reversible)
    student_canvas_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_device_per_session UNIQUE (session_code, device_hash)
);
ALTER TABLE public.checkin_devices ENABLE ROW LEVEL SECURITY;   -- sin políticas: solo el servidor

-- 6. Historial de marcajes REALES: 1 por alumno y clase, filtrado y paginado ---
-- (excluye los registros de valor 0 y los cambios manuales: esos van a Auditoría)
CREATE OR REPLACE FUNCTION public.get_checkin_history(
    p_section_code TEXT,
    p_date DATE DEFAULT NULL,
    p_search TEXT DEFAULT NULL,
    p_limit INT DEFAULT 25,
    p_offset INT DEFAULT 0
)
RETURNS TABLE (
    id UUID, session_code VARCHAR, session_date DATE, student_canvas_id BIGINT,
    student_name VARCHAR, student_email VARCHAR, method VARCHAR,
    schedule_label VARCHAR, distancia_metros INT, created_at TIMESTAMPTZ, total_count BIGINT
) AS $$
    WITH valid AS (
        SELECT DISTINCT ON (l.session_code, l.student_canvas_id) l.*
        FROM public.attendance_checkin_logs l
        WHERE l.section_code = p_section_code
          AND l.value = 1
          AND l.method IN ('PIN', 'PIN + GPS')
          AND (p_date IS NULL OR l.session_date = p_date)
          AND (COALESCE(p_search, '') = ''
               OR l.student_name ILIKE '%' || p_search || '%'
               OR l.student_email ILIKE '%' || p_search || '%')
        ORDER BY l.session_code, l.student_canvas_id, l.created_at ASC
    )
    SELECT v.id, v.session_code, v.session_date, v.student_canvas_id, v.student_name, v.student_email,
           v.method, v.schedule_label, v.distancia_metros, v.created_at, COUNT(*) OVER()
    FROM valid v
    ORDER BY v.created_at DESC
    LIMIT LEAST(GREATEST(p_limit, 1), 100) OFFSET GREATEST(p_offset, 0);
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_checkin_history_dates(p_section_code TEXT)
RETURNS TABLE (session_date DATE, total BIGINT) AS $$
    SELECT l.session_date, COUNT(DISTINCT l.student_canvas_id)
    FROM public.attendance_checkin_logs l
    WHERE l.section_code = p_section_code AND l.value = 1 AND l.method IN ('PIN', 'PIN + GPS')
    GROUP BY l.session_date ORDER BY l.session_date DESC;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- 7. Verificación -----------------------------------------------------------------
SELECT 'class_sessions.is_optional' AS item, COUNT(*) AS ok FROM information_schema.columns
 WHERE table_name = 'class_sessions' AND column_name = 'is_optional'
UNION ALL SELECT 'audit_events', COUNT(*) FROM information_schema.tables WHERE table_name = 'audit_events'
UNION ALL SELECT 'triggers_auditoria', COUNT(*) FROM information_schema.triggers WHERE trigger_name LIKE 'trg_audit_%'
UNION ALL SELECT 'checkin_devices', COUNT(*) FROM information_schema.tables WHERE table_name = 'checkin_devices';
