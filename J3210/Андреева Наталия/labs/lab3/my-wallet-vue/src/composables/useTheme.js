import {ref, onMounted} from 'vue'

export function useTheme() {
    const isDark = ref(localStorage.getItem('theme') === 'dark')

    const applyTheme = () => {
        if (isDark.value) {
            document.body.classList.add('dark-theme')
        } else {
            document.body.classList.remove('dark-theme')
        }
    }

    const toggleTheme = () => {
        isDark.value = !isDark.value
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
        applyTheme()
    }

    onMounted(applyTheme)

    return {isDark, toggleTheme}
}