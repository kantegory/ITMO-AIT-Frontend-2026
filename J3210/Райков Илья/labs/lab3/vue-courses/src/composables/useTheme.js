import { ref, onMounted } from 'vue';

export function useTheme() {
    const currentTheme = ref('light');

    const applyTheme = (theme) => {
        currentTheme.value = theme;
        document.body.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('site_theme', theme);
    };

    const toggleTheme = () => {
        applyTheme(currentTheme.value === 'dark' ? 'light' : 'dark');
    };

    const initTheme = () => {
        const savedTheme = localStorage.getItem('site_theme') || 'light';
        applyTheme(savedTheme)
    }

    return { currentTheme, toggleTheme, initTheme };
}