import { ref, onMounted } from 'vue';

const theme = ref('light');

export function useTheme() {
    const applyTheme = (newTheme) => {
        theme.value = newTheme;
        document.documentElement.setAttribute('data-theme', newTheme);
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('app-theme', newTheme);
    };

    const toggleTheme = () => {
        applyTheme(theme.value === 'dark' ? 'light' : 'dark');
    };

    const initTheme = () => {
        const savedTheme = localStorage.getItem('app-theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('app-theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    };

    return {
        theme,
        toggleTheme,
        initTheme
    };
}