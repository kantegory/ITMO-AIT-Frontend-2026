import { ref } from 'vue'

const THEME_KEY = 'dataforge_theme'

function getInitialTheme() {
  return (
    localStorage.getItem(THEME_KEY) ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )
}

const theme = ref(getInitialTheme())

export function useTheme() {
  function applyTheme(value) {
    document.documentElement.setAttribute('data-theme', value)
    document.documentElement.setAttribute('data-bs-theme', value)
    theme.value = value
  }

  function initTheme() {
    applyTheme(theme.value)
  }

  function toggleTheme() {
    const next = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem(THEME_KEY, next)
    applyTheme(next)
  }

  return { theme, initTheme, toggleTheme }
}
