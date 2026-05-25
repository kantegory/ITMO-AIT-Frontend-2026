import { api } from './http'

export async function fetchKudaGoSearch(params) {
  const { data } = await api.get('/kudago/search', { params })
  return data
}

export async function fetchKudaGoEvents(params) {
  const { data } = await api.get('/kudago/events', { params })
  return data
}
