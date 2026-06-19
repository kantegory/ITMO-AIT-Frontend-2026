import { ref } from 'vue'

export function useTheme() {
    const theme = ref(localStorage.getItem('posimax-theme') || 'dark')

    const applyTheme = (currentTheme) => {
        document.body.setAttribute('data-theme', currentTheme)
        document.documentElement.setAttribute('data-bs-theme', currentTheme)
    }

    const initTheme = () => {
        applyTheme(theme.value)
    }

    const toggleTheme = () => {
        theme.value = theme.value === 'dark' ? 'light' : 'dark'
        localStorage.setItem('posimax-theme', theme.value)
        applyTheme(theme.value)
    }

    return {
        theme,
        initTheme,
        toggleTheme
    }
}