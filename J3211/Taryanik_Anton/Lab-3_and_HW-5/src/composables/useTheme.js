import { ref, onMounted } from 'vue'

const currentTheme = ref(localStorage.getItem('theme') || 'light')

export function useTheme() {
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme)
    }

    const toggleTheme = () => {
        currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
        localStorage.setItem('theme', currentTheme.value)
        applyTheme(currentTheme.value)
    }

    onMounted(() => {
        applyTheme(currentTheme.value)
    })

    return { currentTheme, toggleTheme }
}