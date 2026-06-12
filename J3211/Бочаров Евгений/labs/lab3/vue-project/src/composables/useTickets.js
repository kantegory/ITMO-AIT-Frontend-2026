import { ref } from 'vue'
import { TicketsAPI } from '@/api/endpoints'

export function useTickets() {
    const tickets = ref([])
    const fetchTickets = async (userId) => {
        tickets.value = await TicketsAPI.getByUserId(userId)
    }
    return { tickets, fetchTickets }
}