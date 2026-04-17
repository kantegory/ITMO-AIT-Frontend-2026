import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'
import { useUiStore } from '@/stores/ui'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import '@/assets/main.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

const uiStore = useUiStore()
uiStore.initTheme()

app.mount('#app')
