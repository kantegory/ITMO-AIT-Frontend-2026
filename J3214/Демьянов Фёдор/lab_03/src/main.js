import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Подключение стилей и скриптов Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'

// Подключение стилей NovaTransit
import './assets/style.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
