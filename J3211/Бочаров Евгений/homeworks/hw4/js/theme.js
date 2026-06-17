function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        updateButtonIcon('dark');
    } else {
        document.documentElement.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        updateButtonIcon('light');
    }
}

function updateButtonIcon(theme) {
    const btn = document.querySelector('.theme-switch');
    if (!btn) return;
    if (theme === 'dark') {
        btn.innerHTML = '<svg class="icon me-2" aria-hidden="true"><use href="images/sprite.svg#icon-sun"></use></svg> Светлая тема';
    } else {
        btn.innerHTML = '<svg class="icon me-2" aria-hidden="true"><use href="images/sprite.svg#icon-moon"></use></svg> Тёмная тема';
    }
}

function getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

function applyTheme() {
    const theme = getInitialTheme();
    setTheme(theme);
}

function initThemeSwitcher() {
    const switcher = document.querySelector('.theme-switch');
    if (switcher) {
        switcher.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark-theme');
            setTheme(isDark ? 'light' : 'dark');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    initThemeSwitcher();
});