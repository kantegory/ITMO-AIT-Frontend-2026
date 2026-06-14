import { ref } from 'vue'

const STORAGE_KEY = 'finance-manager-theme'
const theme = ref(localStorage.getItem(STORAGE_KEY) || 'light')

export function useTheme() {
  const applyTheme = (value) => {
    theme.value = value
    document.documentElement.setAttribute('data-theme', value)
    localStorage.setItem(STORAGE_KEY, value)
  }

  const toggleTheme = () => {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return {
    theme,
    applyTheme,
    toggleTheme,
  }
}
