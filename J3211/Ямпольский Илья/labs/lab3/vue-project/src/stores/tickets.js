import { defineStore } from 'pinia'
import { ticketsApi } from '@/api'

export const useTicketsStore = defineStore('tickets', {
  state: () => ({
    tickets: []
  }),

  persist: true,

  actions: {
    async loadTickets(userId) {
      const response = await ticketsApi.getAll({ userId, status: 'active' })
      this.tickets = response.data
      return response
    },
    async returnTicket(ticketId) {
      await ticketsApi.update(ticketId, { status: 'returned' })
    }
  }
})
