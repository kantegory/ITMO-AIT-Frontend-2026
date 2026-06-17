import {createApp} from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/stores'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import '@/assets/style.css'

import * as bootstrap from 'bootstrap'

window.bootstrap = bootstrap

const app = createApp(App)

app.use(store)
app.use(router)
app.mount('#app')
