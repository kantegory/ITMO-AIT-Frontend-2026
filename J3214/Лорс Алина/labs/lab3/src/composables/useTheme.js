import { computed, ref } from 'vue';

const savedTheme = localStorage.getItem('tarelka-theme');
const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const theme = ref(savedTheme || systemTheme);
document.documentElement.dataset.theme = theme.value;

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark');

  function setTheme(value) {
    theme.value = value;
    document.documentElement.dataset.theme = value;
    localStorage.setItem('tarelka-theme', value);
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark');
  }

  return { theme, isDark, setTheme, toggleTheme };
}
