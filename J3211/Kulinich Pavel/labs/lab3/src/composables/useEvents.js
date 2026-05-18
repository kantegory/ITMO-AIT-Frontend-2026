import { ref } from 'vue';
import http from '../api/http';

export function useEvents() {
  const events = ref([]);
  const loading = ref(false);
  const error = ref('');

  async function fetchEvents() {
    loading.value = true;
    error.value = '';
    try {
      const { data } = await http.get('/events');
      events.value = data;
    } catch (e) {
      error.value = 'Ошибка загрузки мероприятий.';
    } finally {
      loading.value = false;
    }
  }

  async function fetchEventById(id) {
    loading.value = true;
    error.value = '';
    try {
      const { data } = await http.get(`/events/${id}`);
      return data;
    } catch (e) {
      error.value = 'Ошибка загрузки мероприятия.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  function filterEvents({ type = '', date = '', location = '' }) {
    const search = location.trim().toLowerCase();
    return events.value.filter(event => {
      const typeMatch = !type || event.type === type;
      const dateMatch = !date || event.date === date;
      const locationMatch =
        !search ||
        event.location.toLowerCase().includes(search) ||
        event.place.toLowerCase().includes(search);
      return typeMatch && dateMatch && locationMatch;
    });
  }

  return {
    events,
    loading,
    error,
    fetchEvents,
    fetchEventById,
    filterEvents
  };
}
