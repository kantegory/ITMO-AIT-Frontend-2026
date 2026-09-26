import { computed, ref } from 'vue'

const STORAGE_KEY = 'pm_theme'
const theme = ref('light')

function applyTheme(value) {
  theme.value = value
  document.documentElement.setAttribute('data-theme', value)
  localStorage.setItem(STORAGE_KEY, value)
}

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark')

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY)
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(saved === 'dark' || saved === 'light' ? saved : systemDark ? 'dark' : 'light')
  }

  function toggleTheme() {
    applyTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  return { theme, isDark, initTheme, toggleTheme }
}
