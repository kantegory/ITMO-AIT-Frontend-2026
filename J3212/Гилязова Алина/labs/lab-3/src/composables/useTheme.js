import { ref, computed, watch } from 'vue'

const THEME_STORAGE_KEY = 'theme-preference'

const readStoredPreference = () => {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    if (value === 'light' || value === 'dark' || value === 'system') return value
  } catch {  }
  return 'system'
}

const readSystemTheme = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

const preference = ref(readStoredPreference())
const systemTheme = ref(readSystemTheme())

const resolvedTheme = computed(() =>
  preference.value === 'system' ? systemTheme.value : preference.value
)

const applyToDom = (theme, pref) => {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-bs-theme', theme)
  if (document.body) document.body.setAttribute('data-theme-preference', pref)
}

applyToDom(resolvedTheme.value, preference.value)

watch([resolvedTheme, preference], ([newTheme, newPref]) => {
  applyToDom(newTheme, newPref)
})

if (typeof window !== 'undefined' && window.matchMedia) {
  try {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (event) => {
      systemTheme.value = event.matches ? 'dark' : 'light'
    }
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', handler)
    else if (typeof mq.addListener === 'function') mq.addListener(handler)
  } catch {  }
}

export default function useTheme() {
  const setTheme = (value) => {
    if (value !== 'light' && value !== 'dark' && value !== 'system') return
    preference.value = value
    try { localStorage.setItem(THEME_STORAGE_KEY, value) } catch {  }
  }
  return { preference, resolvedTheme, setTheme }
}
