import { ref } from "vue";

const savedTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const theme = ref(savedTheme || systemTheme);

export function applyTheme() {
    document.documentElement.dataset.theme = theme.value;
}

export function toggleTheme() {
    theme.value = theme.value === "dark" ? "light" : "dark";
    localStorage.setItem("theme", theme.value);
    applyTheme();
}
