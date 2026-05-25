import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3000' })

export function useApi() {
  return {
    getExperiments: (params) => api.get('/experiments', { params }),
    getExperiment: (id) => api.get(`/experiments/${id}`),
    createExperiment: (data) => api.post('/experiments', data),
    deleteExperiment: (id) => api.delete(`/experiments/${id}`),

    getModels: (params) => api.get('/models', { params }),
    createModel: (data) => api.post('/models', data),
    deleteModel: (id) => api.delete(`/models/${id}`),

    getUsers: (params) => api.get('/users', { params }),
    createUser: (data) => api.post('/users', data),
    deleteUser: (id) => api.delete(`/users/${id}`),
  }
}
