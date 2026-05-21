# CLASSROOM - Sitio web estilo plataforma de cursos

Proyecto listo para abrir en Visual Studio Code.

## Cómo usarlo

1. Descomprime `classroom_crehana_style.zip`.
2. Abre la carpeta `classroom_crehana_style` en Visual Studio Code.
3. Abre `index.html`.
4. Usa la extensión **Live Server** para navegar entre páginas.

## Páginas incluidas

- `index.html`: página principal.
- `cursos.html`: catálogo de cursos.
- `asesores.html`: página de asesores.
- `productividad.html`: archivo conservado, pero ya no aparece en el inicio ni en el menú superior.
- `curso-emprendimiento.html`: detalle de curso.
- `curso-liderazgo.html`: detalle de curso.
- `curso-digital.html`: detalle de curso.
- `registro.html`: archivo conservado, pero se quitó del menú superior.
- `login.html`: página de ingreso.
- `styles.css`: estilos generales.

## Enlaces internos

Los botones y tarjetas usan enlaces normales, por ejemplo:

```html
<a href="cursos.html">Cursos</a>
<a href="curso-emprendimiento.html">Ver curso</a>
<a href="registro.html">Comenzar</a>
```

Así, cuando haces clic, el navegador abre otra página.

## Cambios solicitados

- Se agregó el botón **Inicio** en el menú superior.
- Se quitó **Registrarme** del menú superior.
- Se quitó **Productividad** del menú superior.
- Se quitó **Productividad** de la página principal.

- `nosotros.html`: página de Nosotros con la sección Nuestra historia.

## Cambio nuevo

- Se agregó **Nosotros** en el menú superior.
- Al hacer clic en **Nosotros**, abre `nosotros.html` con la sección **Nuestra historia**.


## Cambios finales agregados

- Se agregó **Mentores** en el menú superior.
- Se creó `mentores.html`.
- Se agregó botón para cambiar tema entre **Crema** y **Oscuro**.
- Se creó `theme.js` para guardar el tema elegido en el navegador.
- Se agregaron precios visibles en los cursos:
  - Emprendimiento Social: GRATIS
  - Liderazgo Estratégico: GRATIS
  - Herramientas Digitales: GRATIS
  - Productividad Personal: S/ 35
  - Asesoría de Proyecto: S/ 70
  - Comunicación de Impacto: S/ 45


## Correcciones solicitadas

- Se quitó **Mentores** del menú superior.
- Se eliminó la página `mentores.html`.
- Se quitó el texto **Emprendimiento Social desde cero** del panel principal.
- Se quitó la tarjeta de asesores/mentores activos del inicio y se reemplazó por una tarjeta de aprendizaje guiado.
- Se dejó un solo botón para cambiar entre tema **Crema** y **Oscuro**, ubicado al final del menú superior.


## Corrección adicional

- Se quitaron los porcentajes visibles del panel principal de aprendizaje.


## Corrección de cursos

- Se cambió el curso **Productividad Personal** por **Marketing Digital**.
- Se ajustaron las tarjetas para que todas tengan la misma altura.
- Se alinearon los precios y el botón **Comenzar gratis** para que se vean como las tarjetas superiores.
- El curso **Marketing Digital** ahora se muestra como **GRATIS**.


## Actualización: detalle para todos los cursos

Ahora todos los cursos del catálogo abren una página de detalle con el mismo diseño:
- Portada del curso.
- Contenido del curso.
- Lista de clases.
- Costo del curso: GRATIS.
- Certificado.
- Asesoría.
- Proyecto final.
- Botones para ver más cursos o volver.

Páginas nuevas:
- `curso-marketing.html`
- `curso-asesoria.html`
- `curso-comunicacion.html`


## Actualización: WhatsApp y chat inferior

- Se agregó el botón verde **Habla con Sales** en la parte superior.
- Se agregó el botón **Agenda un demo**.
- Se agregó un cuadro flotante inferior tipo chat con mensaje y opciones.
- El enlace de WhatsApp usa este número de ejemplo: `51999999999`.
  Puedes cambiarlo en los archivos HTML buscando `https://wa.me/51999999999`.


## Corrección: chat solo en inicio

- Las opciones del chat flotante ahora aparecen únicamente en `index.html`.
- Se quitaron de cursos, detalles de cursos, nosotros, asesores, login y demás páginas.


## Actualización: página Agenda Demo

- Se creó `agenda-demo.html`.
- El botón **Agenda un demo** ahora abre esa página.
- La página tiene diseño dividido: sección morada promocional a la izquierda y formulario a la derecha.


## Actualización: cursos gratis + asesoría pagada

- Todos los cursos del catálogo se muestran como **GRATIS**.
- Al señalar un curso aparece un aviso indicando que el curso es gratis.
- Si el alumno quiere hablar con un asesor, debe pagar la asesoría en `pago-asesoria.html`.


## Flujo agregado de mentores

Se agregó una sección de **Mentores del curso** dentro de cada curso. La página muestra todos los mentores y resalta con color especial a quienes están habilitados para asesorar el curso actual.

Regla aplicada en el prototipo:

1. El alumno lleva un curso gratis.
2. El botón de agendar asesoría está bloqueado mientras no presente su proyecto final.
3. Para la demostración, el botón **Simular presentación del proyecto final** marca el proyecto como presentado.
4. Luego se habilita **Agendar asesoría** solo en los mentores permitidos para ese curso.
5. Al pagar la asesoría, se confirma la sesión y se habilita iniciar un nuevo curso.

Este flujo está implementado con `mentores.js` y `localStorage` para que funcione como demostración sin backend.


## Actualización: funcionalidades indispensables del sistema

Se agregó en `index.html` una nueva sección llamada **Funcionalidades indispensables**, basada en lo solicitado por el profesor. Incluye:

- Cursos progresivos y desbloqueables.
- Módulos con videos, guías y plantillas.
- Gestión de proyectos y entregables.
- Envío y evaluación de proyectos por mentores.
- Retroalimentación escrita y asesorías.
- Agenda de mentorías.
- Dashboard de progreso.
- Roles diferenciados: estudiantes, mentores, administradores, empresas y ONGs.
- Panel institucional B2B.
- Reportes y métricas de impacto.
- Sistema de pagos o simulación de pagos.
- Repositorio de recursos y plantillas.

También se actualizó el menú superior para mostrar **Iniciar sesión**, **Crear cuenta**, **WhatsApp** y **Asesorías** de forma más clara.

## Acceso por rol agregado

Se agregó el flujo de creación e inicio de sesión separado para:

- **Alumno:** crea cuenta, indica si tiene empresa, emprendimiento o idea de proyecto, escoge curso y accede a la primera clase gratis. Para asesoría debe presentar proyecto final y pagar.
- **Mentor:** crea cuenta para revisar proyectos, dar retroalimentación y atender asesorías pagadas.
- **Administrador:** tiene su propia cuenta para gestionar alumnos, mentores, cursos, pagos, reportes y métricas.

Archivos agregados o modificados:

- `registro.html`: formulario con selector de rol: alumno, mentor y administrador.
- `login.html`: inicio de sesión con selector de rol.
- `panel-alumno.html`: panel de alumno.
- `panel-mentor.html`: panel de mentor.
- `panel-admin.html`: panel de administrador.
- `cuentas.js`: lógica demo para mostrar campos según rol y redirigir al panel correcto.


## Actualización basada en el formulario del profesor

Se incorporaron los puntos principales del formulario "Plataforma E-learning para emprendedores":

- Nombre visible: SUClassroom.
- Propósito: convertir conocimiento en ejecución empresarial mediante asesoría estratégica y validación de proyectos reales.
- Acceso por rol para alumno, mentor, administrador y empresa/ONG.
- Registro obligatorio con selección de rol.
- El alumno registra si tiene empresa, emprendimiento, programa social o idea de proyecto.
- Primer curso/clase gratis y avance condicionado a entregables.
- Proyecto práctico obligatorio por curso.
- Evaluación por mentor con feedback accionable.
- Pago después de enviar proyecto; la revisión + asesoría desbloquea el siguiente curso.
- Panel institucional B2B para empresas/ONGs.
- Dashboard de avance, reportes, métricas de impacto, pagos y soporte por WhatsApp/chat/email.
- Nueva página `requisitos-formulario.html` para revisar todos los requisitos.
- Nuevo `panel-empresa.html` para cuenta institucional.


## Actualizacion: acceso y PostgreSQL

- La pagina `requisitos-formulario.html` ya no aparece en el menu publico.
- Solo el administrador puede entrar a requisitos internos despues de iniciar sesion.
- El registro publico permite cuatro tipos de cuenta: alumno, mentor, administrador y empresa/ONG. Para administrador se pide codigo `ADMIN-2026` y para empresa/ONG `ORG-2026`.
- Para crear administrador en la demo se usa el codigo `ADMIN-2026`.
- La base de datos PostgreSQL esta en la carpeta `database/`.
- Tambien se incluye un ejemplo de backend Node.js + PostgreSQL en `backend-postgresql/`.

## Actualización final: demostrar que funciona + BD PostgreSQL

Se agregó `login.html y registro.html` para que el profesor vea rápidamente que el sistema cumple lo principal:

- Acceso por rol por rol: alumno, mentor, administrador y empresa/ONG.
- Cada rol entra a su propio panel protegido.
- El alumno inicia con primera clase gratis, registra su proyecto y luego paga asesoría.
- El mentor revisa proyectos y brinda retroalimentación.
- El administrador gestiona usuarios, cursos, pagos, reportes y requisitos internos.
- Empresa/ONG tiene panel institucional B2B para grupos, avance e impacto.
- Hay botón visible para descargar la base de datos PostgreSQL.

Base de datos principal:

```text
database/BD_SUCLASSROOM_POSTGRESQL.sql
```

Instrucciones:

```bash
createdb suclassroom
psql -d suclassroom -f database/BD_SUCLASSROOM_POSTGRESQL.sql
```

Backend con PostgreSQL:

```bash
cd backend-postgresql
npm install
cp .env.example .env
npm start
```

Página recomendada para iniciar la demostración:

```text
login.html y registro.html
```
