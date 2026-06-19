import {computed, ref, watch} from 'vue'

const THEME_KEY = 'theme'

const currentTheme = ref(localStorage.getItem(THEME_KEY) || 'light')

function applyTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme)
}

watch(currentTheme, (newTheme) => {
  applyTheme(newTheme)
  localStorage.setItem(THEME_KEY, newTheme)
}, {immediate: true})

export function useTheme() {
  const isDark = computed(() => currentTheme.value === 'dark')

  function toggleTheme() {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
  }

  return {
    currentTheme,
    isDark,
    toggleTheme
  }
}
