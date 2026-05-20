import { ref } from 'vue'

let initialized = false

const STORAGE_KEY = 'dataflow-theme'
const THEMES = ['light', 'dark', 'red']

const theme = ref('light')

function getPreferred() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (THEMES.includes(saved)) return saved
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

function applyTheme(value) {
  theme.value = value
  document.body.setAttribute('data-theme', value)
  localStorage.setItem(STORAGE_KEY, value)
}

function initTheme() {
  if (!initialized) {
    applyTheme(getPreferred())
    initialized = true
  }
}

export function useTheme() {
  initTheme()

  function toggleTheme() {
    const idx = THEMES.indexOf(theme.value)
    applyTheme(THEMES[(idx + 1) % THEMES.length])
  }

  return { theme, toggleTheme }
}
