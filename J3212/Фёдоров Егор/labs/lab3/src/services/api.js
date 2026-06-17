import axios from 'axios'
import { mapDataset, mapModel } from './mappers'

const API_BASE = 'http://localhost:3001'
const HF_BASE = 'https://huggingface.co/api'

export const localApi = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

localApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('mh_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

localApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Ошибка локального API.'
    return Promise.reject(new Error(message))
  },
)

export const hfApi = axios.create({
  baseURL: HF_BASE,
})

hfApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Сервер Hugging Face API недоступен.'
    return Promise.reject(new Error(message))
  },
)

function encodeHubId(id) {
  return encodeURIComponent(id).replace(/%2F/g, '/')
}

export const authApi = {
  login(email, password) {
    return localApi.post('/auth/login', { email, password })
  },
  register(firstName, lastName, username, email, password) {
    return localApi.post('/auth/register', { firstName, lastName, username, email, password })
  },
  me() {
    return localApi.get('/auth/me')
  },
}

export const hubApi = {
  async search({ query = '', type = 'all', limit = 24 } = {}) {
    const params = { search: query, limit, full: 'true' }

    const [models, datasets] = await Promise.all([
      type === 'dataset' ? Promise.resolve([]) : hfApi.get('/models', { params }).then((list) => list.map(mapModel)),
      type === 'model' ? Promise.resolve([]) : hfApi.get('/datasets', { params }).then((list) => list.map(mapDataset)),
    ])

    return [...models, ...datasets]
  },
  async getModel(id) {
    const data = await hfApi.get(`/models/${encodeHubId(id)}`)
    return mapModel(data)
  },
  async getDataset(id) {
    const data = await hfApi.get(`/datasets/${encodeHubId(id)}`)
    return mapDataset(data)
  },
}

export const commentsApi = {
  list(resourceType, resourceKey) {
    return localApi.get('/comments', { params: { resourceType, resourceKey } })
  },
  add(resourceType, resourceKey, text) {
    return localApi.post('/comments', { resourceType, resourceKey, text })
  },
}

export const favoritesApi = {
  list() {
    return localApi.get('/favorites')
  },
  check(resourceType, resourceKey) {
    return localApi.get('/favorites/check', { params: { resourceType, resourceKey } })
  },
  toggle(payload) {
    return localApi.post('/favorites/toggle', payload)
  },
}

export const profileApi = {
  summary() {
    return localApi.get('/profile/summary')
  },
}

export const publicationsApi = {
  create(data) {
    return localApi.post('/publications', data)
  },
}
