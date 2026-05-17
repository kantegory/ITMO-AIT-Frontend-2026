import { onMounted, ref } from 'vue';

const STORAGE_KEY = 'ml-pipeline-theme';
const theme = ref(localStorage.getItem(STORAGE_KEY) || 'auto');

function applyTheme(value) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldUseDark = value === 'dark' || (value === 'auto' && prefersDark);

  if (shouldUseDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

export function useTheme() {
  function toggleTheme() {
    theme.value = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, theme.value);
    applyTheme(theme.value);
  }

  onMounted(() => {
    applyTheme(theme.value);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'auto') {
        applyTheme(theme.value);
      }
    });
  });

  return {
    theme,
    toggleTheme,
  };
}
