import { ref } from 'vue';

const STORAGE_KEY = 'floworchestrator_theme';

const getInitialTheme = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const theme = ref(getInitialTheme());

export function useTheme() {
  const applyTheme = (value = theme.value) => {
    document.documentElement.setAttribute('data-bs-theme', value);
    localStorage.setItem(STORAGE_KEY, value);
    theme.value = value;
  };

  const toggleTheme = () => {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark');
  };

  return {
    theme,
    applyTheme,
    toggleTheme
  };
}
