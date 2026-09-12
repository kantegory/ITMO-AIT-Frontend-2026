import useEventListener from '@/composables/useEventListener'

const useTheme = () => {
  const media = window.matchMedia('(prefers-color-scheme: dark)')

  const applyTheme = () => {
    document.documentElement.setAttribute('data-bs-theme', media.matches ? 'dark' : 'light')
  }

  applyTheme()
  useEventListener(media, 'change', applyTheme)
}

export default useTheme
