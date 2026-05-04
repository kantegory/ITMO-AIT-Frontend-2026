import { ref, onMounted } from 'vue'

const currentTheme = ref('light')

export function useTheme() {
  const applyTheme = (theme) => {
    currentTheme.value = theme
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  const toggleTheme = () => {
    applyTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    applyTheme(savedTheme)
  })

  return {
    currentTheme,
    toggleTheme
  }
}
