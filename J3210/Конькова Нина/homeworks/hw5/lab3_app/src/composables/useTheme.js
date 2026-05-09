const { ref, computed } = window.Vue;

const theme = ref(localStorage.getItem('theme') || 'light');
let initialized = false;

function applyTheme(value) {
    document.documentElement.setAttribute('data-theme', value);
    localStorage.setItem('theme', value);
}

export function useTheme() {
    function initTheme() {
        if (initialized) return;
        initialized = true;
        applyTheme(theme.value);
    }

    function toggleTheme() {
        theme.value = theme.value === 'dark' ? 'light' : 'dark';
        applyTheme(theme.value);
    }

    const icon = computed(() => theme.value === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill');
    const label = computed(() => theme.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');

    return {
        theme,
        icon,
        label,
        initTheme,
        toggleTheme
    };
}
