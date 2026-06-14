import axios from 'axios'
import { fallbackGet, fallbackPost } from './mockStore'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 3000,
})

export async function getCollection(resource) {
  try {
    const { data } = await api.get(`/${resource}`)
    return data
  } catch {
    return fallbackGet(resource)
  }
}

export async function postCollection(resource, payload) {
  try {
    const { data } = await api.post(`/${resource}`, payload)
    return data
  } catch {
    return fallbackPost(resource, payload)
  }
}

export default api
