import { ref } from 'vue'

function detectInitial() {
  const saved = localStorage.getItem('theme')
  if (saved) return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref(detectInitial())

function apply(value) {
  document.documentElement.setAttribute('data-theme', value)
  document.documentElement.setAttribute('data-bs-theme', value)
}

apply(theme.value)

export function useTheme() {
  function toggle() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    apply(theme.value)
  }
  return { theme, toggle }
}
