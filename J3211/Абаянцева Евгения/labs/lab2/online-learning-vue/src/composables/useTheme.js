import { ref, onMounted } from 'vue';

export default function useTheme() {
    const theme = ref('light');

    onMounted(() => {
        const savedTheme = localStorage.getItem('theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(savedTheme);
    });

    function setTheme(newTheme) {
        theme.value = newTheme;
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    function toggleTheme() {
        setTheme(theme.value === 'light' ? 'dark' : 'light');
    }

    return {
        theme,
        setTheme,
        toggleTheme
    };
}