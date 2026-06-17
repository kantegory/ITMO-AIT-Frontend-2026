import { ref, computed, watch } from 'vue';

const STORAGE_KEY = 'theme';

function readInitial() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const theme = ref(readInitial());

watch(
  theme,
  (value) => {
    document.documentElement.setAttribute('data-bs-theme', value);
    localStorage.setItem(STORAGE_KEY, value);
  },
  { immediate: true },
);

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark');

  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
  }

  return { theme, isDark, toggle };
}
