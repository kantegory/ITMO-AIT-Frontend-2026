import { api } from './http'

export async function apiLogin(email, password) {
  const { data } = await api.post('/login', { email, password })
  return data
}

export async function apiRegister(payload) {
  const { data } = await api.post('/register', payload)
  return data
}
