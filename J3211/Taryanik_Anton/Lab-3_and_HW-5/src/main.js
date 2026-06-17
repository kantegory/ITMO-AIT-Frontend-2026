import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/variables.css'
import './assets/styles.css'

axios.defaults.baseURL = 'http://localhost:3000'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')