import { defineStore } from 'pinia'
import { ticketsApi } from '@/api'

const useTicketsStore = defineStore('tickets', {
  state: () => ({
    tickets: []
  }),

  getters: {

    activeTickets: (state) => state.tickets.filter((t) => !t.refunded)
  },

  actions: {
    async loadTickets(userId) {
      const response = await ticketsApi.getByUser(userId)
      this.tickets = response.data
      return response
    },

    async buyTicket({ userId, eventId }) {
      const payload = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        userId,
        eventId: Number(eventId) || eventId,
        refunded: false
      }
      const response = await ticketsApi.create(payload)
      this.tickets.unshift(response.data)
      return response
    },

    async refundTicket(id) {
      await ticketsApi.refund(id)
      const ticket = this.tickets.find((t) => String(t.id) === String(id))
      if (ticket) ticket.refunded = true
    }
  }
})

export default useTicketsStore
