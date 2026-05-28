import { ref } from 'vue'

const theme = ref(localStorage.getItem('theme') || 'light')

export function useTheme() {
  const setTheme = (value) => {
    theme.value = value
    localStorage.setItem('theme', value)
  }
  return { theme, setTheme }
}
