import { ref } from 'vue'

const theme = ref(localStorage.getItem('mff_theme') || 'light')

function applyTheme(value) {
  theme.value = value

  if (value === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }

  localStorage.setItem('mff_theme', value)
}

export function initTheme() {
  applyTheme(theme.value)
}

export function useTheme() {
  function toggleTheme() {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return {
    theme,
    applyTheme,
    toggleTheme,
  }
}
