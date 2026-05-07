import api from './instance'

export const getUsers = (params = {}) => api.get('/users', { params })
export const getUserById = (id) => api.get(`/users/${id}`)
export const createUser = (data) => api.post('/users', data)
export const updateUser = (id, data) => api.patch(`/users/${id}`, data)