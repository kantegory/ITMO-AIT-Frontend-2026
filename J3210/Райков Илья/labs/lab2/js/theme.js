export function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');

    const applyTheme = (theme) => {
        document.body.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-bs-theme', theme);
        
        localStorage.setItem('site_theme', theme);

        const themeIconUse = document.getElementById('themeIconUse')
        if (themeIconUse) {
            const iconPath = theme === 'dark' ? 'img/sprite.svg#sun-fill' : 'img/sprite.svg#moon-stars-fill';
            themeIconUse.setAttribute('href', iconPath);
        }
    };

    const savedTheme = localStorage.getItem('site_theme') || 'light';
    applyTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }
}