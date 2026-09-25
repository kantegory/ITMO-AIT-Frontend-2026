import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref(localStorage.getItem('theme') || 'auto')

  function setTheme(newTheme) {
    if (['light', 'dark', 'auto'].includes(newTheme)) {
      currentTheme.value = newTheme
      localStorage.setItem('theme', newTheme)
      applyTheme()
    }
  }

  function applyTheme() {
    const darkMedia = "(prefers-color-scheme: dark)"
    const darkLink = document.getElementById('dark-theme-style')

    if (!darkLink) return 

    if (currentTheme.value === 'dark') {
      darkLink.media = "all"
      document.documentElement.style.colorScheme = "dark"
      document.documentElement.setAttribute('data-bs-theme', 'dark')
      
    } else if (currentTheme.value === 'light') {
      darkLink.media = "not all"
      document.documentElement.style.colorScheme = "light"
      document.documentElement.setAttribute('data-bs-theme', 'light')
      
    } else {
      darkLink.media = darkMedia
      document.documentElement.style.colorScheme = ""
      const prefersDark = window.matchMedia(darkMedia).matches
      document.documentElement.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light')
    }
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme.value === 'auto') {
      applyTheme()
    }
  })

  return { currentTheme, setTheme, applyTheme }
})