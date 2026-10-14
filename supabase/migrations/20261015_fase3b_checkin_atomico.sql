-- ==============================================================================
-- MIGRACIÓN 2026-10-15 (b) — Fase 3B: check-in atómico con anti-doble-marcaje
-- ------------------------------------------------------------------------------
-- ADITIVA E IDEMPOTENTE. Solo agrega una función; no modifica datos ni permisos
-- existentes, por lo que es segura con la app en uso.
--
-- La ruta del servidor valida PIN, horario (hora de Chile), GPS y estado de la clase,
-- y luego llama a esta función, que en UNA transacción:
--   1. verifica alumno, matrícula y clase (no cancelada)
--   2. aplica la regla "un dispositivo = un alumno por clase"
--   3. registra la asistencia y deja constancia en el historial
-- Solo puede ejecutarla el servidor (service_role): la clave pública NO.
-- Además crea la tabla de sesiones revocadas (cierre de sesión real).
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.checkin_attendance(
    p_section_code TEXT,
    p_session_code TEXT,
    p_student_canvas_id BIGINT,
    p_device_hash TEXT,
    p_method TEXT DEFAULT 'PIN',
    p_schedule_label TEXT DEFAULT NULL,
    p_distancia INT DEFAULT NULL
)
RETURNS TABLE (result TEXT, student_name TEXT, student_email TEXT) AS $$
DECLARE
    v_section_id UUID;
    v_session RECORD;
    v_student RECORD;
    v_existing_device_student BIGINT;
    v_inserted INT;
    v_prev_value SMALLINT;
    v_name TEXT;
BEGIN
    SELECT id INTO v_section_id FROM public.sections WHERE code = p_section_code LIMIT 1;
    SELECT id, canvas_id, nombres, apellidos, email INTO v_student
        FROM public.students WHERE canvas_id = p_student_canvas_id LIMIT 1;

    IF v_section_id IS NULL OR v_student.id IS NULL THEN
        RETURN QUERY SELECT 'student_not_found'::TEXT, NULL::TEXT, NULL::TEXT; RETURN;
    END IF;
    v_name := TRIM(v_student.nombres || ' ' || v_student.apellidos);

    -- El alumno debe pertenecer a la sección (impide marcar a alumnos de otros cursos)
    IF NOT EXISTS (SELECT 1 FROM public.enrollments e WHERE e.section_id = v_section_id AND e.student_id = v_student.id) THEN
        RETURN QUERY SELECT 'not_enrolled'::TEXT, NULL::TEXT, NULL::TEXT; RETURN;
    END IF;

    SELECT cs.id, cs.status INTO v_session
        FROM public.class_sessions cs
        WHERE cs.session_code = p_session_code AND cs.section_id = v_section_id LIMIT 1;
    IF v_session.id IS NULL THEN
        RETURN QUERY SELECT 'session_not_found'::TEXT, NULL::TEXT, NULL::TEXT; RETURN;
    END IF;
    IF v_session.status = 'cancelada' THEN
        RETURN QUERY SELECT 'cancelled'::TEXT, NULL::TEXT, NULL::TEXT; RETURN;
    END IF;

    -- Un dispositivo = un alumno por clase. El índice único resuelve la carrera entre dos envíos simultáneos.
    INSERT INTO public.checkin_devices (session_code, device_hash, student_canvas_id)
    VALUES (p_session_code, p_device_hash, p_student_canvas_id)
    ON CONFLICT (session_code, device_hash) DO NOTHING;
    GET DIAGNOSTICS v_inserted = ROW_COUNT;

    IF v_inserted = 0 THEN
        SELECT d.student_canvas_id INTO v_existing_device_student
            FROM public.checkin_devices d
            WHERE d.session_code = p_session_code AND d.device_hash = p_device_hash;
        IF v_existing_device_student IS DISTINCT FROM p_student_canvas_id THEN
            -- Intento bloqueado: queda en la auditoría para que el docente lo vea
            INSERT INTO public.audit_events (table_name, op, section_code, session_code, student_canvas_id, actor, new_data)
            VALUES ('checkin_devices', 'BLOCKED', p_section_code, p_session_code, p_student_canvas_id, 'sistema',
                    jsonb_build_object('motivo', 'mismo dispositivo ya registró a otro alumno',
                                       'alumno_ya_registrado_canvas_id', v_existing_device_student,
                                       'alumno_intentado', v_name));
            RETURN QUERY SELECT 'device_conflict'::TEXT, NULL::TEXT, NULL::TEXT; RETURN;
        END IF;
    END IF;

    SELECT value INTO v_prev_value FROM public.attendance_records
        WHERE session_id = v_session.id AND student_id = v_student.id;

    -- Ya estaba presente: respuesta idempotente (no duplica el historial)
    IF v_prev_value = 1 THEN
        RETURN QUERY SELECT 'already_marked'::TEXT, v_name, v_student.email::TEXT; RETURN;
    END IF;

    INSERT INTO public.attendance_records (session_id, student_id, value, marked_by, marked_at)
    VALUES (v_session.id, v_student.id, 1, 'alumno_pin', NOW())
    ON CONFLICT (session_id, student_id)
    DO UPDATE SET value = 1, marked_by = 'alumno_pin', marked_at = NOW();

    INSERT INTO public.attendance_checkin_logs
        (section_code, session_code, session_date, student_canvas_id, student_name, student_email,
         value, method, schedule_label, distancia_metros)
    VALUES (p_section_code, p_session_code, (SELECT date FROM public.class_sessions WHERE id = v_session.id),
            p_student_canvas_id, v_name, v_student.email, 1,
            CASE WHEN p_method IN ('PIN', 'PIN + GPS') THEN p_method ELSE 'PIN' END,
            p_schedule_label, p_distancia);

    RETURN QUERY SELECT 'ok'::TEXT, v_name, v_student.email::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Solo el servidor puede ejecutarla
REVOKE ALL ON FUNCTION public.checkin_attendance(TEXT, TEXT, BIGINT, TEXT, TEXT, TEXT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.checkin_attendance(TEXT, TEXT, BIGINT, TEXT, TEXT, TEXT, INT) TO service_role;

-- ------------------------------------------------------------------------------
-- Revocación de sesiones (cierre de sesión REAL en el servidor)
-- Va aquí, en la migración aditiva, para que exista ANTES de desplegar la app nueva.
-- RLS activado sin políticas: la clave pública no puede leerla ni escribirla.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.revoked_sessions (
    jti        TEXT PRIMARY KEY,                       -- identificador de la sesión revocada
    expires_at TIMESTAMPTZ NOT NULL,                   -- cuando la sesión habría vencido (luego se limpia)
    revoked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_revoked_sessions_expires ON public.revoked_sessions(expires_at);
ALTER TABLE public.revoked_sessions ENABLE ROW LEVEL SECURITY;

-- Verificación: debe devolver 2 filas (la función y la tabla)
SELECT 'funcion checkin_attendance' AS item, COUNT(*) AS existe FROM pg_proc WHERE proname = 'checkin_attendance'
UNION ALL
SELECT 'tabla revoked_sessions', COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND tablename = 'revoked_sessions';
