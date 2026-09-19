import { ref } from 'vue';

const THEME_STORAGE_KEY = 'nova_theme';
const currentTheme = ref('dark');

function getPreferredTheme() {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme) return storedTheme;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme, save = true) {
    currentTheme.value = theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    if (save) {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
}

// Инициализация при импорте модуля
const initial = getPreferredTheme();
applyTheme(initial, false);

if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
            applyTheme(e.matches ? 'light' : 'dark', false);
        }
    });
}

export function useTheme() {
    const toggleTheme = () => {
        const nextTheme = currentTheme.value === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme, true);
    };

    return {
        currentTheme,
        toggleTheme
    };
}