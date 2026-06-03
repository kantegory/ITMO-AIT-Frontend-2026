import { computed, ref } from 'vue';

const STORAGE_KEY = 'kontramarkaTheme';
const DEFAULT_THEME = 'classic';
const THEMES = ['classic', 'neon'];
const theme = ref(DEFAULT_THEME);

function normalizeTheme(value) {
  return THEMES.includes(value) ? value : DEFAULT_THEME;
}

function applyTheme(nextTheme) {
  const normalizedTheme = normalizeTheme(nextTheme);
  theme.value = normalizedTheme;
  document.documentElement.setAttribute('data-theme', normalizedTheme);

  try {
    localStorage.setItem(STORAGE_KEY, normalizedTheme);
  } catch {
    // Ignore storage errors.
  }
}

export function initTheme() {
  let storedTheme = DEFAULT_THEME;

  try {
    storedTheme = normalizeTheme(localStorage.getItem(STORAGE_KEY));
  } catch {
    storedTheme = DEFAULT_THEME;
  }

  applyTheme(storedTheme);
}

export function useTheme() {
  const nextThemeLabel = computed(() => theme.value === 'classic' ? 'Neon' : 'Classic');

  function toggleTheme() {
    applyTheme(theme.value === 'classic' ? 'neon' : 'classic');
  }

  return {
    theme,
    nextThemeLabel,
    toggleTheme
  };
}
