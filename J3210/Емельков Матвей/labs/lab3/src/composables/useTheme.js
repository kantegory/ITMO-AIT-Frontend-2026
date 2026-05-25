import { ref } from 'vue'

const theme = ref(localStorage.getItem('theme') || 'light')
document.documentElement.setAttribute('data-theme', theme.value)

export function useTheme() {
  function setTheme(value) {
    theme.value = value
    document.documentElement.setAttribute('data-theme', value)
    localStorage.setItem('theme', value)
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme, setTheme }
}
