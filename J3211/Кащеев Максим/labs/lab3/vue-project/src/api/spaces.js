import api from './axios'
export const getSpaces = (filters = {}) => api.get('/api/spaces', { params: filters })
export const getSpaceById = (id) => api.get(`/api/space/${id}`)
