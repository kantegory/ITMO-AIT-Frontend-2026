import { createApp } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import App from './App.vue';
import router from './router';
import api from './api';
import { useAuth } from './composables/useAuth';
const auth = useAuth();
api.interceptors.request.use(config => {
  if (auth.session.value) config.headers.Authorization = 'Bearer ' + auth.session.value.accessToken;
  return config;
});
api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401 && auth.session.value && !['/login', '/register'].includes(error.config.url)) {
    auth.logout('Сессия истекла. Войдите снова.');
    router.replace('/login');
  }
  return Promise.reject(error);
});
await auth.restore();
createApp(App).use(router).mount('#app');
