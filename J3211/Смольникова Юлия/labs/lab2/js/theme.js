(function() {
    'use strict';

    const THEME_KEY = 'learnify-theme';
    const THEMES = {
        LIGHT: 'light',
        DARK: 'dark',
        AUTO: 'auto'
    };

    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return THEMES.DARK;
        }
        return THEMES.LIGHT;
    }

    function getSavedTheme() {
        try {
            return localStorage.getItem(THEME_KEY);
        } catch (e) {
            console.warn('Unable to access localStorage:', e);
            return null;
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {
            console.warn('Unable to save theme to localStorage:', e);
        }
    }

    function applyTheme(theme) {
        const root = document.documentElement;

        if (theme === THEMES.DARK) {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.setAttribute('data-theme', 'light');
        }

        updateToggleButton(theme);
        updateColorSchemeMeta(theme);

        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    function updateToggleButton(theme) {
        const buttons = document.querySelectorAll('.theme-toggle');

        buttons.forEach(button => {
            const icon = button.querySelector('.theme-toggle-icon');
            const textSpan = button.querySelector('.theme-toggle-text');

            if (theme === THEMES.DARK) {
                if (icon) icon.textContent = '☀️';
                if (textSpan) textSpan.textContent = 'Светлая тема';
                button.setAttribute('aria-label', 'Переключить на светлую тему');
                button.setAttribute('title', 'Переключить на светлую тему');
            } else {
                if (icon) icon.textContent = '🌙';
                if (textSpan) textSpan.textContent = 'Тёмная тема';
                button.setAttribute('aria-label', 'Переключить на тёмную тему');
                button.setAttribute('title', 'Переключить на тёмную тему');
            }
        });
    }

    function updateColorSchemeMeta(theme) {
        let meta = document.querySelector('meta[name="color-scheme"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'color-scheme';
            document.head.appendChild(meta);
        }
        meta.content = theme === THEMES.DARK ? 'dark' : 'light';
    }

    function getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || THEMES.LIGHT;
    }

    function toggleTheme() {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;

        applyTheme(newTheme);
        saveTheme(newTheme);
    }

    function setTheme(theme) {
        if (theme !== THEMES.LIGHT && theme !== THEMES.DARK) {
            console.warn('Invalid theme:', theme);
            return;
        }

        applyTheme(theme);
        saveTheme(theme);
    }

    function initTheme() {
        const savedTheme = getSavedTheme();

        if (savedTheme && (savedTheme === THEMES.LIGHT || savedTheme === THEMES.DARK)) {
            applyTheme(savedTheme);
        } else {
            const systemTheme = getSystemTheme();
            applyTheme(systemTheme);
        }

        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            mediaQuery.addEventListener('change', (e) => {
                const savedTheme = getSavedTheme();
                if (!savedTheme) {
                    applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
                }
            });
        }

        document.addEventListener('click', (e) => {
            const toggleBtn = e.target.closest('.theme-toggle');
            if (toggleBtn) {
                e.preventDefault();
                toggleTheme();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }

    window.ThemeManager = {
        toggle: toggleTheme,
        set: setTheme,
        get: getCurrentTheme,
        THEMES: THEMES
    };

})();
