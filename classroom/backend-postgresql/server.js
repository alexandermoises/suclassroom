const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const PORT = process.env.PORT || 3000;
const ADMIN_CODE = process.env.ADMIN_REGISTER_CODE || 'ADMIN-2026';
const ORG_CODE = process.env.ORG_REGISTER_CODE || 'ORG-2026';

app.use(cors());
app.use(express.json());

function validRole(role) {
  return ['alumno', 'mentor', 'administrador', 'empresa_ong'].includes(role);
}

function requireRole(req, res, allowedRoles) {
  const role = req.headers['x-user-role'];
  if (!allowedRoles.includes(role)) {
    res.status(403).json({ error: `Acceso denegado. Roles permitidos: ${allowedRoles.join(', ')}` });
    return false;
  }
  return true;
}

function fakeHash(password) {
  // Demo. En produccion usa bcrypt o argon2.
  return `demo_hash_${Buffer.from(password || '').toString('base64')}`;
}

app.get('/api/health', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS now');
    res.json({ ok: true, message: 'Backend conectado a PostgreSQL', database_time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'No se pudo conectar a PostgreSQL', detail: error.message });
  }
});

app.get('/api/roles', (_req, res) => {
  res.json([
    { role: 'alumno', panel: 'panel-alumno.html', description: 'Cursos, proyecto, progreso y asesoria pagada.' },
    { role: 'mentor', panel: 'panel-mentor.html', description: 'Revision de proyectos, feedback y agenda.' },
    { role: 'administrador', panel: 'panel-admin.html', description: 'Gestion, reportes, pagos y requisitos internos.' },
    { role: 'empresa_ong', panel: 'panel-empresa.html', description: 'Panel B2B para grupos, impacto y avance institucional.' }
  ]);
});

app.post('/api/auth/register', async (req, res) => {
  const {
    full_name,
    email,
    password,
    role,
    admin_code,
    org_code,
    project_stage,
    project_name,
    project_description,
    specialty,
    years_experience,
    availability,
    area,
    organization_name,
    organization_type
  } = req.body;

  if (!full_name || !email || !password || !validRole(role)) {
    return res.status(400).json({ error: 'Datos incompletos o rol no permitido.' });
  }

  if (role === 'administrador' && admin_code !== ADMIN_CODE) {
    return res.status(403).json({ error: 'Codigo administrativo incorrecto.' });
  }

  if (role === 'empresa_ong' && org_code !== ORG_CODE) {
    return res.status(403).json({ error: 'Codigo institucional incorrecto.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userResult = await client.query(
      `INSERT INTO users (full_name, email, password_hash, role, email_verified)
       VALUES ($1, $2, $3, $4, TRUE)
       RETURNING id, full_name, email, role`,
      [full_name, email, fakeHash(password), role]
    );
    const user = userResult.rows[0];

    if (role === 'alumno') {
      await client.query(
        `INSERT INTO students (user_id, project_stage, project_name, project_description)
         VALUES ($1, COALESCE($2, 'idea'), $3, $4)`,
        [user.id, project_stage, project_name || null, project_description || null]
      );
    }

    if (role === 'mentor') {
      await client.query(
        `INSERT INTO mentors (user_id, specialty, years_experience, availability)
         VALUES ($1, $2, COALESCE($3, 0), $4)`,
        [user.id, specialty || 'Emprendimiento', years_experience || 0, availability || null]
      );
    }

    if (role === 'administrador') {
      await client.query(
        `INSERT INTO administrators (user_id, admin_code, area)
         VALUES ($1, $2, $3)`,
        [user.id, admin_code, area || 'General']
      );
    }

    if (role === 'empresa_ong') {
      await client.query(
        `INSERT INTO organizations (owner_user_id, name, organization_type, contact_email)
         VALUES ($1, $2, $3, $4)`,
        [user.id, organization_name || full_name, organization_type || 'empresa', email]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Cuenta creada correctamente.', user });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') return res.status(409).json({ error: 'El correo ya existe.' });
    res.status(500).json({ error: 'Error al registrar usuario.', detail: error.message });
  } finally {
    client.release();
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, role } = req.body;
  if (!email || !validRole(role)) return res.status(400).json({ error: 'Correo y rol son obligatorios.' });

  const result = await pool.query(
    'SELECT id, full_name, email, role FROM users WHERE email = $1 AND role = $2 AND is_active = TRUE',
    [email, role]
  );

  if (result.rowCount === 0) return res.status(401).json({ error: 'Cuenta no encontrada para ese rol.' });
  const user = result.rows[0];
  const panels = {
    alumno: 'panel-alumno.html',
    mentor: 'panel-mentor.html',
    administrador: 'panel-admin.html',
    empresa_ong: 'panel-empresa.html'
  };
  res.json({ message: 'Login demo correcto.', user, redirect_to: panels[user.role] });
});

app.get('/api/courses', async (_req, res) => {
  const result = await pool.query(
    `SELECT c.id, c.title, c.slug, c.category, c.level, c.objective, c.expected_results,
            c.project_description, c.estimated_hours, c.is_initial_free, c.order_number,
            COUNT(m.id) AS modules_count
     FROM courses c
     LEFT JOIN course_modules m ON m.course_id = c.id
     WHERE c.is_published = TRUE
     GROUP BY c.id
     ORDER BY c.order_number`
  );
  res.json(result.rows);
});

app.get('/api/courses/:courseId/modules', async (req, res) => {
  const result = await pool.query(
    `SELECT id, title, description, video_url, module_order, is_free_preview
     FROM course_modules WHERE course_id = $1 ORDER BY module_order`,
    [req.params.courseId]
  );
  res.json(result.rows);
});

app.post('/api/enrollments', async (req, res) => {
  if (!requireRole(req, res, ['alumno'])) return;
  const { student_id, course_id } = req.body;
  if (!student_id || !course_id) return res.status(400).json({ error: 'student_id y course_id son obligatorios.' });

  const result = await pool.query(
    `INSERT INTO enrollments (student_id, course_id, status, progress_percent, first_class_unlocked)
     VALUES ($1, $2, 'gratis_activo', 0, TRUE)
     ON CONFLICT (student_id, course_id) DO UPDATE SET first_class_unlocked = TRUE
     RETURNING *`,
    [student_id, course_id]
  );
  res.status(201).json({ message: 'Alumno inscrito. Primera clase gratis habilitada.', enrollment: result.rows[0] });
});

app.post('/api/deliverables', async (req, res) => {
  if (!requireRole(req, res, ['alumno'])) return;
  const { enrollment_id, title, content, file_url, external_link } = req.body;
  if (!enrollment_id || !title) return res.status(400).json({ error: 'enrollment_id y title son obligatorios.' });

  const result = await pool.query(
    `INSERT INTO deliverables (enrollment_id, title, content, file_url, external_link, status, submitted_at)
     VALUES ($1, $2, $3, $4, $5, 'enviado', NOW()) RETURNING *`,
    [enrollment_id, title, content || null, file_url || null, external_link || null]
  );

  await pool.query(`UPDATE enrollments SET status = 'proyecto_enviado', progress_percent = GREATEST(progress_percent, 70) WHERE id = $1`, [enrollment_id]);
  res.status(201).json({ message: 'Proyecto enviado para revision del mentor.', deliverable: result.rows[0] });
});

app.post('/api/reviews', async (req, res) => {
  if (!requireRole(req, res, ['mentor'])) return;
  const { deliverable_id, mentor_id, score, status, feedback, next_steps } = req.body;
  if (!deliverable_id || !mentor_id || !status || !feedback) {
    return res.status(400).json({ error: 'deliverable_id, mentor_id, status y feedback son obligatorios.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const review = await client.query(
      `INSERT INTO project_reviews (deliverable_id, mentor_id, score, status, feedback, next_steps)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [deliverable_id, mentor_id, score || null, status, feedback, next_steps || null]
    );
    await client.query(`UPDATE deliverables SET status = $1, updated_at = NOW() WHERE id = $2`, [status, deliverable_id]);
    await client.query(
      `UPDATE enrollments e SET status = CASE WHEN $1 = 'aprobado' THEN 'feedback_recibido' ELSE 'en_progreso' END,
       progress_percent = CASE WHEN $1 = 'aprobado' THEN GREATEST(e.progress_percent, 85) ELSE e.progress_percent END
       FROM deliverables d WHERE d.enrollment_id = e.id AND d.id = $2`,
      [status, deliverable_id]
    );
    await client.query('COMMIT');
    res.status(201).json({ message: 'Feedback registrado por el mentor.', review: review.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'No se pudo registrar la revision.', detail: error.message });
  } finally {
    client.release();
  }
});

app.post('/api/payments/simulate', async (req, res) => {
  if (!requireRole(req, res, ['alumno'])) return;
  const { student_id, course_id, amount } = req.body;
  if (!student_id || !amount) return res.status(400).json({ error: 'student_id y amount son obligatorios.' });

  const result = await pool.query(
    `INSERT INTO payments (student_id, course_id, amount, status, transaction_code, paid_at)
     VALUES ($1, $2, $3, 'pagado', 'CULQI-DEMO-' || floor(random() * 1000000)::text, NOW())
     RETURNING *`,
    [student_id, course_id || null, amount]
  );
  res.status(201).json({ message: 'Pago simulado realizado. Asesoria habilitada.', payment: result.rows[0] });
});

app.post('/api/advisories', async (req, res) => {
  if (!requireRole(req, res, ['alumno'])) return;
  const { student_id, mentor_id, course_id, payment_id, scheduled_at, meeting_url } = req.body;
  if (!student_id || !mentor_id || !course_id || !payment_id || !scheduled_at) {
    return res.status(400).json({ error: 'student_id, mentor_id, course_id, payment_id y scheduled_at son obligatorios.' });
  }

  const paid = await pool.query('SELECT id FROM payments WHERE id = $1 AND status = $2', [payment_id, 'pagado']);
  if (paid.rowCount === 0) return res.status(402).json({ error: 'La asesoria requiere pago aprobado.' });

  const result = await pool.query(
    `INSERT INTO advisory_sessions (student_id, mentor_id, course_id, payment_id, scheduled_at, meeting_url, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'confirmada') RETURNING *`,
    [student_id, mentor_id, course_id, payment_id, scheduled_at, meeting_url || 'https://meet.google.com/demo-suclassroom']
  );
  res.status(201).json({ message: 'Asesoria confirmada con pago aprobado.', advisory: result.rows[0] });
});

app.get('/api/admin/metrics', async (req, res) => {
  if (!requireRole(req, res, ['administrador'])) return;
  const result = await pool.query('SELECT * FROM admin_dashboard_metrics');
  res.json(result.rows[0]);
});

app.get('/api/admin/requirements-summary', async (req, res) => {
  if (!requireRole(req, res, ['administrador'])) return;
  res.json({
    message: 'Resumen privado de requisitos. Solo administrador.',
    requirements: [
      'Cursos progresivos y desbloqueables',
      'Modulos con videos, guias y plantillas',
      'Gestion y envio de proyectos',
      'Evaluacion por mentores y feedback accionable',
      'Agenda y pago de asesorias',
      'Dashboard de progreso',
      'Roles y cuentas diferenciadas',
      'Panel institucional B2B',
      'Reportes y metricas de impacto',
      'Repositorio de recursos'
    ]
  });
});

app.get('/api/organization/dashboard', async (req, res) => {
  if (!requireRole(req, res, ['empresa_ong', 'administrador'])) return;
  const result = await pool.query(
    `SELECT o.id, o.name, o.organization_type,
      COUNT(DISTINCT gs.student_id) AS participantes,
      COUNT(DISTINCT e.id) AS inscripciones,
      COUNT(DISTINCT d.id) FILTER (WHERE d.status = 'aprobado') AS proyectos_aprobados
     FROM organizations o
     LEFT JOIN organization_groups g ON g.organization_id = o.id
     LEFT JOIN group_students gs ON gs.group_id = g.id
     LEFT JOIN enrollments e ON e.student_id = gs.student_id
     LEFT JOIN deliverables d ON d.enrollment_id = e.id
     GROUP BY o.id
     ORDER BY o.created_at DESC`
  );
  res.json(result.rows);
});

app.listen(PORT, () => {
  console.log(`Servidor SUClassroom PostgreSQL en http://localhost:${PORT}`);
});
