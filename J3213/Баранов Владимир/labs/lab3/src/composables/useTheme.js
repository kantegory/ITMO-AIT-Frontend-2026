import { ref, watchEffect } from "vue";

const STORAGE_KEY = "pipelinelab-theme";
const VALID_THEMES = ["lab", "pipeline"];

function readInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (VALID_THEMES.includes(saved)) return saved;
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "pipeline";
    return "lab";
}

const currentTheme = ref(readInitialTheme());

watchEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", currentTheme.value);
    html.setAttribute("data-bs-theme", currentTheme.value === "pipeline" ? "dark" : "light");
    localStorage.setItem(STORAGE_KEY, currentTheme.value);
});

export function useTheme() {
    function toggleTheme() {
        currentTheme.value = currentTheme.value === "lab" ? "pipeline" : "lab";
    }

    return { currentTheme, toggleTheme };
}
