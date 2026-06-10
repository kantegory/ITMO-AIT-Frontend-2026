import { ref, watch } from 'vue'

const STORAGE_KEY = 'theme'
const isDark = ref(localStorage.getItem(STORAGE_KEY) === 'dark')

const applyThemeClass = (dark) => {
  document.body.classList.toggle('dark-theme', dark)
}

applyThemeClass(isDark.value)

watch(isDark, (value) => {
  applyThemeClass(value)
  localStorage.setItem(STORAGE_KEY, value ? 'dark' : 'light')
})

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }
  return { isDark, toggleTheme }
}
