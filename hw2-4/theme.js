(function () {
    const root = document.documentElement;
    const btn = document.getElementById('themeToggle');
    const saved = localStorage.getItem('theme');
    if (saved) root.setAttribute('data-theme', saved);

    function current() {
        return root.getAttribute('data-theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }

    function sync() {
        btn.setAttribute('aria-pressed', current() === 'dark');
    }

    sync();

    btn.addEventListener('click', function () {
        const next = current() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        sync();
    });
})();
