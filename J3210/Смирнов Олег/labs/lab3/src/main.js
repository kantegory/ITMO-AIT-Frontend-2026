import { createApp } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './assets/styles/style.css';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');
