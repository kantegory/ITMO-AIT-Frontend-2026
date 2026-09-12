import { ref, onMounted } from 'vue'

export function useTheme() {
  const currentTheme = ref('light')

  const applyTheme = (theme) => {
    currentTheme.value = theme
    document.documentElement.setAttribute('data-bs-theme', theme)
    localStorage.setItem('app_theme', theme)
  }

  const toggleTheme = () => {
    applyTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem('app_theme')
    const osPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(savedTheme || (osPrefersDark ? 'dark' : 'light'))
  })

  return { currentTheme, toggleTheme }
}