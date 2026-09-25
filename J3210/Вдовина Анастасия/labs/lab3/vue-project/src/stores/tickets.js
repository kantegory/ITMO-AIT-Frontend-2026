import { defineStore } from 'pinia'
import { ticketsApi } from '@/api'

const useTicketsStore = defineStore('tickets', {
  state: () => ({
    tickets: [],
    refunds: [],
  }),
  actions: {
    async loadTickets(userId) {
      const response = await ticketsApi.getByUser(userId)

      this.tickets = response.data

      return response
    },
    async loadAllTickets() {
      const response = await ticketsApi.getAll()

      this.tickets = response.data

      return response
    },
    async loadRefunds(userId) {
      const response = await ticketsApi.getRefunds(userId)

      this.refunds = response.data

      return response
    },
    async loadAllRefunds() {
      const response = await ticketsApi.getAllRefunds()

      this.refunds = response.data

      return response
    },
    async buyTicket(data) {
      return ticketsApi.createTicket(data)
    },
    async refundTicket({ ticket, event, userId, reason }) {
      await ticketsApi.createRefund({
        userId,
        eventId: ticket.eventId,
        amount: event ? event.priceLabel : '',
        reason,
        date: new Date()
          .toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
          .replace(' г.', ''),
      })

      await ticketsApi.updateStatus(ticket.id, 'refunded')
    },
  },
})

export default useTicketsStore
