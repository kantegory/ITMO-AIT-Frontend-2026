import api from './axios'
export const getDatasets = (filters = {}) => api.get('/api/datasets', { params: filters })
export const getDatasetById = (id) => api.get(`/api/dataset/${id}`)
