import { createApp } from 'vue'

import App from '@/App.vue'
import { initTheme } from '@/composables/useTheme'
import router from '@/router'

import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/main.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

initTheme()

const app = createApp(App)
app.use(router)
app.mount('#app')
