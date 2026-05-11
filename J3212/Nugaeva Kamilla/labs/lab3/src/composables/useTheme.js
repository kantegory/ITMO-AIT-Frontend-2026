import { onMounted, ref } from 'vue'

const STORAGE_KEY = 'travel_theme'

export function useTheme() {
  const theme = ref(localStorage.getItem(STORAGE_KEY) || 'light')

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem(STORAGE_KEY, theme.value)
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme()
  }

  onMounted(() => {
    applyTheme()
  })

  return {
    theme,
    toggleTheme,
  }
}