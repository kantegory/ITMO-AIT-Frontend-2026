import { ref, watch } from 'vue';

const THEME_KEY = 'theme';
const theme = ref(localStorage.getItem(THEME_KEY) || 'dark');

watch(
  theme,
  (value) => {
    document.documentElement.setAttribute('data-theme', value);
    localStorage.setItem(THEME_KEY, value);
  },
  { immediate: true }
);

export function useTheme() {
  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
  };
  return { theme, toggle };
}
