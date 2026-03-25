import { defineStore } from 'pinia'

export const usePreferencesStore = defineStore('preferences', {
    state: () => ({
        theme: null,
    }),

    actions: {
        getSystemTheme() {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        },

        applyTheme(theme) {
            this.theme = theme
            document.documentElement.setAttribute('data-bs-theme', theme)
        },

        initTheme() {
            this.applyTheme(this.theme || this.getSystemTheme())
        },

        toggleTheme() {
            const currentTheme = this.theme || this.getSystemTheme()
            this.applyTheme(currentTheme === 'dark' ? 'light' : 'dark')
        },
    },

    persist: {
        pick: ['theme'],
    },
})
