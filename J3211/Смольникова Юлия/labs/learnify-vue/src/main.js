import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './assets/css/variables.css'
import './assets/css/light.css'
import './assets/css/dark.css'
import './assets/css/base.css'
import './assets/css/components.css'
import './assets/css/layout.css'
import './assets/css/pages.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.mount('#app')
