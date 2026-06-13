import { ref, onMounted } from 'vue'

const theme = ref('light')

export function useTheme() {
  onMounted(() => {
    const savedTheme = localStorage.getItem('finflow-theme')

    if (savedTheme) {
      theme.value = savedTheme
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? 'dark' : 'light'
    }

    document.documentElement.setAttribute('data-theme', theme.value)
  })

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('finflow-theme', theme.value)
  }

  return {
    theme,
    toggleTheme,
  }
}