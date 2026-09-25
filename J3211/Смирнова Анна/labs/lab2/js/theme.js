(function() {
    const savedTheme = localStorage.getItem('app-theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('data-bs-theme', savedTheme);

    window.applyTheme = function(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('app-theme', theme);
        
        const themeIcon = document.getElementById('theme-icon');
        const themeText = document.getElementById('theme-text');
        if (themeIcon && themeText) {
            if (theme === 'dark') {
                themeIcon.className = 'bi bi-sun me-2 text-warning';
                themeText.innerText = 'Светлая тема';
            } else {
                themeIcon.className = 'bi bi-moon-stars me-2';
                themeText.innerText = 'Тёмная тема';
            }
        }

        try {
            if (typeof renderDashboardCharts === 'function' && document.getElementById('balanceChart')) {
                renderDashboardCharts();
            }
            if (typeof renderReportsCharts === 'function' && document.getElementById('reportsChart')) {
                renderReportsCharts();
            }
        } catch (e) {}
    };

    document.addEventListener('DOMContentLoaded', () => {
        applyTheme(document.documentElement.getAttribute('data-theme'));

        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const current = document.documentElement.getAttribute('data-theme');
                applyTheme(current === 'dark' ? 'light' : 'dark');
            });
        }
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        applyTheme(e.matches ? 'dark' : 'light');
        localStorage.removeItem('app-theme');
    });
})();