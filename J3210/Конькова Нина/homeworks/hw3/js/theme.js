(function () {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);

    document.addEventListener('DOMContentLoaded', function () {
        const btn = document.getElementById('themeToggle');
        if (!btn) return;

        updateIcon(btn, document.documentElement.getAttribute('data-theme'));

        btn.addEventListener('click', function () {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateIcon(btn, next);
        });
    });

    function updateIcon(btn, theme) {
        const icon = btn.querySelector('i');
        if (!icon) return;
        if (theme === 'dark') {
            icon.className = 'bi bi-sun-fill';
            btn.setAttribute('aria-label', 'Switch to light theme');
        } else {
            icon.className = 'bi bi-moon-fill';
            btn.setAttribute('aria-label', 'Switch to dark theme');
        }
    }
})();