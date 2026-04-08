import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './stores'
import useAuthStore from './stores/auth'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

const app = createApp(App)
app.use(store)
app.use(router)
useAuthStore().restoreSession()
app.mount('#app')
