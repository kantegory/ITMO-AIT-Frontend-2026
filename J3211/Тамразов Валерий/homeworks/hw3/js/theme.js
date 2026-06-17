(function() {
    var savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    document.addEventListener('DOMContentLoaded', function() {
        var btn = document.getElementById('themeToggle');
        if (!btn) return;

        updateIcon(btn);

        btn.addEventListener('click', function() {
            var current = document.documentElement.getAttribute('data-theme');
            var next = current === 'light' ? 'dark' : 'light';

            if (next === 'dark') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', next);
            }

            localStorage.setItem('theme', next);
            updateIcon(btn);
        });
    });

    function updateIcon(btn) {
        var current = document.documentElement.getAttribute('data-theme');
        var icon = btn.querySelector('i');
        if (!icon) return;

        if (current === 'light') {
            icon.className = 'bi bi-moon-fill';
            btn.setAttribute('aria-label', 'Переключить на тёмную тему');
        } else {
            icon.className = 'bi bi-sun-fill';
            btn.setAttribute('aria-label', 'Переключить на светлую тему');
        }
    }
})();
