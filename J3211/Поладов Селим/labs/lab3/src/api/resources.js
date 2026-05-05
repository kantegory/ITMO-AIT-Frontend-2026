import { api } from './client.js'

export const accountsApi = {
  list: (params) => api.get('/accounts', { params }).then(r => r.data),
}

export const transactionsApi = {
  list: (params) => api.get('/transactions', { params }).then(r => r.data),
  create: (payload) => api.post('/transactions', payload).then(r => r.data),
}

export const banksApi = {
  list: (params) => api.get('/banks', { params }).then(r => r.data),
  create: (payload) => api.post('/banks', payload).then(r => r.data),
  remove: (id) => api.delete(`/banks/${id}`).then(r => r.data),
}

export const rulesApi = {
  list: (params) => api.get('/rules', { params }).then(r => r.data),
  create: (payload) => api.post('/rules', payload).then(r => r.data),
  remove: (id) => api.delete(`/rules/${id}`).then(r => r.data),
}

export const usersApi = {
  update: (id, payload) => api.patch(`/users/${id}`, payload).then(r => r.data),
}
