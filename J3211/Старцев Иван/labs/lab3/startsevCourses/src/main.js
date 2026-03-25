import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import { usePreferencesStore } from '@/stores/preferences'
import { useSessionStore } from '@/stores/session'
import './assets/main.css'

const preferencesStore = usePreferencesStore(store)
const sessionStore = useSessionStore(store)

preferencesStore.initTheme()
await sessionStore.restoreSession()

createApp(App).use(store).use(router).mount('#app')
