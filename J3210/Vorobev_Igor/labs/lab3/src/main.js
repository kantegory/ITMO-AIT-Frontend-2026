import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { useTheme } from '@/composables/useTheme'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import '@/assets/main.css'

useTheme().initTheme()

createApp(App).use(router).mount('#app')
