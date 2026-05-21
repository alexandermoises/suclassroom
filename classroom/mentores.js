(function () {
    const cursos = {
        emprendimiento: {
            nombre: 'Emprendimiento Social',
            archivo: 'curso-emprendimiento.html',
            icono: 'fa-rocket'
        },
        liderazgo: {
            nombre: 'Liderazgo Estratégico',
            archivo: 'curso-liderazgo.html',
            icono: 'fa-chess-king'
        },
        digital: {
            nombre: 'Herramientas Digitales',
            archivo: 'curso-digital.html',
            icono: 'fa-laptop-code'
        },
        marketing: {
            nombre: 'Marketing Digital',
            archivo: 'curso-marketing.html',
            icono: 'fa-bullhorn'
        },
        comunicacion: {
            nombre: 'Comunicación de Impacto',
            archivo: 'curso-comunicacion.html',
            icono: 'fa-comments'
        },
        productividad: {
            nombre: 'Productividad Personal',
            archivo: 'productividad.html',
            icono: 'fa-chart-simple'
        }
    };

    const mentores = [
        {
            id: 'mentor-ruta',
            iniciales: 'MR',
            nombre: 'Mentoría de Ruta',
            estrellas: '★★★★★',
            descripcion: 'Ayuda a ordenar metas, entregables y pasos finales del proyecto.',
            cursos: ['emprendimiento', 'liderazgo', 'productividad']
        },
        {
            id: 'especialista-impacto',
            iniciales: 'EI',
            nombre: 'Especialista de Impacto',
            estrellas: '★★★★★',
            descripcion: 'Revisa beneficiarios, indicadores, propuesta de valor e impacto social.',
            cursos: ['emprendimiento', 'marketing', 'comunicacion']
        },
        {
            id: 'tutor-digital',
            iniciales: 'TD',
            nombre: 'Tutor Digital',
            estrellas: '★★★★☆',
            descripcion: 'Acompaña el uso de herramientas, recursos digitales y presentación final.',
            cursos: ['digital', 'comunicacion', 'productividad']
        },
        {
            id: 'mentor-marketing',
            iniciales: 'MK',
            nombre: 'Mentor de Marketing',
            estrellas: '★★★★★',
            descripcion: 'Asesora campañas, contenido, marca y estrategia de difusión del proyecto.',
            cursos: ['marketing', 'emprendimiento']
        }
    ];

    const params = new URLSearchParams(window.location.search);

    function proyectoKey(cursoId) {
        return 'classroom-proyecto-final-' + cursoId;
    }

    function pagoKey(cursoId) {
        return 'classroom-asesoria-pagada-' + cursoId;
    }

    function proyectoPresentado(cursoId) {
        return localStorage.getItem(proyectoKey(cursoId)) === 'true';
    }

    function asesoriaPagada(cursoId) {
        return localStorage.getItem(pagoKey(cursoId)) === 'true';
    }

    function cursoActual(cursoId) {
        return cursos[cursoId] || cursos.emprendimiento;
    }

    function mentorActual(mentorId) {
        return mentores.find((mentor) => mentor.id === mentorId) || mentores[0];
    }

    function pagoUrl(cursoId, mentorId) {
        return 'pago-asesoria.html?curso=' + encodeURIComponent(cursoId) + '&mentor=' + encodeURIComponent(mentorId);
    }

    function badge(texto, tipo) {
        return '<span class="mentor-badge ' + tipo + '">' + texto + '</span>';
    }

    function cursosDelMentor(mentor) {
        return mentor.cursos.map((cursoId) => cursos[cursoId]?.nombre || cursoId).join(', ');
    }

    function renderMentorCard(mentor, cursoId, proyectoListo, paginaGeneral) {
        const habilitado = cursoId ? mentor.cursos.includes(cursoId) : true;
        const pagado = cursoId ? asesoriaPagada(cursoId) : false;
        const clase = habilitado ? 'mentor-enabled' : 'mentor-disabled';
        const estado = !cursoId
            ? badge('Disponible por especialidad', 'neutral')
            : habilitado
                ? badge('Habilitado para este curso', 'success')
                : badge('No habilitado para este curso', 'muted');

        let accion = '';
        if (!cursoId) {
            accion = '<a class="btn btn-light" href="cursos.html">Elegir curso primero</a>';
        } else if (!habilitado) {
            accion = '<button class="btn btn-disabled" type="button" disabled>No asesora este curso</button>';
        } else if (!proyectoListo) {
            accion = '<button class="btn btn-disabled" type="button" disabled>Presenta tu proyecto final</button>';
        } else if (pagado) {
            accion = '<a class="btn btn-primary" href="cursos.html"><i class="fa-solid fa-unlock"></i> Nuevo curso habilitado</a>';
        } else {
            accion = '<a class="btn btn-primary" href="' + pagoUrl(cursoId, mentor.id) + '"><i class="fa-solid fa-calendar-check"></i> Agendar asesoría</a>';
        }

        return '' +
            '<article class="mentor-card mentor-state-card ' + clase + '">' +
                '<div class="mentor-head">' +
                    '<div class="mentor-photo">' + mentor.iniciales + '</div>' +
                    '<div><h3>' + mentor.nombre + '</h3><div class="stars">' + mentor.estrellas + '</div></div>' +
                '</div>' +
                '<div class="mentor-status-line">' + estado + '</div>' +
                '<p>' + mentor.descripcion + '</p>' +
                '<p class="mentor-small"><b>Cursos que asesora:</b> ' + cursosDelMentor(mentor) + '</p>' +
                (paginaGeneral && cursoId && habilitado ? '<p class="mentor-small success-text"><i class="fa-solid fa-circle-check"></i> Este mentor sí puede asesorar ' + cursoActual(cursoId).nombre + '.</p>' : '') +
                '<div class="mentor-card-action">' + accion + '</div>' +
            '</article>';
    }

    function renderFlow(contenedor, cursoId) {
        const curso = cursoActual(cursoId);
        const proyectoListo = proyectoPresentado(cursoId);
        const pagado = asesoriaPagada(cursoId);
        const nuevoCurso = pagado;

        contenedor.innerHTML = '' +
            '<div class="mentor-flow-card active">' +
                '<i class="fa-solid ' + curso.icono + '"></i>' +
                '<b>Curso actual</b>' +
                '<span>' + curso.nombre + '</span>' +
            '</div>' +
            '<div class="mentor-flow-card ' + (proyectoListo ? 'done' : '') + '">' +
                '<i class="fa-solid fa-file-circle-check"></i>' +
                '<b>Proyecto final</b>' +
                '<span>' + (proyectoListo ? 'Proyecto presentado' : 'Pendiente para agendar') + '</span>' +
            '</div>' +
            '<div class="mentor-flow-card ' + (pagado ? 'done' : '') + '">' +
                '<i class="fa-solid fa-credit-card"></i>' +
                '<b>Pago de asesoría</b>' +
                '<span>' + (pagado ? 'Pago registrado' : 'Se paga al agendar') + '</span>' +
            '</div>' +
            '<div class="mentor-flow-card ' + (nuevoCurso ? 'done' : '') + '">' +
                '<i class="fa-solid fa-unlock"></i>' +
                '<b>Nuevo curso</b>' +
                '<span>' + (nuevoCurso ? 'Habilitado' : 'Bloqueado hasta pagar') + '</span>' +
            '</div>';
    }

    function renderCourseMentors(section) {
        const cursoId = section.dataset.courseId || 'emprendimiento';
        localStorage.setItem('classroom-ultimo-curso', cursoId);
        const flow = section.querySelector('[data-course-flow]');
        const lista = section.querySelector('[data-course-mentor-list]');
        const alerta = section.querySelector('[data-course-alert]');
        const proyectoListo = proyectoPresentado(cursoId);
        const pagado = asesoriaPagada(cursoId);

        if (flow) renderFlow(flow, cursoId);
        if (lista) {
            lista.innerHTML = mentores.map((mentor) => renderMentorCard(mentor, cursoId, proyectoListo, false)).join('');
        }
        if (alerta) {
            alerta.innerHTML = pagado
                ? '<div class="unlock-alert success"><i class="fa-solid fa-circle-check"></i><div><b>Pago confirmado.</b><span>Ya puedes iniciar un nuevo curso desde el catálogo.</span></div><a class="btn btn-primary" href="cursos.html">Ir a cursos</a></div>'
                : proyectoListo
                    ? '<div class="unlock-alert"><i class="fa-solid fa-calendar-check"></i><div><b>Proyecto final presentado.</b><span>Ahora puedes agendar con un mentor habilitado y luego pagar la asesoría.</span></div></div>'
                    : '<div class="unlock-alert warning"><i class="fa-solid fa-lock"></i><div><b>Agendamiento bloqueado.</b><span>Primero debes presentar tu proyecto final. Usa el botón de demo para simular esa entrega.</span></div></div>';
        }

        const botonProyecto = section.querySelector('[data-mark-project]');
        const botonReiniciar = section.querySelector('[data-reset-course-demo]');

        if (botonProyecto) {
            botonProyecto.textContent = proyectoListo ? 'Proyecto final presentado' : 'Simular presentación del proyecto final';
            botonProyecto.disabled = proyectoListo;
            botonProyecto.addEventListener('click', () => {
                localStorage.setItem(proyectoKey(cursoId), 'true');
                renderCourseMentors(section);
            }, { once: true });
        }

        if (botonReiniciar) {
            botonReiniciar.addEventListener('click', () => {
                localStorage.removeItem(proyectoKey(cursoId));
                localStorage.removeItem(pagoKey(cursoId));
                renderCourseMentors(section);
            }, { once: true });
        }
    }

    document.querySelectorAll('[data-course-mentors]').forEach(renderCourseMentors);

    const listaGeneral = document.querySelector('[data-mentors-list]');
    if (listaGeneral) {
        const cursoId = params.get('curso') || '';
        const curso = cursoActual(cursoId || 'emprendimiento');
        const proyectoListo = cursoId ? proyectoPresentado(cursoId) : false;
        const intro = document.querySelector('[data-mentors-context]');

        if (intro) {
            intro.innerHTML = cursoId
                ? '<div class="mentor-context-card"><b>Curso seleccionado:</b> ' + curso.nombre + '<br><span>Los mentores con color especial están habilitados para asesorar este curso. El botón de agendar solo se activa si el proyecto final ya fue presentado.</span></div>'
                : '<div class="mentor-context-card"><b>Vista general de mentores.</b><br><span>Entra desde un curso para ver resaltados los mentores habilitados para esa ruta.</span></div>';
        }
        listaGeneral.innerHTML = mentores.map((mentor) => renderMentorCard(mentor, cursoId, proyectoListo, true)).join('');
    }

    const paymentPage = document.querySelector('[data-payment-page]');
    if (paymentPage) {
        const cursoId = params.get('curso') || localStorage.getItem('classroom-ultimo-curso') || 'emprendimiento';
        const mentorId = params.get('mentor') || mentores.find((mentor) => mentor.cursos.includes(cursoId))?.id || mentores[0].id;
        const curso = cursoActual(cursoId);
        const mentor = mentorActual(mentorId);
        const summary = paymentPage.querySelector('[data-payment-summary]');
        const success = paymentPage.querySelector('[data-payment-success]');
        const form = paymentPage.querySelector('form');
        const proyectoListo = proyectoPresentado(cursoId);

        if (summary) {
            summary.innerHTML = '' +
                '<div class="selected-mentor-box ' + (proyectoListo ? 'ready' : 'blocked') + '">' +
                    '<b>Asesoría seleccionada</b>' +
                    '<span><i class="fa-solid fa-book-open"></i> Curso: ' + curso.nombre + '</span>' +
                    '<span><i class="fa-solid fa-user-tie"></i> Mentor: ' + mentor.nombre + '</span>' +
                    '<span><i class="fa-solid ' + (proyectoListo ? 'fa-circle-check' : 'fa-lock') + '"></i> Proyecto final: ' + (proyectoListo ? 'presentado' : 'pendiente') + '</span>' +
                '</div>';
        }

        if (form) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (!proyectoListo && submitButton) {
                submitButton.disabled = true;
                submitButton.classList.add('btn-disabled');
                submitButton.textContent = 'Presenta tu proyecto final para pagar';
            }

            form.addEventListener('submit', (event) => {
                event.preventDefault();

                if (!proyectoPresentado(cursoId)) {
                    alert('Primero debes presentar tu proyecto final para poder agendar y pagar la asesoría.');
                    return;
                }

                localStorage.setItem(pagoKey(cursoId), 'true');
                localStorage.setItem('classroom-nuevo-curso-habilitado', 'true');

                if (success) {
                    success.hidden = false;
                    success.innerHTML = '<i class="fa-solid fa-circle-check"></i><div><b>Pago de ejemplo registrado.</b><span>La asesoría quedó confirmada y ahora se habilitó iniciar un nuevo curso.</span></div><a class="btn btn-primary" href="cursos.html">Iniciar nuevo curso</a>';
                }

                const mensaje = encodeURIComponent('Hola, ya realicé el pago de mi asesoría para el curso ' + curso.nombre + ' con ' + mentor.nombre + '.');
                window.open('https://wa.me/51999999999?text=' + mensaje, '_blank');
            });
        }
    }

    const bannerCursos = document.querySelector('[data-new-course-banner]');
    if (bannerCursos) {
        const cursoPagado = Object.keys(cursos).find((cursoId) => asesoriaPagada(cursoId));
        if (cursoPagado) {
            bannerCursos.innerHTML = '<div class="unlock-alert success"><i class="fa-solid fa-unlock"></i><div><b>Nuevo curso habilitado.</b><span>Ya realizaste el pago de asesoría en ' + cursoActual(cursoPagado).nombre + '. Puedes iniciar otra ruta gratis.</span></div></div>';
        }
    }
}());
