import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/style.css'

import App from './App.vue'
import router from './router/index.js'

createApp(App).use(router).mount('#app')
