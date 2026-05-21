(function () {
    const roleSelect = document.querySelector('[data-role-select]');
    const roleCards = document.querySelectorAll('[data-role-card]');
    const roleFields = document.querySelectorAll('[data-role-fields]');
    const registerForm = document.querySelector('[data-register-form]');
    const loginForm = document.querySelector('[data-login-form]');

    const panels = {
        alumno: 'panel-alumno.html',
        mentor: 'panel-mentor.html',
        administrador: 'panel-admin.html',
        empresa_ong: 'panel-empresa.html'
    };

    const roleMessages = {
        alumno: 'Registro completado. Entrarás al panel de alumno para ver cursos, mentores, proyecto y asesoría.',
        mentor: 'Registro completado. Entrarás al panel de mentor para revisar proyectos, feedback y asesorías.',
        administrador: 'Registro completado. Entrarás al panel de administrador para gestionar usuarios, cursos, pagos, reportes y requisitos internos.',
        empresa_ong: 'Registro completado. Entrarás al panel de empresa/ONG para monitorear grupos, avance, reportes e impacto.'
    };

    function setRole(role) {
        if (!panels[role]) role = 'alumno';
        if (roleSelect) roleSelect.value = role;

        roleCards.forEach((card) => {
            card.classList.toggle('active', card.dataset.roleCard === role);
        });

        roleFields.forEach((field) => {
            field.classList.toggle('is-visible', field.dataset.roleFields === role);
        });
    }

    if (roleSelect) {
        roleSelect.addEventListener('change', () => setRole(roleSelect.value));
        setRole(roleSelect.value);
    }

    roleCards.forEach((card) => {
        card.addEventListener('click', () => setRole(card.dataset.roleCard));
    });

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const role = roleSelect ? roleSelect.value : 'alumno';
            const name = registerForm.querySelector('[name="nombre"]')?.value || 'Usuario';
            const email = registerForm.querySelector('[name="correo"]')?.value || '';
            const password = registerForm.querySelector('[name="password"]')?.value || '';
            const confirm = registerForm.querySelector('[name="confirmar"]')?.value || '';
            const adminCode = registerForm.querySelector('[name="codigo_admin"]')?.value || '';
            const orgCode = registerForm.querySelector('[name="codigo_empresa"]')?.value || '';

            if (!panels[role]) {
                alert('Solo se permite registrar alumno, mentor, administrador o empresa/ONG.');
                return;
            }

            if (password && confirm && password !== confirm) {
                alert('Las contrasenas no coinciden.');
                return;
            }

            // Reglas demo: en un sistema real estas validaciones se hacen en el backend con PostgreSQL.
            if (role === 'administrador' && adminCode.trim() !== 'ADMIN-2026') {
                alert('Para crear una cuenta de administrador necesitas el codigo administrativo correcto.');
                return;
            }

            if (role === 'empresa_ong' && orgCode.trim() !== 'ORG-2026') {
                alert('Para crear una cuenta de empresa/ONG necesitas un codigo institucional.');
                return;
            }

            localStorage.setItem('classroom-current-role', role);
            localStorage.setItem('classroom-current-name', name);
            localStorage.setItem('classroom-current-email', email);

            alert(roleMessages[role]);
            window.location.href = panels[role];
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const role = roleSelect ? roleSelect.value : 'alumno';

            if (!panels[role]) {
                alert('Selecciona alumno, mentor, administrador o empresa/ONG.');
                return;
            }

            localStorage.setItem('classroom-current-role', role);
            window.location.href = panels[role];
        });
    }
})();
