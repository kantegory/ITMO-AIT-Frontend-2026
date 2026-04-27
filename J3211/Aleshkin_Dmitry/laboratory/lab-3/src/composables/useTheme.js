import { computed, ref } from 'vue';

const THEME_STORAGE_KEY = 'financeManagerTheme';
const THEME_VALUES = ['system', 'light', 'dark'];
const preference = ref(localStorage.getItem(THEME_STORAGE_KEY) || 'system');

function resolveTheme(value) {
  if (value === 'light' || value === 'dark') return value;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(value, persist = true) {
  preference.value = value;
  const resolved = resolveTheme(value);

  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = value;

  if (persist) {
    localStorage.setItem(THEME_STORAGE_KEY, value);
  }
}

function initTheme() {
  applyTheme(preference.value, false);
}

export function useTheme() {
  const label = computed(() => {
    if (preference.value === 'system') return 'Тема: системная';
    if (preference.value === 'light') return 'Тема: светлая';
    return 'Тема: тёмная';
  });

  const icon = computed(() => {
    if (preference.value === 'system') return 'icon-monitor';
    if (preference.value === 'light') return 'icon-sun';
    return 'icon-moon';
  });

  function cycleTheme() {
    const currentIndex = THEME_VALUES.indexOf(preference.value);
    const nextTheme = THEME_VALUES[(currentIndex + 1) % THEME_VALUES.length];
    applyTheme(nextTheme, true);
  }

  return {
    preference,
    label,
    icon,
    initTheme,
    applyTheme,
    cycleTheme,
  };
}