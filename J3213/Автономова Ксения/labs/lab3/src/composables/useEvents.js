import { ref } from 'vue'
import apiClient from '../api/client'
export function useEvents() {
  const events = ref([])
  const eventItem = ref(null)
  const loading = ref(false)
  const error = ref('')
  async function loadEvents(params = {}) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await apiClient.get('/events', { params })
      events.value = data || []
      return events.value
    } catch (err) {
      error.value = err.response?.data || err.message || 'Ошибка загрузки мероприятий'
      throw err
    } finally {
      loading.value = false
    }
  }
  async function loadEvent(id) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await apiClient.get(`/events/${id}`)
      eventItem.value = data
      return data
    } catch (err) {
      error.value = err.response?.data || err.message || 'Ошибка загрузки мероприятия'
      throw err
    } finally {
      loading.value = false
    }
  }
  async function createEvent(payload) {
    const { data } = await apiClient.post('/600/events', payload)
    return data
  }
  return {
    events,
    eventItem,
    loading,
    error,
    loadEvents,
    loadEvent,
    createEvent
  }
}
