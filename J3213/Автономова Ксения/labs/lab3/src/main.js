import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/css/style.css'
import './assets/css/light.css'
import './assets/css/dark.css'
createApp(App).use(router).mount('#app')
