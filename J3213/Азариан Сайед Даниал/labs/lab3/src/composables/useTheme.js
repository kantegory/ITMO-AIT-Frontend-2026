import { ref, watch } from 'vue'

const STORAGE_THEME_KEY = 'eventpass_theme'
const theme = ref(localStorage.getItem(STORAGE_THEME_KEY) || 'light')

watch(
  theme,
  (value) => {
    document.documentElement.setAttribute('data-theme', value)
    localStorage.setItem(STORAGE_THEME_KEY, value)
  },
  { immediate: true },
)

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return {
    theme,
    toggleTheme,
  }
}
