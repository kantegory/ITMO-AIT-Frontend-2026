import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: { Accept: 'application/json' },
})

export async function getTours() {
  const { data } = await api.get('/tours')
  return data
}

export async function getTourById(id) {
  const { data } = await api.get(`/tours/${id}`)
  return data
}

export async function getFilters() {
  const { data } = await api.get('/filters')
  return data
}

export async function createUser(user) {
  const { data } = await api.post('/users', user)
  return data
}

export default api
