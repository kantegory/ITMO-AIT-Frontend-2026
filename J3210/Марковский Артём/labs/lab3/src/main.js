import { createApp } from 'vue'
import router from './router/index.js'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './assets/style.css'

createApp(App).use(router).mount('#app')
