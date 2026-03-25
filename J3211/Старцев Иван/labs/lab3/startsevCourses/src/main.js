import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import { usePreferencesStore } from '@/stores/preferences'
import { useSessionStore } from '@/stores/session'
import './assets/main.css'

const app = createApp(App)
app.use(store)
const preferencesStore = usePreferencesStore()
const sessionStore = useSessionStore()

preferencesStore.initTheme()
await sessionStore.restoreSession()

app.use(router).mount('#app')
