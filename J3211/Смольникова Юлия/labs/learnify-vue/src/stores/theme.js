import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'light'
  }),

  getters: {
    isDark: (state) => state.theme === 'dark'
  },

  actions: {
    init() {
      const saved = localStorage.getItem('learnify-theme')
      if (saved === 'dark' || saved === 'light') {
        this.theme = saved
      } else if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        this.theme = 'dark'
      }
      this.apply()
    },

    toggle() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('learnify-theme', this.theme)
      this.apply()
    },

    setTheme(newTheme) {
      this.theme = newTheme
      localStorage.setItem('learnify-theme', newTheme)
      this.apply()
    },

    apply() {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', this.theme)
        const meta = document.querySelector('meta[name="color-scheme"]')
        if (meta) meta.content = this.theme === 'dark' ? 'dark' : 'light'
      }
    }
  }
})