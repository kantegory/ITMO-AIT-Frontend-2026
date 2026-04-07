import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'
import store from '@/stores'

const app = createApp(App)

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import '@/assets/main.css'

app.use(store)
app.use(router)

app.mount('#app')