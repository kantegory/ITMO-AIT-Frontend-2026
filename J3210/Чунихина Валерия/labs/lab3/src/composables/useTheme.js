import { computed, onMounted, ref } from 'vue'

const STORAGE_KEY = 'aibloom-theme'
const theme = ref('light')

function getPreferredTheme() {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

function applyTheme(nextTheme) {
  theme.value = nextTheme
  document.body.dataset.theme = nextTheme
  localStorage.setItem(STORAGE_KEY, nextTheme)
}

export function useTheme() {
  onMounted(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY)
    applyTheme(savedTheme || getPreferredTheme())
  })

  function toggleTheme() {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return {
    theme: computed(() => theme.value),
    toggleTheme
  }
}
