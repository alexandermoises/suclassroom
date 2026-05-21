-- BD completa SUClassroom para PostgreSQL
-- Incluye esquema + datos demo para probar roles, cursos, proyectos, pagos, asesorias y metricas.
-- Importar: psql -d suclassroom -f database/BD_SUCLASSROOM_POSTGRESQL.sql

-- Base de datos PostgreSQL para SUClassroom
-- Roles de cuenta: alumno, mentor, administrador y empresa_ong.
-- La pagina de requisitos internos solo la puede ver el administrador.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('alumno', 'mentor', 'administrador', 'empresa_ong');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE project_stage AS ENUM ('idea', 'emprendimiento', 'empresa', 'programa_social', 'sin_proyecto');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE course_level AS ENUM ('basico', 'intermedio', 'avanzado');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE enrollment_status AS ENUM ('gratis_activo', 'en_progreso', 'proyecto_enviado', 'feedback_recibido', 'asesoria_pagada', 'completado', 'bloqueado');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE deliverable_status AS ENUM ('borrador', 'enviado', 'observado', 'aprobado', 'rechazado');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pendiente', 'pagado', 'fallido', 'reembolsado');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    project_stage project_stage NOT NULL DEFAULT 'idea',
    project_name VARCHAR(180),
    project_description TEXT,
    initial_diagnostic TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mentors (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    specialty VARCHAR(100) NOT NULL,
    years_experience INT NOT NULL DEFAULT 0 CHECK (years_experience >= 0),
    availability TEXT,
    bio TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS administrators (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    admin_code VARCHAR(50),
    area VARCHAR(80),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(180) NOT NULL,
    organization_type VARCHAR(80) NOT NULL CHECK (organization_type IN ('empresa','ong','institucion_educativa','programa_social')),
    contact_email VARCHAR(160),
    contact_phone VARCHAR(40),
    created_by_admin UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organization_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    group_name VARCHAR(160) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS group_students (
    group_id UUID NOT NULL REFERENCES organization_groups(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(user_id) ON DELETE CASCADE,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (group_id, student_id)
);

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(180) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    level course_level NOT NULL DEFAULT 'basico',
    objective TEXT NOT NULL,
    expected_results TEXT,
    project_description TEXT,
    estimated_hours INT DEFAULT 0 CHECK (estimated_hours >= 0),
    is_initial_free BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    order_number INT NOT NULL DEFAULT 1,
    created_by_admin UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(180) NOT NULL,
    description TEXT,
    video_url TEXT,
    module_order INT NOT NULL DEFAULT 1,
    is_free_preview BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_id UUID REFERENCES course_modules(id) ON DELETE SET NULL,
    title VARCHAR(180) NOT NULL,
    resource_type VARCHAR(60) NOT NULL CHECK (resource_type IN ('guia','plantilla','lectura','ejemplo','caso_real','link')),
    resource_url TEXT,
    is_unlocked_by_progress BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(user_id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status enrollment_status NOT NULL DEFAULT 'gratis_activo',
    progress_percent INT NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    first_class_unlocked BOOLEAN NOT NULL DEFAULT TRUE,
    next_course_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
    enrolled_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    UNIQUE (student_id, course_id)
);

CREATE TABLE IF NOT EXISTS deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    title VARCHAR(180) NOT NULL,
    instructions TEXT,
    file_url TEXT,
    external_link TEXT,
    content TEXT,
    status deliverable_status NOT NULL DEFAULT 'borrador',
    submitted_at TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deliverable_id UUID NOT NULL REFERENCES deliverables(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES mentors(user_id),
    score INT CHECK (score BETWEEN 0 AND 20),
    status deliverable_status NOT NULL,
    feedback TEXT NOT NULL,
    next_steps TEXT,
    reviewed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mentor_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES mentors(user_id) ON DELETE CASCADE,
    weekday INT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(user_id),
    course_id UUID REFERENCES courses(id),
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'PEN',
    payment_method VARCHAR(60) NOT NULL DEFAULT 'culqi_simulado',
    status payment_status NOT NULL DEFAULT 'pendiente',
    transaction_code VARCHAR(120),
    paid_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS advisory_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(user_id),
    mentor_id UUID NOT NULL REFERENCES mentors(user_id),
    course_id UUID NOT NULL REFERENCES courses(id),
    payment_id UUID REFERENCES payments(id),
    scheduled_at TIMESTAMP NOT NULL,
    format VARCHAR(40) NOT NULL DEFAULT 'videollamada',
    meeting_url TEXT,
    status VARCHAR(40) NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente','confirmada','realizada','cancelada')),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT advisory_requires_paid_payment CHECK (payment_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS support_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    channel VARCHAR(40) NOT NULL CHECK (channel IN ('email','chat','whatsapp')),
    subject VARCHAR(180) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'abierto',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_status ON deliverables(status);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_sessions_student ON advisory_sessions(student_id);

CREATE OR REPLACE VIEW admin_dashboard_metrics AS
SELECT
    (SELECT COUNT(*) FROM users WHERE role = 'alumno') AS total_alumnos,
    (SELECT COUNT(*) FROM users WHERE role = 'mentor') AS total_mentores,
    (SELECT COUNT(*) FROM users WHERE role = 'empresa_ong') AS total_empresas_ongs,
    (SELECT COUNT(*) FROM enrollments WHERE status = 'completado') AS cursos_completados,
    (SELECT COUNT(*) FROM deliverables WHERE status = 'enviado') AS proyectos_enviados,
    (SELECT COUNT(*) FROM deliverables WHERE status = 'aprobado') AS proyectos_aprobados,
    (SELECT COUNT(*) FROM advisory_sessions WHERE status IN ('confirmada','realizada')) AS asesorias,
    (SELECT COALESCE(SUM(amount),0) FROM payments WHERE status = 'pagado') AS ingresos_pagados;


-- Politica de acceso recomendada:
-- 1. Requisitos internos: solo users.role = 'administrador'.
-- 2. Panel alumno: solo users.role = 'alumno'.
-- 3. Panel mentor: solo users.role = 'mentor'.
-- 4. Panel empresa/ONG: solo users.role = 'empresa_ong' o administrador.
-- 5. Cada endpoint del backend debe validar el rol antes de consultar o modificar informacion.

-- =============================================
-- DATOS DEMO
-- =============================================
-- Datos de ejemplo para probar SUClassroom en PostgreSQL
-- La contrasena esta simulada como texto hash de ejemplo. En produccion usar bcrypt/argon2 desde backend.

INSERT INTO users (full_name, email, password_hash, role, email_verified)
VALUES
('Admin Demo', 'admin@suclassroom.com', 'hash_demo_admin', 'administrador', TRUE),
('Alumno Demo', 'alumno@suclassroom.com', 'hash_demo_alumno', 'alumno', TRUE),
('Mentor Demo', 'mentor@suclassroom.com', 'hash_demo_mentor', 'mentor', TRUE),
('Empresa Demo', 'empresa@suclassroom.com', 'hash_demo_empresa', 'empresa_ong', TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO administrators (user_id, admin_code, area)
SELECT id, 'ADMIN-2026', 'Academica' FROM users WHERE email = 'admin@suclassroom.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO students (user_id, project_stage, project_name, project_description)
SELECT id, 'emprendimiento', 'Emprendimiento demo', 'Proyecto inicial para validar mercado y modelo de negocio.'
FROM users WHERE email = 'alumno@suclassroom.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO mentors (user_id, specialty, years_experience, availability, bio)
SELECT id, 'Emprendimiento', 5, 'Lunes y miercoles por la tarde', 'Mentor especializado en validacion de proyectos.'
FROM users WHERE email = 'mentor@suclassroom.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO courses (title, slug, category, level, objective, expected_results, project_description, estimated_hours, is_initial_free, order_number)
VALUES
('Validacion de ideas y mercado', 'validacion-ideas-mercado', 'Emprendimiento', 'basico', 'Validar una idea de negocio o programa social con evidencias reales.', 'Propuesta de valor definida y primeras validaciones de mercado.', 'El alumno desarrollara un entregable de validacion de su idea.', 6, TRUE, 1),
('Modelo de negocio sostenible', 'modelo-negocio-sostenible', 'Negocios', 'basico', 'Estructurar un modelo de negocio claro y sostenible.', 'Modelo de negocio completo con clientes, ingresos y operaciones.', 'El alumno presentara su modelo de negocio estructurado.', 8, FALSE, 2)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO course_modules (course_id, title, description, video_url, module_order, is_free_preview)
SELECT id, 'Clase 1 gratuita: diagnostico de idea', 'Primera clase gratis para iniciar el proyecto.', 'https://video-demo.local/clase-1', 1, TRUE
FROM courses WHERE slug = 'validacion-ideas-mercado'
ON CONFLICT DO NOTHING;

INSERT INTO course_resources (course_id, title, resource_type, resource_url)
SELECT id, 'Plantilla de diagnostico del proyecto', 'plantilla', 'https://recursos-demo.local/plantilla-diagnostico.pdf'
FROM courses WHERE slug = 'validacion-ideas-mercado'
ON CONFLICT DO NOTHING;


INSERT INTO organizations (owner_user_id, name, organization_type, contact_email)
SELECT id, 'ONG Demo Impacto', 'ong', email FROM users WHERE email = 'empresa@suclassroom.com'
ON CONFLICT (owner_user_id) DO NOTHING;
