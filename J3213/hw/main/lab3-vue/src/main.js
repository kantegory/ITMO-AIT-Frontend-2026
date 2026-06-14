import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'
import { useTheme } from './composables/useTheme'

const app = createApp(App)
app.use(router)
app.mount('#app')

const { applyTheme, theme } = useTheme()
applyTheme(theme.value)
