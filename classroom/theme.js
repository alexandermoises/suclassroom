const themeButtons = document.querySelectorAll('.theme-toggle');

function applyTheme(theme) {
    document.body.classList.remove('cream-theme', 'dark-theme');

    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.add('cream-theme');
    }

    localStorage.setItem('classroom-theme', theme);

    themeButtons.forEach((button) => {
        const span = button.querySelector('span');
        if (span) {
            span.textContent = theme === 'dark' ? 'Oscuro' : 'Crema';
        }
        button.setAttribute('title', theme === 'dark' ? 'Modo oscuro' : 'Modo crema');
    });
}

const savedTheme = localStorage.getItem('classroom-theme') || 'cream';
applyTheme(savedTheme);

themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('dark-theme') ? 'cream' : 'dark';
        applyTheme(nextTheme);
    });
});

const homeChatWidget = document.querySelector('[data-home-chat]');

if (homeChatWidget) {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (currentPage !== 'index.html') {
        homeChatWidget.remove();
    } else {
        const closeChatButton = homeChatWidget.querySelector('.chat-close');
        const openChatButton = homeChatWidget.querySelector('.chat-open-button');

        function setChatCollapsed(isCollapsed) {
            homeChatWidget.classList.toggle('is-collapsed', isCollapsed);
            localStorage.setItem('classroom-chat-collapsed', isCollapsed ? 'true' : 'false');
        }

        const chatWasClosed = localStorage.getItem('classroom-chat-collapsed') === 'true';
        setChatCollapsed(chatWasClosed);

        if (closeChatButton) {
            closeChatButton.addEventListener('click', () => setChatCollapsed(true));
        }

        if (openChatButton) {
            openChatButton.addEventListener('click', () => setChatCollapsed(false));
        }
    }
}

