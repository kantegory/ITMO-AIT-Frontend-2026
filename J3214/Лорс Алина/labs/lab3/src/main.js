import { createApp } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/app.css';
import './assets/styles/auth.css';
import './assets/styles/dashboard.css';
import './assets/styles/transactions.css';
import './assets/styles/reports.css';
import './assets/styles/integrations.css';
import './assets/styles/responsive.css';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');
