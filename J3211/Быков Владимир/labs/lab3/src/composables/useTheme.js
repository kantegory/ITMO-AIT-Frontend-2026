import { computed, ref } from 'vue';

const THEME_STORAGE_KEY = 'datamark-lab3-theme';
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
const theme = ref(savedTheme || (systemThemeQuery.matches ? 'dark' : 'light'));

function applyTheme() {
    document.documentElement.dataset.theme = theme.value;
    localStorage.setItem(THEME_STORAGE_KEY, theme.value);
}

systemThemeQuery.addEventListener('change', () => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        theme.value = systemThemeQuery.matches ? 'dark' : 'light';
        document.documentElement.dataset.theme = theme.value;
    }
});

export function useTheme() {
    const isDark = computed(() => theme.value === 'dark');
    const buttonText = computed(() => (isDark.value ? 'Светлая тема' : 'Тёмная тема'));

    function toggleTheme() {
        theme.value = isDark.value ? 'light' : 'dark';
        applyTheme();
    }

    applyTheme();

    return {
        theme,
        isDark,
        buttonText,
        toggleTheme
    };
}
