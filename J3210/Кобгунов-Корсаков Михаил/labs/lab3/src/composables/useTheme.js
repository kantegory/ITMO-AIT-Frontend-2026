import { ref } from 'vue';

const theme = ref(localStorage.getItem('theme') || 'light');

export function useTheme() {
  function applyTheme() {
    document.body.dataset.theme = theme.value;
  }

  function initTheme() {
    theme.value = localStorage.getItem('theme') || 'light';
    applyTheme();
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme.value);
    applyTheme();
  }

  return {
    theme,
    initTheme,
    toggleTheme
  };
}
