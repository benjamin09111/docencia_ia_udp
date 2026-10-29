-- Invalidación global de sesiones después de un cambio de contraseña.
-- ADITIVA: sólo agrega un campo de autenticación a `users`; no toca Asistencia.
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_version INTEGER NOT NULL DEFAULT 1 CHECK (auth_version >= 1);
