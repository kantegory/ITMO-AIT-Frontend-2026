import { ref, onMounted } from 'vue'

const THEME_KEY = 'theme'
const DARK_THEME = 'dark'
const LIGHT_THEME = 'light'

export function useTheme() {
  const currentTheme = ref(localStorage.getItem(THEME_KEY) || DARK_THEME)

  const initTheme = () => {
    document.documentElement.setAttribute('data-theme', currentTheme.value)
  }

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === DARK_THEME ? LIGHT_THEME : DARK_THEME
    localStorage.setItem(THEME_KEY, currentTheme.value)
    document.documentElement.setAttribute('data-theme', currentTheme.value)
  }

  const isDark = () => currentTheme.value === DARK_THEME

  onMounted(() => {
    initTheme()
  })

  return {
    currentTheme,
    initTheme,
    toggleTheme,
    isDark
  }
}