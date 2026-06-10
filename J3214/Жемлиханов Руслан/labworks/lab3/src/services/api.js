import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('floworchestrator_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  login(payload) {
    return api.post('/login', payload);
  },
  register(payload) {
    return api.post('/register', payload);
  }
};

export const dataApi = {
  getPipelines() {
    return api.get('/660/pipelines');
  },
  getPipelineDetails(id) {
    return api.get(`/660/pipelineDetails/${id}`);
  },
  getNotifications() {
    return api.get('/660/notifications');
  },
  getConnections() {
    return api.get('/660/connections');
  },
  createConnection(payload) {
    return api.post('/660/connections', payload);
  },
  deleteConnection(id) {
    return api.delete(`/660/connections/${id}`);
  },
  getVariables() {
    return api.get('/660/variables');
  },
  createVariable(payload) {
    return api.post('/660/variables', payload);
  },
  deleteVariable(id) {
    return api.delete(`/660/variables/${id}`);
  }
};

export default api;
