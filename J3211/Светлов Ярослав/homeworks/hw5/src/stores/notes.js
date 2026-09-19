import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
const api = axios.create({ baseURL: '/api', timeout: 10000 });
export const useNotesStore = defineStore('notes', () => {
  const notes = ref([]);
  const loading = ref(false);
  const error = ref('');
  async function load() {
    loading.value = true;
    error.value = '';
    try { notes.value = (await api.get('/notes?_sort=createdAt&_order=desc')).data; }
    catch { error.value = 'Не удалось загрузить заметки. Проверьте запуск API и повторите попытку.'; }
    finally { loading.value = false; }
  }
  async function add(note) {
    const { data } = await api.post('/notes', note);
    notes.value.unshift(data);
  }
  return { notes, loading, error, load, add };
});
