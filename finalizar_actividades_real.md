La Solución Empresarial (Patrón Híbrido Relacional + JSONB)
La arquitectura moderna que usan Canvas LMS, Google Classroom y los grandes SaaS EdTech en PostgreSQL es el Patrón Híbrido Relacional:

Las entidades de negocio de alto nivel (courses, activities, rubrics, submissions) son tablas relacionales estrictas con Foreign Keys, índices y CASCADE.
La matriz de criterios y niveles de la rúbrica se almacena como JSONB estructurado e indexable.
┌─────────────────┐ ┌─────────────────┐
│ COURSES │ │ RUBRICS │ (Catálogo reutilizable
│ (id, code...) │ │ (id, title, │ a nivel de curso o
└────────┬────────┘ │ criterios) │ de facultad/departamento)
│ 1 └────────┬────────┘
│ │ 1
│ N │
┌────────▼─────────────────────────▼────────┐
│ ACTIVITIES │ (Relacional pura:
│ id, course_id (FK), rubric_id (FK), │ course_id y rubric_id)
│ title, due_date, bonus_decimas... │
└────────────────────┬──────────────────────┘
│ 1
│ N
┌────────────────────▼──────────────────────┐
│ SUBMISSIONS │ (Entrega del alumno +
│ id, activity_id (FK), student_id, │ evaluación IA sellada
│ grade, rubric_assessment (JSONB) │ como snapshot inmutable)
└───────────────────────────────────────────┘ 3. Modelo de Tablas SQL Recomendado (PostgreSQL / Supabase)
Tabla 1: rubrics (Catálogo maestro reutilizable)
Una rúbrica se crea una vez (ej: "Rúbrica Oficial de Informes UDP") y se puede reutilizar en cientos de cursos y actividades diferentes:

sql
CREATE TABLE rubrics (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
institution_id UUID NOT NULL,
course_id BIGINT, -- NULL si es una rúbrica transversal institucional
title VARCHAR(255) NOT NULL,
description TEXT,
total_points NUMERIC(5,2) DEFAULT 100,
criteria JSONB NOT NULL, -- Array de criterios y niveles estructurados
is_template BOOLEAN DEFAULT FALSE, -- TRUE si está en el catálogo global
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Índice GIN para buscar rápidamente criterios dentro de millones de rúbricas
CREATE INDEX idx_rubrics_criteria ON rubrics USING gin (criteria);
Tabla 2: activities (Instancia de la actividad en el curso)
Relaciona el curso con la rúbrica elegida:

sql
CREATE TABLE activities (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
course_id BIGINT NOT NULL, -- FK al curso de Canvas (ej: 44999)
rubric_id UUID REFERENCES rubrics(id) ON DELETE RESTRICT,
title VARCHAR(255) NOT NULL,
description TEXT,
due_date TIMESTAMPTZ NOT NULL,
type VARCHAR(50) DEFAULT 'actividad_ayudantia', -- 'actividad_ayudantia' | 'tarea_oficial'
bonus_decimas NUMERIC(3,1) DEFAULT 0.3, -- 0.3 décimas
target_evaluation VARCHAR(100), -- 'Solemne 1'
status VARCHAR(20) DEFAULT 'publicada', -- 'borrador' | 'publicada'
created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_activities_course ON activities (course_id);
Tabla 3: submissions (Entregas y Auditoría SpeedGrader IA)
Guarda la entrega y el dictamen congelado del agente IA:

sql
CREATE TABLE submissions (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
student_id BIGINT NOT NULL, -- Canvas User ID
submitted_at TIMESTAMPTZ DEFAULT NOW(),
file_url TEXT,
solution_text TEXT,
status VARCHAR(30) DEFAULT 'calificada_ia', -- 'pendiente' | 'calificada_ia' | 'auditada'
suggested_decimas NUMERIC(3,1),
rubric_assessment JSONB NOT NULL, -- Snapshot congelado con puntajes y citas textuales
appeal JSONB -- Motivo, estado y respuesta si el alumno apela
);
CREATE INDEX idx_submissions_activity_student ON submissions (activity_id, student_id); 4. ¿Por qué esta solución es la que escala a millones de registros?
Reutilización Masiva: La facultad define 21 rúbricas en la tabla rubrics una sola vez. 5.000 secciones pueden vincularse a la misma rubric_id sin duplicar filas.
Consultas a velocidad de 1ms: Obtener una actividad con su rúbrica es un simple SELECT \* FROM activities JOIN rubrics ... WHERE course_id = 44999. Sin JOINs cuádruples.
Blindaje Académico: Cuando el alumno entrega, su nota y feedback quedan en submissions.rubric_assessment. Si el profesor edita la rúbrica dos meses después, la nota histórica del alumno no se rompe.
Compatible con Canvas API: Canvas devuelve las rúbricas y las calificaciones en este exacto formato (rubric_association y rubric_assessment).
¿Te parece bien si cuando llegue el momento de conectar la base de datos real en Supabase, implementamos esta estructura de 3 tablas (rubrics, activities, submissions)? Mientras tanto, en el frontend ya estamos usando exactamente este modelo.
