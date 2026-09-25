import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { persist } from 'pinia-persists'

import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import './assets/theme.css'
import './assets/base.css'
import './assets/components.css'
import './assets/form.css'
import './assets/dashboard.css'
import './assets/modals.css'
import './assets/navigation.css'
import './assets/auth.css'

const app = createApp(App)
const pinia = createPinia()

pinia.use(persist())

app.use(pinia)
app.use(router)
app.mount('#app')
