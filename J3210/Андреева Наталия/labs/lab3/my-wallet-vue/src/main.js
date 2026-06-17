import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './assets/css/themes.css'
import './assets/css/base.css'
import './assets/css/layout.css'
import './assets/css/components.css'
import './assets/css/pages.css'
import './assets/css/dark-theme.css'

const app = createApp(App)
app.use(router)
app.mount('#app')