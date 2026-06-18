import { ref } from 'vue'
import apiClient from '../api/client'
export function useTickets() {
  const tickets = ref([])
  const returns = ref([])
  const loading = ref(false)
  function dedupeTickets(items) {
    const result = []
    items.forEach((ticket) => {
      if (!ticket.seat) {
        result.push(ticket)
        return
      }
      const index = result.findIndex((item) => item.eventId === ticket.eventId && item.seat === ticket.seat)
      if (index === -1) {
        result.push(ticket)
        return
      }
      const current = result[index]
      const newer = new Date(ticket.purchaseDate) > new Date(current.purchaseDate)
      if (newer) {
        result[index] = ticket
      }
    })
    return result
  }
  async function loadMyTickets(userId) {
    loading.value = true
    try {
      const { data } = await apiClient.get('/660/tickets', { params: { userId } })
      tickets.value = dedupeTickets((data || []).filter((ticket) => ticket.userId === userId))
      return tickets.value
    } finally {
      loading.value = false
    }
  }
  async function loadMyReturns(userId) {
    const { data } = await apiClient.get('/660/returns', { params: { userId } })
    returns.value = (data || []).filter((item) => item.userId === userId)
    return returns.value
  }
  async function loadTicketsByEvent(eventId) {
    const { data } = await apiClient.get('/tickets', { params: { eventId } })
    return data || []
  }
  async function loadReturnsByEvent(eventId) {
    const { data } = await apiClient.get('/returns', { params: { eventId } })
    return data || []
  }
  async function buyTicket(payload) {
    const { data } = await apiClient.post('/660/tickets', payload)
    return data
  }
  async function returnTicket(ticket, userId) {
    await apiClient.delete(`/660/tickets/${ticket.id}`)
    const payload = {
      eventId: ticket.eventId,
      seat: ticket.seat || null,
      returnDate: new Date().toISOString(),
      userId
    }
    const { data } = await apiClient.post('/660/returns', payload)
    return data
  }
  return {
    tickets,
    returns,
    loading,
    loadMyTickets,
    loadMyReturns,
    loadTicketsByEvent,
    loadReturnsByEvent,
    buyTicket,
    returnTicket
  }
}
