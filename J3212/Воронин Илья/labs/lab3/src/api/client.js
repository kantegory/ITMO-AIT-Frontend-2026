import axios from 'axios';
import { clearAuth, getToken } from '../composables/useAuth';

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const client = axios.create({ baseURL });

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.auth !== false) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearAuth();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default client;
