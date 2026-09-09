const THEME_KEY = 'pm_theme';
const THEME_ATTR = 'data-theme';

function applyTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') return;
    
    document.documentElement.setAttribute(THEME_ATTR, theme);
    localStorage.setItem(THEME_KEY, theme);
}

function changeTheme() {
    const current = document.documentElement.getAttribute(THEME_ATTR) || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
}

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (systemDark ? 'dark' : 'light');
    applyTheme(theme);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}

window.changeTheme = changeTheme;