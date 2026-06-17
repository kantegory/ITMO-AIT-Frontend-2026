import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Подключаем созданный роутер

const app = createApp(App)

app.use(router) // Активируем роутер в приложении
app.mount('#app')