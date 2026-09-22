import { ref, watch } from 'vue'

function resolveIsDark() {
  const saved = localStorage.getItem('wl_theme')
  if (saved) return saved === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const isDark = ref(resolveIsDark())
watch(isDark, val => {
  document.documentElement.setAttribute('data-theme', val ? 'dark' : 'light')
  localStorage.setItem('wl_theme', val ? 'dark' : 'light')
}, { immediate: true })

export function useTheme() {
  function toggleTheme() { isDark.value = !isDark.value }
  return { isDark, toggleTheme }
}
