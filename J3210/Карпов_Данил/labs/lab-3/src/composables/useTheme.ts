import { ref, watch } from 'vue'

const theme = ref<'light' | 'dark'>(
  (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
)

watch(
  theme,
  (val) => {
    document.documentElement.setAttribute('data-bs-theme', val)
    localStorage.setItem('theme', val)
  },
  { immediate: true },
)

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return { theme, toggleTheme }
}
