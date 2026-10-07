-- ==============================================================================
-- ECOSISTEMA DOCENCIA IA UDP — ESQUEMA RELACIONAL INSTITUCIONAL (SUPABASE / POSTGRESQL)
-- Arquitectura Normalizada (3NF/BCNF) de Alto Rendimiento y Escalabilidad Universitaria
-- ==============================================================================

-- 1. EXTENSIONES REQUERIDAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Función global para actualización automática de updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 2. JERARQUÍA INSTITUCIONAL Y MULTI-TENANT (UDP Y MULTI-UNIVERSIDAD)
-- ------------------------------------------------------------------------------

-- 2.1 Institución (UDP, etc.)
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) UNIQUE NOT NULL,              -- ej. 'UDP'
    name VARCHAR(255) NOT NULL,                    -- 'Universidad Diego Portales'
    domain VARCHAR(100) NOT NULL,                  -- 'mail.udp.cl'
    canvas_base_url VARCHAR(255) NULL,             -- 'https://udp.instructure.com'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 Facultades
CREATE TABLE IF NOT EXISTS public.faculties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,                     -- ej. 'FING'
    name VARCHAR(255) NOT NULL,                    -- 'Facultad de Ingeniería y Ciencias'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_faculty_institution_code UNIQUE (institution_id, code)
);

-- 2.3 Carreras / Departamentos Académicos
CREATE TABLE IF NOT EXISTS public.academic_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID NOT NULL REFERENCES public.faculties(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,                     -- ej. 'INF_TELE'
    name VARCHAR(255) NOT NULL,                    -- 'Escuela de Informática y Telecomunicaciones'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_program_faculty_code UNIQUE (faculty_id, code)
);

-- 2.4 Periodos Académicos (Semestres)
CREATE TABLE IF NOT EXISTS public.academic_terms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,                     -- ej. '2026-01', '2026-02'
    name VARCHAR(100) NOT NULL,                    -- ej. 'Primer Semestre 2026'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_term_institution_code UNIQUE (institution_id, code)
);

-- ------------------------------------------------------------------------------
-- 3. CURSOS Y SECCIONES (MODELO ACADÉMICO NORMALIZADO)
-- ------------------------------------------------------------------------------

-- 3.1 Cursos Institucionales
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NULL REFERENCES public.institutions(id) ON DELETE SET NULL,
    program_id UUID NULL REFERENCES public.academic_programs(id) ON DELETE SET NULL,
    canvas_course_id BIGINT UNIQUE NOT NULL,       -- ID numérico de Canvas UDP (ej. 47552)
    code VARCHAR(50) NOT NULL,                    -- Código oficial asignatura (ej. CIT3203)
    name VARCHAR(255) NOT NULL,                   -- 'PROYECTO EN TICS II'
    term VARCHAR(20) DEFAULT '2026-02',           -- Semestre actual para compatibilidad
    term_id UUID NULL REFERENCES public.academic_terms(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Secciones por Curso (1 Curso Canvas = 1 Sección matriculada)
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    canvas_section_id BIGINT NULL,
    code VARCHAR(50) NOT NULL,                    -- ej. CIT3203_CA01
    name VARCHAR(100) NOT NULL,                   -- ej. Sección 1
    teacher_name VARCHAR(255) NULL,
    teacher_email VARCHAR(255) NULL,
    assistant_name VARCHAR(255) NULL,
    assistant_email VARCHAR(255) NULL,
    
    -- Configuración Horario Cátedra (Compatibilidad plana)
    horario_catedra_dias INT[] DEFAULT '{3}',     -- 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie
    horario_catedra_inicio TIME DEFAULT '14:30',
    horario_catedra_fin TIME DEFAULT '17:30',
    horario_catedra_sala VARCHAR(100) DEFAULT 'SALA X',

    -- Configuración Horario Ayudantía (Compatibilidad plana)
    horario_ayudantia_dias INT[] DEFAULT '{3}',
    horario_ayudantia_inicio TIME DEFAULT '16:00',
    horario_ayudantia_fin TIME DEFAULT '17:20',
    horario_ayudantia_sala VARCHAR(100) DEFAULT 'SALA X',

    -- Parámetros Operativos y Seguridad
    pin_activo VARCHAR(10) DEFAULT '4821',
    requiere_pin BOOLEAN DEFAULT TRUE,
    requiere_geo BOOLEAN DEFAULT FALSE,
    incluir_ayudantias_en_final BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_section_course_code UNIQUE (course_id, code)
);

-- 3.3 Horarios Detallados Multi-bloque (Soporte para cátedras con múltiples días/bloques)
CREATE TABLE IF NOT EXISTS public.section_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('catedra', 'ayudantia', 'laboratorio', 'taller')),
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Lunes, 7=Domingo
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(100) NULL,
    building VARCHAR(100) NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_schedule_time CHECK (start_time < end_time)
);

-- ------------------------------------------------------------------------------
-- 4. ESTUDIANTES Y MATRÍCULA (NÓMINA INSTITUCIONAL CANVAS UDP)
-- ------------------------------------------------------------------------------

-- 4.1 Estudiantes
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canvas_id BIGINT UNIQUE NOT NULL,             -- ID único Canvas (ej. 29248)
    rut VARCHAR(20) NOT NULL UNIQUE,              -- RUT institucional validado (ej. 20.481.932-8)
    nombres VARCHAR(150) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.2 Matrícula / Enrollments (Relación Estudiante <-> Sección)
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'assistant', 'teacher', 'observer')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'withdrawn', 'suspended')),
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_enrollment UNIQUE (section_id, student_id)
);

-- ------------------------------------------------------------------------------
-- 5. SESIONES EFECTIVAS DE CLASES (ASISTENCIA Y PROGRAMACIÓN)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.class_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    session_code VARCHAR(100) NULL,               -- Identificador semántico (ej. sess_CIT3203_CA01_ayu_2)
    date DATE NOT NULL,                           -- Fecha de la clase YYYY-MM-DD
    dia_semana VARCHAR(20) NOT NULL,              -- Miércoles, Jueves, etc.
    type VARCHAR(20) NOT NULL CHECK (type IN ('catedra', 'ayudantia', 'laboratorio')),
    modality VARCHAR(20) DEFAULT 'presencial' CHECK (modality IN ('presencial', 'online')),
    status VARCHAR(20) DEFAULT 'programada' CHECK (status IN ('programada', 'en_curso', 'realizada', 'cancelada')),
    motivo_cancelacion TEXT NULL,
    start_time TIME NULL,
    end_time TIME NULL,
    room VARCHAR(100) NULL,
    pin VARCHAR(10) NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_session_date_type UNIQUE (section_id, date, type)
);

-- ------------------------------------------------------------------------------
-- 6. REGISTROS DE ASISTENCIA (ALTO VOLUMEN: ESCALABLE A MILLONES DE FILAS)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.class_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    value SMALLINT NOT NULL DEFAULT 0 CHECK (value IN (0, 1)), -- 1 = Presente, 0 = Ausente
    marked_by VARCHAR(50) DEFAULT 'profesor' CHECK (marked_by IN ('profesor', 'ayudante', 'alumno_pin', 'sistema', 'alumno_link', 'alumno_qr')),
    marked_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET NULL,
    latitude NUMERIC(10, 7) NULL,
    longitude NUMERIC(10, 7) NULL,
    CONSTRAINT uq_attendance_session_student UNIQUE (session_id, student_id)
);

-- ------------------------------------------------------------------------------
-- 7. DÉCIMAS, TRABAJOS Y EVALUACIONES DE AYUDANTÍA (ESCALABILIDAD EXCEL + ACTIVIDADES)
-- ------------------------------------------------------------------------------

-- 7.1 Registro de Trabajo y Décimas por Estudiante y Sección (Reemplazo inmediato de papel a Excel)
CREATE TABLE IF NOT EXISTS public.student_work_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    decimas_acumuladas NUMERIC(4, 2) NOT NULL DEFAULT 0.0 CHECK (decimas_acumuladas >= 0),
    trabajos_realizados INT NOT NULL DEFAULT 0 CHECK (trabajos_realizados >= 0),
    observaciones TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_student_work_section UNIQUE (section_id, student_id)
);

-- 7.2 Actividades de Ayudantía / Talleres (Preparado para cuando se conecte con el generador de actividades IA)
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,                  -- ej. 'Taller 1: Modelado de Clases'
    description TEXT NULL,
    type VARCHAR(30) DEFAULT 'taller_ayudantia' CHECK (type IN ('taller_ayudantia', 'control', 'preparacion_solemne', 'tarea')),
    max_decimas NUMERIC(4, 2) DEFAULT 0.5,        -- Tope de décimas a entregar
    due_date TIMESTAMPTZ NULL,
    rubric_json JSONB NULL,                       -- Criterios y pautas generadas por el Agente IA
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7.3 Entregas de Estudiantes por Actividad (Submissions)
CREATE TABLE IF NOT EXISTS public.activity_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'entregado' CHECK (status IN ('pendiente', 'entregado', 'corregido', 'tardio')),
    decimas_obtained NUMERIC(4, 2) DEFAULT 0.0,
    feedback_text TEXT NULL,                      -- Retroalimentación del Agente o Ayudante
    evaluated_by VARCHAR(50) DEFAULT 'ayudante',
    evaluated_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_activity_student_sub UNIQUE (activity_id, student_id)
);

-- ------------------------------------------------------------------------------
-- 8. AUDITORÍA INSTITUCIONAL DE CAMBIOS (CUMPLIMIENTO UDP)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.attendance_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.class_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    previous_value SMALLINT NULL,
    new_value SMALLINT NOT NULL,
    reason TEXT NULL,                             -- ej. 'Certificado médico presentado'
    changed_by VARCHAR(100) NOT NULL,             -- Usuario/email del docente o ayudante
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. ÍNDICES DE ALTO RENDIMIENTO (OPTIMIZADOS PARA INDEX-ONLY SCANS A ESCALA UNIVERSITARIA)
-- ------------------------------------------------------------------------------

-- Secciones y Matrícula
CREATE INDEX IF NOT EXISTS idx_sections_course ON public.sections(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_section ON public.enrollments(section_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments(student_id);

-- Sesiones
CREATE INDEX IF NOT EXISTS idx_sessions_section_date ON public.class_sessions(section_id, date);
CREATE INDEX IF NOT EXISTS idx_sessions_sec_date_type ON public.class_sessions(section_id, date, type);
CREATE INDEX IF NOT EXISTS idx_sessions_code ON public.class_sessions(session_code);

-- Asistencia: Índices covering con INCLUDE para conteo relámpago sin tocar disco (Heap)
CREATE INDEX IF NOT EXISTS idx_attendance_records_covering 
ON public.attendance_records(session_id, value) 
INCLUDE (student_id);

CREATE INDEX IF NOT EXISTS idx_attendance_student_covering 
ON public.attendance_records(student_id, value) 
INCLUDE (session_id);

-- Décimas y Trabajos
CREATE INDEX IF NOT EXISTS idx_work_records_lookup 
ON public.student_work_records(section_id, student_id);

-- Actividades
CREATE INDEX IF NOT EXISTS idx_activities_section ON public.activities(section_id);
CREATE INDEX IF NOT EXISTS idx_activity_submissions_act ON public.activity_submissions(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_submissions_stu ON public.activity_submissions(student_id);

-- ------------------------------------------------------------------------------
-- 10. VISTAS RESUMEN DE RENDIMIENTO
-- ------------------------------------------------------------------------------

CREATE OR REPLACE VIEW public.v_student_attendance_summary AS
SELECT 
    e.section_id,
    s.id AS student_id,
    s.canvas_id,
    s.rut,
    s.nombres,
    s.apellidos,
    s.email,
    -- Décimas y Trabajos registrados en Ayudantía
    COALESCE(wr.decimas_acumuladas, 0) AS decimas_acumuladas,
    COALESCE(wr.trabajos_realizados, 0) AS trabajos_realizados,
    -- Cátedras
    COUNT(CASE WHEN cs.type = 'catedra' AND cs.status != 'cancelada' AND ar.value = 1 THEN 1 END) AS catedras_asistidas,
    COUNT(CASE WHEN cs.type = 'catedra' AND cs.status != 'cancelada' THEN 1 END) AS catedras_validas,
    CASE 
        WHEN COUNT(CASE WHEN cs.type = 'catedra' AND cs.status != 'cancelada' THEN 1 END) > 0 THEN
            ROUND((COUNT(CASE WHEN cs.type = 'catedra' AND cs.status != 'cancelada' AND ar.value = 1 THEN 1 END)::NUMERIC / 
                   COUNT(CASE WHEN cs.type = 'catedra' AND cs.status != 'cancelada' THEN 1 END)::NUMERIC) * 100)
        ELSE 0 
    END AS catedras_pct,
    -- Ayudantías
    COUNT(CASE WHEN cs.type = 'ayudantia' AND cs.status != 'cancelada' AND ar.value = 1 THEN 1 END) AS ayudantias_asistidas,
    COUNT(CASE WHEN cs.type = 'ayudantia' AND cs.status != 'cancelada' THEN 1 END) AS ayudantias_validas,
    CASE 
        WHEN COUNT(CASE WHEN cs.type = 'ayudantia' AND cs.status != 'cancelada' THEN 1 END) > 0 THEN
            ROUND((COUNT(CASE WHEN cs.type = 'ayudantia' AND cs.status != 'cancelada' AND ar.value = 1 THEN 1 END)::NUMERIC / 
                   COUNT(CASE WHEN cs.type = 'ayudantia' AND cs.status != 'cancelada' THEN 1 END)::NUMERIC) * 100)
        ELSE 0 
    END AS ayudantias_pct,
    -- Totales Combinados
    COUNT(CASE WHEN cs.status != 'cancelada' AND ar.value = 1 THEN 1 END) AS total_asistidas,
    COUNT(CASE WHEN cs.status != 'cancelada' THEN 1 END) AS total_validas,
    CASE 
        WHEN COUNT(CASE WHEN cs.status != 'cancelada' THEN 1 END) > 0 THEN
            ROUND((COUNT(CASE WHEN cs.status != 'cancelada' AND ar.value = 1 THEN 1 END)::NUMERIC / 
                   COUNT(CASE WHEN cs.status != 'cancelada' THEN 1 END)::NUMERIC) * 100)
        ELSE 0 
    END AS total_pct
FROM public.enrollments e
JOIN public.students s ON s.id = e.student_id
LEFT JOIN public.student_work_records wr ON wr.section_id = e.section_id AND wr.student_id = s.id
LEFT JOIN public.class_sessions cs ON cs.section_id = e.section_id
LEFT JOIN public.attendance_records ar ON ar.session_id = cs.id AND ar.student_id = s.id
GROUP BY e.section_id, s.id, s.canvas_id, s.rut, s.nombres, s.apellidos, s.email, wr.decimas_acumuladas, wr.trabajos_realizados;

-- ------------------------------------------------------------------------------
-- 11. PROCEDIMIENTOS ALMACENADOS / RPCs DE ALTA EFICIENCIA
-- ------------------------------------------------------------------------------

-- 11.1 Marcación individual de asistencia por código semántico
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
        DO UPDATE SET value = EXCLUDED.value, marked_by = EXCLUDED.marked_by, marked_at = NOW();
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11.2 Inserción masiva atómica de asistencias por códigos semánticos
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
        value = EXCLUDED.value,
        marked_by = EXCLUDED.marked_by,
        marked_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11.3 Obtención ultra rápida del mapa de asistencia para una sección
CREATE OR REPLACE FUNCTION public.get_section_attendance_map(p_section_code TEXT)
RETURNS TABLE (
    session_code VARCHAR,
    student_canvas_id BIGINT,
    value SMALLINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cs.session_code,
        st.canvas_id AS student_canvas_id,
        ar.value
    FROM public.attendance_records ar
    JOIN public.class_sessions cs ON cs.id = ar.session_id
    JOIN public.students st ON st.id = ar.student_id
    JOIN public.sections sec ON sec.id = cs.section_id
    WHERE sec.code = p_section_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11.4 Upsert de décimas y trabajos realizados por estudiante y sección
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

-- 11.5 Obtener registros de décimas y trabajos de toda la sección
CREATE OR REPLACE FUNCTION public.get_section_work_records(p_section_code TEXT)
RETURNS TABLE (
    student_canvas_id BIGINT,
    decimas_acumuladas NUMERIC,
    trabajos_realizados INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        st.canvas_id AS student_canvas_id,
        wr.decimas_acumuladas,
        wr.trabajos_realizados
    FROM public.student_work_records wr
    JOIN public.students st ON st.id = wr.student_id
    JOIN public.sections sec ON sec.id = wr.section_id
    WHERE sec.code = p_section_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 12. TRIGGERS PARA UPDATED_AT
-- ------------------------------------------------------------------------------

CREATE OR REPLACE TRIGGER trg_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER trg_sections_updated_at BEFORE UPDATE ON public.sections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER trg_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER trg_sessions_updated_at BEFORE UPDATE ON public.class_sessions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER trg_work_records_updated_at BEFORE UPDATE ON public.student_work_records FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 13. POLÍTICAS ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------

ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_work_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de desarrollo y acceso institucional
DROP POLICY IF EXISTS "Permitir lectura general de cursos" ON public.courses;
CREATE POLICY "Permitir lectura general de cursos" ON public.courses FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permitir edición general de cursos" ON public.courses;
CREATE POLICY "Permitir edición general de cursos" ON public.courses FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura de secciones" ON public.sections;
CREATE POLICY "Permitir lectura de secciones" ON public.sections FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permitir edición de secciones" ON public.sections;
CREATE POLICY "Permitir edición de secciones" ON public.sections FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura de estudiantes" ON public.students;
CREATE POLICY "Permitir lectura de estudiantes" ON public.students FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permitir edición de estudiantes" ON public.students;
CREATE POLICY "Permitir edición de estudiantes" ON public.students FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura de matricula" ON public.enrollments;
CREATE POLICY "Permitir lectura de matricula" ON public.enrollments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permitir edición de matricula" ON public.enrollments;
CREATE POLICY "Permitir edición de matricula" ON public.enrollments FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura de sesiones" ON public.class_sessions;
CREATE POLICY "Permitir lectura de sesiones" ON public.class_sessions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permitir edición de sesiones" ON public.class_sessions;
CREATE POLICY "Permitir edición de sesiones" ON public.class_sessions FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura de asistencia" ON public.attendance_records;
CREATE POLICY "Permitir lectura de asistencia" ON public.attendance_records FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permitir edición de asistencia" ON public.attendance_records;
CREATE POLICY "Permitir edición de asistencia" ON public.attendance_records FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura de work records" ON public.student_work_records;
CREATE POLICY "Permitir lectura de work records" ON public.student_work_records FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permitir edición de work records" ON public.student_work_records;
CREATE POLICY "Permitir edición de work records" ON public.student_work_records FOR ALL USING (true);

-- Semilla Institucional UDP Inicial (Idempotente)
INSERT INTO public.institutions (code, name, domain, canvas_base_url)
VALUES ('UDP', 'Universidad Diego Portales', 'mail.udp.cl', 'https://udp.instructure.com')
ON CONFLICT (code) DO NOTHING;
