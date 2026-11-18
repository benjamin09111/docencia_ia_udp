-- ==============================================================================
-- MIGRACIÓN 2026-11-18 — Módulo 1: Gestión y Calificaciones (Act-IA)
-- ------------------------------------------------------------------------------
-- Tablas AISLADAS: no referencian `courses`, `students` ni ninguna tabla del
-- Módulo de Asistencia. Los cursos reales blindados (AGENTS.md §6) no se tocan.
--
-- Contrato con el Módulo 2 (Actividades y Corrección): ver
-- docs/modulo-1-contrato-datos.md. Resumen:
--   * Una actividad se liga a una evaluación con
--       evaluacion_id UUID REFERENCES public.evaluaciones(id) ON DELETE SET NULL
--   * Las notas se escriben en public.notas con origen = 'actividad'.
--   * La nota final NUNCA se guarda: se calcula siempre a partir de esta data.
--
-- Idempotente y no destructiva. Ejecutar completa en Supabase → SQL Editor.
-- Requiere public.handle_updated_at() (definida en supabase/schema.sql).
-- ==============================================================================

-- 1. Cursos creados por el docente (desde el PDF del programa o a mano)
CREATE TABLE IF NOT EXISTS public.cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id TEXT NOT NULL,                       -- session.userId del docente dueño
    nombre VARCHAR(150) NOT NULL,
    codigo VARCHAR(30) NOT NULL,                       -- ej. CIT3000
    seccion VARCHAR(20) NOT NULL DEFAULT '',
    semestre VARCHAR(20) NOT NULL,                     -- ej. 2026-2
    docente_nombre VARCHAR(150) NULL,
    origen VARCHAR(10) NOT NULL DEFAULT 'manual' CHECK (origen IN ('pdf', 'manual')),
    programa_archivo VARCHAR(255) NULL,                -- solo el nombre; el PDF no se guarda

    -- Escala de notas
    nota_minima NUMERIC(2, 1) NOT NULL DEFAULT 1.0,
    nota_maxima NUMERIC(2, 1) NOT NULL DEFAULT 7.0,
    nota_aprobacion NUMERIC(2, 1) NOT NULL DEFAULT 4.0,
    exigencia_pct NUMERIC(5, 2) NOT NULL DEFAULT 60 CHECK (exigencia_pct > 0 AND exigencia_pct <= 100),

    -- Reglas de cálculo (estructuradas: el motor de notas las usa)
    nota_eximicion NUMERIC(2, 1) NULL,                 -- NP >= esto → no rinde examen
    nota_minima_examen NUMERIC(2, 1) NULL,             -- NP < esto → no tiene derecho a examen
    decimas_totales NUMERIC(2, 1) NULL CHECK (decimas_totales IS NULL OR decimas_totales >= 0), -- 0.5 = 5 décimas
    asistencia_minima_pct NUMERIC(5, 2) NULL CHECK (asistencia_minima_pct IS NULL OR (asistencia_minima_pct >= 0 AND asistencia_minima_pct <= 100)),
    notas_faltantes VARCHAR(12) NOT NULL DEFAULT 'pendiente' CHECK (notas_faltantes IN ('pendiente', 'nota_minima')),
    restricciones JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(restricciones) = 'array'),
    supuestos JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(supuestos) = 'array'),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_cursos_escala CHECK (nota_minima < nota_aprobacion AND nota_aprobacion <= nota_maxima),
    CONSTRAINT uq_cursos_owner_codigo UNIQUE (owner_user_id, codigo, seccion, semestre)
);

-- 2. Evaluaciones ponderadas del curso (una columna de la tabla de notas cada una)
CREATE TABLE IF NOT EXISTS public.evaluaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
    nombre VARCHAR(80) NOT NULL,                       -- ej. 'Solemne 1', 'Tarea 2'
    tipo VARCHAR(15) NOT NULL DEFAULT 'otro' CHECK (tipo IN (
        'solemne', 'control', 'tarea', 'proyecto', 'informe', 'presentacion', 'examen', 'otro'
    )),
    ponderacion NUMERIC(5, 2) NOT NULL CHECK (ponderacion > 0 AND ponderacion <= 100), -- % sobre la nota final
    orden SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_evaluaciones_curso ON public.evaluaciones(curso_id, orden);

-- 3. Alumnos de cada curso (nómina propia del curso; no se comparte entre cursos)
CREATE TABLE IF NOT EXISTS public.alumnos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    rut VARCHAR(12) NOT NULL CHECK (rut ~ '^[0-9]{7,8}-[0-9K]$'), -- normalizado: cuerpo-DV, sin puntos
    correo VARCHAR(254) NOT NULL,
    decimas NUMERIC(2, 1) NOT NULL DEFAULT 0 CHECK (decimas >= 0), -- décimas ganadas (en puntos de nota)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_alumnos_curso_rut UNIQUE (curso_id, rut)
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_alumnos_curso_correo ON public.alumnos(curso_id, lower(correo));

-- 4. Notas por evaluación y alumno (una nota vacía = la fila no existe)
CREATE TABLE IF NOT EXISTS public.notas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluacion_id UUID NOT NULL REFERENCES public.evaluaciones(id) ON DELETE CASCADE,
    alumno_id UUID NOT NULL REFERENCES public.alumnos(id) ON DELETE CASCADE,
    valor NUMERIC(2, 1) NOT NULL CHECK (valor >= 1.0 AND valor <= 7.0),
    origen VARCHAR(12) NOT NULL DEFAULT 'manual' CHECK (origen IN ('manual', 'importacion', 'actividad')),
    referencia_externa VARCHAR(100) NULL,              -- ej. id de la actividad/entrega del Módulo 2
    updated_by VARCHAR(100) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_notas_evaluacion_alumno UNIQUE (evaluacion_id, alumno_id)
);
CREATE INDEX IF NOT EXISTS idx_notas_alumno ON public.notas(alumno_id);

-- 5. updated_at automático
CREATE OR REPLACE TRIGGER trg_cursos_updated_at BEFORE UPDATE ON public.cursos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER trg_evaluaciones_updated_at BEFORE UPDATE ON public.evaluaciones FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER trg_alumnos_updated_at BEFORE UPDATE ON public.alumnos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER trg_notas_updated_at BEFORE UPDATE ON public.notas FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. Acceso: solo el servidor (service_role). Las rutas /api/gestion/* controlan dueño y rol.
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notas ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.cursos, public.evaluaciones, public.alumnos, public.notas FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cursos, public.evaluaciones, public.alumnos, public.notas TO service_role;

COMMENT ON TABLE public.cursos IS 'Módulo 1: curso creado por el docente (PDF del programa o manual) con su configuración de calificación.';
COMMENT ON TABLE public.evaluaciones IS 'Módulo 1: evaluación ponderada. El Módulo 2 liga sus actividades aquí (evaluacion_id).';
COMMENT ON TABLE public.alumnos IS 'Módulo 1: nómina del curso. RUT y correo nunca se envían a la IA.';
COMMENT ON TABLE public.notas IS 'Módulo 1: nota 1.0–7.0 por evaluación y alumno. La nota final se calcula, no se guarda.';
