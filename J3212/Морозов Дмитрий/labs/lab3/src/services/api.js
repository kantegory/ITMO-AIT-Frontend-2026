import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:3000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  console.info('Запрос:', config.method?.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Ошибка API:', error.response?.status, error.message);
    return Promise.reject(error);
  },
);
