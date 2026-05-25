import { ref, watch } from 'vue';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'app-theme';

function readInitial(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

const theme = ref<Theme>(readInitial());
const userExplicit = ref<boolean>(
  localStorage.getItem(STORAGE_KEY) === 'light' || localStorage.getItem(STORAGE_KEY) === 'dark',
);

let initialized = false;

export function useTheme() {
  function set(next: Theme): void {
    userExplicit.value = true;
    localStorage.setItem(STORAGE_KEY, next);
    theme.value = next;
  }

  function toggle(): void {
    set(theme.value === 'light' ? 'dark' : 'light');
  }

  function init(): void {
    if (initialized) return;
    initialized = true;

    watch(
      theme,
      (next) => {
        document.documentElement.setAttribute('data-theme', next);
      },
      { immediate: true },
    );

    const mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener('change', (e) => {
      if (!userExplicit.value) theme.value = e.matches ? 'light' : 'dark';
    });
  }

  return { theme, toggle, set, init };
}
