import { ref } from 'vue';
import http from '../api/http';

export function useTickets() {
  const tickets = ref([]);
  const loading = ref(false);
  const error = ref('');

  async function fetchTicketsByUser(userId) {
    loading.value = true;
    error.value = '';
    try {
      const { data } = await http.get('/tickets', { params: { userId } });
      tickets.value = data;
    } catch (e) {
      error.value = 'Ошибка загрузки билетов.';
    } finally {
      loading.value = false;
    }
  }

  async function buyTicket(ticket) {
    const { data } = await http.post('/tickets', ticket);
    tickets.value.push(data);
    return data;
  }

  return {
    tickets,
    loading,
    error,
    fetchTicketsByUser,
    buyTicket
  };
}
