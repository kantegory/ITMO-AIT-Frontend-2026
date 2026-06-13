import { ref } from 'vue'

const THEME_KEY = 'lab3Theme'
const stored = localStorage.getItem(THEME_KEY)
const systemDark = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches
const theme = ref(stored || (systemDark ? 'dark' : 'light'))

const applyTheme = (t) => {
  document.documentElement.dataset.theme = t
  document.documentElement.setAttribute('data-bs-theme', t)
}

applyTheme(theme.value)

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem(THEME_KEY, theme.value)
    applyTheme(theme.value)
  }

  return { theme, toggleTheme }
}
