import { ref } from 'vue'

const theme = ref(localStorage.getItem('theme') || 'light')

export function useTheme() {
  const applyTheme = () => {
    document.body.classList.toggle('dark-theme', theme.value === 'dark')
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    applyTheme()
  }

  return {
    theme,
    applyTheme,
    toggleTheme
  }
}