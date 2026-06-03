import { apiClient } from './client'

export const pipelinesApi = {
  getAll: () => apiClient.get('/pipelines').then((r) => r.data),
  getById: (id) => apiClient.get(`/pipelines/${id}`).then((r) => r.data),
}

export const tasksApi = {
  getByPipeline: (pipelineId) =>
    apiClient.get('/tasks', { params: { pipelineId, _sort: 'order' } }).then((r) => r.data),
}

export const logsApi = {
  getByPipeline: (pipelineId) =>
    apiClient.get('/logs', { params: { pipelineId } }).then((r) => r.data),
}

export const runsApi = {
  getAll: () => apiClient.get('/runs').then((r) => r.data),
  getByPipeline: (pipelineId) =>
    apiClient.get('/runs', { params: { pipelineId } }).then((r) => r.data),
}

export const usersApi = {
  getById: (id) => apiClient.get(`/users/${id}`).then((r) => r.data),
  findByEmail: (email) =>
    apiClient.get('/users', { params: { email } }).then((r) => r.data),
  create: (data) => apiClient.post('/users', data).then((r) => r.data),
}

export const connectionsApi = {
  getByUser: (userId) =>
    apiClient.get('/connections', { params: { userId } }).then((r) => r.data),
}
