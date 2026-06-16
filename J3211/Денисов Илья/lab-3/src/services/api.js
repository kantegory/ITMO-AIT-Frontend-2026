import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 7000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function getUsers(params = {}) {
  const { data } = await api.get('/users', { params });
  return data;
}

export async function createUser(user) {
  const { data } = await api.post('/users', user);
  return data;
}

export async function getTasks(params = {}) {
  const { data } = await api.get('/tasks', { params });
  return data;
}

export async function getApplications(params = {}) {
  const { data } = await api.get('/applications', { params });
  return data;
}

export async function createApplication(application) {
  const { data } = await api.post('/applications', application);
  return data;
}
