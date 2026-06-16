(function () {
    const STORAGE_KEY = 'siteTheme';
    const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    function getStoredTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            console.error('Не удалось прочитать тему из localStorage', error);
            return null;
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (error) {
            console.error('Не удалось сохранить тему в localStorage', error);
        }
    }

    function getSystemTheme() {
        return mediaQuery && mediaQuery.matches ? 'dark' : 'light';
    }

    function getCurrentTheme() {
        return document.documentElement.getAttribute('data-bs-theme') || getStoredTheme() || getSystemTheme();
    }

    function getButtonLabel(theme) {
        return theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);
        document.documentElement.dataset.theme = theme;

        document.querySelectorAll('[data-theme-label]').forEach(function (label) {
            label.textContent = getButtonLabel(theme);
        });

        document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
            button.setAttribute('aria-label', getButtonLabel(theme));
            button.setAttribute('title', getButtonLabel(theme));
        });
    }

    function toggleTheme() {
        const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        saveTheme(nextTheme);
    }

    applyTheme(getStoredTheme() || getSystemTheme());

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
            button.addEventListener('click', toggleTheme);
        });

        applyTheme(getCurrentTheme());
    });

    if (mediaQuery && typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', function (event) {
            if (!getStoredTheme()) {
                applyTheme(event.matches ? 'dark' : 'light');
            }
        });
    }
})();
