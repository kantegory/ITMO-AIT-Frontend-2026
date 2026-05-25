import { ref } from 'vue'
import { EventsAPI } from '@/api/endpoints'

export function useEvents() {
    const events = ref([])
    const loading = ref(false)
    const error = ref(null)

    const fetchEvents = async (filters = {}) => {
        loading.value = true
        error.value = null
        try {
            events.value = await EventsAPI.getAll(filters)
        } catch (e) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    return { events, loading, error, fetchEvents }
}