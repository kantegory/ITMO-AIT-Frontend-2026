import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'

export function useTheme() {
  const uiStore = useUiStore()

  const isDarkTheme = computed(() => uiStore.theme === 'dark')
  const themeLabel = computed(() => (isDarkTheme.value ? 'Тёмная тема' : 'Светлая тема'))
  const themeIcon = computed(() => (isDarkTheme.value ? 'icon-moon' : 'icon-sun'))

  function initTheme() {
    uiStore.initTheme()
  }

  function toggleTheme() {
    uiStore.toggleTheme()
  }

  return {
    theme: computed(() => uiStore.theme),
    isDarkTheme,
    themeLabel,
    themeIcon,
    initTheme,
    toggleTheme
  }
}
