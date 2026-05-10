import { ref, onMounted } from 'vue'

export function useTheme() {
  const currentTheme = ref('light')

  const applyTheme = (theme) => {
    currentTheme.value = theme
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  const toggleTheme = () => {
    const newTheme = currentTheme.value === 'zombie' ? 'light' : 'zombie'
    applyTheme(newTheme)
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    applyTheme(savedTheme)
  })

  return {
    currentTheme,
    toggleTheme
  }
}
