import { computed, ref } from "vue";
import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/services/config";

const themes = {
  lagoon: { label: "Лагуна" },
  graphite: { label: "Графит" },
};

const currentTheme = ref(DEFAULT_THEME);

function getStoredTheme() {
  try {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    return themes[theme] ? theme : DEFAULT_THEME;
  } catch (error) {
    return DEFAULT_THEME;
  }
}

function applyTheme(theme, { persist = true } = {}) {
  const nextTheme = themes[theme] ? theme : DEFAULT_THEME;
  currentTheme.value = nextTheme;
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
      label: themes[nextTheme].label,
    },
  }));
}

export function useTheme() {
  const themeLabel = computed(() => themes[currentTheme.value]?.label || themes[DEFAULT_THEME].label);
  const isGraphite = computed(() => currentTheme.value === "graphite");

  function initTheme() {
    applyTheme(getStoredTheme(), { persist: false });
  }

  function toggleTheme() {
    applyTheme(currentTheme.value === "lagoon" ? "graphite" : "lagoon");
  }

  return {
    currentTheme,
    themeLabel,
    isGraphite,
    initTheme,
    toggleTheme,
  };
}

