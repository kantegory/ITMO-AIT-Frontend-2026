import { ref, onMounted, watch } from 'vue'

const THEME_KEY = 'lab3_theme'

export function useTheme() {
  const theme = ref('light')

  onMounted(() => {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') {
      theme.value = saved
    } else {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
      theme.value = prefersDark ? 'dark' : 'light'
    }
  })

  watch(
    theme,
    (nextTheme) => {
      document.documentElement.setAttribute('data-theme', nextTheme)
      localStorage.setItem(THEME_KEY, nextTheme)
    },
    { immediate: true }
  )

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return {
    theme,
    toggleTheme
  }
}
