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
