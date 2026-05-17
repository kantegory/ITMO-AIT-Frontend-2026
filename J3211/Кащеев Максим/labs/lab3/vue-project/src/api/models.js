import api from './axios'
export const getModels = (filters = {}) => api.get('/api/models', { params: filters })
export const getModelById = (id) => api.get(`/api/model/${id}`)
