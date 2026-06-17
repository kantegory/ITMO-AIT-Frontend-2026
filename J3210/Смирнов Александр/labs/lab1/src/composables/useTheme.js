import { ref } from "vue";

const THEME_KEY = "theme";
const theme = ref(getInitialTheme());

function getInitialTheme() {
    const fromStorage = localStorage.getItem(THEME_KEY);
    if (fromStorage === "dark" || fromStorage === "light") return fromStorage;

    const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return isDark ? "dark" : "light";
}

function applyTheme(nextTheme) {
    const normalized = nextTheme === "dark" ? "dark" : "light";
    theme.value = normalized;
    localStorage.setItem(THEME_KEY, normalized);
    document.documentElement.setAttribute("data-theme", normalized);
}

export function useTheme() {
    const toggleTheme = () => applyTheme(theme.value === "dark" ? "light" : "dark");

    return {
        theme,
        applyTheme,
        toggleTheme
    };
}
