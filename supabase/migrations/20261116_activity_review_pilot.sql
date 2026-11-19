CREATE TABLE public.activity_review_tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id bigint NOT NULL CHECK (course_id = 900001),
    teacher_id text NOT NULL,
    details jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX activity_review_tasks_teacher_idx
    ON public.activity_review_tasks (teacher_id, course_id, created_at DESC);

CREATE TABLE public.activity_review_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id uuid NOT NULL REFERENCES public.activity_review_tasks(id) ON DELETE CASCADE,
    student_id text NOT NULL,
    student_name text NOT NULL,
    file_name text NOT NULL,
    pdf bytea NOT NULL CHECK (octet_length(pdf) BETWEEN 1 AND 2097152),
    solution text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    processing_at timestamptz,
    suggested jsonb,
    review_error text,
    final_value numeric(4,1),
    final_feedback text,
    approved_at timestamptz,
    UNIQUE (activity_id, student_id),
    CHECK ((approved_at IS NULL) = (final_value IS NULL))
);

ALTER TABLE public.activity_review_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_review_submissions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.activity_review_tasks, public.activity_review_submissions FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.activity_review_tasks, public.activity_review_submissions TO service_role;
