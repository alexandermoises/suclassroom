# Checklist para revisar el formulario del profesor

Abre `index.html` para revisar lo publico. Para `requisitos-formulario.html`, primero inicia sesion como administrador; no debe estar disponible para cualquier persona.

## Requisitos implementados

- Nombre del proyecto: SUClassroom.
- Proposito: convertir conocimiento en ejecucion empresarial mediante asesoria estrategica y validacion de proyectos reales.
- Registro obligatorio por rol.
- Acceso por rol para Alumno, Mentor, Administrador y Empresa/ONG.
- Login con redireccion a panel diferente por rol.
- Panel de alumno: curso inicial gratis, proyecto final, progreso y asesoria pagada.
- Panel de mentor: proyectos enviados, feedback, aprobacion/rechazo y agenda de asesorias.
- Panel administrador: usuarios, cursos, pagos, reportes, criterios de evaluacion y panel institucional.
- Panel empresa/ONG: grupos, participantes, avance, reportes de impacto y mentorias institucionales.
- Flujo MVP: aprender -> aplicar -> entregar -> recibir feedback -> mejorar -> pagar asesoria -> desbloquear siguiente curso.
- Cursos progresivos y desbloqueables segun avance y proyecto aprobado.
- Modulos con videos, guias, plantillas y recursos.
- Sistema de envio y evaluacion de proyectos.
- Pago despues de enviar proyecto. El pago desbloquea revision + asesoria y luego el siguiente curso.
- Soporte por WhatsApp, chat y correo.
- Boton visible para tema Crema/Negro.
- Botones visibles de WhatsApp, Iniciar sesion y Crear cuenta.
- Sin botones de Sprint/Spring Mentores en el menu principal.

## Paginas nuevas o importantes

- `requisitos-formulario.html`: resumen completo del formulario del profesor.
- `registro.html`: crea cuenta para alumno, mentor, administrador y empresa/ONG.
- `login.html`: inicia sesion segun rol.
- `panel-alumno.html`: panel del alumno.
- `panel-mentor.html`: panel del mentor.
- `panel-admin.html`: panel del administrador.
- `panel-empresa.html`: panel institucional B2B.

## Cambios de seguridad y base de datos

- [x] Acceso restringido a requisitos: solo administrador.
- [x] Registro publico solo para alumno, mentor y administrador.
- [x] Codigo administrativo demo para crear cuenta admin: `ADMIN-2026`.
- [x] Base de datos PostgreSQL en `database/postgresql_schema.sql`.
- [x] Datos de prueba en `database/seed_data.sql`.
- [x] Backend demo con PostgreSQL en `backend-postgresql/`.


## Verificacion final de roles y cuentas
- [x] Alumno tiene registro, login y `panel-alumno.html`.
- [x] Mentor tiene registro, login y `panel-mentor.html`.
- [x] Administrador tiene registro con codigo `ADMIN-2026`, login y `panel-admin.html`.
- [x] Empresa/ONG tiene registro con codigo `ORG-2026`, login y `panel-empresa.html`.
- [x] `requisitos-formulario.html` solo permite rol administrador.
- [x] La base de datos PostgreSQL tiene tabla `users` con roles separados y tablas relacionadas para cada flujo.
