import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const THEME_STORAGE_KEY = 'mbe-theme'
const THEME_DARK = 'dark'
const THEME_LIGHT = 'light'

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME_DARK : THEME_LIGHT
}

function getStoredTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY)
  return saved === THEME_DARK || saved === THEME_LIGHT ? saved : null
}

function updateThemeToggleButtons(currentTheme) {
  const nextThemeLabel = currentTheme === THEME_DARK ? 'Включить светлую тему' : 'Включить тёмную тему'

  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-pressed', String(currentTheme === THEME_DARK))
    button.setAttribute('aria-label', nextThemeLabel)
    button.setAttribute('title', nextThemeLabel)
  })
}

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref(THEME_LIGHT)
  const initialized = ref(false)

  const isDark = computed(() => currentTheme.value === THEME_DARK)

  function applyTheme(theme) {
    const resolvedTheme = theme === THEME_DARK ? THEME_DARK : THEME_LIGHT
    currentTheme.value = resolvedTheme
    document.documentElement.dataset.theme = resolvedTheme
    document.documentElement.style.colorScheme = resolvedTheme
    updateThemeToggleButtons(resolvedTheme)
  }

  function initTheme() {
    if (initialized.value) return
    const storedTheme = getStoredTheme()
    applyTheme(storedTheme || getSystemTheme())
    initialized.value = true
  }

  function toggleTheme() {
    const nextTheme = currentTheme.value === THEME_DARK ? THEME_LIGHT : THEME_DARK
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    applyTheme(nextTheme)
  }

  return {
    currentTheme,
    isDark,
    initTheme,
    toggleTheme,
    applyTheme
  }
})
