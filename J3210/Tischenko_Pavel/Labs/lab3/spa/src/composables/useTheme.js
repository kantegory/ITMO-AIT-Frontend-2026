import { ref, watch } from 'vue'

const THEME_KEY = 'lab3_theme'

function resolveInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') {
    return saved
  }
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
  return prefersDark ? 'dark' : 'light'
}

export function useTheme() {
  const theme = ref(resolveInitialTheme())

  watch(
    theme,
    (nextTheme) => {
      document.documentElement.setAttribute('data-theme', nextTheme)
      localStorage.setItem(THEME_KEY, nextTheme)
    },
    { immediate: true }
  )

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return {
    theme,
    toggleTheme
  }
}
