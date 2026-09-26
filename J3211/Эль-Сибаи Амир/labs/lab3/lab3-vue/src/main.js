import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-persists'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPersist)

app.use(createPinia())
app.use(router)

app.mount('#app')
