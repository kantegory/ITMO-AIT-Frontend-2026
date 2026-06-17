import { ref, watch } from 'vue'

const STORAGE_KEY = 'tickethub_theme'

function getPreference() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark' || v === 'auto') return v
  } catch {
    /* ignore */
  }
  return 'auto'
}

function resolveToDataTheme(pref) {
  if (pref === 'light') return 'light'
  if (pref === 'dark') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(pref) {
  const resolved = resolveToDataTheme(pref)
  document.documentElement.setAttribute('data-theme', resolved)
  document.documentElement.setAttribute('data-theme-preference', pref)
}

const preference = ref(getPreference())

function syncDom() {
  applyTheme(preference.value)
}

let mediaListenerAttached = false

export function initTheme() {
  syncDom()
  if (mediaListenerAttached || typeof window === 'undefined') return
  mediaListenerAttached = true
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const onChange = () => {
    if (preference.value === 'auto') syncDom()
  }
  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', onChange)
  } else if (typeof mq.addListener === 'function') {
    mq.addListener(onChange)
  }
}

watch(preference, (v) => {
  if (v !== 'light' && v !== 'dark' && v !== 'auto') return
  try {
    localStorage.setItem(STORAGE_KEY, v)
  } catch {
    /* ignore */
  }
  syncDom()
})

export function useTheme() {
  function setPreference(value) {
    if (value !== 'light' && value !== 'dark' && value !== 'auto') return
    preference.value = value
  }

  return { preference, setPreference }
}
