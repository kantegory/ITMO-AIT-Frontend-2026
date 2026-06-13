import { ref } from 'vue'

export function useTheme() {
  const theme = ref(localStorage.getItem('app-theme') || 'dark')
  document.documentElement.setAttribute('data-theme', theme.value)

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('app-theme', theme.value)
  }

  return { theme, toggleTheme }
}
