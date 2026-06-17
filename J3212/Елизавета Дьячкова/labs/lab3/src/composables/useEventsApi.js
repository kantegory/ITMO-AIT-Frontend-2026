import { http } from '@/api/http'

export function useEventsApi() {
  async function fetchEventsList() {
    const res = await http.get('/events')
    return Array.isArray(res.data) ? res.data : []
  }

  async function getEventById(id) {
    const res = await http.get(`/events/${id}`)
    if (!res.data || res.status === 404) throw new Error('not found')
    return res.data
  }

  return { fetchEventsList, getEventById }
}
