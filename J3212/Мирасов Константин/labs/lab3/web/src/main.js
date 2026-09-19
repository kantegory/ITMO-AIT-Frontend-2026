import { createApp } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/tokens.css';
import './assets/base.css';
import './assets/catalog.css';
import './assets/pages.css';
import './assets/styles.css';
import App from './App.vue';
import { router } from './router/index.js';

createApp(App).use(router).mount('#app');
