import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import App from './App.vue';
import router from './router';
createApp(App).use(createPinia()).use(router).mount('#app');
