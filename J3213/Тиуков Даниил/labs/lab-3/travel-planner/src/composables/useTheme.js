import { computed, watch } from 'vue'
import { useStorage, STORAGE_KEYS } from './useStorage.js'

export function useTheme() {
  const theme = useStorage(STORAGE_KEYS.theme, 'light')
  const isDark = computed(() => theme.value === 'dark')

  function applyTheme(value) {
    if (value) {
      document.documentElement.setAttribute('data-theme', value)
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }

  function toggle() {
    theme.value = isDark.value ? 'light' : 'dark'
  }

  watch(theme, applyTheme, { immediate: true })

  return { theme, isDark, toggle }
}
