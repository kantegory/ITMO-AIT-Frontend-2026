import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE ?? ''

export const http = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
  validateStatus: () => true,
})

http.interceptors.request.use((config) => {
  if (!config.skipAuth) {
    const token = localStorage.getItem('tickethub_auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export function extractApiMessage(error) {
  if (!error || typeof error !== 'object') return 'Неизвестная ошибка'
  const data = error.response?.data
  if (data && typeof data === 'object') {
    const msg = data.message ?? data.error
    if (typeof msg === 'string' && msg.trim()) return msg
  }
  if (typeof error.message === 'string' && error.message.trim()) return error.message
  return 'Ошибка запроса'
}

export async function unwrap(response, fallbackMessage) {
  const { status, data } = response
  if (status === 204) return null
  if (status >= 200 && status < 300) return data
  const msg =
    (data && typeof data === 'object' && (data.message || data.error)) ||
    (typeof data === 'string' && data.trim()) ||
    fallbackMessage ||
    `Ошибка ${status}`
  const err = new Error(typeof msg === 'string' ? msg : fallbackMessage || 'Ошибка запроса')
  err.response = response
  throw err
}
