import axios from 'axios';

export const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function getCourses() {
  const { data } = await api.get('/courses');
  return data;
}

export async function getCourse(id) {
  const { data } = await api.get(`/courses/${id}`);
  return data;
}

export async function getProfile(userId) {
  const { data } = await api.get('/profiles', {
    params: { userId }
  });

  return data[0] || null;
}

export default api;
