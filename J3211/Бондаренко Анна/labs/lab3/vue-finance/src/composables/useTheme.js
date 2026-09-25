import { ref } from 'vue'

export function useTheme() {
    const theme = ref(localStorage.getItem('theme') || 'light')

    const applyTheme = (newTheme) => {
        document.documentElement.setAttribute('data-theme', newTheme)
        localStorage.setItem('theme', newTheme)
        theme.value = newTheme
    }

    const toggleTheme = () => {
        const newTheme = theme.value === 'light' ? 'dark' : 'light'
        applyTheme(newTheme)
    }

    const initTheme = () => {
        applyTheme(theme.value)
    }

    return { theme, toggleTheme, initTheme }
}