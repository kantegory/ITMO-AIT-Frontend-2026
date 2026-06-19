import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./stores";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'

import '@/assets/base.css';
import '@/assets/cards.css';
import '@/assets/sidebar.css';
import '@/assets/auth.css';
import '@/assets/dashboard.css';

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount('#app');