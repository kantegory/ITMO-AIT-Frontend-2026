import { defineStore } from 'pinia'
import { eventsApi } from '@/api'

const useEventsStore = defineStore('events', {
  state: () => ({
    events: [],
    currentEvent: null,
  }),
  actions: {
    async loadEvents(params = {}) {
      const response = await eventsApi.getAll(params)

      this.events = response.data

      return response
    },
    async loadEvent(id) {
      const response = await eventsApi.getOne(id)

      this.currentEvent = response.data

      return response
    },
    async createEvent(data) {
      return eventsApi.createEvent(data)
    },
    async saveReviews(id, reviews) {
      const response = await eventsApi.updateEvent(id, { reviews })

      this.currentEvent = response.data

      return response
    },
  },
})

export default useEventsStore
