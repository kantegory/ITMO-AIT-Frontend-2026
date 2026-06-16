import { computed, ref } from 'vue';

const STORAGE_KEY = 'siteTheme';
const theme = ref('light');
let initialized = false;

function getSystemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme() {
  return localStorage.getItem(STORAGE_KEY);
}

function applyTheme(nextTheme) {
  theme.value = nextTheme;
  document.documentElement.setAttribute('data-bs-theme', nextTheme);
  document.documentElement.dataset.theme = nextTheme;
}

export function useTheme() {
  const themeLabel = computed(() => (theme.value === 'dark' ? 'Светлая тема' : 'Тёмная тема'));

  function initTheme() {
    if (initialized) {
      return;
    }

    applyTheme(getStoredTheme() || getSystemTheme());

    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (event) => {
        if (!getStoredTheme()) {
          applyTheme(event.matches ? 'dark' : 'light');
        }
      });
    }

    initialized = true;
  }

  function toggleTheme() {
    const nextTheme = theme.value === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  }

  return {
    theme,
    themeLabel,
    initTheme,
    toggleTheme
  };
}
