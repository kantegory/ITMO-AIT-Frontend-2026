import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'
import { useTheme } from '@/composables/useTheme'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import '@/assets/styles/index.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

const { initTheme } = useTheme()
initTheme()

app.mount('#app')
