import axios from 'axios'

const BASE_URL = 'http://localhost:3001'

const client = axios.create({ baseURL: BASE_URL })

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function useApi() {
  async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const { data } = await client.get<T>(url, { params })
    return data
  }

  async function post<T>(url: string, body: unknown): Promise<T> {
    const { data } = await client.post<T>(url, body)
    return data
  }

  return { get, post }
}
