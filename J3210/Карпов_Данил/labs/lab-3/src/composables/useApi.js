import axios from 'axios'

const BASE_URL = 'http://localhost:3001'

const client = axios.create({ baseURL: BASE_URL })

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function useApi() {
  async function get(url, params) {
    const { data } = await client.get(url, { params })
    return data
  }

  async function post(url, body) {
    const { data } = await client.post(url, body)
    return data
  }

  return { get, post }
}
