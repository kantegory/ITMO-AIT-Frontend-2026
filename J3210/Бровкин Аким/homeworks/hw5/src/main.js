import { createApp } from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css";
import router from './router'
import "bootstrap";
const app = createApp(App)
app.use(router)
app.mount('#app')
