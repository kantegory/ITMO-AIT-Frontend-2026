import { defineStore } from 'pinia'
import { eventsApi } from '@/api'

const useEventsStore = defineStore('events', {
    state: () => ({ events: [] }),
    actions: {
        async loadEvents() {
            const response = await eventsApi.getAll()
            this.events = response.data
        }
    }
})

export default useEventsStore