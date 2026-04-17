import { defineStore } from 'pinia'
import { THEME_STORAGE_KEY } from '@/utils'

let toastTimer = null

export const useUiStore = defineStore('ui', {
  state: () => ({
    toast: {
      visible: false,
      message: ''
    },
    theme:
      localStorage.getItem(THEME_STORAGE_KEY) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  }),
  actions: {
    initTheme() {
      document.documentElement.setAttribute('data-theme', this.theme)
    },
    setTheme(theme) {
      this.theme = theme === 'dark' ? 'dark' : 'light'
      localStorage.setItem(THEME_STORAGE_KEY, this.theme)
      document.documentElement.setAttribute('data-theme', this.theme)
    },
    toggleTheme() {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark')
    },
    showToast(message) {
      this.toast.message = message
      this.toast.visible = true

      if (toastTimer) clearTimeout(toastTimer)
      toastTimer = setTimeout(() => {
        this.toast.visible = false
      }, 2500)
    },
    hideToast() {
      this.toast.visible = false
      if (toastTimer) clearTimeout(toastTimer)
    }
  }
})
