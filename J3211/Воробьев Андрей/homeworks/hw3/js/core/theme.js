const THEME_STORAGE_KEY = "mbe-theme";
const THEME_DARK = "dark";
const THEME_LIGHT = "light";

function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? THEME_DARK : THEME_LIGHT;
}

function getStoredTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === THEME_DARK || saved === THEME_LIGHT ? saved : null;
}

export function getCurrentTheme() {
    return document.documentElement.dataset.theme || THEME_LIGHT;
}

export function applyTheme(theme) {
    const resolvedTheme = theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
}

export function initTheme() {
    const storedTheme = getStoredTheme();
    applyTheme(storedTheme || getSystemTheme());
}

function updateThemeToggleButtons() {
    const currentTheme = getCurrentTheme();
    const nextThemeLabel = currentTheme === THEME_DARK ? "Включить светлую тему" : "Включить тёмную тему";

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
        button.setAttribute("aria-pressed", String(currentTheme === THEME_DARK));
        button.setAttribute("aria-label", nextThemeLabel);
        button.setAttribute("title", nextThemeLabel);
    });
}

export function toggleTheme() {
    const nextTheme = getCurrentTheme() === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
    updateThemeToggleButtons();
}

export function bindThemeToggle(container = document) {
    container.querySelectorAll("[data-theme-toggle]").forEach((button) => {
        if (button.dataset.themeBound === "true") {
            return;
        }

        button.addEventListener("click", toggleTheme);
        button.dataset.themeBound = "true";
    });

    updateThemeToggleButtons();
}

