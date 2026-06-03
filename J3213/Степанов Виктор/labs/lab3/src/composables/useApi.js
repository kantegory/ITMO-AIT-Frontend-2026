import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:3001'
})

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function useApi() {
  async function getModels(params = {}) {
    const { data } = await API.get('/models', { params })
    return data
  }

  async function getModel(id) {
    const { data } = await API.get(`/models/${id}`)
    return data
  }

  return { getModels, getModel }
}
