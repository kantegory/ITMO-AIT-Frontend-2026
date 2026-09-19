import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:3002',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('omagad_lab3_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
