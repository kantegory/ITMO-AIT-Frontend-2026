import { computed, ref } from 'vue'

const theme = ref(readTheme())

function readTheme() {
  try {
    return localStorage.getItem('theme') || 'light'
  } catch {
    return 'light'
  }
}

function applyTheme(value) {
  document.documentElement.setAttribute('data-theme', value)
}

applyTheme(theme.value)

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark')

  function toggleTheme() {
    theme.value = isDark.value ? 'light' : 'dark'
    applyTheme(theme.value)
    try {
      localStorage.setItem('theme', theme.value)
    } catch {
    }
  }

  return { theme, isDark, toggleTheme }
}
