-- ==============================================================================
-- MIGRACIÓN 2026-10-29 — Rate limit distribuido de autenticación
-- ADITIVA. No consulta ni modifica datos, tablas o funciones de Asistencia.
-- Las claves son HMAC-SHA256: no se almacenan correo ni IP en texto plano.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.auth_rate_limit_windows (
    scope TEXT NOT NULL,
    key_hash CHAR(64) NOT NULL,
    window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
    PRIMARY KEY (scope, key_hash)
);

ALTER TABLE public.auth_rate_limit_windows ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.auth_rate_limit_windows FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.consume_auth_rate_limit(
    p_scope TEXT,
    p_key_hash CHAR(64),
    p_limit INTEGER,
    p_window_seconds INTEGER
)
RETURNS TABLE (allowed BOOLEAN, retry_after_seconds INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_window_start TIMESTAMPTZ;
    v_count INTEGER;
    v_now TIMESTAMPTZ := NOW();
BEGIN
    IF p_scope !~ '^[a-z_]{2,40}$' OR p_limit < 1 OR p_limit > 100 OR p_window_seconds < 1 OR p_window_seconds > 86400 THEN
        RAISE EXCEPTION 'Parámetros de límite inválidos';
    END IF;

    INSERT INTO public.auth_rate_limit_windows AS w (scope, key_hash, window_started_at, attempt_count)
    VALUES (p_scope, p_key_hash, v_now, 1)
    ON CONFLICT (scope, key_hash) DO UPDATE
    SET window_started_at = CASE
            WHEN w.window_started_at <= v_now - make_interval(secs => p_window_seconds) THEN v_now
            ELSE w.window_started_at
        END,
        attempt_count = CASE
            WHEN w.window_started_at <= v_now - make_interval(secs => p_window_seconds) THEN 1
            ELSE w.attempt_count + 1
        END
    RETURNING window_started_at, attempt_count INTO v_window_start, v_count;

    RETURN QUERY SELECT
        v_count <= p_limit,
        CASE WHEN v_count <= p_limit THEN 0 ELSE GREATEST(1, CEIL(EXTRACT(EPOCH FROM (v_window_start + make_interval(secs => p_window_seconds) - v_now)))::INTEGER) END;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_auth_rate_limit(TEXT, CHAR(64), INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_auth_rate_limit(TEXT, CHAR(64), INTEGER, INTEGER) TO service_role;
