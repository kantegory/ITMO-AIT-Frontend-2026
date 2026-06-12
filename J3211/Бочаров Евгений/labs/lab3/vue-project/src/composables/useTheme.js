import { ref } from 'vue'

const isDark = ref(document.documentElement.classList.contains('dark-theme'))

export function useTheme() {
    const toggleTheme = () => {
        isDark.value = !isDark.value
        if (isDark.value) {
            document.documentElement.classList.add('dark-theme')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark-theme')
            localStorage.setItem('theme', 'light')
        }
    }

    const init = () => {
        const saved = localStorage.getItem('theme')
        if (saved === 'dark') {
            isDark.value = true
            document.documentElement.classList.add('dark-theme')
        }
    }

    return { isDark, toggleTheme, init }
}