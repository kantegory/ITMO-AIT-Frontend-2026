import { defineStore } from 'pinia'
import { eventsApi } from '@/api'

export const useEventsStore = defineStore('events', {
  state: () => ({
    events: [],
    selectedSeats: {},
    currentEventId: null
  }),
  actions: {
    async loadEvents() {
      const response = await eventsApi.getAll()
      this.events = response.data
      return response
    },
    async createEvent(data) {
      const response = await eventsApi.create(data)
      this.events.push(response.data)
      return response
    },
    async deleteEvent(id) {
      await eventsApi.delete(id)
      this.events = this.events.filter(e => e.id !== id)
    }
  }
})
