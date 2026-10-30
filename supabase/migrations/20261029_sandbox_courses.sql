-- Cursos de desarrollo aislados: no referencian Canvas ni tablas de Asistencia.
CREATE TABLE IF NOT EXISTS public.sandbox_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canvas_like_id BIGINT NOT NULL UNIQUE CHECK (canvas_like_id >= 900000),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    term TEXT NOT NULL DEFAULT '2026-2 Sandbox',
    students_count INTEGER NOT NULL DEFAULT 0 CHECK (students_count >= 0),
    agent_id TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sandbox_course_members (
    sandbox_course_id UUID NOT NULL REFERENCES public.sandbox_courses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'teacher' CHECK (role IN ('admin', 'teacher', 'assistant')),
    PRIMARY KEY (sandbox_course_id, user_id)
);

ALTER TABLE public.sandbox_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sandbox_course_members ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sandbox_courses, public.sandbox_course_members FROM anon, authenticated;

INSERT INTO public.sandbox_courses (canvas_like_id, code, name, students_count, agent_id)
VALUES
  (900001, 'CIT3000_CA02', 'Arquitectura de Software — Sandbox', 32, 'agent_arq_soft'),
  (900002, 'MOCK2101_CA01', 'Gestión de Proyectos Digitales — Mock', 28, 'agent_docente_generico'),
  (900003, 'MOCK3102_CA01', 'Taller de Innovación Tecnológica — Mock', 24, 'agent_docente_generico')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, students_count = EXCLUDED.students_count, agent_id = EXCLUDED.agent_id;

INSERT INTO public.sandbox_course_members (sandbox_course_id, user_id, role)
SELECT course.id, usr.id, 'admin'
FROM public.sandbox_courses AS course
CROSS JOIN public.users AS usr
WHERE usr.role_global = 'admin' AND usr.is_active = true
ON CONFLICT (sandbox_course_id, user_id) DO NOTHING;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sandbox_courses, public.sandbox_course_members TO service_role;
