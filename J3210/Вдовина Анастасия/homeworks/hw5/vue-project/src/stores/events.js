import { defineStore } from 'pinia'
import { eventsApi } from '@/api'

const useEventsStore = defineStore('events', {
  state: () => ({
    events: [],
  }),
  actions: {
    async loadEvents() {
      const response = await eventsApi.getAll()

      this.events = response.data

      return response
    },
    async createEvent(data) {
      const response = await eventsApi.createEvent(data)

      return response
    },
  },
})

export default useEventsStore
