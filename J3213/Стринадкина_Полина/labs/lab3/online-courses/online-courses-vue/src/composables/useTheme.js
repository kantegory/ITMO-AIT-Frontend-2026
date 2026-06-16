import { ref } from 'vue'

const theme = ref(localStorage.getItem('theme') || 'light')

export function useTheme() {
  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('theme', theme.value)
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme()
  }

  applyTheme()

  return {
    theme,
    toggleTheme,
  }
}