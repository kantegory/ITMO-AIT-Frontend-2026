import { defineStore } from 'pinia'
import api from '@/api/instance'

export const useTicketStore = defineStore('tickets', {
  state: () => ({
    matches: [],
    myTickets: [],
    listings: []
  }),
  actions: {
    async fetchMatches() {
      const res = await api.get('/matches')
      this.matches = res.data
    },
    async fetchMyTickets(userId) {
      const res = await api.get(`/tickets?userId=${userId}`)
      this.myTickets = res.data
    },
    async buyTicket(ticketData) {
      await api.post('/tickets', ticketData)
    }
  }
})
