import { createApp } from 'vue'
import App    from '@/App.vue'
import router from '@/router'
import pinia  from '@/stores'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@/assets/main.css'

createApp(App).use(pinia).use(router).mount('#app')
