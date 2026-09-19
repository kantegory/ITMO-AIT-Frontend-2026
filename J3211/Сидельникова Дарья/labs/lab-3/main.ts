import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/base.css'
import './styles/auth.css'
import './styles/dashboard.css'
import './styles/landing.css'
import './styles/dark.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')