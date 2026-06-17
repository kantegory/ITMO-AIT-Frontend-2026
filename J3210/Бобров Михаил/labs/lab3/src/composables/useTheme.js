import { ref } from "vue";

const savedTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const theme = ref(savedTheme || systemTheme);

function applyTheme() {
    document.documentElement.dataset.theme = theme.value;
}

function toggleTheme() {
    theme.value = theme.value === "dark" ? "light" : "dark";
    localStorage.setItem("theme", theme.value);
    applyTheme();
}

export function useTheme() {
    return { theme, applyTheme, toggleTheme };
}
