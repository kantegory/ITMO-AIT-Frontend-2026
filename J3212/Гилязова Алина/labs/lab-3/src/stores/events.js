import { defineStore } from 'pinia'
import { eventsApi } from '@/api'

const useEventsStore = defineStore('events', {
  state: () => ({
    events: [],
    organizerEvents: [],
    currentEvent: null
  }),

  actions: {
    async loadEvents() {
      const response = await eventsApi.getAll()
      this.events = response.data
      return response
    },

    async loadEventById(id) {
      const response = await eventsApi.getById(id)
      this.currentEvent = response.data
      return response
    },

    async loadOrganizerEvents(userId) {
      const response = await eventsApi.getByOrganizer(userId)
      this.organizerEvents = response.data
      return response
    },

    async createEvent(payload) {
      const response = await eventsApi.create(payload)
      this.events.push(response.data)
      this.organizerEvents.unshift(response.data)
      return response
    },

    async updateEvent(id, payload) {
      const response = await eventsApi.update(id, payload)
      const updated = response.data

      const replaceIn = (arr) => {
        const idx = arr.findIndex((e) => String(e.id) === String(id))
        if (idx !== -1) arr.splice(idx, 1, updated)
      }
      replaceIn(this.events)
      replaceIn(this.organizerEvents)
      if (this.currentEvent && String(this.currentEvent.id) === String(id)) {
        this.currentEvent = updated
      }
      return response
    },

    async deleteEvent(id) {
      await eventsApi.remove(id)
      this.events = this.events.filter((e) => String(e.id) !== String(id))
      this.organizerEvents = this.organizerEvents.filter(
        (e) => String(e.id) !== String(id)
      )
    }
  }
})

export default useEventsStore
