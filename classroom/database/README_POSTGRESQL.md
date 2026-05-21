# Base de datos PostgreSQL - SUClassroom

Esta carpeta contiene la base de datos solicitada para el proyecto. Está pensada para demostrar que la plataforma tiene cuentas por rol, cursos progresivos, proyecto, evaluación por mentor, pago de asesoría, panel empresa/ONG y métricas administrativas.

## Archivo principal para entregar

- `BD_SUCLASSROOM_POSTGRESQL.sql`: script completo para importar en PostgreSQL. Incluye esquema y datos demo.

## Archivos separados

- `postgresql_schema.sql`: crea tipos, tablas, relaciones, restricciones, índices y vista de métricas.
- `seed_data.sql`: inserta datos demo para probar administrador, alumno, mentor, empresa/ONG, cursos, módulos y recursos.

## Cómo importar la BD

```bash
createdb suclassroom
psql -d suclassroom -f database/BD_SUCLASSROOM_POSTGRESQL.sql
```

También puedes cargarlo separado:

```bash
psql -d suclassroom -f database/postgresql_schema.sql
psql -d suclassroom -f database/seed_data.sql
```

## Cómo levantar el backend PostgreSQL

```bash
cd backend-postgresql
npm install
cp .env.example .env
npm start
```

En `.env` configura:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/suclassroom
PORT=3000
ADMIN_REGISTER_CODE=ADMIN-2026
ORG_REGISTER_CODE=ORG-2026
```

## Tablas principales

- `users`: cuenta base con rol `alumno`, `mentor`, `administrador` o `empresa_ong`.
- `students`: datos del alumno y su empresa, emprendimiento o idea de proyecto.
- `mentors`: especialidad, experiencia y disponibilidad del mentor.
- `administrators`: cuenta administrativa para gestionar el sistema.
- `organizations`: empresas, ONGs o instituciones para el panel B2B.
- `organization_groups`: grupos o cohortes institucionales.
- `courses`: cursos progresivos, con primera clase gratuita.
- `course_modules`: módulos, videos y clases.
- `course_resources`: guías, plantillas y recursos.
- `enrollments`: inscripción y progreso del alumno.
- `deliverables`: proyectos o entregables enviados por el alumno.
- `project_reviews`: revisión, evaluación y retroalimentación del mentor.
- `payments`: pago o simulación de pago de asesorías.
- `advisory_sessions`: asesorías agendadas con pago asociado.
- `support_requests`: soporte por email, chat o WhatsApp.

## Regla de acceso por rol

- Alumno: solo entra a `panel-alumno.html`.
- Mentor: solo entra a `panel-mentor.html`.
- Administrador: entra a `panel-admin.html` y puede ver `requisitos-formulario.html`.
- Empresa/ONG: entra a `panel-empresa.html`.

En el prototipo esto se protege con `auth-guard.js`. En un sistema real se debe validar también en backend con sesión o JWT y consultando `users.role`.

## Página para demostrar que funciona

Abre `login.html y registro.html`. Ahí se puede probar rápidamente:

1. Acceso por rol.
2. Panel del alumno.
3. Panel del mentor.
4. Panel del administrador.
5. Panel empresa/ONG.
6. Descarga del SQL PostgreSQL.
