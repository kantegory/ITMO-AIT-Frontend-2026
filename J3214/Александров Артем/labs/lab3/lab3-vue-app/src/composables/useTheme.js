// импорт функции реактивности
import { ref } from 'vue'

const theme = ref(localStorage.getItem('theme') || 'light')

const applyTheme = (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
}

// export - функция импортируема. 
export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme(theme.value)
  }

  return {
    theme,
    toggleTheme
  }
}