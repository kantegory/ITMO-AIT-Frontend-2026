import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', 
  headers: {
    'Content-Type': 'application/json',
  }
});


api.interceptors.response.use(
  (response) => response.data, 
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);