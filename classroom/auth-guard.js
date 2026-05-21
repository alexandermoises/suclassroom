(function () {
    const protectedPage = document.body.dataset.protected === 'true';
    if (!protectedPage) return;

    const allowed = (document.body.dataset.allowedRoles || '')
        .split(',')
        .map((role) => role.trim())
        .filter(Boolean);

    const currentRole = localStorage.getItem('classroom-current-role');

    if (!currentRole || !allowed.includes(currentRole)) {
        alert('Acceso restringido. Inicia sesion con una cuenta autorizada.');
        window.location.href = 'login.html';
        return;
    }
})();
