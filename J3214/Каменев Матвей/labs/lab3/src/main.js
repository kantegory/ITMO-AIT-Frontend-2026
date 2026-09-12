import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import instance from './api/instance'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

instance.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401) {
    await router.push({ name: 'home' })
    useAuthStore().logout()
  }

  return Promise.reject(error)
})

app.mount('#app')
