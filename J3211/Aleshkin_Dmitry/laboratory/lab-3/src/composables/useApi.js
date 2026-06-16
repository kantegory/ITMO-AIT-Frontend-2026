import axios from 'axios';
import { API_URL } from '../utils/constants.js';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(
        new Error('Не удаётся подключиться к mock API. Запустите json-server командой npm run api.'),
      );
    }

    const message =
      error.response?.data?.message ||
      error.response?.data ||
      'Ошибка запроса к серверу';

    return Promise.reject(
      new Error(typeof message === 'string' ? message : 'Ошибка запроса к серверу'),
    );
  },
);

export function useApi() {
  return { api };
}