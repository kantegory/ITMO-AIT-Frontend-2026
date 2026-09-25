import { ref } from 'vue'

const STORAGE_KEY = 'eventtix-theme'

function themeLinks() {
  return {
    light: document.querySelector('link[data-theme="light"]'),
    dark: document.querySelector('link[data-theme="dark"]'),
  }
}

function applyTheme(theme) {
  const links = themeLinks()

  if (!links.light || !links.dark) return

  if (theme === 'light' || theme === 'dark') {
    links.light.media = theme === 'light' ? 'all' : 'not all'
    links.dark.media = theme === 'dark' ? 'all' : 'not all'
    return
  }

  links.light.media = '(prefers-color-scheme: light)'
  links.dark.media = '(prefers-color-scheme: dark)'
}

function currentTheme() {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (saved === 'light' || saved === 'dark') return saved

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const theme = ref(currentTheme())

  applyTheme(localStorage.getItem(STORAGE_KEY))

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'

    localStorage.setItem(STORAGE_KEY, theme.value)
    applyTheme(theme.value)
  }

  return { theme, toggleTheme }
}
