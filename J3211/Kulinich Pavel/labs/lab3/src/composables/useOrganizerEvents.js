import { ref } from 'vue';
import http from '../api/http';

export function useOrganizerEvents() {
  const organizerEvents = ref([]);
  const loading = ref(false);
  const error = ref('');

  async function fetchOrganizerEvents() {
    loading.value = true;
    error.value = '';
    try {
      const { data } = await http.get('/organizerEvents');
      organizerEvents.value = data;
    } catch (e) {
      error.value = 'Ошибка загрузки событий.';
    } finally {
      loading.value = false;
    }
  }

  async function createOrganizerEvent(payload) {
    const { data } = await http.post('/organizerEvents', payload);
    organizerEvents.value.push(data);
    return data;
  }

  return {
    organizerEvents,
    loading,
    error,
    fetchOrganizerEvents,
    createOrganizerEvent
  };
}
