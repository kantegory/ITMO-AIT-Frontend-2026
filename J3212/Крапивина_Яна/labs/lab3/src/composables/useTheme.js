import { ref, onMounted } from 'vue'

const isLight = ref(false)

export function useTheme() {
  const applyTheme = (theme) => {
    isLight.value = theme === 'light'
    const html = document.documentElement
    
    if (isLight.value) {
      html.classList.add('light-theme')
      html.classList.remove('dark-theme')
    } else {
      html.classList.remove('light-theme')
    }
    localStorage.setItem('user-theme', theme)
  }

  const toggleTheme = () => {
    const newTheme = isLight.value ? 'dark' : 'light'
    applyTheme(newTheme)
  }

  const initTheme = () => {
    const saved = localStorage.getItem('user-theme') || 'dark'
    applyTheme(saved)
  }

  return { isLight, toggleTheme, initTheme }
}