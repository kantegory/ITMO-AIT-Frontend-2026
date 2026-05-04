import { computed, onMounted, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'

export function useTheme() {
  const themeStore = useThemeStore()

  const theme = computed(() => themeStore.theme)
  const isDark = computed(() => themeStore.theme === 'dark')
  const isLight = computed(() => themeStore.theme === 'light')

  function toggle() {
    themeStore.toggle()
  }

  function setTheme(newTheme) {
    if (newTheme === 'dark' || newTheme === 'light') {
      themeStore.theme = newTheme
      localStorage.setItem('learnify-theme', newTheme)
      themeStore.apply()
    }
  }

  function setDark() {
    setTheme('dark')
  }

  function setLight() {
    setTheme('light')
  }

  function initTheme() {
    themeStore.init()
  }

  function useSystemTheme() {
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      setDark()
    } else {
      setLight()
    }
  }

  function watchSystemTheme(enabled = true) {
    if (!window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    if (enabled) {
      mediaQuery.addEventListener('change', (e) => {
        setTheme(e.matches ? 'dark' : 'light')
      })
    }
  }

  function getCssVar(varName) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--${varName}`)
      .trim()
  }

  function applyCustomColors(colors) {
    const root = document.documentElement
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
  }

  return {
    theme,
    isDark,
    isLight,

    toggle,
    setTheme,
    setDark,
    setLight,
    initTheme,
    useSystemTheme,
    watchSystemTheme,

    getCssVar,
    applyCustomColors
  }
}
