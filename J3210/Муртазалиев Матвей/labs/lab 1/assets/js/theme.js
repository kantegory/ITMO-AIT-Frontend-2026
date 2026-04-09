import { renderSpriteIcon } from "./utils.js";

const THEME_STORAGE_KEY = "finflow-theme";
const DEFAULT_THEME = "lagoon";

const THEMES = {
  lagoon: {
    label: "Лагуна",
  },
  graphite: {
    label: "Графит",
  },
};

export function getCurrentTheme() {
  const theme = document.documentElement.dataset.theme;
  return THEMES[theme] ? theme : DEFAULT_THEME;
}

export function getThemeLabel(theme = getCurrentTheme()) {
  return THEMES[theme]?.label || THEMES[DEFAULT_THEME].label;
}

export function getStoredTheme() {
  try {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES[theme] ? theme : DEFAULT_THEME;
  } catch (error) {
    return DEFAULT_THEME;
  }
}

export function applyTheme(theme, { persist = true } = {}) {
  const nextTheme = THEMES[theme] ? theme : DEFAULT_THEME;
  document.documentElement.dataset.theme = nextTheme;

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (error) {
      console.error(error);
    }
  }

  document.dispatchEvent(new CustomEvent("finflow:themechange", {
    detail: {
      theme: nextTheme,
      label: getThemeLabel(nextTheme),
    },
  }));

  return nextTheme;
}

export function toggleTheme() {
  return applyTheme(getCurrentTheme() === "lagoon" ? "graphite" : "lagoon");
}

export function initTheme() {
  applyTheme(getStoredTheme(), { persist: false });
  document.addEventListener("finflow:themechange", syncThemeToggleButtons);
}

export function renderThemeToggleMarkup() {
  const label = getThemeLabel();
  const isGraphite = getCurrentTheme() === "graphite";

  return `
    <button
      class="btn btn-theme btn-sm px-3"
      type="button"
      data-theme-toggle
      aria-pressed="${String(isGraphite)}"
      aria-label="Переключить тему. Сейчас выбрана тема ${label}"
      title="Переключить тему"
    >
      ${renderSpriteIcon("palette", "icon--inline")}
      <span data-theme-toggle-label>${label}</span>
    </button>
  `;
}

export function bindThemeToggles(root = document) {
  root.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    if (button.dataset.themeBound === "true") return;

    button.dataset.themeBound = "true";
    button.addEventListener("click", () => {
      toggleTheme();
    });
  });

  syncThemeToggleButtons();
}

function syncThemeToggleButtons() {
  const label = getThemeLabel();
  const isGraphite = getCurrentTheme() === "graphite";

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.setAttribute("aria-pressed", String(isGraphite));
    button.setAttribute("aria-label", `Переключить тему. Сейчас выбрана тема ${label}`);
    button.title = `Переключить тему. Сейчас выбрана тема ${label}`;

    const text = button.querySelector("[data-theme-toggle-label]");
    if (text) {
      text.textContent = label;
    }
  });
}
