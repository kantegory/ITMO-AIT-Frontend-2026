import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './stores/index.js'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './assets/main.css'

const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')
