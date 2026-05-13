import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import './assets/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { useTheme } from './composables/useTheme'

const app = createApp(App)

const { initTheme } = useTheme()
initTheme()

app.use(store)
app.use(router)
app.mount('#app')