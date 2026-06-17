import { ref } from 'vue'

const theme = ref(localStorage.getItem('theme') || 'light')

export function useTheme() {
  function applyTheme(value) {
    theme.value = value
    localStorage.setItem('theme', value)
    document.body.setAttribute('data-theme', value)
  }

  function toggleTheme() {
    applyTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  function initTheme() {
    applyTheme(localStorage.getItem('theme') || 'light')
  }

  return {
    theme,
    applyTheme,
    toggleTheme,
    initTheme
  }
}