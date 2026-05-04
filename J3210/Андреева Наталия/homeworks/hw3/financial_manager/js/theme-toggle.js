document.addEventListener("DOMContentLoaded", () => {
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    if (!document.getElementById('theme-toggle')) {
        const btn = document.createElement('button');
        btn.id = 'theme-toggle';
        btn.innerText = currentTheme === 'dark' ? 'ТЕМА: ТЕМНАЯ' : 'ТЕМА: СВЕТЛАЯ';

        const navContainer = document.querySelector('.navbar .d-flex.align-items-center.ms-auto');

        if (navContainer) {
            btn.className = 'btn theme-toggle-btn btn-sm fw-bold me-3';
            const logoutBtn = navContainer.querySelector('.btn-logout, .btn-outline-light');
            if (logoutBtn) {
                navContainer.insertBefore(btn, logoutBtn);
            } else {
                navContainer.appendChild(btn);
            }
        } else {
            btn.className = 'btn theme-toggle-btn btn-sm fw-bold floating-theme-btn';
            document.body.appendChild(btn);
        }

        btn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            btn.innerText = isDark ? 'ТЕМА: ТЕМНАЯ' : 'ТЕМА: СВЕТЛАЯ';
        });
    }
});