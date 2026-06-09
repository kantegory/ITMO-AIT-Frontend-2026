import { computed, reactive } from "vue";

const THEME_STORAGE_KEY = "makars-event-lab3-theme";
const DARK_COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

const state = reactive({
  current: "light"
});

let isInitialized = false;

function getStoredThemePreference() {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "";
  } catch (error) {
    return "";
  }
}

function getSystemThemePreference() {
  return window.matchMedia(DARK_COLOR_SCHEME_QUERY).matches ? "dark" : "light";
}

function applyTheme(theme) {
  const safeTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = safeTheme;
  document.documentElement.setAttribute("data-bs-theme", safeTheme);
  state.current = safeTheme;
}

function saveThemePreference(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
  }
}

function initTheme() {
  if (isInitialized || typeof window === "undefined") {
    return;
  }

  const preferredTheme = getStoredThemePreference() || getSystemThemePreference();
  applyTheme(preferredTheme);

  const mediaQuery = window.matchMedia(DARK_COLOR_SCHEME_QUERY);
  const handleSystemThemeChange = (event) => {
    if (getStoredThemePreference()) {
      return;
    }

    applyTheme(event.matches ? "dark" : "light");
  };

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handleSystemThemeChange);
  } else if (typeof mediaQuery.addListener === "function") {
    mediaQuery.addListener(handleSystemThemeChange);
  }

  isInitialized = true;
}

export function useTheme() {
  function toggleTheme() {
    const nextTheme = state.current === "dark" ? "light" : "dark";
    saveThemePreference(nextTheme);
    applyTheme(nextTheme);
  }

  return {
    currentTheme: computed(() => state.current),
    initTheme,
    toggleTheme
  };
}
