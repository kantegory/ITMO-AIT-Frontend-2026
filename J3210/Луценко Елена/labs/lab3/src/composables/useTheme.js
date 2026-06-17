import {ref} from 'vue'

export function useTheme() {
    const theme = ref(localStorage.getItem('app-theme') || 'light')
    const toggleTheme = () => {
        theme.value = theme.value === 'light' ? 'dark' : 'light'
        localStorage.setItem('app-theme', theme.value)
        document.body.dataset.theme = theme.value
    }
    const initTheme = () => {
        document.body.dataset.theme = theme.value
    }
    return {theme, toggleTheme, initTheme}
}
