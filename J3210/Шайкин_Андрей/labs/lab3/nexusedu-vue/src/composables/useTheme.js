import { ref } from 'vue'

const currentTheme = ref(localStorage.getItem('theme') || 'dark')

export function useTheme() {
    const toggleTheme = () => {
        currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
        document.documentElement.setAttribute('data-theme', currentTheme.value)
        localStorage.setItem('theme', currentTheme.value)
    }

    document.documentElement.setAttribute('data-theme', currentTheme.value)

    return { currentTheme, toggleTheme }
}