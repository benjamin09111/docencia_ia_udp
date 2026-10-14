-- ==============================================================================
-- MIGRACIÓN 2026-10-14 — Blindaje de Concurrencia y Protección contra Sobreescritura
-- ------------------------------------------------------------------------------
-- Impide que procesos automáticos o sincronizaciones batch en cero degraden
-- una asistencia en 1 marcada legítimamente por el alumno vía PIN/Link/QR.
-- Solo el profesor o ayudante pueden desmarcar una asistencia.
-- ==============================================================================

-- 1. Eliminar soporte legado de Bloque 2 (horario_ayudantia2)
UPDATE public.sections SET horario_ayudantia2 = NULL WHERE horario_ayudantia2 IS NOT NULL;

-- 2. Función atómica de marcación protegida contra sobreescritura accidental
CREATE OR REPLACE FUNCTION public.upsert_attendance_by_code(
    p_session_code TEXT,
    p_student_canvas_id BIGINT,
    p_value SMALLINT,
    p_marked_by TEXT DEFAULT 'profesor'
)
RETURNS VOID AS $$
DECLARE
    v_session_id UUID;
    v_student_id UUID;
BEGIN
    SELECT id INTO v_session_id FROM public.class_sessions WHERE session_code = p_session_code LIMIT 1;
    SELECT id INTO v_student_id FROM public.students WHERE canvas_id = p_student_canvas_id LIMIT 1;

    IF v_session_id IS NOT NULL AND v_student_id IS NOT NULL THEN
        INSERT INTO public.attendance_records (session_id, student_id, value, marked_by, marked_at)
        VALUES (v_session_id, v_student_id, p_value, COALESCE(p_marked_by, 'profesor'), NOW())
        ON CONFLICT (session_id, student_id)
        DO UPDATE SET 
            value = CASE
                WHEN attendance_records.value = 1 
                     AND attendance_records.marked_by IN ('alumno_link', 'alumno_pin', 'alumno_qr') 
                     AND EXCLUDED.value = 0 
                     AND EXCLUDED.marked_by NOT IN ('profesor', 'ayudante') THEN 1
                ELSE EXCLUDED.value
            END,
            marked_by = CASE
                WHEN attendance_records.value = 1 
                     AND attendance_records.marked_by IN ('alumno_link', 'alumno_pin', 'alumno_qr') 
                     AND EXCLUDED.value = 0 
                     AND EXCLUDED.marked_by NOT IN ('profesor', 'ayudante') THEN attendance_records.marked_by
                ELSE EXCLUDED.marked_by
            END,
            marked_at = NOW();
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Inserción masiva protegida contra degradación
CREATE OR REPLACE FUNCTION public.upsert_attendance_batch_by_codes(
    records_json JSONB
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.attendance_records (session_id, student_id, value, marked_by, marked_at)
    SELECT 
        cs.id AS session_id,
        st.id AS student_id,
        (r->>'value')::SMALLINT AS value,
        COALESCE(r->>'marked_by', 'profesor') AS marked_by,
        NOW() AS marked_at
    FROM jsonb_array_elements(records_json) AS r
    JOIN public.class_sessions cs ON cs.session_code = r->>'session_code'
    JOIN public.students st ON st.canvas_id = (r->>'student_canvas_id')::BIGINT
    ON CONFLICT (session_id, student_id)
    DO UPDATE SET 
        value = CASE
            WHEN attendance_records.value = 1 
                 AND attendance_records.marked_by IN ('alumno_link', 'alumno_pin', 'alumno_qr') 
                 AND EXCLUDED.value = 0 
                 AND EXCLUDED.marked_by NOT IN ('profesor', 'ayudante') THEN 1
            ELSE EXCLUDED.value
        END,
        marked_by = CASE
            WHEN attendance_records.value = 1 
                 AND attendance_records.marked_by IN ('alumno_link', 'alumno_pin', 'alumno_qr') 
                 AND EXCLUDED.value = 0 
                 AND EXCLUDED.marked_by NOT IN ('profesor', 'ayudante') THEN attendance_records.marked_by
            ELSE EXCLUDED.marked_by
        END,
        marked_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
