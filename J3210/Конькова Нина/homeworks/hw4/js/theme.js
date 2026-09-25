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
        const use = btn.querySelector('use');
        if (!use) return;
        if (theme === 'dark') {
            use.setAttribute('href', 'img/sprite.svg#icon-sun');
            btn.setAttribute('aria-label', 'Switch to light theme');
        } else {
            use.setAttribute('href', 'img/sprite.svg#icon-moon');
            btn.setAttribute('aria-label', 'Switch to dark theme');
        }
    }
})();