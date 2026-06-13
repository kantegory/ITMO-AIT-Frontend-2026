import api from './instance'

export const getWorkspaces = (params = {}) => api.get('/workspaces', { params })
export const getWorkspaceById = (id) => api.get(`/workspaces/${id}`)
export const createWorkspace = (data) => api.post('/workspaces', data)
export const updateWorkspace = (id, data) => api.patch(`/workspaces/${id}`, data)
export const deleteWorkspace = (id) => api.delete(`/workspaces/${id}`)